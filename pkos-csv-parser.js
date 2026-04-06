// ═══════════════════════════════════════════════════════
// PKOS CSV Parser — Converts flat CSV into 7-layer schema
// ═══════════════════════════════════════════════════════

const PKOSCsvParser = (() => {
    'use strict';

    // ── CSV Parser (RFC 4180 compliant) ──
    function parseCSV(text) {
        const lines = [];
        let current = '';
        let inQuotes = false;
        const rows = [];

        for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            const next = text[i + 1];

            if (inQuotes) {
                if (ch === '"' && next === '"') {
                    current += '"';
                    i++; // skip escaped quote
                } else if (ch === '"') {
                    inQuotes = false;
                } else {
                    current += ch;
                }
            } else {
                if (ch === '"') {
                    inQuotes = true;
                } else if (ch === ',') {
                    lines.push(current);
                    current = '';
                } else if (ch === '\n' || (ch === '\r' && next === '\n')) {
                    lines.push(current);
                    current = '';
                    rows.push([...lines]);
                    lines.length = 0;
                    if (ch === '\r') i++; // skip \n in \r\n
                } else {
                    current += ch;
                }
            }
        }
        // Last field/row
        if (current || lines.length > 0) {
            lines.push(current);
            rows.push([...lines]);
        }

        return rows;
    }

    // ── Helpers ──
    function splitSemicolon(val) {
        if (!val || val.trim() === '') return [];
        return val.split(';').map(s => s.trim()).filter(Boolean);
    }

    function parseBool(val) {
        if (!val) return false;
        const v = val.toString().toLowerCase().trim();
        return v === 'true' || v === '1' || v === 'yes';
    }

    function parseNum(val) {
        if (!val || val.toString().trim() === '') return null;
        const n = Number(val);
        return isNaN(n) ? null : n;
    }

    function parseResolution(label) {
        const map = {
            'HD Ready': { width: 1366, height: 768 },
            'Full HD': { width: 1920, height: 1080 },
            '4K UHD': { width: 3840, height: 2160 },
            '8K UHD': { width: 7680, height: 4320 }
        };
        const res = map[label] || { width: null, height: null };
        return { ...res, label: label || 'Unknown' };
    }

    function parseComparisons(val) {
        // Format: "productId:relationship;productId:relationship"
        if (!val || val.trim() === '') return [];
        return val.split(';').map(s => s.trim()).filter(Boolean).map(entry => {
            const [productId, ...rest] = entry.split(':');
            return { productId: productId.trim(), relationship: rest.join(':').trim() || 'same-tier' };
        });
    }

    function parseAlternatives(val) {
        // Format: "productId:reason;productId:reason"
        if (!val || val.trim() === '') return [];
        return val.split(';').map(s => s.trim()).filter(Boolean).map(entry => {
            const [productId, ...rest] = entry.split(':');
            return { productId: productId.trim(), reason: rest.join(':').trim() || '' };
        });
    }

    // ── Row → PKOS Product ──
    function rowToProduct(headers, values) {
        const get = (col) => {
            const idx = headers.indexOf(col);
            return idx >= 0 && idx < values.length ? values[idx].trim() : '';
        };

        return {
            _meta: { schemaVersion: '2.0', createdBy: 'csv-import' },
            identity: {
                id: get('id'),
                brand: get('brand'),
                model: get('model'),
                sku: null,
                name: get('name'),
                category: get('category') || 'TV',
                subcategory: get('subcategory') || null,
                variant: null,
                confidenceScore: parseNum(get('confidenceScore')) || 50,
                dataSource: ['csv-import'],
                lastUpdated: new Date().toISOString().split('T')[0]
            },
            visual: {
                heroImage: '', gallery: [], marketingVisuals: [],
                videoUrl: null, thumbnailUrl: null, imageStatus: 'missing'
            },
            technical: {
                quickSpecs: {
                    screenSize: parseNum(get('screenSize')),
                    resolution: parseResolution(get('resolution')),
                    panelType: get('panelType') || 'LED',
                    refreshRate: get('refreshRate') || '60Hz',
                    power: null
                },
                display: {
                    brightness: get('brightness') || null,
                    contrastRatio: get('contrastRatio') || null,
                    hdr: parseBool(get('hdr')),
                    hdrFormats: splitSemicolon(get('hdrFormats')),
                    viewingAngle: null
                },
                smart: {
                    platform: get('platform') || null,
                    os: get('os') || null,
                    processor: get('processor') || null,
                    ram: null, storage: null,
                    voiceAssistants: splitSemicolon(get('voiceAssistants'))
                },
                connectivity: {
                    wifi: parseBool(get('wifi')),
                    wifiSpec: null,
                    bluetooth: parseBool(get('bluetooth')),
                    btVersion: null,
                    hdmiPorts: parseNum(get('hdmiPorts')) || 0,
                    hdmiSpec: get('hdmiSpec') || null,
                    usbPorts: parseNum(get('usbPorts')) || 0,
                    ethernet: parseBool(get('ethernet')),
                    casting: splitSemicolon(get('casting'))
                },
                audio: {
                    output: get('audioOutput') || null,
                    technology: splitSemicolon(get('audioTech')),
                    speakers: null
                },
                comparisonTags: [] // Auto-generated below
            },
            commercial: {
                priceRange: {
                    min: parseNum(get('priceMin')),
                    max: parseNum(get('priceMax')),
                    typical: parseNum(get('priceTypical')),
                    currency: 'DZD'
                },
                priceConfidence: parseNum(get('priceTypical')) ? 'estimated' : 'unknown',
                priceSources: [],
                availability: 'unknown',
                warranty: get('warranty') || null,
                riskFlags: []
            },
            strategic: {
                productRole: get('productRole') || 'core',
                marginBehavior: get('marginBehavior') || 'unknown',
                discountSensitivity: get('discountSensitivity') || 'medium',
                bundleEligibility: parseBool(get('bundleEligibility')),
                bundleRole: get('bundleRole') || null,
                seasonalRelevance: splitSemicolon(get('seasonalRelevance')),
                targetAudience: splitSemicolon(get('targetAudience')),
                competitivePosition: get('competitivePosition') || 'unknown'
            },
            marketing: {
                sellingAngles: splitSemicolon(get('sellingAngles')),
                emotionalDrivers: [],
                hooks: splitSemicolon(get('hooks')),
                captions: {
                    short: null,
                    medium: null,
                    long: null
                },
                benefits_dz: splitSemicolon(get('benefits_dz')),
                ramadanAngle: get('ramadanAngle') || null,
                adFormats: []
            },
            relationships: {
                complementary: [],
                comparisons: parseComparisons(get('comparisons')),
                upgradePath: {
                    from: splitSemicolon(get('upgradeFrom')),
                    to: splitSemicolon(get('upgradeTo'))
                },
                bundleFamilies: [],
                alternatives: parseAlternatives(get('alternatives'))
            }
        };
    }

    // ── Auto-generate comparison tags ──
    function autoTags(product) {
        const tags = [];
        const qs = product.technical.quickSpecs;
        const res = qs.resolution.label;

        if (res === 'HD Ready') tags.push('hd');
        else if (res === 'Full HD') tags.push('fhd');
        else if (res === '4K UHD') tags.push('4k');
        else if (res === '8K UHD') tags.push('8k');

        if (product.technical.smart.platform) tags.push('smart');
        else tags.push('led');

        const platform = (product.technical.smart.platform || '').toLowerCase();
        if (platform.includes('vidaa')) tags.push('vidaa');
        if (platform.includes('google')) tags.push('google-tv');
        if (platform.includes('android')) tags.push('android-tv');
        if (platform.includes('tizen')) tags.push('tizen');
        if (platform.includes('webos')) tags.push('webos');

        if (qs.screenSize) tags.push(`${qs.screenSize}-inch`);
        if (product.technical.display.hdr) tags.push('hdr');

        const panel = (qs.panelType || '').toUpperCase();
        if (panel === 'QLED') tags.push('qled');
        if (panel === 'OLED') tags.push('oled');

        product.technical.comparisonTags = tags;
    }

    // ── Main: Parse CSV text → PKOS_PRODUCTS array ──
    function parse(csvText) {
        const rows = parseCSV(csvText);
        if (rows.length < 2) return [];

        const headers = rows[0].map(h => h.trim());
        const products = [];

        for (let i = 1; i < rows.length; i++) {
            if (rows[i].length < 3) continue; // skip blank rows
            if (rows[i].every(v => !v.trim())) continue; // skip fully empty rows

            const product = rowToProduct(headers, rows[i]);
            autoTags(product);
            products.push(product);
        }

        return products;
    }

    // ── Export: PKOS_PRODUCTS array → CSV text ──
    function exportCSV(products) {
        const headers = [
            'id', 'brand', 'model', 'name', 'category', 'subcategory', 'confidenceScore',
            'screenSize', 'resolution', 'panelType', 'refreshRate', 'hdr', 'hdrFormats',
            'brightness', 'contrastRatio', 'platform', 'os', 'processor', 'voiceAssistants',
            'wifi', 'bluetooth', 'hdmiPorts', 'hdmiSpec', 'usbPorts', 'ethernet', 'casting',
            'audioOutput', 'audioTech', 'priceMin', 'priceMax', 'priceTypical', 'warranty',
            'productRole', 'marginBehavior', 'discountSensitivity', 'bundleEligibility',
            'bundleRole', 'competitivePosition', 'seasonalRelevance', 'targetAudience',
            'sellingAngles', 'hooks', 'benefits_dz', 'ramadanAngle',
            'comparisons', 'alternatives', 'upgradeFrom', 'upgradeTo'
        ];

        function esc(val) {
            if (val === null || val === undefined) return '';
            const s = String(val);
            if (s.includes(',') || s.includes('"') || s.includes('\n')) {
                return '"' + s.replace(/"/g, '""') + '"';
            }
            return s;
        }

        const rows = [headers.join(',')];
        for (const p of products) {
            const vals = [
                p.identity.id, p.identity.brand, p.identity.model, p.identity.name,
                p.identity.category, p.identity.subcategory || '', p.identity.confidenceScore,
                p.technical.quickSpecs.screenSize, p.technical.quickSpecs.resolution.label,
                p.technical.quickSpecs.panelType, p.technical.quickSpecs.refreshRate,
                p.technical.display.hdr, (p.technical.display.hdrFormats || []).join(';'),
                p.technical.display.brightness || '', p.technical.display.contrastRatio || '',
                p.technical.smart.platform || '', p.technical.smart.os || '',
                p.technical.smart.processor || '', (p.technical.smart.voiceAssistants || []).join(';'),
                p.technical.connectivity.wifi, p.technical.connectivity.bluetooth,
                p.technical.connectivity.hdmiPorts, p.technical.connectivity.hdmiSpec || '',
                p.technical.connectivity.usbPorts, p.technical.connectivity.ethernet,
                (p.technical.connectivity.casting || []).join(';'),
                p.technical.audio.output || '', (p.technical.audio.technology || []).join(';'),
                p.commercial.priceRange.min || '', p.commercial.priceRange.max || '',
                p.commercial.priceRange.typical || '', p.commercial.warranty || '',
                p.strategic.productRole, p.strategic.marginBehavior,
                p.strategic.discountSensitivity, p.strategic.bundleEligibility,
                p.strategic.bundleRole || '', p.strategic.competitivePosition,
                (p.strategic.seasonalRelevance || []).join(';'),
                (p.strategic.targetAudience || []).join(';'),
                (p.marketing.sellingAngles || []).join(';'),
                (p.marketing.hooks || []).join(';'),
                (p.marketing.benefits_dz || []).join(';'),
                p.marketing.ramadanAngle || '',
                (p.relationships.comparisons || []).map(c => `${c.productId}:${c.relationship}`).join(';'),
                (p.relationships.alternatives || []).map(a => `${a.productId}:${a.reason}`).join(';'),
                (p.relationships.upgradePath.from || []).join(';'),
                (p.relationships.upgradePath.to || []).join(';')
            ];
            rows.push(vals.map(esc).join(','));
        }

        return rows.join('\n');
    }

    return { parse, exportCSV, parseCSV };
})();
