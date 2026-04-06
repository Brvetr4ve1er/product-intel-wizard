/**
 * ═══════════════════════════════════════════════════════════════
 *  PKOS LLM Engine v2.0
 *  - LM Studio connection via OpenAI-compat /v1/chat/completions
 *  - Web scraping via DuckDuckGo HTML (routed through local proxy)
 *  - Full source links with URLs, titles, prices for each result
 * ═══════════════════════════════════════════════════════════════
 */
const LLMEngine = (() => {
    'use strict';

    const LM_STUDIO_BASE = 'http://127.0.0.1:1234';
    const LM_STUDIO_URL  = '/api/llm';  // routed via Python proxy to avoid CORS
    const LM_MODEL       = 'nvidia/nemotron-3-nano-4b';

    // ─── Status overlay helpers ────────────────────────────────
    function setStatus(msg) {
        const el = document.getElementById('csv-status-text');
        if (el) el.textContent = msg;
        console.log('[LLMEngine]', msg);
    }

    // ── Core LLM call (OpenAI-compat) ──────────────────────────
    async function callLLM(systemPrompt, userPrompt, jsonMode = false) {
        setStatus('🤖 LLM local en cours...');
        const body = {
            model: LM_MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user',   content: userPrompt   }
            ],
            temperature: 0.05,  // very low for consistent JSON output
            max_tokens: 1500,
            stream: false
            // Note: response_format json_object NOT used — not supported by nano models
            // JSON is enforced via prompt instructions instead
        };

        // POST through our local Python proxy → no CORS issues
        const response = await fetch(LM_STUDIO_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const txt = await response.text().catch(() => '');
            throw new Error(`LM Studio HTTP ${response.status}: ${txt.substring(0, 200)}`);
        }

        const data = await response.json();

        if (!data.choices || !data.choices.length) {
            throw new Error('LLM returned no choices. Check model is loaded in LM Studio.');
        }

        let content = data.choices[0].message.content || '';

        if (jsonMode) {
            // Aggressively extract JSON from model output
            // Nano models often add prose before/after the JSON block
            content = content.trim();
            // Try to find a JSON block between ```json ... ``` or ``` ... ```
            const fenceMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (fenceMatch) content = fenceMatch[1].trim();
            // Try to find the first { ... } block
            const braceStart = content.indexOf('{');
            const braceEnd   = content.lastIndexOf('}');
            if (braceStart !== -1 && braceEnd > braceStart) {
                content = content.substring(braceStart, braceEnd + 1);
            }
            try {
                return JSON.parse(content);
            } catch (e) {
                console.error('[LLMEngine] JSON parse failed. Raw output:', content.substring(0, 500));
                throw new Error('Model returned invalid JSON. Consider using a larger model for enrichment.');
            }
        }

        return content;
    }

    // ── CSV Column → Schema Mapping ────────────────────────────
    async function adaptCsvMapping(headers, sampleRows) {
        const sys = `You are a data mapper. Map CSV column headers to product schema fields.
Output ONLY a JSON object. No explanation. No markdown. Just the JSON.
Schema fields: id, brand, model, name, category, price, cost, stockQty
For each field, give the exact CSV header that matches, or null.
Example output: {"id":"SKU","brand":"Marque","name":"Designation","price":"Prix Vente","cost":null,"stockQty":"Quantite"}`;

        const usr = `Headers: ${JSON.stringify(headers)}
Sample: ${JSON.stringify(sampleRows[0] || {})}
Output JSON only:`;
        return await callLLM(sys, usr, true);
    }

    // ── Adaptive Category Taxonomy ─────────────────────────────
    async function determineCategories(productsSample) {
        const sys = `You are a product categorization engine. Analyse the product names and output an optimal taxonomy.
Return ONLY this JSON: { "categories": [{"id":"tv","label":"Télévisions","keywords":["TV","LED","UHD"]}], "filters":["brand","price_range"] }
Maximum 12 categories. Use French labels.`;
        const usr = `Product names sample:\n${JSON.stringify(productsSample, null, 2)}`;
        return await callLLM(sys, usr, true);
    }

    // ── Proxy-routed raw HTML fetch ────────────────────────────
    async function proxyFetch(url) {
        const res = await fetch('/api/proxy?url=' + encodeURIComponent(url));
        if (!res.ok) throw new Error(`Proxy error ${res.status} for ${url}`);
        return await res.text();
    }

    // ── DuckDuckGo search → structured results with URLs ───────
    async function searchProduct(query) {
        setStatus('🔍 Recherche web: ' + query);
        const searchUrl = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(query);

        let html;
        try {
            html = await proxyFetch(searchUrl);
        } catch (e) {
            console.error('[LLMEngine] Search proxy failed:', e);
            return { text: '', links: [] };
        }

        const parser = new DOMParser();
        const doc    = parser.parseFromString(html, 'text/html');

        const links   = [];
        const snippets = [];

        // DuckDuckGo HTML layout: .result elements contain .result__a (title+href) + .result__snippet
        doc.querySelectorAll('.result').forEach(result => {
            const anchor  = result.querySelector('.result__a');
            const snippet = result.querySelector('.result__snippet');
            if (!anchor) return;

            const title = anchor.textContent.trim();
            // DDG wraps real URLs in /l/?uddg= redirect — decode it
            let href = anchor.href || anchor.getAttribute('href') || '';
            try {
                const u = new URL(href, 'https://html.duckduckgo.com');
                href = u.searchParams.get('uddg') || u.searchParams.get('u') || href;
                href = decodeURIComponent(href);
            } catch (_) {}

            const text = snippet ? snippet.textContent.trim() : '';

            if (href && !href.startsWith('https://duckduckgo.com')) {
                links.push({ title, url: href, snippet: text });
                snippets.push(`[${title}] (${href})\n${text}`);
            }
        });

        return { text: snippets.join('\n\n').substring(0, 12000), links: links.slice(0, 8) };
    }

    // ── Full Product Enrichment Pipeline ───────────────────────
    async function enrichProductData(product) {
        const query = [product.brand, product.model, product.name, 'prix fiche technique'].filter(Boolean).join(' ');
        
        setStatus('🔍 Scraping prix et fiche: ' + (product.name || '').substring(0, 40) + '...');
        const { text: searchText, links: sourceLinks } = await searchProduct(query);

        if (!searchText && sourceLinks.length === 0) {
            return { error: 'Aucun résultat web trouvé.' };
        }

        setStatus('🧠 Analyse IA en cours...');

        const sys = `You are a product intelligence engine for an Algerian electronics store.
Given a product and web search results, output ONLY a JSON object with this exact structure.
Do not write anything outside the JSON. Do not use markdown.

{"description":"French product description (2 sentences)","specs":{"Spec Name":"value"},"competitorPrices":[{"source":"site name","url":"https://url","price":45000}],"ai_insights":{"buyerFit":"French buyer description","pricePosition":"budget","pros":["pro1","pro2"],"cons":["con1"]}}

Rules:
- pricePosition must be: budget, midrange, or premium
- Extract real prices from the web context if visible
- Include url field only if you see a real URL in the context
- Keep specs short: 3-5 key specs max
- Write all text in French`;

        const usr = `Product: ${product.brand} ${product.name}
Category: ${product.category ? product.category.label : 'Electronics'}
Our price: ${product.commercial ? product.commercial.retailPrice : 'unknown'} DZD

Web search snippets:
${searchText.substring(0, 6000)}

URLs found:
${sourceLinks.slice(0, 5).map(l => `${l.title}: ${l.url}`).join('\n')}

Output JSON only:`;

        const result = await callLLM(sys, usr, true);

        // Inject source links back in if LLM omitted URLs
        if (result && result.competitorPrices) {
            result.competitorPrices = result.competitorPrices.map(cp => {
                if (!cp.url) {
                    // Try to find a matching source link by name
                    const match = sourceLinks.find(l =>
                        l.title.toLowerCase().includes(cp.source.toLowerCase()) ||
                        cp.source.toLowerCase().includes(l.title.toLowerCase().split(' ')[0])
                    );
                    if (match) cp.url = match.url;
                }
                return cp;
            });
        }

        // Also attach all raw source links for reference
        result._sourceLinks = sourceLinks;

        setStatus('✅ Enrichissement terminé');
        return result;
    }

    // ── Ping / connectivity check ──────────────────────────────
    async function ping() {
        try {
            // Use the scraping proxy to GET the models list from LM Studio
            const res = await fetch('/api/proxy?url=' + encodeURIComponent(LM_STUDIO_BASE + '/api/v1/models'));
            if (res.ok) {
                const data = await res.json().catch(() => ({}));
                const models = data.data || [];
                return { online: true, models: models.map(m => m.id || 'model') };
            }
            // Fallback: try OpenAI models endpoint
            const res2 = await fetch('/api/proxy?url=' + encodeURIComponent(LM_STUDIO_BASE + '/v1/models'));
            if (res2.ok) return { online: true, models: [] };
            return { online: false, error: `LM Studio HTTP ${res.status}` };
        } catch (e) {
            return { online: false, error: e.message };
        }
    }

    return { adaptCsvMapping, determineCategories, searchProduct, enrichProductData, ping };
})();
