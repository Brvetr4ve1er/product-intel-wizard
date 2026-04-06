// ═══════════════════════════════════════════════════════
// PKOS Application Engine
// CSV-first: loads products from CSV file import
// Renders infographic-grade cards with progressive disclosure
// ═══════════════════════════════════════════════════════

(() => {
    'use strict';

    // ── State ──
    let PKOS_PRODUCTS = [];
    let filters = { brand: 'All', resolution: 'All', role: 'All' };
    let searchQuery = '';
    let debounceTimer = null;

    // ── Helpers ──
    const $ = s => document.querySelector(s);
    const $$ = s => document.querySelectorAll(s);

    function getConfidenceClass(score) {
        if (score >= 75) return 'confidence-high';
        if (score >= 55) return 'confidence-medium';
        return 'confidence-low';
    }

    function getConfidenceLabel(score) {
        if (score >= 75) return '🟢';
        if (score >= 55) return '🟡';
        return '🔴';
    }

    function getRoleClass(role) {
        return `tag-role-${role}`;
    }

    function getRelTypeClass(type) {
        const map = { 'upgrade': 'rel-type-upgrade', 'downgrade': 'rel-type-downgrade', 'same-tier': 'rel-type-same-tier', 'competitor': 'rel-type-competitor' };
        return map[type] || 'rel-type-alternative';
    }

    function findProductName(id) {
        const p = PKOS_PRODUCTS.find(x => x.identity.id === id);
        return p ? p.identity.name : id;
    }

    // ── Build Stats ──
    function buildStats() {
        if (PKOS_PRODUCTS.length === 0) {
            $('#stats-bar').innerHTML = '';
            return;
        }
        const total = PKOS_PRODUCTS.length;
        const brands = new Set(PKOS_PRODUCTS.map(p => p.identity.brand)).size;
        const smart = PKOS_PRODUCTS.filter(p => p.technical.smart.platform).length;
        const uhd4k = PKOS_PRODUCTS.filter(p => p.technical.quickSpecs.resolution.label === '4K UHD').length;
        const hdr = PKOS_PRODUCTS.filter(p => p.technical.display.hdr).length;

        $('#stats-bar').innerHTML = `
            <div class="stat-item"><span class="stat-num">${total}</span><span class="stat-label">Products</span></div>
            <div class="stat-item"><span class="stat-num">${brands}</span><span class="stat-label">Brands</span></div>
            <div class="stat-item"><span class="stat-num">${smart}</span><span class="stat-label">Smart TVs</span></div>
            <div class="stat-item"><span class="stat-num">${uhd4k}</span><span class="stat-label">4K UHD</span></div>
            <div class="stat-item"><span class="stat-num">${hdr}</span><span class="stat-label">HDR</span></div>
        `;
    }

    // ── Build Filters ──
    function buildFilters() {
        if (PKOS_PRODUCTS.length === 0) {
            $('#brand-filters').innerHTML = '';
            $('#resolution-filters').innerHTML = '';
            $('#role-filters').innerHTML = '';
            return;
        }

        const brands = ['All', ...new Set(PKOS_PRODUCTS.map(p => p.identity.brand))];
        $('#brand-filters').innerHTML = `<span style="color:var(--text-muted);font-size:0.78rem;font-weight:600;">Brand</span>
            <div class="filter-group">${brands.map(b =>
            `<button class="filter-pill${b === filters.brand ? ' active' : ''}" data-filter="brand" data-value="${b}">${b}</button>`
        ).join('')}</div>`;

        const resolutions = ['All', ...new Set(PKOS_PRODUCTS.map(p => p.technical.quickSpecs.resolution.label))];
        $('#resolution-filters').innerHTML = `<span style="color:var(--text-muted);font-size:0.78rem;font-weight:600;">Resolution</span>
            <div class="filter-group">${resolutions.map(r =>
            `<button class="filter-pill${r === filters.resolution ? ' active' : ''}" data-filter="resolution" data-value="${r}">${r}</button>`
        ).join('')}</div>`;

        const roles = ['All', ...new Set(PKOS_PRODUCTS.map(p => p.strategic.productRole))];
        const roleIcons = { 'entry': '🟢', 'core': '🔵', 'premium': '🟡', 'upsell': '🟣', 'clearance': '🔴' };
        $('#role-filters').innerHTML = `<span style="color:var(--text-muted);font-size:0.78rem;font-weight:600;">Role</span>
            <div class="filter-group">${roles.map(r =>
            `<button class="filter-pill${r === filters.role ? ' active' : ''}" data-filter="role" data-value="${r}">${r === 'All' ? 'All' : (roleIcons[r] || '⚪') + ' ' + r.charAt(0).toUpperCase() + r.slice(1)}</button>`
        ).join('')}</div>`;
    }

    // ── Filter products ──
    function getFilteredProducts() {
        return PKOS_PRODUCTS.filter(p => {
            if (filters.brand !== 'All' && p.identity.brand !== filters.brand) return false;
            if (filters.resolution !== 'All' && p.technical.quickSpecs.resolution.label !== filters.resolution) return false;
            if (filters.role !== 'All' && p.strategic.productRole !== filters.role) return false;
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const searchable = [
                    p.identity.name, p.identity.brand, p.identity.model,
                    p.identity.subcategory || '',
                    p.technical.quickSpecs.panelType,
                    p.technical.quickSpecs.resolution.label,
                    p.technical.smart.platform || '',
                    ...(p.technical.comparisonTags || []),
                    ...(p.marketing.sellingAngles || []),
                    ...(p.marketing.hooks || []),
                    ...(p.marketing.benefits_dz || []),
                    ...(p.technical.connectivity.casting || []),
                    ...(p.technical.audio.technology || [])
                ].join(' ').toLowerCase();
                if (!searchable.includes(q)) return false;
            }
            return true;
        });
    }

    // ── Render a single card ──
    function renderCard(p, index) {
        const id = p.identity;
        const tech = p.technical;
        const qs = tech.quickSpecs;
        const strat = p.strategic;
        const mkt = p.marketing;
        const rel = p.relationships;
        const comm = p.commercial;

        const confClass = getConfidenceClass(id.confidenceScore);
        const confLabel = getConfidenceLabel(id.confidenceScore);

        // Quick spec items
        const specs = [];
        if (qs.screenSize) specs.push(`<div class="qspec"><span class="qspec-icon">📏</span><span class="qspec-val">${qs.screenSize}"</span></div>`);
        specs.push(`<div class="qspec"><span class="qspec-icon">📺</span><span class="qspec-val">${qs.resolution.label}</span></div>`);
        specs.push(`<div class="qspec"><span class="qspec-icon">🖥️</span><span class="qspec-val">${qs.panelType}</span></div>`);
        if (tech.display.hdr) specs.push(`<div class="qspec"><span class="qspec-icon">✨</span><span class="qspec-val">HDR</span></div>`);
        if (tech.audio.output) specs.push(`<div class="qspec"><span class="qspec-icon">🔊</span><span class="qspec-val">${tech.audio.output}</span></div>`);
        if (tech.connectivity.wifi) specs.push(`<div class="qspec"><span class="qspec-icon">📡</span><span class="qspec-val">WiFi</span></div>`);
        if (tech.connectivity.bluetooth) specs.push(`<div class="qspec"><span class="qspec-icon">🔵</span><span class="qspec-val">BT</span></div>`);
        if (tech.connectivity.hdmiPorts) specs.push(`<div class="qspec"><span class="qspec-icon">🔌</span><span class="qspec-val">HDMI×${tech.connectivity.hdmiPorts}</span></div>`);

        // Benefits (Darja)
        const benefitsHtml = mkt.benefits_dz && mkt.benefits_dz.length > 0
            ? `<div class="card-benefits">
                <h4>🇩🇿 فوائد</h4>
                <div class="benefits-list">${mkt.benefits_dz.map(b => `<span class="benefit-chip">✔ ${b}</span>`).join('')}</div>
               </div>` : '';

        // Price
        let priceHtml = '';
        if (comm.priceRange && comm.priceRange.typical) {
            priceHtml = `<div class="card-price">
                <div class="price-bar">
                    <div class="price-visual"><div class="price-fill"></div></div>
                    <span class="price-label">${comm.priceRange.typical.toLocaleString()} DZD</span>
                </div>
            </div>`;
        } else {
            priceHtml = `<div class="card-price"><span class="price-unknown">💰 Price data pending</span></div>`;
        }

        // Strategic
        const stratHtml = `<div class="expand-section">
            <h4>🎯 Strategic</h4>
            <div class="strategic-grid">
                <div class="strat-item"><div class="strat-label">Role</div><div class="strat-val">${strat.productRole}</div></div>
                <div class="strat-item"><div class="strat-label">Margin</div><div class="strat-val">${strat.marginBehavior}</div></div>
                <div class="strat-item"><div class="strat-label">Discount</div><div class="strat-val">${strat.discountSensitivity} sensitivity</div></div>
                <div class="strat-item"><div class="strat-label">Position</div><div class="strat-val">${(strat.competitivePosition || '').replace(/-/g, ' ')}</div></div>
                <div class="strat-item"><div class="strat-label">Bundle</div><div class="strat-val">${strat.bundleEligibility ? '✓ ' + (strat.bundleRole || '') : '✗'}</div></div>
                <div class="strat-item"><div class="strat-label">Season</div><div class="strat-val">${(strat.seasonalRelevance || []).join(', ')}</div></div>
            </div>
        </div>`;

        // Marketing
        const hooksHtml = mkt.hooks && mkt.hooks.length > 0
            ? `<div class="marketing-hooks">${mkt.hooks.map(h => `<span class="hook-chip">🎣 ${h}</span>`).join('')}</div>` : '';
        const captionHtml = mkt.captions && mkt.captions.medium
            ? `<div class="marketing-caption">"${mkt.captions.medium}"</div>` : '';
        const mktHtml = `<div class="expand-section">
            <h4>📢 Marketing</h4>
            ${hooksHtml}${captionHtml}
        </div>`;

        // Relationships
        let relItems = [];
        if (rel.comparisons) {
            rel.comparisons.forEach(c => {
                relItems.push(`<div class="rel-item" data-goto="${c.productId}">
                    <span class="rel-arrow">→</span>
                    <span class="rel-type ${getRelTypeClass(c.relationship)}">${c.relationship}</span>
                    <span class="rel-name">${findProductName(c.productId)}</span>
                </div>`);
            });
        }
        if (rel.alternatives) {
            rel.alternatives.forEach(a => {
                relItems.push(`<div class="rel-item" data-goto="${a.productId}">
                    <span class="rel-arrow">↔</span>
                    <span class="rel-type rel-type-alternative">alt</span>
                    <span class="rel-name">${findProductName(a.productId)}</span>
                    <span class="rel-reason">${a.reason}</span>
                </div>`);
            });
        }
        const relHtml = relItems.length > 0
            ? `<div class="expand-section"><h4>🔗 Related Products</h4><div class="rel-list">${relItems.join('')}</div></div>`
            : '';

        const panelTag = qs.panelType === 'QLED' ? `<span class="tag tag-panel-qled">QLED</span>` : '';
        const platformBadge = tech.smart.platform
            ? `<span class="platform-badge">${tech.smart.platform}</span>`
            : `<span class="platform-badge" style="background:rgba(255,255,255,0.05);color:var(--text-muted);">Basic TV</span>`;

        return `<div class="product-card" style="animation-delay:${index * 0.04}s" data-product-id="${id.id}">
            <div class="card-header">
                <div class="card-identity">
                    <h3>${id.name}</h3>
                    <div class="card-brand-model">${id.brand} · ${id.model}</div>
                </div>
                <div class="confidence-badge ${confClass}">${confLabel} ${id.confidenceScore}%</div>
            </div>
            <div class="card-tags">
                <span class="tag ${getRoleClass(strat.productRole)}">${strat.productRole}</span>
                <span class="tag tag-category">${id.subcategory || id.category}</span>
                ${panelTag}
            </div>
            <div class="card-visual">
                <span class="tv-icon">📺</span>
                <span class="size-badge">${qs.screenSize || '?'}"</span>
            </div>
            <div class="card-quickspecs">${specs.join('')}</div>
            ${benefitsHtml}
            ${priceHtml}
            <button class="card-expand-toggle" onclick="toggleExpand(this)">
                <span>Strategic · Marketing · Relationships</span>
                <span class="toggle-arrow">▼</span>
            </button>
            <div class="card-expandable">
                ${stratHtml}
                ${mktHtml}
                ${relHtml}
            </div>
            <div class="card-footer">
                ${platformBadge}
                <span class="last-updated">Updated ${id.lastUpdated}</span>
            </div>
        </div>`;
    }

    // ── Render all cards ──
    function render() {
        const grid = $('#product-grid');
        const emptyState = $('#csv-empty-state');

        if (PKOS_PRODUCTS.length === 0) {
            if (emptyState) emptyState.style.display = '';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        const products = getFilteredProducts();
        if (products.length === 0) {
            grid.innerHTML = `<div class="no-results">
                <div class="no-emoji">🔍</div>
                <p>No products match your filters</p>
            </div>`;
            return;
        }

        grid.innerHTML = products.map((p, i) => renderCard(p, i)).join('');
    }

    // ── Toggle expand ──
    window.toggleExpand = function (btn) {
        btn.classList.toggle('expanded');
        const expandable = btn.nextElementSibling;
        expandable.classList.toggle('open');
    };

    // ── CSV Import ──
    function loadFromCSV(csvText) {
        try {
            const products = PKOSCsvParser.parse(csvText);
            if (products.length === 0) {
                updateCSVStatus('⚠️', 'CSV parsed but no valid products found — check your column headers');
                return;
            }
            PKOS_PRODUCTS = products;

            // Save to localStorage for persistence
            try { localStorage.setItem('pkos_csv', csvText); } catch (e) { }

            updateCSVStatus('✅', `${products.length} products loaded from CSV`);
            $('#csv-export-btn').disabled = false;
            filters = { brand: 'All', resolution: 'All', role: 'All' };
            searchQuery = '';
            $('#search-input').value = '';
            buildStats();
            buildFilters();
            render();
        } catch (err) {
            updateCSVStatus('❌', 'CSV parse error: ' + err.message);
        }
    }

    function updateCSVStatus(icon, text) {
        const statusEl = $('#csv-status');
        if (statusEl) {
            statusEl.innerHTML = `<span class="csv-status-icon">${icon}</span><span class="csv-status-text">${text}</span>`;
        }
    }

    // ── Export CSV ──
    function exportCSV() {
        if (PKOS_PRODUCTS.length === 0) return;
        const csv = PKOSCsvParser.exportCSV(PKOS_PRODUCTS);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pkos-products-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // ── Template CSV ──
    function downloadTemplate() {
        const headers = 'id,brand,model,name,category,subcategory,confidenceScore,screenSize,resolution,panelType,refreshRate,hdr,hdrFormats,brightness,contrastRatio,platform,os,processor,voiceAssistants,wifi,bluetooth,hdmiPorts,hdmiSpec,usbPorts,ethernet,casting,audioOutput,audioTech,priceMin,priceMax,priceTypical,warranty,productRole,marginBehavior,discountSensitivity,bundleEligibility,bundleRole,competitivePosition,seasonalRelevance,targetAudience,sellingAngles,hooks,benefits_dz,ramadanAngle,comparisons,alternatives,upgradeFrom,upgradeTo';
        const example = 'EX001,ExampleBrand,EX001,ExampleBrand 43" Smart TV,TV,Smart TV,70,43,Full HD,LED,60Hz,true,HDR10,250 cd/m²,4000:1,Google TV,Android 11,,Google Assistant,true,true,3,,2,true,Chromecast,16W,Dolby Audio,,,65000,,core,standard,medium,true,anchor,value-sweet-spot,ramadan;year-round,families,Great smart TV;Feature packed,Best value TV!,تلفزيون ممتاز;سعر مناسب,,EX002:upgrade,EX003:Alternative brand,,EX002';
        const csv = headers + '\n' + example;
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pkos-template.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    // ── Event handlers ──
    function attachEvents() {
        // Search
        $('#search-input').addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                searchQuery = e.target.value.trim();
                render();
            }, 250);
        });

        // CSV file import
        $('#csv-file-input').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => loadFromCSV(ev.target.result);
            reader.readAsText(file, 'UTF-8');
            e.target.value = ''; // reset for re-import
        });

        // CSV export
        $('#csv-export-btn').addEventListener('click', exportCSV);

        // Template download
        $('#csv-template-btn').addEventListener('click', downloadTemplate);

        // Filter clicks (delegated)
        document.addEventListener('click', (e) => {
            const pill = e.target.closest('.filter-pill');
            if (!pill) return;
            filters[pill.dataset.filter] = pill.dataset.value;
            buildFilters();
            render();
        });

        // Relationship navigation
        document.addEventListener('click', (e) => {
            const relItem = e.target.closest('.rel-item');
            if (!relItem) return;
            const targetId = relItem.dataset.goto;
            const targetCard = document.querySelector(`[data-product-id="${targetId}"]`);
            if (targetCard) {
                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetCard.style.borderColor = 'var(--accent-blue)';
                targetCard.style.boxShadow = '0 0 30px rgba(99,102,241,0.3)';
                setTimeout(() => { targetCard.style.borderColor = ''; targetCard.style.boxShadow = ''; }, 2000);
            } else {
                filters = { brand: 'All', resolution: 'All', role: 'All' };
                searchQuery = '';
                $('#search-input').value = '';
                buildFilters();
                render();
                setTimeout(() => {
                    const card = document.querySelector(`[data-product-id="${targetId}"]`);
                    if (card) {
                        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        card.style.borderColor = 'var(--accent-blue)';
                        card.style.boxShadow = '0 0 30px rgba(99,102,241,0.3)';
                        setTimeout(() => { card.style.borderColor = ''; card.style.boxShadow = ''; }, 2000);
                    }
                }, 100);
            }
        });

        // Drag & drop CSV onto page
        document.body.addEventListener('dragover', (e) => { e.preventDefault(); document.body.classList.add('drag-active'); });
        document.body.addEventListener('dragleave', () => { document.body.classList.remove('drag-active'); });
        document.body.addEventListener('drop', (e) => {
            e.preventDefault();
            document.body.classList.remove('drag-active');
            const file = e.dataTransfer.files[0];
            if (file && (file.name.endsWith('.csv') || file.name.endsWith('.txt'))) {
                const reader = new FileReader();
                reader.onload = (ev) => loadFromCSV(ev.target.result);
                reader.readAsText(file, 'UTF-8');
            }
        });
    }

    // ── Init ──
    function init() {
        attachEvents();

        // Try loading from localStorage first (persistence between sessions)
        const saved = localStorage.getItem('pkos_csv');
        if (saved) {
            loadFromCSV(saved);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
