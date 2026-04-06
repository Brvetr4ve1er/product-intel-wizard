/* ═══════════════════════════════════════════════════════════════════
   CATEGORY SCHEMA ENGINE — Layered Adaptive Attribute System
   Amazon-style category-specific attribute governance with
   AI-driven pros/cons generation from scraped intelligence.
   ═══════════════════════════════════════════════════════════════════ */

const CategorySchema = (() => {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    //  LAYER 1 — UNIVERSAL ATTRIBUTES (All products share these)
    // ═══════════════════════════════════════════════════════════════
    const UNIVERSAL_KEYS = [
        'brand', 'model', 'sku', 'category', 'variant',
        'price', 'margin', 'availability',
        'images', 'sources', 'description',
        'enrichedAt', 'confidenceScore',
    ];

    // ═══════════════════════════════════════════════════════════════
    //  LAYER 2+3 — CATEGORY TEMPLATES (Core + Filter + Comparison)
    // ═══════════════════════════════════════════════════════════════
    const TEMPLATES = {

        // ─────────────────── 📺 TELEVISION ───────────────────────
        tv: {
            label: 'Télévision',
            icon: '📺',
            coreAttributes: {
                screen_size: { label: 'Taille Écran', unit: '"', type: 'number', filterable: true, comparable: true, priority: 1 },
                resolution: { label: 'Résolution', unit: null, type: 'enum', filterable: true, comparable: true, priority: 2, options: ['HD', 'FHD', '4K UHD', '8K'] },
                panel_type: { label: 'Type Dalle', unit: null, type: 'enum', filterable: true, comparable: true, priority: 3, options: ['LED', 'QLED', 'OLED', 'Crystal LED', 'DLED', 'NanoCell'] },
                refresh_rate: { label: 'Taux Rafraîch.', unit: 'Hz', type: 'number', filterable: false, comparable: true, priority: 4 },
                os: { label: 'Système', unit: null, type: 'enum', filterable: true, comparable: true, priority: 5, options: ['Tizen', 'WebOS', 'Android TV', 'Google TV', 'VIDAA', 'Sans OS'] },
                hdr: { label: 'HDR', unit: null, type: 'tags', filterable: false, comparable: true, priority: 6 },
                smart_tv: { label: 'Smart TV', unit: null, type: 'boolean', filterable: true, comparable: false, priority: 7 },
                audio_power: { label: 'Puissance Audio', unit: 'W', type: 'number', filterable: false, comparable: true, priority: 8 },
                hdmi_ports: { label: 'Ports HDMI', unit: null, type: 'number', filterable: false, comparable: true, priority: 9 },
                usb_ports: { label: 'Ports USB', unit: null, type: 'number', filterable: false, comparable: true, priority: 10 },
                wifi: { label: 'Wi-Fi', unit: null, type: 'boolean', filterable: false, comparable: false, priority: 11 },
                bluetooth: { label: 'Bluetooth', unit: null, type: 'boolean', filterable: false, comparable: false, priority: 12 },
            },
            comparisonAxes: ['display_quality', 'smart_features', 'connectivity', 'audio', 'value_for_money'],
            proConsRules: {
                strongIf: {
                    '4K+ resolution at mid price': (a) => a.resolution === '4K UHD' && a._pricePosition !== 'premium',
                    'Smart OS included': (a) => a.smart_tv === true,
                    'HDR support': (a) => a.hdr && a.hdr.length > 0,
                    'High refresh rate': (a) => a.refresh_rate >= 120,
                    'QLED/OLED panel': (a) => ['QLED', 'OLED'].includes(a.panel_type),
                    'Large screen (55"+)': (a) => a.screen_size >= 55,
                    'Rich connectivity': (a) => (a.hdmi_ports || 0) >= 3,
                },
                weakIf: {
                    'Faible taux de rafraîchissement': (a) => a.refresh_rate && a.refresh_rate <= 60,
                    'Résolution HD seulement': (a) => a.resolution === 'HD',
                    'Pas de Smart TV': (a) => a.smart_tv === false,
                    'Pas de HDR': (a) => !a.hdr || a.hdr.length === 0,
                    'Dalle LED basique': (a) => a.panel_type === 'LED' || a.panel_type === 'DLED',
                    'Connectivité limitée': (a) => (a.hdmi_ports || 0) < 2,
                },
            },
        },

        // ─────────────────── 👕 MACHINE À LAVER ─────────────────
        washing_machine: {
            label: 'Machine à Laver',
            icon: '👕',
            coreAttributes: {
                capacity_kg: { label: 'Capacité', unit: 'kg', type: 'number', filterable: true, comparable: true, priority: 1 },
                spin_rpm: { label: 'Essorage', unit: 'tr/min', type: 'number', filterable: false, comparable: true, priority: 2 },
                motor_type: { label: 'Moteur', unit: null, type: 'enum', filterable: true, comparable: true, priority: 3, options: ['Standard', 'Inverter'] },
                loading_type: { label: 'Chargement', unit: null, type: 'enum', filterable: true, comparable: false, priority: 4, options: ['Frontal', 'Top', 'Semi-Auto'] },
                energy_class: { label: 'Classe Énergie', unit: null, type: 'enum', filterable: true, comparable: true, priority: 5, options: ['A+++', 'A++', 'A+', 'A', 'B'] },
                programs: { label: 'Programmes', unit: null, type: 'tags', filterable: false, comparable: true, priority: 6 },
                steam: { label: 'Vapeur', unit: null, type: 'boolean', filterable: true, comparable: true, priority: 7 },
                display: { label: 'Afficheur', unit: null, type: 'boolean', filterable: false, comparable: false, priority: 8 },
            },
            comparisonAxes: ['capacity', 'efficiency', 'durability', 'features', 'value_for_money'],
            proConsRules: {
                strongIf: {
                    'Moteur Inverter (durable + silencieux)': (a) => a.motor_type === 'Inverter',
                    'Grande capacité (10kg+)': (a) => a.capacity_kg >= 10,
                    'Haute classe énergétique': (a) => ['A+++', 'A++'].includes(a.energy_class),
                    'Fonction vapeur hygiénique': (a) => a.steam === true,
                    'Essorage puissant (1400+)': (a) => a.spin_rpm >= 1400,
                },
                weakIf: {
                    'Moteur standard (moins durable)': (a) => a.motor_type === 'Standard',
                    'Capacité limitée (<7kg)': (a) => a.capacity_kg && a.capacity_kg < 7,
                    'Faible classe énergétique': (a) => ['B', 'C'].includes(a.energy_class),
                    'Essorage faible (<1000 tr/min)': (a) => a.spin_rpm && a.spin_rpm < 1000,
                    'Semi-automatique': (a) => a.loading_type === 'Semi-Auto',
                },
            },
        },

        // ─────────────────── 🧊 RÉFRIGÉRATEUR ───────────────────
        refrigerator: {
            label: 'Réfrigérateur',
            icon: '🧊',
            coreAttributes: {
                capacity_l: { label: 'Capacité', unit: 'L', type: 'number', filterable: true, comparable: true, priority: 1 },
                no_frost: { label: 'No Frost', unit: null, type: 'boolean', filterable: true, comparable: true, priority: 2 },
                compressor: { label: 'Compresseur', unit: null, type: 'enum', filterable: true, comparable: true, priority: 3, options: ['Standard', 'Inverter', 'Digital Inverter'] },
                doors: { label: 'Portes', unit: null, type: 'enum', filterable: true, comparable: false, priority: 4, options: ['1 Porte', '2 Portes', 'Side-by-Side', 'French Door'] },
                energy_class: { label: 'Classe Énergie', unit: null, type: 'enum', filterable: true, comparable: true, priority: 5, options: ['A+++', 'A++', 'A+', 'A', 'B'] },
                cooling_tech: { label: 'Technologie', unit: null, type: 'tags', filterable: false, comparable: true, priority: 6 },
                dispenser: { label: 'Distributeur', unit: null, type: 'boolean', filterable: true, comparable: false, priority: 7 },
            },
            comparisonAxes: ['capacity', 'efficiency', 'technology', 'convenience', 'value_for_money'],
            proConsRules: {
                strongIf: {
                    'No Frost (pas de dégivrage)': (a) => a.no_frost === true,
                    'Compresseur Inverter (silencieux)': (a) => a.compressor === 'Inverter' || a.compressor === 'Digital Inverter',
                    'Grande capacité (400L+)': (a) => a.capacity_l >= 400,
                    'Haute efficacité énergétique': (a) => ['A+++', 'A++'].includes(a.energy_class),
                    'Distributeur d\'eau/glace': (a) => a.dispenser === true,
                },
                weakIf: {
                    'Dégivrage manuel requis': (a) => a.no_frost === false,
                    'Compresseur standard': (a) => a.compressor === 'Standard',
                    'Capacité réduite (<300L)': (a) => a.capacity_l && a.capacity_l < 300,
                    'Faible classe énergétique': (a) => ['B', 'C'].includes(a.energy_class),
                },
            },
        },

        // ─────────────────── 🍳 CUISINIÈRE ──────────────────────
        cooker: {
            label: 'Cuisinière',
            icon: '🍳',
            coreAttributes: {
                burners: { label: 'Nombre de Feux', unit: null, type: 'number', filterable: true, comparable: true, priority: 1 },
                oven_capacity: { label: 'Volume Four', unit: 'L', type: 'number', filterable: false, comparable: true, priority: 2 },
                width: { label: 'Largeur', unit: 'cm', type: 'enum', filterable: true, comparable: false, priority: 3, options: ['50cm', '55cm', '60cm', '90cm'] },
                material: { label: 'Matériau', unit: null, type: 'enum', filterable: true, comparable: true, priority: 4, options: ['Inox', 'Émaillé', 'Verre'] },
                grill: { label: 'Grill', unit: null, type: 'boolean', filterable: false, comparable: true, priority: 5 },
                tournebroche: { label: 'Tournebroche', unit: null, type: 'boolean', filterable: false, comparable: true, priority: 6 },
                allumage_auto: { label: 'Allumage Auto.', unit: null, type: 'boolean', filterable: false, comparable: false, priority: 7 },
                timer: { label: 'Minuterie', unit: null, type: 'boolean', filterable: false, comparable: false, priority: 8 },
            },
            comparisonAxes: ['cooking_power', 'oven_quality', 'build_quality', 'features', 'value_for_money'],
            proConsRules: {
                strongIf: {
                    '5 feux (grande surface cuisson)': (a) => a.burners >= 5,
                    'Matériau Inox (durable)': (a) => a.material === 'Inox',
                    'Four grande capacité (60L+)': (a) => a.oven_capacity >= 60,
                    'Grill + tournebroche inclus': (a) => a.grill === true && a.tournebroche === true,
                    'Largeur 60cm (standard)': (a) => a.width === '60cm' || a.width === '90cm',
                },
                weakIf: {
                    'Seulement 4 feux': (a) => a.burners && a.burners <= 4,
                    'Matériau émaillé (moins durable)': (a) => a.material === 'Émaillé',
                    'Four petit volume (<50L)': (a) => a.oven_capacity && a.oven_capacity < 50,
                    'Pas de tournebroche': (a) => a.tournebroche === false,
                },
            },
        },

        // ─────────────────── 📡 MICRO-ONDES ─────────────────────
        microwave: {
            label: 'Micro-Ondes',
            icon: '📡',
            coreAttributes: {
                capacity_l: { label: 'Capacité', unit: 'L', type: 'number', filterable: true, comparable: true, priority: 1 },
                power_w: { label: 'Puissance', unit: 'W', type: 'number', filterable: false, comparable: true, priority: 2 },
                grill: { label: 'Grill', unit: null, type: 'boolean', filterable: true, comparable: true, priority: 3 },
                convection: { label: 'Convection', unit: null, type: 'boolean', filterable: true, comparable: true, priority: 4 },
                power_levels: { label: 'Niveaux', unit: null, type: 'number', filterable: false, comparable: true, priority: 5 },
                display: { label: 'Afficheur', unit: null, type: 'boolean', filterable: false, comparable: false, priority: 6 },
                timer_min: { label: 'Minuterie Max', unit: 'min', type: 'number', filterable: false, comparable: false, priority: 7 },
            },
            comparisonAxes: ['capacity', 'power', 'versatility', 'ease_of_use', 'value_for_money'],
            proConsRules: {
                strongIf: {
                    'Fonction grill combinée': (a) => a.grill === true,
                    'Grande capacité (25L+)': (a) => a.capacity_l >= 25,
                    'Puissance élevée (800W+)': (a) => a.power_w >= 800,
                    'Convection (cuisson complète)': (a) => a.convection === true,
                },
                weakIf: {
                    'Micro-ondes simple (pas de grill)': (a) => a.grill === false,
                    'Petite capacité (<20L)': (a) => a.capacity_l && a.capacity_l < 20,
                    'Puissance limitée (<700W)': (a) => a.power_w && a.power_w < 700,
                },
            },
        },

        // ─────────────────── 👔 FER À REPASSER ──────────────────
        iron: {
            label: 'Fer à Repasser',
            icon: '👔',
            coreAttributes: {
                power_w: { label: 'Puissance', unit: 'W', type: 'number', filterable: true, comparable: true, priority: 1 },
                soleplate: { label: 'Semelle', unit: null, type: 'enum', filterable: true, comparable: true, priority: 2, options: ['Céramique', 'Inox', 'Téflon', 'Acier inox'] },
                steam_type: { label: 'Type Vapeur', unit: null, type: 'enum', filterable: true, comparable: true, priority: 3, options: ['Vapeur Variable', 'Centrale Vapeur', 'Sec'] },
                steam_output: { label: 'Débit Vapeur', unit: 'g/min', type: 'number', filterable: false, comparable: true, priority: 4 },
                anti_calc: { label: 'Anti-Calcaire', unit: null, type: 'boolean', filterable: false, comparable: true, priority: 5 },
                anti_drip: { label: 'Anti-Goutte', unit: null, type: 'boolean', filterable: false, comparable: false, priority: 6 },
                auto_shutoff: { label: 'Arrêt Auto.', unit: null, type: 'boolean', filterable: false, comparable: true, priority: 7 },
            },
            comparisonAxes: ['power', 'glide_quality', 'steam_performance', 'safety', 'value_for_money'],
            proConsRules: {
                strongIf: {
                    'Semelle céramique (glisse fluide)': (a) => a.soleplate === 'Céramique',
                    'Puissance élevée (2400W+)': (a) => a.power_w >= 2400,
                    'Fonction anti-calcaire': (a) => a.anti_calc === true,
                    'Centrale vapeur (pro)': (a) => a.steam_type === 'Centrale Vapeur',
                },
                weakIf: {
                    'Semelle basique': (a) => a.soleplate === 'Téflon',
                    'Puissance limitée (<2000W)': (a) => a.power_w && a.power_w < 2000,
                    'Fer sec (pas de vapeur)': (a) => a.steam_type === 'Sec',
                    'Pas d\'anti-calcaire': (a) => a.anti_calc === false,
                },
            },
        },

        // ─────────────────── 🍟 FRITEUSE / AIR FRYER ────────────
        air_fryer: {
            label: 'Friteuse / Air Fryer',
            icon: '🍟',
            coreAttributes: {
                capacity_l: { label: 'Capacité', unit: 'L', type: 'number', filterable: true, comparable: true, priority: 1 },
                power_w: { label: 'Puissance', unit: 'W', type: 'number', filterable: false, comparable: true, priority: 2 },
                is_air_fryer: { label: 'Air Fryer', unit: null, type: 'boolean', filterable: true, comparable: true, priority: 3 },
                controls: { label: 'Commandes', unit: null, type: 'enum', filterable: true, comparable: true, priority: 4, options: ['Mécanique', 'Tactile', 'Digital'] },
                programs: { label: 'Programmes', unit: null, type: 'number', filterable: false, comparable: true, priority: 5 },
                temp_range: { label: 'Température', unit: '°C', type: 'string', filterable: false, comparable: false, priority: 6 },
                timer: { label: 'Minuterie', unit: null, type: 'boolean', filterable: false, comparable: false, priority: 7 },
            },
            comparisonAxes: ['capacity', 'versatility', 'ease_of_use', 'health_factor', 'value_for_money'],
            proConsRules: {
                strongIf: {
                    'Air Fryer (cuisson saine)': (a) => a.is_air_fryer === true,
                    'Grande capacité (5L+)': (a) => a.capacity_l >= 5,
                    'Commandes tactiles/digitales': (a) => a.controls === 'Tactile' || a.controls === 'Digital',
                    'Multi-programmes': (a) => a.programs >= 8,
                    'Puissance élevée (1500W+)': (a) => a.power_w >= 1500,
                },
                weakIf: {
                    'Friteuse classique (huile)': (a) => a.is_air_fryer === false,
                    'Petite capacité (<3L)': (a) => a.capacity_l && a.capacity_l < 3,
                    'Commandes mécaniques simples': (a) => a.controls === 'Mécanique',
                    'Peu de programmes': (a) => a.programs && a.programs < 5,
                },
            },
        },

        // ─────────────────── 🍞 PÉTRIN / ROBOT ──────────────────
        stand_mixer: {
            label: 'Pétrin / Robot',
            icon: '🍞',
            coreAttributes: {
                power_w: { label: 'Puissance', unit: 'W', type: 'number', filterable: true, comparable: true, priority: 1 },
                bowl_l: { label: 'Bol', unit: 'L', type: 'number', filterable: true, comparable: true, priority: 2 },
                bowl_material: { label: 'Matériau Bol', unit: null, type: 'enum', filterable: false, comparable: true, priority: 3, options: ['Inox', 'Plastique', 'Verre'] },
                speeds: { label: 'Vitesses', unit: null, type: 'number', filterable: false, comparable: true, priority: 4 },
                planetary: { label: 'Rotation Planet.', unit: null, type: 'boolean', filterable: true, comparable: true, priority: 5 },
                pulse: { label: 'Fonction Pulse', unit: null, type: 'boolean', filterable: false, comparable: false, priority: 6 },
                attachments: { label: 'Accessoires', unit: null, type: 'tags', filterable: false, comparable: true, priority: 7 },
            },
            comparisonAxes: ['power', 'capacity', 'versatility', 'build_quality', 'value_for_money'],
            proConsRules: {
                strongIf: {
                    'Puissance pro (1200W+)': (a) => a.power_w >= 1200,
                    'Grand bol (7L+)': (a) => a.bowl_l >= 7,
                    'Bol Inox (hygiénique)': (a) => a.bowl_material === 'Inox',
                    'Rotation planétaire': (a) => a.planetary === true,
                    'Multi-vitesses (6+)': (a) => a.speeds >= 6,
                },
                weakIf: {
                    'Puissance limitée (<800W)': (a) => a.power_w && a.power_w < 800,
                    'Petit bol (<5L)': (a) => a.bowl_l && a.bowl_l < 5,
                    'Bol plastique': (a) => a.bowl_material === 'Plastique',
                    'Peu de vitesses (<4)': (a) => a.speeds && a.speeds < 4,
                },
            },
        },

        // ─────────────────── 🧹 ASPIRATEUR ───────────────────────
        vacuum_cleaner: {
            label: 'Aspirateur', icon: '🧹',
            coreAttributes: {
                power_w: { label: 'Puissance', unit: 'W', type: 'number', filterable: true, comparable: true, priority: 1 },
                type: { label: 'Type', unit: null, type: 'enum', filterable: true, comparable: false, priority: 2, options: ['Traîneau', 'Balai', 'Robot', 'Vertical'] },
                bag: { label: 'Sac', unit: null, type: 'boolean', filterable: true, comparable: false, priority: 3 },
                capacity_l: { label: 'Capacité', unit: 'L', type: 'number', filterable: false, comparable: true, priority: 4 },
                hepa: { label: 'Filtre HEPA', unit: null, type: 'boolean', filterable: true, comparable: true, priority: 5 },
            },
            comparisonAxes: ['power', 'filtration', 'convenience', 'value_for_money'],
            proConsRules: {
                strongIf: { 'Puissance élevée (1800W+)': a => a.power_w >= 1800, 'Filtre HEPA (anti-allergies)': a => a.hepa === true, 'Sans sac (facile entretien)': a => a.bag === false },
                weakIf: { 'Puissance limitée (<1200W)': a => a.power_w && a.power_w < 1200, 'Pas de filtre HEPA': a => a.hepa === false },
            },
        },

        // ─────────────────── 🛢️ BAIN D'HUILE ────────────────────
        oil_heater: {
            label: 'Bain d\'Huile', icon: '🛢️',
            coreAttributes: {
                elements: { label: 'Éléments', unit: null, type: 'number', filterable: true, comparable: true, priority: 1 },
                power_w: { label: 'Puissance', unit: 'W', type: 'number', filterable: false, comparable: true, priority: 2 },
                fan: { label: 'Ventilateur', unit: null, type: 'boolean', filterable: true, comparable: true, priority: 3 },
                thermostat: { label: 'Thermostat', unit: null, type: 'boolean', filterable: false, comparable: false, priority: 4 },
            },
            comparisonAxes: ['heating_power', 'coverage', 'features', 'value_for_money'],
            proConsRules: {
                strongIf: { '13 éléments (grande pièce)': a => a.elements >= 13, 'Ventilateur intégré': a => a.fan === true, 'Puissance élevée (2500W+)': a => a.power_w >= 2500 },
                weakIf: { 'Petit modèle (<9 éléments)': a => a.elements && a.elements < 9, 'Sans ventilateur': a => a.fan === false },
            },
        },

        // ─────────────────── 🥄 BATTEUR ──────────────────────────
        hand_mixer: {
            label: 'Batteur', icon: '🥄',
            coreAttributes: {
                power_w: { label: 'Puissance', unit: 'W', type: 'number', filterable: true, comparable: true, priority: 1 },
                speeds: { label: 'Vitesses', unit: null, type: 'number', filterable: false, comparable: true, priority: 2 },
                turbo: { label: 'Turbo', unit: null, type: 'boolean', filterable: false, comparable: true, priority: 3 },
                type: { label: 'Type', unit: null, type: 'enum', filterable: true, comparable: false, priority: 4, options: ['Batteur', 'Batteur Plongeant', '2-en-1', '3-en-1'] },
                bowl: { label: 'Bol inclus', unit: null, type: 'boolean', filterable: true, comparable: true, priority: 5 },
            },
            comparisonAxes: ['power', 'versatility', 'ease_of_use', 'value_for_money'],
            proConsRules: {
                strongIf: { 'Puissance élevée (500W+)': a => a.power_w >= 500, 'Multi-fonction (2in1/3in1)': a => ['2-en-1', '3-en-1'].includes(a.type), 'Bol inclus': a => a.bowl === true, 'Fonction turbo': a => a.turbo === true },
                weakIf: { 'Puissance limitée (<300W)': a => a.power_w && a.power_w < 300, 'Batteur simple': a => a.type === 'Batteur' && a.bowl === false },
            },
        },

        // ─────────────────── 🥤 BLENDER ──────────────────────────
        blender: {
            label: 'Blender', icon: '🥤',
            coreAttributes: {
                power_w: { label: 'Puissance', unit: 'W', type: 'number', filterable: true, comparable: true, priority: 1 },
                capacity_l: { label: 'Capacité', unit: 'L', type: 'number', filterable: true, comparable: true, priority: 2 },
                jar_mat: { label: 'Matériau Bol', unit: null, type: 'enum', filterable: true, comparable: true, priority: 3, options: ['Verre', 'Plastique', 'Inox'] },
                speeds: { label: 'Vitesses', unit: null, type: 'number', filterable: false, comparable: true, priority: 4 },
                ice_crush: { label: 'Pilage Glace', unit: null, type: 'boolean', filterable: false, comparable: true, priority: 5 },
            },
            comparisonAxes: ['power', 'capacity', 'build_quality', 'versatility', 'value_for_money'],
            proConsRules: {
                strongIf: { 'Bol en verre (hygiénique)': a => a.jar_mat === 'Verre', 'Puissance élevée (1000W+)': a => a.power_w >= 1000, 'Grande capacité (1.5L+)': a => a.capacity_l >= 1.5, 'Pilage de glace': a => a.ice_crush === true },
                weakIf: { 'Bol plastique': a => a.jar_mat === 'Plastique', 'Puissance faible (<500W)': a => a.power_w && a.power_w < 500 },
            },
        },

        // ─────────────────── ☕ CAFETIÈRE ─────────────────────────
        coffee_maker: {
            label: 'Cafetière', icon: '☕',
            coreAttributes: {
                type: { label: 'Type', unit: null, type: 'enum', filterable: true, comparable: true, priority: 1, options: ['Filtre', 'Expresso', 'Capsule', 'Turque', 'Italienne'] },
                pressure: { label: 'Pression', unit: 'bars', type: 'number', filterable: false, comparable: true, priority: 2 },
                capacity: { label: 'Capacité', unit: 'tasses', type: 'number', filterable: false, comparable: true, priority: 3 },
                grinder: { label: 'Broyeur', unit: null, type: 'boolean', filterable: true, comparable: true, priority: 4 },
                milk_frother: { label: 'Mousseur Lait', unit: null, type: 'boolean', filterable: true, comparable: true, priority: 5 },
            },
            comparisonAxes: ['coffee_quality', 'convenience', 'versatility', 'value_for_money'],
            proConsRules: {
                strongIf: { 'Expresso haute pression (15+ bars)': a => a.pressure >= 15, 'Broyeur intégré (café en grains)': a => a.grinder === true, 'Mousseur à lait': a => a.milk_frother === true },
                weakIf: { 'Filtre simple': a => a.type === 'Filtre', 'Pas de broyeur': a => a.grinder === false && a.type === 'Expresso' },
            },
        },

        // ─────────────────── 🫕 COCOTTE / AUTOCUISEUR ────────────
        pressure_cooker: {
            label: 'Cocotte / Autocuiseur', icon: '🫕',
            coreAttributes: {
                capacity_l: { label: 'Capacité', unit: 'L', type: 'number', filterable: true, comparable: true, priority: 1 },
                material: { label: 'Matériau', unit: null, type: 'enum', filterable: true, comparable: true, priority: 2, options: ['Inox', 'Aluminium', 'Revêtement antiadhésif'] },
                electric: { label: 'Électrique', unit: null, type: 'boolean', filterable: true, comparable: true, priority: 3 },
                display: { label: 'Afficheur', unit: null, type: 'boolean', filterable: false, comparable: true, priority: 4 },
                programs: { label: 'Programmes', unit: null, type: 'number', filterable: false, comparable: true, priority: 5 },
            },
            comparisonAxes: ['capacity', 'build_quality', 'features', 'value_for_money'],
            proConsRules: {
                strongIf: { 'Électrique programmable': a => a.electric === true, 'Inox (durable)': a => a.material === 'Inox', 'Grande capacité (8L+)': a => a.capacity_l >= 8, 'Avec afficheur': a => a.display === true },
                weakIf: { 'Manuelle (pas de programmes)': a => a.electric === false, 'Aluminium': a => a.material === 'Aluminium', 'Petite capacité (<5L)': a => a.capacity_l && a.capacity_l < 5 },
            },
        },

        // ─────────────────── 🔥 FOUR ÉLECTRIQUE ──────────────────
        electric_oven: {
            label: 'Four Électrique', icon: '🔥',
            coreAttributes: {
                capacity_l: { label: 'Volume', unit: 'L', type: 'number', filterable: true, comparable: true, priority: 1 },
                power_w: { label: 'Puissance', unit: 'W', type: 'number', filterable: false, comparable: true, priority: 2 },
                grill: { label: 'Grill', unit: null, type: 'boolean', filterable: true, comparable: true, priority: 3 },
                convection: { label: 'Convection', unit: null, type: 'boolean', filterable: true, comparable: true, priority: 4 },
                timer: { label: 'Minuterie', unit: null, type: 'boolean', filterable: false, comparable: false, priority: 5 },
                tournebroche: { label: 'Tournebroche', unit: null, type: 'boolean', filterable: false, comparable: true, priority: 6 },
            },
            comparisonAxes: ['capacity', 'versatility', 'build_quality', 'value_for_money'],
            proConsRules: {
                strongIf: { 'Grand volume (60L+)': a => a.capacity_l >= 60, 'Fonction convection': a => a.convection === true, 'Grill + tournebroche': a => a.grill === true && a.tournebroche === true },
                weakIf: { 'Volume réduit (<30L)': a => a.capacity_l && a.capacity_l < 30, 'Pas de convection': a => a.convection === false },
            },
        },

        // ─────────────────── ⬛ FOUR ENCASTRABLE ────────────────
        builtin_oven: {
            label: 'Four Encastrable', icon: '⬛',
            coreAttributes: {
                capacity_l: { label: 'Volume', unit: 'L', type: 'number', filterable: true, comparable: true, priority: 1 },
                functions: { label: 'Fonctions', unit: null, type: 'number', filterable: false, comparable: true, priority: 2 },
                type: { label: 'Type', unit: null, type: 'enum', filterable: true, comparable: true, priority: 3, options: ['Électrique', 'Gaz-Électrique', 'Gaz'] },
                glass: { label: 'Façade Verre', unit: null, type: 'boolean', filterable: true, comparable: false, priority: 4 },
                display: { label: 'Afficheur', unit: null, type: 'boolean', filterable: false, comparable: true, priority: 5 },
            },
            comparisonAxes: ['capacity', 'versatility', 'design', 'build_quality', 'value_for_money'],
            proConsRules: {
                strongIf: { 'Multi-fonctions (3+)': a => a.functions >= 3, 'Façade verre premium': a => a.glass === true, 'Grand volume (70L+)': a => a.capacity_l >= 70, 'Avec afficheur': a => a.display === true },
                weakIf: { 'Fonctions limitées': a => a.functions && a.functions < 2, 'Volume réduit (<60L)': a => a.capacity_l && a.capacity_l < 60 },
            },
        },

        // ─────────────────── 💨 HOTTE ────────────────────────────
        range_hood: {
            label: 'Hotte', icon: '💨',
            coreAttributes: {
                width: { label: 'Largeur', unit: 'cm', type: 'enum', filterable: true, comparable: false, priority: 1, options: ['40cm', '60cm', '90cm'] },
                suction: { label: 'Aspiration', unit: 'm³/h', type: 'number', filterable: false, comparable: true, priority: 2 },
                type: { label: 'Type', unit: null, type: 'enum', filterable: true, comparable: false, priority: 3, options: ['Classique', 'Décorative', 'Encastrable', 'Ilot'] },
                material: { label: 'Matériau', unit: null, type: 'enum', filterable: true, comparable: true, priority: 4, options: ['Inox', 'Verre', 'Plastique'] },
                speeds: { label: 'Vitesses', unit: null, type: 'number', filterable: false, comparable: true, priority: 5 },
            },
            comparisonAxes: ['suction_power', 'design', 'noise', 'value_for_money'],
            proConsRules: {
                strongIf: { 'Largeur 90cm': a => a.width === '90cm', 'Matériau Inox': a => a.material === 'Inox', 'Multi-vitesses (3+)': a => a.speeds >= 3 },
                weakIf: { 'Largeur 40cm (petite)': a => a.width === '40cm', 'Plastique': a => a.material === 'Plastique' },
            },
        },

        // ─────────────────── 🥪 PANINEUSE / GRILL ───────────────
        sandwich_maker: {
            label: 'Panineuse / Grill', icon: '🥪',
            coreAttributes: {
                power_w: { label: 'Puissance', unit: 'W', type: 'number', filterable: false, comparable: true, priority: 1 },
                plates: { label: 'Plaques', unit: null, type: 'number', filterable: false, comparable: true, priority: 2 },
                grill: { label: 'Grill', unit: null, type: 'boolean', filterable: true, comparable: true, priority: 3 },
                removable: { label: 'Plaques Amov.', unit: null, type: 'boolean', filterable: true, comparable: true, priority: 4 },
            },
            comparisonAxes: ['versatility', 'ease_of_use', 'build_quality', 'value_for_money'],
            proConsRules: {
                strongIf: { 'Multi-plaques (3+)': a => a.plates >= 3, 'Fonction grill': a => a.grill === true, 'Plaques amovibles': a => a.removable === true, 'Puissance élevée (1500W+)': a => a.power_w >= 1500 },
                weakIf: { 'Plaque simple': a => a.plates && a.plates <= 1, 'Puissance faible (<750W)': a => a.power_w && a.power_w < 750 },
            },
        },

        // ─────────────────── 🍽️ LAVE-VAISSELLE ──────────────────
        dishwasher: {
            label: 'Lave-Vaisselle', icon: '🍽️',
            coreAttributes: {
                capacity: { label: 'Couverts', unit: null, type: 'number', filterable: true, comparable: true, priority: 1 },
                programs: { label: 'Programmes', unit: null, type: 'number', filterable: false, comparable: true, priority: 2 },
                energy_class: { label: 'Classe Énergie', unit: null, type: 'enum', filterable: true, comparable: true, priority: 3, options: ['A+++', 'A++', 'A+', 'A', 'B'] },
                display: { label: 'Afficheur', unit: null, type: 'boolean', filterable: false, comparable: true, priority: 4 },
                material: { label: 'Finition', unit: null, type: 'enum', filterable: true, comparable: false, priority: 5, options: ['Inox', 'Noir', 'Blanc', 'Gris'] },
            },
            comparisonAxes: ['capacity', 'efficiency', 'features', 'value_for_money'],
            proConsRules: {
                strongIf: { 'Grande capacité (14+ couverts)': a => a.capacity >= 14, 'Multi-programmes (6+)': a => a.programs >= 6, 'Haute efficacité': a => ['A+++', 'A++'].includes(a.energy_class), 'Afficheur digital': a => a.display === true },
                weakIf: { 'Capacité limitée (<12 couverts)': a => a.capacity && a.capacity < 12, 'Faible efficacité': a => ['B', 'C'].includes(a.energy_class) },
            },
        },

        // ─────────────────── 💇 SÈCHE-CHEVEUX ───────────────────
        hair_dryer: {
            label: 'Sèche-Cheveux', icon: '💇',
            coreAttributes: {
                power_w: { label: 'Puissance', unit: 'W', type: 'number', filterable: true, comparable: true, priority: 1 },
                speeds: { label: 'Vitesses', unit: null, type: 'number', filterable: false, comparable: true, priority: 2 },
                temps: { label: 'Températures', unit: null, type: 'number', filterable: false, comparable: true, priority: 3 },
                ionic: { label: 'Ionique', unit: null, type: 'boolean', filterable: true, comparable: true, priority: 4 },
                foldable: { label: 'Pliable', unit: null, type: 'boolean', filterable: false, comparable: false, priority: 5 },
            },
            comparisonAxes: ['power', 'hair_care', 'convenience', 'value_for_money'],
            proConsRules: {
                strongIf: { 'Puissance pro (2000W+)': a => a.power_w >= 2000, 'Technologie ionique': a => a.ionic === true },
                weakIf: { 'Puissance faible (<1500W)': a => a.power_w && a.power_w < 1500 },
            },
        },

        // ─────────────────── 🚰 FONTAINE ─────────────────────────
        water_dispenser: {
            label: 'Fontaine à Eau', icon: '🚰',
            coreAttributes: {
                hot: { label: 'Eau Chaude', unit: null, type: 'boolean', filterable: true, comparable: true, priority: 1 },
                cold: { label: 'Eau Froide', unit: null, type: 'boolean', filterable: true, comparable: true, priority: 2 },
                storage: { label: 'Rangement', unit: null, type: 'boolean', filterable: false, comparable: false, priority: 3 },
                type: { label: 'Type', unit: null, type: 'enum', filterable: true, comparable: false, priority: 4, options: ['Posable', 'Sur Pied'] },
            },
            comparisonAxes: ['features', 'capacity', 'design', 'value_for_money'],
            proConsRules: {
                strongIf: { 'Chaud + Froid': a => a.hot === true && a.cold === true, 'Sur pied avec rangement': a => a.type === 'Sur Pied' && a.storage === true },
                weakIf: { 'Eau froide seulement': a => a.hot === false, 'Posable (pas de rangement)': a => a.type === 'Posable' },
            },
        },

        // ─────────────────── 🔴 PLAQUE CHAUFFANTE ─────────────
        cooktop: {
            label: 'Plaque Chauffante', icon: '🔴',
            coreAttributes: {
                burners: { label: 'Feux', unit: null, type: 'number', filterable: true, comparable: true, priority: 1 },
                surface: { label: 'Surface', unit: null, type: 'enum', filterable: true, comparable: true, priority: 2, options: ['Verre', 'Inox', 'Émail'] },
                width: { label: 'Largeur', unit: 'cm', type: 'enum', filterable: true, comparable: false, priority: 3, options: ['30cm', '60cm', '75cm', '90cm'] },
                allumage_auto: { label: 'Allumage Auto.', unit: null, type: 'boolean', filterable: false, comparable: true, priority: 4 },
            },
            comparisonAxes: ['cooking_power', 'design', 'build_quality', 'value_for_money'],
            proConsRules: {
                strongIf: { '5 feux (grand plan)': a => a.burners >= 5, 'Surface verre (facile nettoyage)': a => a.surface === 'Verre', 'Surface Inox (durable)': a => a.surface === 'Inox' },
                weakIf: { '2 feux seulement': a => a.burners && a.burners <= 2, 'Surface émail': a => a.surface === 'Émail' },
            },
        },

        // ─────────────────── 🍊 JUICER / CENTRIFUGEUSE ──────────
        juicer: {
            label: 'Centrifugeuse', icon: '🍊',
            coreAttributes: {
                power_w: { label: 'Puissance', unit: 'W', type: 'number', filterable: true, comparable: true, priority: 1 },
                speeds: { label: 'Vitesses', unit: null, type: 'number', filterable: false, comparable: true, priority: 2 },
                type: { label: 'Type', unit: null, type: 'enum', filterable: true, comparable: true, priority: 3, options: ['Centrifugeuse', 'Presse-agrumes', 'Extracteur'] },
            },
            comparisonAxes: ['juice_quality', 'speed', 'ease_of_use', 'value_for_money'],
            proConsRules: {
                strongIf: { 'Haute puissance (800W+)': a => a.power_w >= 800, 'Extracteur lent (conservation nutrients)': a => a.type === 'Extracteur' },
                weakIf: { 'Presse-agrumes simple': a => a.type === 'Presse-agrumes' },
            },
        },

        // ─────────────────── 🌀 VENTILATEUR ─────────────────────
        fan: {
            label: 'Ventilateur', icon: '🌀',
            coreAttributes: {
                type: { label: 'Type', unit: null, type: 'enum', filterable: true, comparable: false, priority: 1, options: ['Sur Pied', 'Mural', 'Colonne', 'De Table', 'Industriel'] },
                speeds: { label: 'Vitesses', unit: null, type: 'number', filterable: false, comparable: true, priority: 2 },
                oscillation: { label: 'Oscillation', unit: null, type: 'boolean', filterable: false, comparable: true, priority: 3 },
                remote: { label: 'Télécommande', unit: null, type: 'boolean', filterable: true, comparable: true, priority: 4 },
            },
            comparisonAxes: ['airflow', 'noise', 'features', 'value_for_money'],
            proConsRules: {
                strongIf: { 'Télécommande incluse': a => a.remote === true, 'Multi-vitesses (3+)': a => a.speeds >= 3, 'Oscillation': a => a.oscillation === true },
                weakIf: { 'Vitesse unique': a => a.speeds && a.speeds <= 1 },
            },
        },

        // ─────────────────── 🥩 HACHOIR ─────────────────────────
        meat_grinder: {
            label: 'Hachoir', icon: '🥩',
            coreAttributes: {
                power_w: { label: 'Puissance', unit: 'W', type: 'number', filterable: true, comparable: true, priority: 1 },
                capacity_l: { label: 'Bol', unit: 'L', type: 'number', filterable: true, comparable: true, priority: 2 },
                zones: { label: 'Zones', unit: null, type: 'number', filterable: false, comparable: true, priority: 3 },
                type: { label: 'Type', unit: null, type: 'enum', filterable: true, comparable: false, priority: 4, options: ['Hachoir', 'Hachoir Viande', 'Moulinette'] },
            },
            comparisonAxes: ['power', 'capacity', 'versatility', 'value_for_money'],
            proConsRules: {
                strongIf: { 'Puissance élevée (1000W+)': a => a.power_w >= 1000, 'Multi-zones (3+)': a => a.zones >= 3, 'Grand bol (2L+)': a => a.capacity_l >= 2 },
                weakIf: { 'Puissance faible (<500W)': a => a.power_w && a.power_w < 500 },
            },
        },

        // ─────────────────── 📦 GÉNÉRIQUE ────────────────────────
        other: {
            label: 'Autre', icon: '📦',
            coreAttributes: {
                power_w: { label: 'Puissance', unit: 'W', type: 'number', filterable: false, comparable: true, priority: 1 },
                capacity_l: { label: 'Capacité', unit: 'L', type: 'number', filterable: false, comparable: true, priority: 2 },
            },
            comparisonAxes: ['features', 'build_quality', 'value_for_money'],
            proConsRules: { strongIf: {}, weakIf: {} },
        },
    };

    // Category aliases
    TEMPLATES.freezer = TEMPLATES.refrigerator;
    TEMPLATES.heater = TEMPLATES.oil_heater;
    TEMPLATES.gas_heater = TEMPLATES.oil_heater;

    // ═══════════════════════════════════════════════════════════════
    //  LAYER 4 — AI PROS/CONS GENERATOR
    // ═══════════════════════════════════════════════════════════════

    /**
     * Generate pros & cons from structured attributes using rule engine.
     * This is the "AI" — deterministic rule-based inference on real data.
     * @param {string} categoryId
     * @param {object} coreAttrs - Layer 2 structured attributes
     * @param {object} commercial - Price/margin data from inventory
     * @param {array}  competitorPrices - Scraped competitor prices
     * @returns {{ pros: string[], cons: string[], buyerFit: string, pricePosition: string }}
     */
    function generateIntelligence(categoryId, coreAttrs, commercial, competitorPrices) {
        const template = TEMPLATES[categoryId];
        const pros = [];
        const cons = [];

        // ── Run category-specific rules ──
        if (template && template.proConsRules) {
            const attrs = { ...coreAttrs };

            // Inject price position context
            if (commercial && competitorPrices && competitorPrices.length > 0) {
                const compPrices = competitorPrices.map(c => c.price).filter(Boolean);
                const avgComp = compPrices.reduce((s, p) => s + p, 0) / compPrices.length;
                const retailPrice = commercial.retailPrice || 0;
                if (retailPrice > 0) {
                    const ratio = retailPrice / avgComp;
                    attrs._pricePosition = ratio < 0.9 ? 'budget' : ratio > 1.15 ? 'premium' : 'mid';
                }
            }

            // Evaluate strength rules
            for (const [label, fn] of Object.entries(template.proConsRules.strongIf || {})) {
                try { if (fn(attrs)) pros.push(label); } catch { /* skip */ }
            }

            // Evaluate weakness rules
            for (const [label, fn] of Object.entries(template.proConsRules.weakIf || {})) {
                try { if (fn(attrs)) cons.push(label); } catch { /* skip */ }
            }
        }

        // ── Price intelligence (universal) ──
        if (commercial && competitorPrices && competitorPrices.length > 0) {
            const compPrices = competitorPrices.map(c => c.price).filter(Boolean);
            const minComp = Math.min(...compPrices);
            const maxComp = Math.max(...compPrices);
            const retailPrice = commercial.retailPrice || 0;

            if (retailPrice > 0 && minComp > 0) {
                const diff = ((retailPrice - minComp) / retailPrice * 100);
                if (diff > 5) {
                    pros.push(`Prix compétitif vs marché (+${Math.round(diff)}% marge)`);
                } else if (diff < -5) {
                    cons.push(`Prix au-dessus du marché (${Math.round(Math.abs(diff))}% plus cher)`);
                }
            }

            if (commercial.margin > 35) {
                pros.push('Bonne marge commerciale');
            } else if (commercial.margin < 10 && commercial.margin > 0) {
                cons.push('Marge très serrée');
            }
        }

        // ── Generate buyer fit summary ──
        const pricePos = competitorPrices && competitorPrices.length > 0
            ? (() => {
                const avg = competitorPrices.reduce((s, c) => s + (c.price || 0), 0) / competitorPrices.length;
                const r = (commercial?.retailPrice || 0) / avg;
                return r < 0.9 ? 'budget' : r > 1.15 ? 'premium' : 'mid';
            })()
            : 'unknown';

        const proCount = pros.length;
        const conCount = cons.length;
        const ratio = proCount / Math.max(conCount, 1);

        let buyerFit;
        if (ratio >= 2) {
            buyerFit = 'Excellent rapport qualité/prix — fortement recommandé';
        } else if (ratio >= 1.2) {
            buyerFit = 'Bon produit avec plus d\'atouts que de faiblesses';
        } else if (ratio >= 0.8) {
            buyerFit = 'Produit équilibré — convient pour un usage standard';
        } else {
            buyerFit = 'Produit basique — comparer avec les alternatives';
        }

        return {
            pros,
            cons,
            buyerFit,
            pricePosition: pricePos,
            featureScore: Math.min(10, Math.round(proCount * 1.5)),
            weaknessScore: Math.min(10, Math.round(conCount * 1.5)),
        };
    }


    // ═══════════════════════════════════════════════════════════════
    //  PUBLIC API
    // ═══════════════════════════════════════════════════════════════

    return {
        TEMPLATES,
        UNIVERSAL_KEYS,

        /** Get template for a category (null if unsupported) */
        getTemplate(categoryId) {
            return TEMPLATES[categoryId] || null;
        },

        /** Check if a category has a dedicated schema */
        hasSchema(categoryId) {
            return !!TEMPLATES[categoryId];
        },

        /** Get only filterable attributes for a category */
        getFilterableAttributes(categoryId) {
            const t = TEMPLATES[categoryId];
            if (!t) return [];
            return Object.entries(t.coreAttributes)
                .filter(([, def]) => def.filterable)
                .sort((a, b) => a[1].priority - b[1].priority)
                .map(([key, def]) => ({ key, ...def }));
        },

        /** Get comparison axes for a category */
        getComparisonAxes(categoryId) {
            const t = TEMPLATES[categoryId];
            return t ? t.comparisonAxes : [];
        },

        /** Generate intelligence from structured data */
        generateIntelligence,

        /** Format a core attribute value for display */
        formatAttributeValue(key, value, def) {
            if (value === null || value === undefined) return '—';
            if (def.type === 'boolean') return value ? '✅ Oui' : '❌ Non';
            if (def.type === 'tags' && Array.isArray(value)) return value.join(', ');
            if (def.unit) return `${value} ${def.unit}`;
            return String(value);
        },

        /** Get all supported category IDs */
        getSupportedCategories() {
            return Object.keys(TEMPLATES).filter(k => TEMPLATES[k] !== TEMPLATES.refrigerator || k === 'refrigerator');
        },
    };
})();
