/* ═══════════════════════════════════════════════════════════════════
   INVENTORY PARSER — French/Algerian Product Name Intelligence
   Converts raw inventory CSV into structured product data.
   ═══════════════════════════════════════════════════════════════════ */

const InventoryParser = (() => {
    'use strict';

    // ── Brand Dictionary ──────────────────────────────────────────
    // Order: longest names first to avoid partial matches
    const BRANDS = [
        'CONTIGLOBAL', 'CONTI GLOBAL', 'ROYALTYLINE', 'MEGATRONICS',
        'HOTPOINT', 'ELECTROGAS', 'MULTISMART', 'SCHALLENGE',
        'WESTCROWN', 'BERGMANN', 'BERGHAM', 'ARTCOOL', 'ARCODYM',
        'DIGITECH', 'STARMAN', 'NEWSTAR', 'NOVACEL', 'MOULINEX',
        'KENWOOD', 'HISENSE', 'CRISTOR', 'CONDOR', 'HYUNDAI',
        'CRRAFT', 'CRAFT', 'BRANDT', 'CAMRY', 'GEANT', 'MOSER',
        'MOZER', 'MIDEA', 'MEDIA', 'BOMANN', 'BOOMAX', 'LUXINOX',
        'SAMSUNG', 'SONIFER', 'ARISTON', 'THOMSON', 'GENERAL',
        'RAYLAN', 'WINOR', 'FIRAX', 'KRUPS', 'TEFAL',
        'BRENT', 'EXTRA', 'MESKO', 'COBRA', 'HOOVER',
        'IRIS', 'TCL', 'LG',
        'EAGLFLY', 'TOYOTA',
    ];

    // ── Category Patterns ─────────────────────────────────────────
    // Ordered by specificity (longest/most specific first)
    const CATEGORY_PATTERNS = [
        { pattern: /\bMACHINE A VAISSELLE\b/i, id: 'dishwasher', label: 'Lave-Vaisselle', icon: '🍽️', group: 'large' },
        { pattern: /\bLAVE LINGE\b/i, id: 'washing_machine', label: 'Machine à Laver', icon: '👕', group: 'large' },
        { pattern: /\bMACHINE A LAVER\b/i, id: 'washing_machine', label: 'Machine à Laver', icon: '👕', group: 'large' },
        { pattern: /\bMACHINE A COUDRE\b/i, id: 'sewing_machine', label: 'Machine à Coudre', icon: '🧵', group: 'small' },
        { pattern: /\bMACHINE A CREPE\b/i, id: 'crepe_maker', label: 'Crêpière', icon: '🥞', group: 'small' },
        { pattern: /\bMACHINE A GOFFRE\b/i, id: 'waffle_maker', label: 'Gaufrier', icon: '🧇', group: 'small' },
        { pattern: /\bMACHINE A PIZZA\b/i, id: 'pizza_maker', label: 'Machine à Pizza', icon: '🍕', group: 'small' },
        { pattern: /\bMACHINE A PATTE\b/i, id: 'pasta_maker', label: 'Machine à Pâtes', icon: '🍝', group: 'small' },
        { pattern: /\bMACHINE A PETIT DEJEUNER\b/i, id: 'breakfast_machine', label: 'Petit Déjeuner', icon: '☕', group: 'small' },
        { pattern: /\bMACHINE A CAFE\b/i, id: 'coffee_maker', label: 'Cafetière', icon: '☕', group: 'small' },
        { pattern: /\bFOUR.?ENCASTRABLE\b/i, id: 'builtin_oven', label: 'Four Encastrable', icon: '🔥', group: 'large' },
        { pattern: /\bFOUR.?ELECTRIQUE\b/i, id: 'electric_oven', label: 'Four Électrique', icon: '🔥', group: 'large' },
        { pattern: /\bFOUR ELECTRIC\b/i, id: 'electric_oven', label: 'Four Électrique', icon: '🔥', group: 'large' },
        { pattern: /\bPLAQUE.?CHAUFFANT\b/i, id: 'cooktop', label: 'Plaque de Cuisson', icon: '🍳', group: 'large' },
        { pattern: /\bCLIMATISEUR\b/i, id: 'air_conditioner', label: 'Climatiseur', icon: '❄️', group: 'large' },
        { pattern: /\bCONGELATEUR\b/i, id: 'freezer', label: 'Congélateur', icon: '🧊', group: 'large' },
        { pattern: /\bREFRIG[EÉ]RATEUR\b/i, id: 'refrigerator', label: 'Réfrigérateur', icon: '🧊', group: 'large' },
        { pattern: /\bREFRIGRATEUR\b/i, id: 'refrigerator', label: 'Réfrigérateur', icon: '🧊', group: 'large' },
        { pattern: /\bMICRO.?ONDE\b/i, id: 'microwave', label: 'Micro-Ondes', icon: '📡', group: 'large' },
        { pattern: /\bCHAUFF(?:E|AGE)?\s*BAIN\b/i, id: 'water_heater', label: 'Chauffe-Bain', icon: '🚿', group: 'large' },
        { pattern: /\bCHAUFFAGE\b/i, id: 'gas_heater', label: 'Chauffage', icon: '🔥', group: 'large' },
        { pattern: /\bBAIN D\s*HUILE\b/i, id: 'oil_heater', label: 'Bain d\'Huile', icon: '🌡️', group: 'large' },
        { pattern: /\bCUIS\b/i, id: 'cooker', label: 'Cuisinière', icon: '🍳', group: 'large' },
        { pattern: /\bHACHOIR VIANDE\b/i, id: 'meat_grinder', label: 'Hachoir à Viande', icon: '🥩', group: 'small' },
        { pattern: /\bCENTRE FIGEUSE\b/i, id: 'canning', label: 'Centre Figeuse', icon: '🫙', group: 'small' },
        { pattern: /\bCOFFEE GRINDER\b|MOULINETTE\b/i, id: 'coffee_grinder', label: 'Moulin à Café', icon: '⚙️', group: 'small' },
        { pattern: /\bPRESSE A CAFE\b/i, id: 'french_press', label: 'Presse à Café', icon: '☕', group: 'small' },
        { pattern: /\bCAFE(?:TIER|ITIER)\b/i, id: 'coffee_maker', label: 'Cafetière', icon: '☕', group: 'small' },
        { pattern: /\bESPRESSO\b/i, id: 'espresso', label: 'Espresso', icon: '☕', group: 'small' },
        { pattern: /\bFRITEUSE\b/i, id: 'air_fryer', label: 'Friteuse', icon: '🍟', group: 'small' },
        { pattern: /\bBATTEUR\b/i, id: 'hand_mixer', label: 'Batteur', icon: '🥄', group: 'small' },
        { pattern: /\bBLENDER\b/i, id: 'blender', label: 'Blender', icon: '🥤', group: 'small' },
        { pattern: /\bHACHOIR\b/i, id: 'chopper', label: 'Hachoir', icon: '🔪', group: 'small' },
        { pattern: /\bPETRIN\b/i, id: 'stand_mixer', label: 'Pétrin', icon: '🍞', group: 'small' },
        { pattern: /\bBAKER\b/i, id: 'bread_maker', label: 'Machine à Pain', icon: '🍞', group: 'small' },
        { pattern: /\bASPIRATEUR\b/i, id: 'vacuum', label: 'Aspirateur', icon: '🧹', group: 'small' },
        { pattern: /\bFER\b/i, id: 'iron', label: 'Fer à Repasser', icon: '👔', group: 'small' },
        { pattern: /\bFONTAIN[E]?\b/i, id: 'water_dispenser', label: 'Fontaine', icon: '💧', group: 'large' },
        { pattern: /\bHOTTE\b/i, id: 'range_hood', label: 'Hotte', icon: '🌬️', group: 'large' },
        { pattern: /\bPANINEUSE\b/i, id: 'sandwich_maker', label: 'Panineuse', icon: '🥪', group: 'small' },
        { pattern: /\bCOCOTTE\b/i, id: 'pressure_cooker', label: 'Cocotte', icon: '🍲', group: 'small' },
        { pattern: /\bBOULOIRE\b/i, id: 'kettle', label: 'Bouilloire', icon: '🫖', group: 'small' },
        { pattern: /\bMARMITE\b/i, id: 'electric_pot', label: 'Marmite Électrique', icon: '🍲', group: 'small' },
        { pattern: /\bJUICER\b/i, id: 'juicer', label: 'Extracteur', icon: '🍊', group: 'small' },
        { pattern: /\bSECHE.?CHEVEUX\b/i, id: 'hair_dryer', label: 'Sèche-Cheveux', icon: '💇', group: 'small' },
        { pattern: /\bTOASTER\b/i, id: 'toaster', label: 'Grille-Pain', icon: '🍞', group: 'small' },
        { pattern: /\bVENTILATEUR\b/i, id: 'fan', label: 'Ventilateur', icon: '🌀', group: 'small' },
        { pattern: /\bRECHAUD\b/i, id: 'portable_stove', label: 'Réchaud', icon: '🔥', group: 'small' },
        { pattern: /\bRESISTANCE\b/i, id: 'electric_heater', label: 'Résistance', icon: '🌡️', group: 'small' },
        { pattern: /\bAIR COOLER\b/i, id: 'air_cooler', label: 'Refroidisseur', icon: '❄️', group: 'large' },
        { pattern: /\bTV\b/i, id: 'tv', label: 'Télévision', icon: '📺', group: 'large' },
    ];

    // ── Color Dictionary (French → standard) ──────────────────────
    const COLORS = {
        'NOIR': { fr: 'Noir', en: 'Black', hex: '#1a1a2e' },
        'NOIRE': { fr: 'Noir', en: 'Black', hex: '#1a1a2e' },
        'BLANC': { fr: 'Blanc', en: 'White', hex: '#f5f5f5' },
        'BLANCHE': { fr: 'Blanc', en: 'White', hex: '#f5f5f5' },
        'GRIS': { fr: 'Gris', en: 'Grey', hex: '#808090' },
        'GRISE': { fr: 'Gris', en: 'Grey', hex: '#808090' },
        'INOX': { fr: 'Inox', en: 'Stainless Steel', hex: '#c0c0d0' },
        'ROUGE': { fr: 'Rouge', en: 'Red', hex: '#dc3545' },
        'BEIGE': { fr: 'Beige', en: 'Beige', hex: '#d4a574' },
        'BLEU': { fr: 'Bleu', en: 'Blue', hex: '#4a90e2' },
        'BLUE': { fr: 'Bleu', en: 'Blue', hex: '#4a90e2' },
        'VERT': { fr: 'Vert', en: 'Green', hex: '#28a745' },
        'ARGENT': { fr: 'Argent', en: 'Silver', hex: '#b0b0c0' },
        'SILVER': { fr: 'Argent', en: 'Silver', hex: '#b0b0c0' },
        'MAUVE': { fr: 'Mauve', en: 'Purple', hex: '#9b59b6' },
        'MORON': { fr: 'Marron', en: 'Brown', hex: '#8b4513' },
        'BRONZE': { fr: 'Bronze', en: 'Bronze', hex: '#cd7f32' },
        'ORANGE': { fr: 'Orange', en: 'Orange', hex: '#fd7e14' },
        'CORAL': { fr: 'Corail', en: 'Coral', hex: '#ff7f50' },
        'MATT': { fr: 'Mat', en: 'Matte', hex: '#666680' },
    };

    // ── Category group colors for dashboard ───────────────────────
    const GROUP_THEMES = {
        large: { gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', accent: '#8b5cf6' },
        small: { gradient: 'linear-gradient(135deg, #2dd4bf, #06b6d4)', accent: '#2dd4bf' },
    };

    // ═══════════════════════════════════════════════════════════════
    //  PRE-COMPILED REGEX OPTIMIZATIONS
    // ═══════════════════════════════════════════════════════════════
    const BRAND_REGEXES = BRANDS.map(brand => {
        const escaped = brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return {
            normalized: brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase(),
            regex: new RegExp('\\b' + escaped + '\\b', 'i')
        };
    });

    const COLOR_REGEXES = Object.entries(COLORS).map(([key, val]) => ({
        val,
        regex: new RegExp('\\b' + key + '\\b', 'i')
    }));

    // ═══════════════════════════════════════════════════════════════
    // ----- Confidence Wrapper ---------------------------------------------------
    function wrapWithConfidence(value, source, matchCount, totalPatterns, specificityScore, brandOverlap) {
        const confidence = 0.5 * (matchCount / totalPatterns) +
            0.3 * specificityScore +
            0.2 * brandOverlap;
        return { value, confidence: Math.min(1, Math.max(0, confidence)), source };
    }
    //  CSV PARSER (RFC 4180)
    // ═══════════════════════════════════════════════════════════════
    function parseCSVRows(csvText) {
        const rows = [];
        let current = '';
        let inQuotes = false;
        const lines = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        let row = [];

        for (let i = 0; i < lines.length; i++) {
            const ch = lines[i];
            if (inQuotes) {
                if (ch === '"') {
                    if (i + 1 < lines.length && lines[i + 1] === '"') {
                        current += '"';
                        i++;
                    } else {
                        inQuotes = false;
                    }
                } else {
                    current += ch;
                }
            } else {
                if (ch === '"') {
                    inQuotes = true;
                } else if (ch === ',') {
                    row.push(current.trim());
                    current = '';
                } else if (ch === '\n') {
                    row.push(current.trim());
                    if (row.length > 1 || (row.length === 1 && row[0] !== '')) {
                        rows.push(row);
                    }
                    row = [];
                    current = '';
                } else {
                    current += ch;
                }
            }
        }
        // Last field/row
        row.push(current.trim());
        if (row.length > 1 || (row.length === 1 && row[0] !== '')) {
            rows.push(row);
        }
        return rows;
    }

    // ═══════════════════════════════════════════════════════════════
    //  BRAND EXTRACTION
    // ═══════════════════════════════════════════════════════════════
    function extractBrand(nom) {
        const upper = nom.toUpperCase();
        let matchCount = 0;
        let bestMatch = null;
        let bestSpecificity = 0;
        for (const b of BRAND_REGEXES) {
            if (b.regex.test(upper)) {
                matchCount++;
                const spec = b.normalized.length;
                if (spec > bestSpecificity) {
                    bestSpecificity = spec;
                    bestMatch = b.normalized;
                }
            }
        }
        // Fallback: try the second word (common pattern: "CATEGORY BRAND ...")
        if (!bestMatch) {
            const words = nom.trim().split(/\s+/);
            if (words.length >= 2) {
                bestMatch = words[1].charAt(0).toUpperCase() + words[1].slice(1).toLowerCase();
            }
        }
        const brandOverlap = BRANDS.includes(bestMatch) ? 1 : 0;
        const specificityScore = bestSpecificity / Math.max(...BRANDS.map(b => b.length));
        return wrapWithConfidence(bestMatch || 'Unknown', 'brand', matchCount, BRANDS.length, specificityScore, brandOverlap);
    }

    // ═══════════════════════════════════════════════════════════════
    //  CATEGORY CLASSIFICATION
    // ═══════════════════════════════════════════════════════════════
    function classifyCategory(nom) {
        const upper = nom.toUpperCase();
        let matchCount = 0;
        let best = null;
        let bestSpecificity = 0;
        for (const cat of CATEGORY_PATTERNS) {
            if (cat.pattern.test(upper)) {
                matchCount++;
                const spec = cat.pattern.source.length;
                if (spec > bestSpecificity) {
                    bestSpecificity = spec;
                    best = cat;
                }
            }
        }
        const result = best ? { id: best.id, label: best.label, icon: best.icon, group: best.group } : { id: 'other', label: 'Autre', icon: '📦', group: 'small' };
        const specificityScore = bestSpecificity / Math.max(...CATEGORY_PATTERNS.map(c => c.pattern.source.length));
        return wrapWithConfidence(result, 'category', matchCount, CATEGORY_PATTERNS.length, specificityScore, 0);
    }

    // ═══════════════════════════════════════════════════════════════
    //  SPEC EXTRACTION (from product name)
    // ═══════════════════════════════════════════════════════════════
    function extractSpecs(nom, categoryId) {
        const upper = nom.toUpperCase();
        const specs = {};

        // ── Screen size (TVs): "32P", "43P", "55P", "75P" ──
        const screenMatch = upper.match(/(\d{2})P\b/);
        if (screenMatch) specs.screenSize = parseInt(screenMatch[1]);

        // ── Capacity in KG: "10.5KG", "8KG" ──
        const kgMatch = upper.match(/(\d+(?:\.\d+)?)\s*KG?\b/);
        if (kgMatch) specs.capacityKg = parseFloat(kgMatch[1]);

        // ── Capacity in Liters: "50L", "20L" ──
        const literMatch = upper.match(/(\d+(?:\.\d+)?)\s*L\b/);
        if (literMatch) specs.capacityL = parseInt(literMatch[1]);

        // ── Burners: "4F", "5F", "3 FEUX" ──
        const burnerMatch = upper.match(/(\d)\s*F(?:EUX)?\b/);
        if (burnerMatch && ['cooker', 'cooktop', 'portable_stove'].includes(categoryId)) {
            specs.burners = parseInt(burnerMatch[1]);
        }

        // ── Elements (oil heaters): "9 ELEMENT", "13 ELEMENT" ──
        const elemMatch = upper.match(/(\d+)\s*ELEMENT/);
        if (elemMatch) specs.elements = parseInt(elemMatch[1]);

        // ── BTU (air conditioners): "25BT", "36000" ──
        const btuMatch = upper.match(/(\d+)\s*BT/);
        if (btuMatch) specs.btu = parseInt(btuMatch[1]) * 1000;

        // ── KW (heaters): "10KW", "14KW" ──
        const kwMatch = upper.match(/(\d+)\s*KW/);
        if (kwMatch) specs.powerKW = parseInt(kwMatch[1]);

        // ── Wattage: "2000W", "1400W" ──
        const wattMatch = upper.match(/(\d+)\s*W\b/);
        if (wattMatch) specs.powerW = parseInt(wattMatch[1]);

        // ── Color ──
        for (const cr of COLOR_REGEXES) {
            if (cr.regex.test(upper)) {
                specs.color = cr.val.fr;
                specs.colorHex = cr.val.hex;
                break;
            }
        }

        // ── Material ──
        if (/\bPLASTIC\b/i.test(upper)) specs.material = 'Plastique';
        if (/\bMETAL\b/i.test(upper)) specs.material = 'Métal';
        if (/\bGLASS\b|VITRE\b/i.test(upper)) specs.material = 'Verre';

        // ── Features/Tags ──
        const features = [];
        if (/\bSMART\b/i.test(upper)) features.push('Smart');
        if (/\bGOOGLE TV\b/i.test(upper)) features.push('Google TV');
        if (/\bVIDAA\b/i.test(upper)) features.push('VIDAA');
        if (/\bANDROID\b/i.test(upper)) features.push('Android');
        if (/\bQLED\b/i.test(upper)) features.push('QLED');
        if (/\bLED\b/i.test(upper) && categoryId === 'tv') features.push('LED');
        if (/\bFRAMELESS\b/i.test(upper)) features.push('Frameless');
        if (/\bAFFICHEUR\b/i.test(upper)) features.push('Afficheur Digital');
        if (/\bVENTIL\b/i.test(upper)) features.push('Ventilé');
        if (/\bINVENT(?:ER|EUR)\b/i.test(upper)) features.push('Inverter');
        if (/\bDISTRIBU?TEUR\b/i.test(upper)) features.push('Distributeur');
        if (/\bDOUBLE (?:BRA|CROCHET)\b/i.test(upper)) features.push('Double');
        if (/\bENCASTRABLE\b/i.test(upper)) features.push('Encastrable');
        if (/\bMULTI.?FONC?TION\b/i.test(upper)) features.push('Multi-Fonction');
        if (/\b3\s*(?:EN|IN)\s*1\b/i.test(upper)) features.push('3-en-1');
        if (/\b2\s*(?:EN|IN)\s*1\b/i.test(upper)) features.push('2-en-1');
        if (/\b5\s*(?:EN|IN)\s*1\b/i.test(upper)) features.push('5-en-1');
        if (/\bGRILL\b/i.test(upper)) features.push('Grill');
        if (/\bARMOIR\b/i.test(upper)) features.push('Armoire');
        if (/\bVERTICAL\b/i.test(upper)) features.push('Vertical');
        if (/\bTOP\b/i.test(upper) && categoryId === 'washing_machine') features.push('Top');
        if (/\bPORTABLE\b/i.test(upper)) features.push('Portable');
        if (/\bCRYSTAL UHD\b/i.test(upper)) features.push('Crystal UHD');
        if (/\bAIRFRYER\b|AIR\s*FRYER\b/i.test(upper)) features.push('Air Fryer');
        if (/\bSCRATCH\b/i.test(upper)) features.push('Scratch');
        if (/\bMINUTE\b/i.test(upper)) features.push('Minute');
        if (/\bMINI\b/i.test(upper)) features.push('Mini');
        if (/\bLUXURY\b/i.test(upper)) features.push('Luxury');

        specs.features = features;

        return specs;
    }

    // ═══════════════════════════════════════════════════════════════
    //  MARGIN INTELLIGENCE
    // ═══════════════════════════════════════════════════════════════
    function calculateCommercial(row) {
        const retail = parseFloat(row['Prix de Vente (Détail)']) || 0;
        const wholesale = parseFloat(row['Prix de Gros']) || 0;
        const purchase = parseFloat(row["Prix d'Achat"]) || 0;
        const cump = parseFloat(row['CUMP (Coût Unitaire Moyen Pondéré)']) || 0;
        const lastPurchase = parseFloat(row["Dernier Prix d'Achat"]) || 0;
        const stockQty = parseInt(row['Quantité en Stock']) || 0;
        const stockStatus = row['Statut Stock'] || 'Unknown';
        const stockValueCUMP = parseFloat(row['Valeur Stock (CUMP)']) || 0;

        // Use best available cost: CUMP > last purchase > purchase price
        const cost = cump || lastPurchase || purchase || 0;

        const margin = cost > 0 ? ((retail - cost) / retail * 100) : 0;
        const wholesaleDiscount = retail > 0 ? ((retail - wholesale) / retail * 100) : 0;
        const markup = cost > 0 ? ((retail - cost) / cost * 100) : 0;

        return {
            retailPrice: retail,
            wholesalePrice: wholesale,
            purchasePrice: purchase,
            cump: cump,
            lastPurchasePrice: lastPurchase,
            cost: cost,
            margin: Math.round(margin * 10) / 10,
            markup: Math.round(markup * 10) / 10,
            wholesaleDiscount: Math.round(wholesaleDiscount * 10) / 10,
            stockQty,
            stockStatus,
            stockValue: stockValueCUMP,
            capitalTiedUp: stockQty * cost,
        };
    }

    // ═══════════════════════════════════════════════════════════════
    //  PRIMARY SPEC (category-dependent display value)
    // ═══════════════════════════════════════════════════════════════
    function getPrimarySpec(specs, categoryId) {
        switch (categoryId) {
            case 'tv':
                return specs.screenSize ? `${specs.screenSize}"` : null;
            case 'washing_machine':
                return specs.capacityKg ? `${specs.capacityKg} kg` : null;
            case 'refrigerator':
            case 'freezer':
                return specs.capacityL ? `${specs.capacityL}L` : null;
            case 'electric_oven':
            case 'builtin_oven':
                return specs.capacityL ? `${specs.capacityL}L` : null;
            case 'microwave':
                return specs.capacityL ? `${specs.capacityL}L` : null;
            case 'air_conditioner':
                return specs.btu ? `${specs.btu / 1000}k BTU` : null;
            case 'air_fryer':
            case 'stand_mixer':
            case 'pressure_cooker':
                return specs.capacityL ? `${specs.capacityL}L` : null;
            case 'cooker':
            case 'cooktop':
                return specs.burners ? `${specs.burners} Feux` : null;
            case 'oil_heater':
                return specs.elements ? `${specs.elements} Éléments` : null;
            case 'gas_heater':
                return specs.powerKW ? `${specs.powerKW}kW` : null;
            case 'range_hood':
                return specs.screenSize ? `${specs.screenSize}cm` : null; // reuses screen size pattern for hood width
            default:
                return specs.capacityL ? `${specs.capacityL}L` :
                    specs.capacityKg ? `${specs.capacityKg}kg` :
                        specs.powerW ? `${specs.powerW}W` : null;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    //  MAIN PARSE FUNCTION
    // ═══════════════════════════════════════════════════════════════
    function parse(csvText) {
        const rows = parseCSVRows(csvText);
        if (rows.length < 2) return [];

        const headers = rows[0];
        const products = [];

        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i];
            if (cells.length < 2) continue;

            // Build row object from headers
            const row = {};
            headers.forEach((h, idx) => { row[h] = cells[idx] || ''; });

            const nom = row['Nom'] || '';
            if (!nom) continue;

            const sku = row['SKU'] || '';
            const barcode = row['Code Barre'] || '';
            const rawId = row['ID'] || `inv_${i}`;

            // Extract intelligence with confidence
            const brandInfo = extractBrand(nom);
            const categoryInfo = classifyCategory(nom);
            const specs = extractSpecs(nom, categoryInfo.value.id);
            const commercial = calculateCommercial(row);
            const primarySpec = getPrimarySpec(specs, categoryInfo.value.id);

            const product = {
                id: rawId,
                brand: brandInfo.value,
                brandConfidence: brandInfo.confidence,
                model: sku,
                name: nom,
                sku: sku,
                barcode: barcode,
                category: categoryInfo.value,
                categoryConfidence: categoryInfo.confidence,
                specs: specs,
                primarySpec: primarySpec,
                commercial: commercial,
                // Convenience accessors
                color: specs.color || null,
                colorHex: specs.colorHex || null,
                features: specs.features || [],
            };

            // Flag low confidence
            if (brandInfo.confidence < 0.6 || categoryInfo.confidence < 0.6) {
                product.needsReview = true;
            }

            products.push(product);
        }

        return products;
    }

    // ═══════════════════════════════════════════════════════════════
    //  ANALYTICS
    // ═══════════════════════════════════════════════════════════════
    function analyze(products) {
        const categories = {};
        const brands = {};
        let totalRetailValue = 0;
        let totalCost = 0;
        let totalItems = 0;
        let rupture = 0;
        let faible = 0;

        products.forEach(p => {
            // Count by category
            const cid = p.category.id;
            categories[cid] = categories[cid] || { label: p.category.label, icon: p.category.icon, count: 0, value: 0 };
            categories[cid].count++;
            categories[cid].value += p.commercial.retailPrice * p.commercial.stockQty;

            // Count by brand
            brands[p.brand] = (brands[p.brand] || 0) + 1;

            // Totals
            totalRetailValue += p.commercial.retailPrice * p.commercial.stockQty;
            totalCost += p.commercial.capitalTiedUp;
            totalItems += p.commercial.stockQty;

            // Stock health
            if (p.commercial.stockStatus === 'Rupture') rupture++;
            if (p.commercial.stockStatus === 'Faible') faible++;
        });

        // Top margin products
        const topMargin = [...products]
            .filter(p => p.commercial.margin > 0)
            .sort((a, b) => b.commercial.margin - a.commercial.margin)
            .slice(0, 10);

        // Capital at risk (out of stock items)
        const outOfStock = products.filter(p => p.commercial.stockStatus === 'Rupture');

        return {
            totalProducts: products.length,
            totalSKUs: totalItems,
            totalRetailValue,
            totalCost,
            avgMargin: products.length > 0
                ? Math.round(products.reduce((s, p) => s + p.commercial.margin, 0) / products.filter(p => p.commercial.margin > 0).length * 10) / 10
                : 0,
            categories: Object.entries(categories)
                .sort((a, b) => b[1].count - a[1].count)
                .map(([id, data]) => ({ id, ...data })),
            brands: Object.entries(brands)
                .sort((a, b) => b[1] - a[1])
                .map(([name, count]) => ({ name, count })),
            stockHealth: {
                normal: products.length - rupture - faible,
                rupture,
                faible,
            },
            topMargin,
            outOfStock,
        };
    }

    // ═══════════════════════════════════════════════════════════════
    //  FORMAT HELPERS
    // ═══════════════════════════════════════════════════════════════
    function formatPrice(price) {
        if (!price) return '—';
        return new Intl.NumberFormat('fr-DZ', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price) + ' DA';
    }

    function marginColor(margin) {
        if (margin >= 50) return '#22c55e';
        if (margin >= 30) return '#84cc16';
        if (margin >= 15) return '#eab308';
        if (margin >= 0) return '#f97316';
        return '#ef4444';
    }

    function stockColor(status) {
        if (status === 'Normal') return '#22c55e';
        if (status === 'Faible') return '#eab308';
        if (status === 'Rupture') return '#ef4444';
        return '#6b7280';
    }

    // ═══════════════════════════════════════════════════════════════
    //  DETECT CSV FORMAT
    // ═══════════════════════════════════════════════════════════════
    function isInventoryCSV(csvText) {
        const firstLine = csvText.split(/[\r\n]/)[0].toUpperCase();
        return firstLine.includes('NOM') && firstLine.includes('PRIX');
    }

    // ═══════════════════════════════════════════════════════════════
    //  PUBLIC API
    // ═══════════════════════════════════════════════════════════════
    return {
        parse,
        analyze,
        formatPrice,
        marginColor,
        stockColor,
        isInventoryCSV,
        extractBrand,
        classifyCategory,
        extractSpecs,
        CATEGORY_PATTERNS,
        BRANDS,
        COLORS,
    };

})();
