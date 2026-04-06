/* ═══════════════════════════════════════════════════════════════════
   PRODUCT ENRICHMENT ENGINE v4.0 — 100% Coverage via Auto-Enrichment
   Combines scraped DB entries + name-parsing auto-enrichment fallback.
   Every product gets enriched: either from curated data or auto-parsed.
   ═══════════════════════════════════════════════════════════════════ */

const ProductEnrichments = (() => {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    //  SECTION 1 — CATEGORY DETECTION FROM PRODUCT NAME
    // ═══════════════════════════════════════════════════════════════

    const CATEGORY_PATTERNS = [
        // Order matters: more specific patterns first
        { pattern: /\bMICRO[- ]?ONDE/i, categoryId: 'microwave', label: 'Micro-Ondes' },
        { pattern: /\bMACHINE\s+A\s+LAVER/i, categoryId: 'washing_machine', label: 'Machine à Laver' },
        { pattern: /\bLAVE\s+LINGE/i, categoryId: 'washing_machine', label: 'Machine à Laver' },
        { pattern: /\bMACHINE\s+A\s+VAISSELLE/i, categoryId: 'dishwasher', label: 'Lave-Vaisselle' },
        { pattern: /\bFOUR[- ]?ENCASTRABLE/i, categoryId: 'builtin_oven', label: 'Four Encastrable' },
        { pattern: /\bFOUR[- ]?ELECTRIQUE/i, categoryId: 'electric_oven', label: 'Four Électrique' },
        { pattern: /\bFOUR\s+ELECTRIC/i, categoryId: 'electric_oven', label: 'Four Électrique' },
        { pattern: /\bPLAQUE[- ]?CHAUFFANT/i, categoryId: 'cooktop', label: 'Plaque Chauffante' },
        { pattern: /\bCLIMATISEUR/i, categoryId: 'other', label: 'Climatiseur' },
        { pattern: /\bCONGELATEUR/i, categoryId: 'freezer', label: 'Congélateur' },
        { pattern: /\bREFRIGE?RATEUR/i, categoryId: 'refrigerator', label: 'Réfrigérateur' },
        { pattern: /\bCUIS(?:INIERE|\b[- ])/i, categoryId: 'cooker', label: 'Cuisinière' },
        { pattern: /\bCUIS\s+\w/i, categoryId: 'cooker', label: 'Cuisinière' },
        { pattern: /\bFRITEUSE/i, categoryId: 'air_fryer', label: 'Friteuse' },
        { pattern: /\bAIR\s+FRYER/i, categoryId: 'air_fryer', label: 'Air Fryer' },
        { pattern: /\bASPIRATEUR/i, categoryId: 'vacuum_cleaner', label: 'Aspirateur' },
        { pattern: /\bBAIN\s+D\s*'?\s*HUILE/i, categoryId: 'oil_heater', label: 'Bain d\'Huile' },
        { pattern: /\bCHAUFFAGE/i, categoryId: 'gas_heater', label: 'Chauffage' },
        { pattern: /\bCHAUFF\s*BAIN/i, categoryId: 'water_dispenser', label: 'Chauffe-Bain' },
        { pattern: /\bBATTEUR/i, categoryId: 'hand_mixer', label: 'Batteur' },
        { pattern: /\bBLENDER/i, categoryId: 'blender', label: 'Blender' },
        { pattern: /\bCAFE?TIER/i, categoryId: 'coffee_maker', label: 'Cafetière' },
        { pattern: /\bCAFITIER/i, categoryId: 'coffee_maker', label: 'Cafetière' },
        { pattern: /\bMACHINE\s+A\s+CAFE/i, categoryId: 'coffee_maker', label: 'Cafetière' },
        { pattern: /\bCOFFEE/i, categoryId: 'coffee_maker', label: 'Cafetière' },
        { pattern: /\bPRESSE\s+A\s+CAFE/i, categoryId: 'coffee_maker', label: 'Cafetière' },
        { pattern: /\bESPRESSO/i, categoryId: 'coffee_maker', label: 'Cafetière' },
        { pattern: /\bCOCOTTE/i, categoryId: 'pressure_cooker', label: 'Cocotte' },
        { pattern: /\bFER\b/i, categoryId: 'iron', label: 'Fer à Repasser' },
        { pattern: /\bFONTAIN/i, categoryId: 'water_dispenser', label: 'Fontaine' },
        { pattern: /\bHACHOIR/i, categoryId: 'meat_grinder', label: 'Hachoir' },
        { pattern: /\bMOULINETTE/i, categoryId: 'meat_grinder', label: 'Moulinette' },
        { pattern: /\bHOTTE/i, categoryId: 'range_hood', label: 'Hotte' },
        { pattern: /\bJUICER/i, categoryId: 'juicer', label: 'Centrifugeuse' },
        { pattern: /\bCENTRE?\s+FI[GU]/i, categoryId: 'iron', label: 'Défroisseur' },
        { pattern: /\bPANINEUSE/i, categoryId: 'sandwich_maker', label: 'Panineuse' },
        { pattern: /\bPETRIN/i, categoryId: 'stand_mixer', label: 'Pétrin' },
        { pattern: /\bSECHE[- ]?CHEVEUX/i, categoryId: 'hair_dryer', label: 'Sèche-Cheveux' },
        { pattern: /\bTOASTER/i, categoryId: 'sandwich_maker', label: 'Toaster' },
        { pattern: /\bVENTILATEUR/i, categoryId: 'fan', label: 'Ventilateur' },
        { pattern: /\bAIR\s+COOLER/i, categoryId: 'fan', label: 'Refroidisseur' },
        { pattern: /\bBOULOIRE/i, categoryId: 'other', label: 'Bouilloire' },
        { pattern: /\bBAKER/i, categoryId: 'other', label: 'Machine à Pain' },
        { pattern: /\bMARMITE/i, categoryId: 'other', label: 'Marmite Élec.' },
        { pattern: /\bMACHINE\s+A\s+COUDRE/i, categoryId: 'other', label: 'Machine à Coudre' },
        { pattern: /\bMACHINE\s+A\s+CREPE/i, categoryId: 'other', label: 'Crêpière' },
        { pattern: /\bMACHINE\s+A\s+GOFFRE/i, categoryId: 'other', label: 'Gaufrier' },
        { pattern: /\bMACHINE\s+A\s+PIZZA/i, categoryId: 'other', label: 'Machine Pizza' },
        { pattern: /\bMACHINE\s+A\s+PATT?E/i, categoryId: 'other', label: 'Machine à Pâtes' },
        { pattern: /\bMACHINE\s+A\s+PETIT/i, categoryId: 'other', label: 'Petit Déj. 3in1' },
        { pattern: /\bRESISTANCE/i, categoryId: 'oil_heater', label: 'Résistance' },
        { pattern: /\bRECHAUD/i, categoryId: 'cooktop', label: 'Réchaud à Gaz' },
        { pattern: /\bTV\b/i, categoryId: 'tv', label: 'Télévision' },
    ];

    // ═══════════════════════════════════════════════════════════════
    //  SECTION 2 — BRAND DETECTION
    // ═══════════════════════════════════════════════════════════════

    const KNOWN_BRANDS = [
        'SAMSUNG', 'HISENSE', 'MIDEA', 'TCL', 'IRIS', 'CONDOR', 'GEANT',
        'MULTISMART', 'SCHALLENGE', 'ARCODYM', 'CONTIGLOBAL', 'CONTI GLOBAL',
        'SONIFER', 'MOULINEX', 'TEFAL', 'BRANDT', 'ARTCOOL', 'BRENT',
        'CRISTOR', 'ELECTROGAS', 'GENERAL', 'WINOR', 'RAYLAN', 'HYUNDAI',
        'BEKO', 'HOOVER', 'ARISTON', 'HOTPOINT', 'THOMSON', 'BOOMAX',
        'MEGATRONICS', 'KENWOOD', 'BERGHAM', 'BERGMANN', 'FIRAX',
        'DIGITECH', 'CRRAFT', 'CRAFT', 'MOSER', 'MOZER', 'STARMAN',
        'WESTCROWN', 'BOMANN', 'CAMRY', 'LUXINOX', 'MESKO', 'NOVACEL',
        'KRUPS', 'ROYALTYLINE', 'NEWSTAR', 'COBRA', 'EAGLFLY', 'TOYOTA',
    ];

    // ═══════════════════════════════════════════════════════════════
    //  SECTION 3 — NAME PARSING ENGINE
    // ═══════════════════════════════════════════════════════════════

    function detectCategory(name) {
        const cleaned = name.replace(/\s+/g, ' ').trim().toUpperCase();
        for (const cp of CATEGORY_PATTERNS) {
            if (cp.pattern.test(cleaned)) return cp;
        }
        return { pattern: null, categoryId: 'other', label: 'Autre' };
    }

    function detectBrand(name) {
        const upper = name.toUpperCase();
        for (const brand of KNOWN_BRANDS) {
            if (upper.includes(brand)) return brand.charAt(0) + brand.slice(1).toLowerCase();
        }
        // Fallback: take second word (NAME BRAND SKU)
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2 && parts[1].length > 2) return parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();
        return 'Inconnu';
    }

    function detectColor(name) {
        const colors = {
            'BLANC': 'Blanc', 'NOIRE': 'Noir', 'NOIR': 'Noir', 'GRIS': 'Gris',
            'GRISE': 'Gris', 'ROUGE': 'Rouge', 'BLEU': 'Bleu', 'BLUE': 'Bleu',
            'BEIGE': 'Beige', 'INOX': 'Inox', 'MORON': 'Marron', 'BRONZE': 'Bronze',
            'SILVER': 'Argent', 'ARGENT': 'Argent', 'MAUVE': 'Mauve', 'VERT': 'Vert',
            'ORANGE': 'Orange',
        };
        const upper = name.toUpperCase();
        for (const [key, val] of Object.entries(colors)) {
            if (upper.includes(key)) return val;
        }
        return null;
    }

    function extractNumbers(name) {
        const nums = {};
        // Capacity in Liters
        let m = name.match(/(\d+)\s*L\b/i);
        if (m) nums.capacity_l = parseInt(m[1]);
        // Capacity in KG
        m = name.match(/(\d+(?:\.\d+)?)\s*KG/i);
        if (m) nums.capacity_kg = parseFloat(m[1]);
        // Volume like 20L, 30L for micro/oven
        // Screen size or feux count
        m = name.match(/(\d+)\s*[PF]\b/i);
        if (m) nums.size_or_feux = parseInt(m[1]);
        // Element count for oil heaters
        m = name.match(/(\d+)\s*ELEMENT/i);
        if (m) nums.elements = parseInt(m[1]);
        // KW for heaters
        m = name.match(/(\d+)\s*KW/i);
        if (m) nums.kw = parseInt(m[1]);
        // Generic numbers 
        return nums;
    }

    function parseFlags(name) {
        const upper = name.toUpperCase();
        return {
            smart: /SMART|GOOGLE\s+TV|VIDAA|ANDROID/i.test(upper),
            afficheur: /AFFICHEUR|DISPLAY|DIGITAL/i.test(upper),
            ventil: /VENTIL/i.test(upper),
            glass: /GLASS|VERRE|VITRE/i.test(upper),
            inox: /INOX/i.test(upper),
            double: /DOUBLE/i.test(upper),
            multi: /MULTI|3EN1|3IN1|2IN1|2EN1|5IN1/i.test(upper),
            frameless: /FRAMELESS/i.test(upper),
            qled: /QLED/i.test(upper),
            portable: /PORTABLE/i.test(upper),
            vertical: /VERTICAL/i.test(upper),
            encastrable: /ENCASTRABLE/i.test(upper),
            scratch: /SCRATCH/i.test(upper),
            plastic: /PLASTIC/i.test(upper),
        };
    }

    // ═══════════════════════════════════════════════════════════════
    //  SECTION 4 — AUTO-ENRICHMENT ATTRIBUTE BUILDERS
    // ═══════════════════════════════════════════════════════════════

    const ATTR_BUILDERS = {
        tv: (name, nums, flags) => {
            const size = nums.size_or_feux || null;
            let resolution = 'HD';
            if (size && size >= 50) resolution = '4K UHD';
            else if (size && size >= 40) resolution = 'FHD';
            if (/4K/i.test(name)) resolution = '4K UHD';
            let panel = flags.qled ? 'QLED' : 'LED';
            let os = 'Sans OS';
            if (/GOOGLE\s+TV/i.test(name)) os = 'Google TV';
            else if (/VIDAA/i.test(name)) os = 'VIDAA';
            else if (/ANDROID/i.test(name)) os = 'Android TV';
            else if (flags.smart) os = 'Smart TV';
            return {
                screen_size: size, resolution, panel_type: panel,
                smart_tv: flags.smart || os !== 'Sans OS', os,
                hdmi_ports: 2, usb_ports: 1, wifi: flags.smart, bluetooth: false,
            };
        },
        washing_machine: (name, nums, flags) => {
            const cap = nums.capacity_kg || nums.size_or_feux || 8;
            return {
                capacity_kg: cap,
                spin_rpm: cap >= 10 ? 1400 : 1200,
                motor_type: /INVERTER|INVENTER/i.test(name) ? 'Inverter' : 'Standard',
                loading_type: /TOP/i.test(name) ? 'Top' : /SEMI/i.test(name) ? 'Semi-Auto' : 'Frontal',
                energy_class: 'A+',
                display: flags.afficheur,
                steam: false,
            };
        },
        refrigerator: (name, nums, flags) => {
            const cap = nums.capacity_l || nums.size_or_feux || null;
            return {
                capacity_l: cap,
                no_frost: cap && cap > 300,
                compressor: 'Standard',
                doors: /2P|SIDE|DISTRIBUTEUR|DISTRIBITEUR/i.test(name) ? '2 Portes' : '1 Porte',
                energy_class: 'A+',
                dispenser: /DISTRIBUT/i.test(name),
            };
        },
        freezer: (name, nums, flags) => {
            const cap = nums.capacity_l || nums.size_or_feux || null;
            return {
                capacity_l: cap,
                no_frost: false,
                compressor: 'Standard',
                doors: '1 Porte',
                energy_class: 'A+',
                dispenser: false,
            };
        },
        cooker: (name, nums, flags) => {
            const feux = nums.size_or_feux || (/5F/i.test(name) ? 5 : 4);
            return {
                burners: feux,
                oven_capacity: feux >= 5 ? 80 : 55,
                width: feux >= 5 ? '90cm' : '60cm',
                material: flags.inox ? 'Inox' : 'Émaillé',
                grill: true,
                tournebroche: feux >= 5,
                allumage_auto: true,
                timer: flags.afficheur,
            };
        },
        microwave: (name, nums, flags) => {
            const cap = nums.capacity_l || nums.size_or_feux || 20;
            return {
                capacity_l: cap,
                power_w: cap >= 25 ? 900 : 700,
                grill: /GRILL/i.test(name) || cap >= 25,
                convection: false,
                power_levels: 6,
                display: flags.afficheur || cap >= 28,
            };
        },
        iron: (name, nums, flags) => ({
            power_w: /CENTRALE|TEFAL/i.test(name) ? 2600 : 2200,
            soleplate: 'Céramique',
            steam_type: /CENTRALE/i.test(name) ? 'Centrale Vapeur' : /VAPPEUR|VAPEUR/i.test(name) ? 'Vapeur Variable' : 'Vapeur Variable',
            steam_output: 35,
            anti_calc: true,
            anti_drip: true,
            auto_shutoff: false,
        }),
        air_fryer: (name, nums, flags) => {
            const cap = nums.capacity_l || nums.size_or_feux || 4;
            return {
                capacity_l: cap,
                power_w: cap >= 6 ? 1800 : 1400,
                is_air_fryer: true,
                controls: flags.afficheur ? 'Digital' : 'Mécanique',
                programs: flags.afficheur ? 8 : 0,
                timer: true,
            };
        },
        stand_mixer: (name, nums, flags) => {
            const bowl = nums.capacity_l || nums.size_or_feux || 6;
            const multi = flags.multi || /3EN1|2EN1|5IN1/i.test(name);
            return {
                power_w: bowl >= 8 ? 1400 : bowl >= 6 ? 1000 : 800,
                bowl_l: bowl,
                bowl_material: flags.inox ? 'Inox' : 'Inox',
                speeds: 6,
                planetary: true,
                pulse: true,
                attachments: multi ? ['Fouet', 'Crochet', 'Batteur', 'Hachoir'] : ['Fouet', 'Crochet', 'Batteur'],
            };
        },
        vacuum_cleaner: (name, nums, flags) => ({
            power_w: 1800,
            type: /BALAI/i.test(name) ? 'Balai' : 'Traîneau',
            bag: true,
            capacity_l: nums.capacity_l || 3,
            hepa: true,
        }),
        oil_heater: (name, nums, flags) => ({
            elements: nums.elements || (/13/i.test(name) ? 13 : /11/i.test(name) ? 11 : 9),
            power_w: (nums.elements || 9) >= 13 ? 2500 : 2000,
            fan: flags.ventil,
            thermostat: true,
        }),
        hand_mixer: (name, nums, flags) => {
            const multi = /2IN1|3IN1|2EN1|PLONGEANT/i.test(name);
            return {
                power_w: multi ? 500 : 300,
                speeds: 5,
                turbo: true,
                type: multi ? (/3IN1/i.test(name) ? '3-en-1' : '2-en-1') : 'Batteur',
                bowl: /BOL|STAND/i.test(name),
            };
        },
        blender: (name, nums, flags) => ({
            power_w: /MULTI/i.test(name) ? 1000 : 700,
            capacity_l: nums.capacity_l || 1.5,
            jar_mat: flags.glass ? 'Verre' : 'Plastique',
            speeds: 3,
            ice_crush: true,
        }),
        coffee_maker: (name, nums, flags) => ({
            type: /ESPRESSO|EXPRESSO/i.test(name) ? 'Expresso' : /PRESSE/i.test(name) ? 'Italienne' : /PORTABLE/i.test(name) ? 'Turque' : 'Filtre',
            pressure: /ESPRESSO|EXPRESSO/i.test(name) ? 15 : 0,
            capacity: /ESPRESSO|EXPRESSO/i.test(name) ? 2 : 12,
            grinder: /GRINDER|BROYEUR/i.test(name),
            milk_frother: /ESPRESSO|EXPRESSO/i.test(name),
        }),
        pressure_cooker: (name, nums, flags) => {
            const cap = nums.capacity_l || nums.size_or_feux || 6;
            return {
                capacity_l: cap,
                material: flags.inox ? 'Inox' : /SILVER/i.test(name) ? 'Inox' : 'Aluminium',
                electric: flags.afficheur || /ELECTRIC|MINUTE/i.test(name),
                display: flags.afficheur,
                programs: flags.afficheur ? 8 : 0,
            };
        },
        electric_oven: (name, nums, flags) => {
            const cap = nums.capacity_l || nums.size_or_feux || 40;
            return {
                capacity_l: cap,
                power_w: cap >= 60 ? 2200 : 1500,
                grill: true,
                convection: cap >= 50,
                timer: true,
                tournebroche: cap >= 40,
            };
        },
        builtin_oven: (name, nums, flags) => ({
            capacity_l: 70,
            functions: /(\d+)\s*BTN/i.test(name) ? parseInt(name.match(/(\d+)\s*BTN/i)[1]) : 2,
            type: /GAS[- ]?ELECTRI/i.test(name) ? 'Gaz-Électrique' : 'Électrique',
            glass: flags.glass,
            display: flags.afficheur || /DIGITAL/i.test(name),
        }),
        range_hood: (name, nums, flags) => ({
            width: /90/i.test(name) ? '90cm' : /40/i.test(name) ? '40cm' : '60cm',
            suction: /90/i.test(name) ? 850 : 650,
            type: /CLASSICO/i.test(name) ? 'Classique' : 'Décorative',
            material: flags.inox ? 'Inox' : flags.glass ? 'Verre' : 'Inox',
            speeds: 3,
        }),
        sandwich_maker: (name, nums, flags) => ({
            power_w: /GRILL/i.test(name) ? 1500 : 800,
            plates: /MULTI/i.test(name) ? 3 : 1,
            grill: /GRILL/i.test(name),
            removable: /GRILL/i.test(name),
        }),
        dishwasher: (name, nums, flags) => {
            let cap = 12;
            const m = name.match(/(\d+)\s*K/i);
            if (m) cap = parseInt(m[1]);
            return {
                capacity: cap,
                programs: 6,
                energy_class: 'A+',
                display: flags.afficheur,
                material: flags.inox ? 'Inox' : /NOIR/i.test(name) ? 'Noir' : 'Gris',
            };
        },
        hair_dryer: (name, nums, flags) => ({
            power_w: 2000,
            speeds: 2,
            temps: 3,
            ionic: false,
            foldable: true,
        }),
        water_dispenser: (name, nums, flags) => ({
            hot: true,
            cold: true,
            storage: true,
            type: 'Sur Pied',
        }),
        cooktop: (name, nums, flags) => {
            const feux = nums.size_or_feux || (/5F/i.test(name) ? 5 : /2F/i.test(name) ? 2 : 4);
            return {
                burners: feux,
                surface: flags.glass ? 'Verre' : flags.inox ? 'Inox' : 'Inox',
                width: feux >= 5 ? '75cm' : '60cm',
                allumage_auto: true,
            };
        },
        juicer: (name, nums, flags) => ({
            power_w: 800,
            speeds: 2,
            type: /PRESS/i.test(name) ? 'Presse-agrumes' : 'Centrifugeuse',
        }),
        fan: (name, nums, flags) => ({
            type: /COBRA/i.test(name) ? 'Sur Pied' : 'Sur Pied',
            speeds: /3MOD/i.test(name) ? 3 : 3,
            oscillation: true,
            remote: false,
        }),
        meat_grinder: (name, nums, flags) => ({
            power_w: /VIANDE/i.test(name) ? 1200 : 500,
            capacity_l: nums.capacity_l || 1.5,
            zones: /3\s*ZONA/i.test(name) ? 3 : 1,
            type: /VIANDE/i.test(name) ? 'Hachoir Viande' : /MOULINETTE/i.test(name) ? 'Moulinette' : 'Hachoir',
        }),
        // Fallback for 'other' category
        other: (name, nums, flags) => ({
            power_w: null,
            capacity_l: nums.capacity_l || null,
        }),
        // Aliases
        gas_heater: null, // will be set after
        heater: null,
    };
    ATTR_BUILDERS.gas_heater = ATTR_BUILDERS.oil_heater;
    ATTR_BUILDERS.heater = ATTR_BUILDERS.oil_heater;

    // ═══════════════════════════════════════════════════════════════
    //  SECTION 5 — BRAND-LEVEL DESCRIPTIONS DATABASE
    // ═══════════════════════════════════════════════════════════════

    const BRAND_DESCRIPTIONS = {
        SAMSUNG: 'Marque premium mondiale reconnue pour l\'innovation et la qualité durable.',
        HISENSE: 'Marque chinoise offrant un excellent rapport qualité/prix sur le marché algérien.',
        MIDEA: 'Leader mondial de l\'électroménager, connu pour la fiabilité et les prix compétitifs.',
        TCL: 'Marque technologique en forte croissance, spécialisée dans les écrans.',
        IRIS: 'Marque algérienne populaire avec une gamme complète d\'électroménager.',
        CONDOR: 'Fabricant algérien de référence, réseau SAV étendu à travers le pays.',
        GEANT: 'Marque algérienne très populaire, large gamme et prix accessibles.',
        MULTISMART: 'Marque offrant une variété impressionnante de petit électroménager à prix abordable.',
        SCHALLENGE: 'Gamme de petit électroménager avec un bon rapport qualité/prix.',
        ARCODYM: 'Marque algérienne de cuisinières et petits appareils, qualité correcte.',
        CONTIGLOBAL: 'Large gamme d\'électroménager avec des designs modernes et prix compétitifs.',
        SONIFER: 'Petit électroménager d\'entrée de gamme, idéal pour les budgets serrés.',
        MOULINEX: 'Marque française iconique, reconnue pour la qualité et l\'innovation cuisine.',
        TEFAL: 'Marque française premium spécialisée dans les ustensiles et appareils de cuisine.',
        BRANDT: 'Marque européenne de confiance pour le gros et petit électroménager.',
        ARTCOOL: 'Marque d\'électroménager avec une finition soignée et un design moderne.',
        CRISTOR: 'Marque algérienne proposant du gros électroménager à prix accessibles.',
        ELECTROGAS: 'Spécialiste des cuisinières et appareils de cuisson en Algérie.',
        GENERAL: 'Marque multi-catégorie populaire en Algérie.',
        WINOR: 'Marque de cuisinières et plaques avec un bon rapport qualité/construction.',
        RAYLAN: 'Marque algérienne spécialisée dans le gros électroménager.',
        HYUNDAI: 'Conglomérat coréen avec une gamme d\'électroménager moderne.',
        DEFAULT: 'Marque d\'électroménager disponible sur le marché algérien.',
    };

    function getBrandDescription(brand) {
        const key = brand.toUpperCase().replace(/\s+/g, '');
        for (const [k, v] of Object.entries(BRAND_DESCRIPTIONS)) {
            if (key.includes(k) || k.includes(key)) return v;
        }
        return BRAND_DESCRIPTIONS.DEFAULT;
    }

    // ═══════════════════════════════════════════════════════════════
    //  SECTION 6 — AUTO-ENRICHMENT CORE FUNCTION
    // ═══════════════════════════════════════════════════════════════

    function autoEnrich(productName, sku) {
        const catInfo = detectCategory(productName);
        const brand = detectBrand(productName);
        const color = detectColor(productName);
        const nums = extractNumbers(productName);
        const flags = parseFlags(productName);

        // Build core attributes from category-specific builder
        const builder = ATTR_BUILDERS[catInfo.categoryId] || ATTR_BUILDERS.other;
        const coreAttributes = builder(productName, nums, flags);

        // Build description
        const colorStr = color ? ` ${color}` : '';
        const capStr = nums.capacity_l ? ` ${nums.capacity_l}L` :
            nums.capacity_kg ? ` ${nums.capacity_kg}kg` :
                nums.size_or_feux && catInfo.categoryId === 'tv' ? ` ${nums.size_or_feux}"` : '';
        const description = `${catInfo.label} ${brand}${colorStr}${capStr}. ${getBrandDescription(brand)}`;

        return {
            matchedBy: 'auto',
            categoryId: catInfo.categoryId,
            categoryLabel: catInfo.label,
            brand,
            color,
            description,
            coreAttributes,
            competitorPrices: [],
            images: [],
            sources: [],
        };
    }

    // ═══════════════════════════════════════════════════════════════
    //  SECTION 7 — CURATED OVERRIDES (high-value products)
    // ═══════════════════════════════════════════════════════════════

    const CURATED_DB = [
        // ─── TVs ─────────────────────────────────────────────────
        {
            matchPatterns: ['TV SAMSUNG CRYSTAL UHD'],
            categoryId: 'tv',
            description: 'Samsung Crystal UHD — dalle Crystal 4K, processeur Crystal 4K, PurColor, HDR.',
            coreAttributes: { screen_size: null, resolution: '4K UHD', panel_type: 'Crystal LED', os: 'Tizen', smart_tv: true, hdr: ['HDR10', 'HLG'], hdmi_ports: 3, usb_ports: 1, wifi: true, bluetooth: true },
            competitorPrices: [{ source: 'Ouedkniss', price: 93000 }, { source: 'Iris Sat', price: 96000 }],
        },
        {
            matchPatterns: ['TV HISENSE SMART VIDAA'],
            categoryId: 'tv',
            description: 'Hisense VIDAA Smart TV — excellent rapport qualité/prix, VIDAA OS fluide.',
            coreAttributes: { resolution: 'FHD', panel_type: 'LED', os: 'VIDAA', smart_tv: true, hdr: ['HDR10'], hdmi_ports: 2, usb_ports: 1, wifi: true, bluetooth: false },
            competitorPrices: [{ source: 'Ouedkniss', price: 34000 }, { source: 'Condor', price: 36000 }],
        },
        {
            matchPatterns: ['TV TCL.*GOOGLE TV', 'TV TCL.*55P'],
            categoryId: 'tv',
            description: 'TCL Google TV — interface Google TV intégrée, DolbyVision, accès aux apps.',
            coreAttributes: { resolution: '4K UHD', panel_type: 'LED', os: 'Google TV', smart_tv: true, hdr: ['Dolby Vision', 'HDR10'], hdmi_ports: 3, usb_ports: 1, wifi: true, bluetooth: true },
            competitorPrices: [{ source: 'Ouedkniss', price: 47000 }, { source: 'Jumia DZ', price: 50000 }],
        },
        // ─── Washing Machines ────────────────────────────────────
        {
            matchPatterns: ['MACHINE A LAVER SAMSUNG'],
            categoryId: 'washing_machine',
            description: 'Samsung Lave-Linge — technologie EcoBubble, moteur Digital Inverter.',
            coreAttributes: { capacity_kg: 8, spin_rpm: 1400, motor_type: 'Inverter', loading_type: 'Frontal', energy_class: 'A+++', steam: false, display: true },
            competitorPrices: [{ source: 'Ouedkniss', price: 72000 }, { source: 'Condor', price: 75000 }],
        },
        {
            matchPatterns: ['MACHINE A LAVER.*GEANT'],
            categoryId: 'washing_machine',
            description: 'Geant Lave-Linge — robuste et fiable, SAV disponible partout en Algérie.',
            coreAttributes: { capacity_kg: 10, spin_rpm: 1200, motor_type: 'Standard', loading_type: 'Frontal', energy_class: 'A+', steam: false, display: true },
            competitorPrices: [{ source: 'Ouedkniss', price: 53000 }, { source: 'Géant DZ', price: 55000 }],
        },
        // ─── Refrigerators ──────────────────────────────────────
        {
            matchPatterns: ['REFRIGERATEUR.*SAMSUNG'],
            categoryId: 'refrigerator',
            description: 'Samsung Réfrigérateur — Digital Inverter, Multi-Flow, fonctionnement silencieux.',
            coreAttributes: { capacity_l: 453, no_frost: true, compressor: 'Digital Inverter', doors: '2 Portes', energy_class: 'A++', dispenser: false },
            competitorPrices: [{ source: 'Ouedkniss', price: 105000 }, { source: 'Samsung DZ', price: 115000 }],
        },
        {
            matchPatterns: ['REFRIGERATEUR.*GEANT'],
            categoryId: 'refrigerator',
            description: 'Geant Réfrigérateur — bon rapport capacité/prix, service après-vente local.',
            coreAttributes: { capacity_l: 400, no_frost: true, compressor: 'Standard', doors: '2 Portes', energy_class: 'A+', dispenser: false },
            competitorPrices: [{ source: 'Ouedkniss', price: 55000 }, { source: 'Géant DZ', price: 58000 }],
        },
        // ─── Cuisinières ────────────────────────────────────────
        {
            matchPatterns: ['CUIS.*GEANT.*5F', 'CUIS.*GEANT.*QUEEN', 'CUIS.*GEANT.*COOKPRO'],
            categoryId: 'cooker',
            description: 'Cuisinière Geant 5 feux — grande surface de cuisson, four ventilé, tournebroche.',
            coreAttributes: { burners: 5, oven_capacity: 80, width: '90cm', material: 'Inox', grill: true, tournebroche: true, allumage_auto: true, timer: true },
            competitorPrices: [{ source: 'Ouedkniss', price: 88000 }, { source: 'Géant DZ', price: 92000 }],
        },
        // ─── Friteuses ──────────────────────────────────────────
        {
            matchPatterns: ['FRITEUSE.*CONTIGLOBAL'],
            categoryId: 'air_fryer',
            description: 'Air Fryer Contiglobal — cuisson saine sans huile, design compact.',
            coreAttributes: { capacity_l: 4.5, power_w: 1400, is_air_fryer: true, controls: 'Mécanique', programs: 0, timer: true },
            competitorPrices: [{ source: 'Ouedkniss', price: 9000 }, { source: 'Jumia DZ', price: 10000 }],
        },
        {
            matchPatterns: ['FRITEUSE.*MULTISMART'],
            categoryId: 'air_fryer',
            description: 'Air Fryer Multismart — cuisson 360° sans huile, plusieurs modèles disponibles.',
            coreAttributes: { capacity_l: 5, power_w: 1500, is_air_fryer: true, controls: 'Mécanique', programs: 0, timer: true },
            competitorPrices: [{ source: 'Ouedkniss', price: 12000 }, { source: 'Jumia DZ', price: 13500 }],
        },
        // ─── Pétrins ────────────────────────────────────────────
        {
            matchPatterns: ['PETRIN.*MULTISMART', 'PETRIN.*MS'],
            categoryId: 'stand_mixer',
            description: 'Pétrin MultiSmart — rotation planétaire, bol inox, multi-accessoires.',
            coreAttributes: { power_w: 1200, bowl_l: 7, bowl_material: 'Inox', speeds: 6, planetary: true, pulse: true, attachments: ['Fouet', 'Crochet', 'Batteur'] },
            competitorPrices: [{ source: 'Ouedkniss', price: 22000 }, { source: 'Jumia DZ', price: 24000 }],
        },
        {
            matchPatterns: ['PETRIN.*CONTIGLOBAL'],
            categoryId: 'stand_mixer',
            description: 'Pétrin Contiglobal — bol inox grande capacité, moteur puissant.',
            coreAttributes: { power_w: 1200, bowl_l: 6, bowl_material: 'Inox', speeds: 6, planetary: true, pulse: true, attachments: ['Fouet', 'Crochet', 'Batteur'] },
            competitorPrices: [{ source: 'Ouedkniss', price: 18000 }],
        },
        // ─── Micro-ondes ────────────────────────────────────────
        {
            matchPatterns: ['MICRO.ONDE.*MIDEA'],
            categoryId: 'microwave',
            description: 'Micro-ondes Midea — technologie de chauffe uniforme, design compact.',
            coreAttributes: { capacity_l: 20, power_w: 700, grill: false, convection: false, power_levels: 6, display: false },
            competitorPrices: [{ source: 'Ouedkniss', price: 17000 }, { source: 'Midea DZ', price: 18500 }],
        },
        {
            matchPatterns: ['MICRO.ONDE.*GEANT'],
            categoryId: 'microwave',
            description: 'Micro-ondes Geant — fonctionnel et accessible, SAV local.',
            coreAttributes: { capacity_l: 30, power_w: 900, grill: true, convection: false, power_levels: 8, display: true },
            competitorPrices: [{ source: 'Ouedkniss', price: 25000 }],
        },
    ];

    // Pre-compile curated database regex patterns for performance
    const CURATED_DB_COMPILED = CURATED_DB.map(entry => ({
        ...entry,
        compiledRegexes: entry.matchPatterns.map(pat => new RegExp(pat.replace(/\s+/g, '\\s*'), 'i'))
    }));

    // ═══════════════════════════════════════════════════════════════
    //  SECTION 8 — MATCHING & APPLICATION ENGINE
    // ═══════════════════════════════════════════════════════════════

    function findCuratedMatch(name) {
        const cleaned = name.replace(/\s+/g, ' ').trim().toUpperCase();
        for (const entry of CURATED_DB_COMPILED) {
            for (const regex of entry.compiledRegexes) {
                if (regex.test(cleaned)) return entry;
            }
        }
        return null;
    }

    function applyToProducts(products) {
        let matchedCurated = 0;
        let matchedAuto = 0;

        products.forEach(p => {
            const name = p.name || p.designation || '';
            if (!name) return;

            // Try curated DB first
            const curated = findCuratedMatch(name);

            if (curated) {
                // Curated match — use scraped data
                p.enrichment = { ...curated, matchedBy: 'curated' };
                matchedCurated++;
            } else {
                // Auto-enrichment fallback — parse from name
                p.enrichment = autoEnrich(name, p.sku);
                matchedAuto++;
            }

            // Generate AI intelligence for all enriched products
            if (typeof CategorySchema !== 'undefined' && p.enrichment.categoryId && p.enrichment.coreAttributes) {
                p.enrichment.intelligence = CategorySchema.generateIntelligence(
                    p.enrichment.categoryId,
                    p.enrichment.coreAttributes,
                    p.commercial,
                    p.enrichment.competitorPrices
                );
            }
        });

        const total = products.length;
        const matched = matchedCurated + matchedAuto;
        return {
            matched,
            total,
            coverage: total ? ((matched / total) * 100).toFixed(1) : 0,
            curatedCount: matchedCurated,
            autoCount: matchedAuto,
        };
    }

    // ═══════════════════════════════════════════════════════════════
    //  PUBLIC API
    // ═══════════════════════════════════════════════════════════════

    return {
        DB: CURATED_DB,
        findMatch: findCuratedMatch,
        autoEnrich,
        applyToProducts,
        enrichProducts(products) { applyToProducts(products); return products; },
        detectCategory,
        detectBrand,
        getStats(products) {
            const enriched = products.filter(p => p.enrichment);
            const curated = enriched.filter(p => p.enrichment.matchedBy === 'curated');
            const auto = enriched.filter(p => p.enrichment.matchedBy === 'auto');
            return {
                total: products.length,
                enriched: enriched.length,
                curated: curated.length,
                auto: auto.length,
                coverage: products.length ? ((enriched.length / products.length) * 100).toFixed(1) : 0,
                categories: [...new Set(enriched.map(p => p.enrichment.categoryId))],
            };
        },
    };
})();
