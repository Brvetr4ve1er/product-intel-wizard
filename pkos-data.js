// Product Knowledge Operating System — Data Layer
// Schema v2.0 — 7-Layer Product Node Architecture
const PKOS_PRODUCTS = [
    // ═══════════════════ ARTCOOL ═══════════════════
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "A32S1", brand: "ARTCOOL", model: "A32S1", sku: null, name: 'ARTCOOL 32" Smart VIDAA TV', category: "TV", subcategory: "Smart TV", variant: null, confidenceScore: 72, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 32, resolution: { width: 1366, height: 768, label: "HD Ready" }, panelType: "LED", refreshRate: "60Hz", power: null },
            display: { brightness: "200 cd/m²", contrastRatio: "3000:1", hdr: false, hdrFormats: [], viewingAngle: null },
            smart: { platform: "VIDAA", os: "VIDAA", processor: null, ram: null, storage: null, voiceAssistants: [] },
            connectivity: { wifi: true, wifiSpec: null, bluetooth: true, btVersion: null, hdmiPorts: 2, hdmiSpec: null, usbPorts: 2, ethernet: false, casting: [] },
            audio: { output: "10W", technology: ["DTS Virtual:X"], speakers: null },
            comparisonTags: ["hd", "smart", "vidaa", "32-inch"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: null, riskFlags: [] },
        strategic: { productRole: "entry", marginBehavior: "unknown", discountSensitivity: "high", bundleEligibility: true, bundleRole: "anchor", seasonalRelevance: ["ramadan", "year-round"], targetAudience: ["budget-buyers", "families"], competitivePosition: "price-leader" },
        marketing: { sellingAngles: ["Affordable smart TV with VIDAA", "Compact 32-inch for bedrooms"], emotionalDrivers: ["First smart TV", "Budget-friendly"], hooks: ["Smart TV starting price!"], captions: { short: "Smart TV at unbeatable price", medium: 'ARTCOOL 32" VIDAA Smart TV — stream everything without breaking the bank', long: null }, benefits_dz: ["تلفزيون سمارت بسعر مناسب", "فيه كلش: يوتيوب، نتفليكس", "حجم مناسب للغرفة"], ramadanAngle: "Perfect second screen for Ramadan content", adFormats: ["story", "banner"] },
        relationships: { complementary: [], comparisons: [{ productId: "A43S1", relationship: "upgrade" }], upgradePath: { from: [], to: ["A43S1"] }, bundleFamilies: [], alternatives: [{ productId: "S32MS", reason: "same-size, Android TV" }, { productId: "MS32HAS1", reason: "same-size, Android TV" }] }
    },
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "A43S1", brand: "ARTCOOL", model: "A43S1", sku: null, name: 'ARTCOOL 43" Smart VIDAA TV', category: "TV", subcategory: "Smart TV", variant: null, confidenceScore: 74, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 43, resolution: { width: 1920, height: 1080, label: "Full HD" }, panelType: "LED", refreshRate: "60Hz", power: null },
            display: { brightness: "250 cd/m²", contrastRatio: "4000:1", hdr: true, hdrFormats: ["HDR10"], viewingAngle: null },
            smart: { platform: "VIDAA", os: "VIDAA", processor: null, ram: null, storage: null, voiceAssistants: [] },
            connectivity: { wifi: true, wifiSpec: null, bluetooth: true, btVersion: null, hdmiPorts: 3, hdmiSpec: null, usbPorts: 2, ethernet: true, casting: ["Screen Sharing"] },
            audio: { output: "14W (7W x 2)", technology: ["DTS Virtual:X", "Dolby Audio"], speakers: "2.0" },
            comparisonTags: ["fhd", "smart", "vidaa", "43-inch", "hdr"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: null, riskFlags: [] },
        strategic: { productRole: "core", marginBehavior: "unknown", discountSensitivity: "medium", bundleEligibility: true, bundleRole: "anchor", seasonalRelevance: ["ramadan", "year-round"], targetAudience: ["families"], competitivePosition: "value-sweet-spot" },
        marketing: { sellingAngles: ["Full HD with VIDAA smart platform", "Great family room size"], emotionalDrivers: ["Family entertainment upgrade"], hooks: ["Full HD Smart TV for the whole family!"], captions: { short: "Full HD smart family TV", medium: 'ARTCOOL 43" VIDAA — crisp Full HD with DTS Virtual:X surround sound', long: null }, benefits_dz: ["صورة واضحة Full HD", "صوت محيطي DTS", "فيه كلش للعايلة"], ramadanAngle: "Family gathering screen for Ramadan", adFormats: ["carousel", "story"] },
        relationships: { complementary: [], comparisons: [{ productId: "A32S1", relationship: "downgrade" }, { productId: "A50S1", relationship: "upgrade" }], upgradePath: { from: ["A32S1"], to: ["A50S1"] }, bundleFamilies: [], alternatives: [{ productId: "TV-43A4G", reason: "Hisense VIDAA competitor" }, { productId: "S5400A", reason: "TCL Google TV alternative" }] }
    },
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "A50S1", brand: "ARTCOOL", model: "A50S1", sku: null, name: 'ARTCOOL 50" Smart VIDAA 4K TV', category: "TV", subcategory: "Smart TV", variant: null, confidenceScore: 72, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 50, resolution: { width: 3840, height: 2160, label: "4K UHD" }, panelType: "LED", refreshRate: "60Hz", power: "53W" },
            display: { brightness: "300 cd/m²", contrastRatio: "4000:1", hdr: true, hdrFormats: ["HDR10"], viewingAngle: null },
            smart: { platform: "VIDAA", os: "VIDAA", processor: null, ram: null, storage: null, voiceAssistants: [] },
            connectivity: { wifi: true, wifiSpec: null, bluetooth: true, btVersion: null, hdmiPorts: 3, hdmiSpec: null, usbPorts: 2, ethernet: true, casting: [] },
            audio: { output: "16W (8W x 2)", technology: ["Dolby Audio"], speakers: "2.0" },
            comparisonTags: ["4k", "smart", "vidaa", "50-inch", "hdr"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: null, riskFlags: [] },
        strategic: { productRole: "core", marginBehavior: "unknown", discountSensitivity: "medium", bundleEligibility: true, bundleRole: "anchor", seasonalRelevance: ["ramadan", "year-round"], targetAudience: ["families", "premium-seekers"], competitivePosition: "value-sweet-spot" },
        marketing: { sellingAngles: ["4K at an accessible price", "Energy efficient at 53W"], emotionalDrivers: ["4K upgrade", "Energy savings"], hooks: ["4K UHD for less than you think!"], captions: { short: "Affordable 4K smart TV", medium: 'ARTCOOL 50" 4K VIDAA — stunning clarity, low power consumption', long: null }, benefits_dz: ["صورة 4K واضحة بزاف", "اقتصادي فالضو — 53 واط برك", "حجم كبير للصالون"], ramadanAngle: "Big screen for Ramadan family viewing", adFormats: ["carousel", "story", "banner"] },
        relationships: { complementary: [], comparisons: [{ productId: "A43S1", relationship: "downgrade" }, { productId: "A55S1", relationship: "upgrade" }], upgradePath: { from: ["A43S1"], to: ["A55S1"] }, bundleFamilies: [], alternatives: [{ productId: "UA50AU7000", reason: "Samsung Crystal UHD competitor" }, { productId: "MS50UAT", reason: "Multismart 4K alternative" }] }
    },
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "A55S1", brand: "ARTCOOL", model: "A55S1", sku: null, name: 'ARTCOOL 55" Smart VIDAA 4K TV', category: "TV", subcategory: "Smart TV", variant: null, confidenceScore: 74, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 55, resolution: { width: 3840, height: 2160, label: "4K UHD" }, panelType: "LED", refreshRate: "60Hz", power: null },
            display: { brightness: "330 cd/m²", contrastRatio: "5000:1", hdr: true, hdrFormats: ["Dolby Vision", "HDR10"], viewingAngle: null },
            smart: { platform: "VIDAA", os: "VIDAA", processor: null, ram: null, storage: null, voiceAssistants: [] },
            connectivity: { wifi: true, wifiSpec: null, bluetooth: true, btVersion: null, hdmiPorts: 3, hdmiSpec: null, usbPorts: 2, ethernet: true, casting: [] },
            audio: { output: "20W (10W x 2)", technology: ["DTS Virtual:X"], speakers: "2.0" },
            comparisonTags: ["4k", "smart", "vidaa", "55-inch", "hdr", "dolby-vision"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: null, riskFlags: [] },
        strategic: { productRole: "core", marginBehavior: "unknown", discountSensitivity: "medium", bundleEligibility: true, bundleRole: "anchor", seasonalRelevance: ["ramadan", "year-round"], targetAudience: ["families", "premium-seekers"], competitivePosition: "value-sweet-spot" },
        marketing: { sellingAngles: ["55-inch Dolby Vision 4K", "Full Array LED for deep blacks"], emotionalDrivers: ["Cinema at home"], hooks: ["Dolby Vision cinema in your living room!"], captions: { short: "55\" 4K Dolby Vision smart TV", medium: 'ARTCOOL 55" — Dolby Vision HDR + DTS Virtual:X for a true cinema experience', long: null }, benefits_dz: ["صورة سينما فدارك", "ألوان حقيقية مع Dolby Vision", "صوت محيطي كيما السينما"], ramadanAngle: "Cinema-quality Ramadan nights", adFormats: ["carousel", "reel"] },
        relationships: { complementary: [], comparisons: [{ productId: "A50S1", relationship: "downgrade" }, { productId: "A65S1", relationship: "upgrade" }], upgradePath: { from: ["A50S1"], to: ["A65S1"] }, bundleFamilies: [], alternatives: [{ productId: "55AU7000", reason: "Samsung Crystal UHD" }, { productId: "55P635", reason: "TCL 4K Google TV" }] }
    },
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "A65S1", brand: "ARTCOOL", model: "A65S1", sku: null, name: 'ARTCOOL 65" Smart VIDAA 4K TV', category: "TV", subcategory: "Smart TV", variant: null, confidenceScore: 74, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 65, resolution: { width: 3840, height: 2160, label: "4K UHD" }, panelType: "LED", refreshRate: "60Hz", power: null },
            display: { brightness: "350 cd/m²", contrastRatio: "5000:1", hdr: true, hdrFormats: ["Dolby Vision", "HDR10"], viewingAngle: null },
            smart: { platform: "VIDAA", os: "VIDAA", processor: null, ram: null, storage: null, voiceAssistants: [] },
            connectivity: { wifi: true, wifiSpec: null, bluetooth: true, btVersion: null, hdmiPorts: 3, hdmiSpec: null, usbPorts: 2, ethernet: true, casting: ["AirPlay 2"] },
            audio: { output: "20W (10W x 2)", technology: ["DTS Virtual:X"], speakers: "2.0" },
            comparisonTags: ["4k", "smart", "vidaa", "65-inch", "hdr", "dolby-vision", "airplay"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: null, riskFlags: [] },
        strategic: { productRole: "premium", marginBehavior: "high-margin", discountSensitivity: "low", bundleEligibility: true, bundleRole: "anchor", seasonalRelevance: ["ramadan"], targetAudience: ["premium-seekers", "families"], competitivePosition: "value-sweet-spot" },
        marketing: { sellingAngles: ["65-inch 4K with Dolby Vision + AirPlay", "AI 4K Upscaler"], emotionalDrivers: ["Ultimate home cinema", "Prestige purchase"], hooks: ["65 inches of pure Dolby Vision cinema!"], captions: { short: "65\" 4K Dolby Vision flagship", medium: 'ARTCOOL 65" — AI upscaler, Dolby Vision, AirPlay 2, Game Mode Plus', long: null }, benefits_dz: ["أكبر شاشة للصالون", "AirPlay باش تبعث من الآيفون", "جودة سينما 4K حقيقية"], ramadanAngle: "The centerpiece of your Ramadan living room", adFormats: ["reel", "banner", "carousel"] },
        relationships: { complementary: [], comparisons: [{ productId: "A55S1", relationship: "downgrade" }], upgradePath: { from: ["A55S1"], to: [] }, bundleFamilies: [], alternatives: [{ productId: "MS-65UAS2", reason: "Multismart 65\" Android" }, { productId: "MS65UAG3", reason: "Multismart 65\" Google TV" }] }
    },
    // ═══════════════════ CONDOR ═══════════════════
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "40SG630", brand: "Condor", model: "40SG630", sku: null, name: 'Condor 40" Google TV', category: "TV", subcategory: "Smart TV", variant: null, confidenceScore: 70, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 40, resolution: { width: 1920, height: 1080, label: "Full HD" }, panelType: "DLED", refreshRate: "60Hz", power: null },
            display: { brightness: "250 cd/m²", contrastRatio: "4000:1", hdr: false, hdrFormats: [], viewingAngle: null },
            smart: { platform: "Google TV", os: "Google TV 5.0", processor: null, ram: "1GB", storage: "4GB", voiceAssistants: ["Google Assistant"] },
            connectivity: { wifi: true, wifiSpec: null, bluetooth: true, btVersion: null, hdmiPorts: 3, hdmiSpec: null, usbPorts: 2, ethernet: true, casting: ["Chromecast"] },
            audio: { output: "16W (8W x 2)", technology: ["Dolby Digital Plus"], speakers: "2.0" },
            comparisonTags: ["fhd", "smart", "google-tv", "40-inch"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: null, riskFlags: [] },
        strategic: { productRole: "core", marginBehavior: "unknown", discountSensitivity: "medium", bundleEligibility: true, bundleRole: "anchor", seasonalRelevance: ["ramadan", "year-round"], targetAudience: ["families", "budget-buyers"], competitivePosition: "price-leader" },
        marketing: { sellingAngles: ["Algerian-brand Google TV", "Voice remote with Google Assistant"], emotionalDrivers: ["Local brand pride", "Modern smart features"], hooks: ["Condor Google TV — made for Algeria!"], captions: { short: "Algerian smart TV with Google", medium: 'Condor 40" Google TV — voice control, Chromecast built-in, Dolby Digital Plus', long: null }, benefits_dz: ["ماركة جزائرية معروفة", "Google TV فيه كلش", "تحكم بالصوت بالعربية"], ramadanAngle: "Support local — Condor for Ramadan", adFormats: ["story", "banner"] },
        relationships: { complementary: [], comparisons: [], upgradePath: { from: [], to: [] }, bundleFamilies: [], alternatives: [{ productId: "C3020", reason: "IRIS 40\" Smart TV" }] }
    },
    // ═══════════════════ CRISTOR ═══════════════════
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "S32MS", brand: "Cristor", model: "S32MS", sku: null, name: 'Cristor 32" Android TV', category: "TV", subcategory: "Smart TV", variant: null, confidenceScore: 68, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 32, resolution: { width: 1366, height: 768, label: "HD Ready" }, panelType: "DLED", refreshRate: "60Hz", power: null },
            display: { brightness: "200 cd/m²", contrastRatio: "3000:1", hdr: false, hdrFormats: [], viewingAngle: null },
            smart: { platform: "Google TV (Android 14)", os: "Android 14", processor: null, ram: null, storage: null, voiceAssistants: ["Google Assistant"] },
            connectivity: { wifi: true, wifiSpec: null, bluetooth: true, btVersion: null, hdmiPorts: 3, hdmiSpec: null, usbPorts: 2, ethernet: true, casting: ["Chromecast"] },
            audio: { output: "12W (6W x 2)", technology: ["Dolby Digital Plus"], speakers: "2.0" },
            comparisonTags: ["hd", "smart", "android-tv", "32-inch", "google-certified"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: null, riskFlags: [] },
        strategic: { productRole: "entry", marginBehavior: "unknown", discountSensitivity: "high", bundleEligibility: true, bundleRole: "anchor", seasonalRelevance: ["year-round"], targetAudience: ["budget-buyers"], competitivePosition: "price-leader" },
        marketing: { sellingAngles: ["Google Certified Android 14", "Chromecast + Google Play Store"], emotionalDrivers: ["Smart TV entry point", "App ecosystem"], hooks: ["Android 14 TV at entry price!"], captions: { short: "Android 14 smart TV from Cristor", medium: 'Cristor 32" — Google Certified, Chromecast built-in, Netflix ready', long: null }, benefits_dz: ["فيه Google Play Store", "Netflix جاهز", "Chromecast مدمج — ابعث من التليفون"], ramadanAngle: null, adFormats: ["story"] },
        relationships: { complementary: [], comparisons: [], upgradePath: { from: [], to: [] }, bundleFamilies: [], alternatives: [{ productId: "A32S1", reason: "ARTCOOL 32\" VIDAA" }, { productId: "MS32HAS1", reason: "Multismart 32\" Android" }] }
    },
    // ═══════════════════ GEANT ═══════════════════
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "GN-Q32JHDT-N", brand: "Geant", model: "GN-Q32JHDT-N", sku: null, name: 'Geant 32" QLED TV', category: "TV", subcategory: "QLED TV", variant: null, confidenceScore: 65, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 32, resolution: { width: 1366, height: 768, label: "HD Ready" }, panelType: "QLED", refreshRate: "60Hz", power: null },
            display: { brightness: "250 cd/m²", contrastRatio: "3000:1", hdr: false, hdrFormats: [], viewingAngle: "Wide" },
            smart: { platform: null, os: null, processor: null, ram: null, storage: null, voiceAssistants: [] },
            connectivity: { wifi: false, wifiSpec: null, bluetooth: false, btVersion: null, hdmiPorts: 2, hdmiSpec: null, usbPorts: 2, ethernet: false, casting: [] },
            audio: { output: "20W (10W x 2)", technology: ["Stereo"], speakers: "2.0" },
            comparisonTags: ["hd", "qled", "32-inch", "basic"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: null, riskFlags: [] },
        strategic: { productRole: "entry", marginBehavior: "unknown", discountSensitivity: "high", bundleEligibility: true, bundleRole: "addon", seasonalRelevance: ["year-round"], targetAudience: ["budget-buyers"], competitivePosition: "niche" },
        marketing: { sellingAngles: ["QLED color quality at budget price", "No smart features = simplicity"], emotionalDrivers: ["Better colors than LED", "Simple to use"], hooks: ["QLED colors at LED price!"], captions: { short: "QLED quality, budget price", medium: 'Geant 32" QLED — vibrant quantum dot colors without the smart complexity', long: null }, benefits_dz: ["ألوان QLED زينة بزاف", "بسيط وسهل الاستعمال", "ماركة جزائرية"], ramadanAngle: null, adFormats: ["banner"] },
        relationships: { complementary: [], comparisons: [{ productId: "GN-Q42JFHD-N", relationship: "upgrade" }], upgradePath: { from: [], to: ["GN-Q42JFHD-N"] }, bundleFamilies: [], alternatives: [{ productId: "GN-32LDJHD-N", reason: "same-size LED cheaper" }] }
    },
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "GN-TE42FHDS", brand: "Geant", model: "GN-TE42FHDS", sku: null, name: 'Geant 42" Frameless Smart TV', category: "TV", subcategory: "Smart TV", variant: null, confidenceScore: 62, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 42, resolution: { width: 1920, height: 1080, label: "Full HD" }, panelType: "LED", refreshRate: "60Hz", power: null },
            display: { brightness: "250 cd/m²", contrastRatio: "4000:1", hdr: false, hdrFormats: [], viewingAngle: "Wide" },
            smart: { platform: "Smart TV OS", os: "Smart TV OS", processor: null, ram: null, storage: null, voiceAssistants: [] },
            connectivity: { wifi: true, wifiSpec: null, bluetooth: false, btVersion: null, hdmiPorts: 2, hdmiSpec: null, usbPorts: 2, ethernet: false, casting: [] },
            audio: { output: "16W (8W x 2)", technology: ["Stereo"], speakers: "2.0" },
            comparisonTags: ["fhd", "smart", "42-inch"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: null, riskFlags: [] },
        strategic: { productRole: "core", marginBehavior: "unknown", discountSensitivity: "medium", bundleEligibility: true, bundleRole: "anchor", seasonalRelevance: ["year-round"], targetAudience: ["families"], competitivePosition: "price-leader" },
        marketing: { sellingAngles: ["Frameless design looks premium", "Smart TV basics"], emotionalDrivers: ["Modern look", "Smart connectivity"], hooks: ["Frameless smart TV from Geant!"], captions: { short: "Frameless smart TV, Algerian made", medium: 'Geant 42" — frameless Full HD smart TV with WiFi connectivity', long: null }, benefits_dz: ["تصميم بلا إطار — يبان غالي", "سمارت بالواي فاي", "ماركة جزائرية موثوقة"], ramadanAngle: null, adFormats: ["story"] },
        relationships: { complementary: [], comparisons: [{ productId: "GN-Q42JFHD-N", relationship: "same-tier" }, { productId: "GN-TE42FHD", relationship: "same-tier" }], upgradePath: { from: [], to: ["GN-G50EXL4K"] }, bundleFamilies: [], alternatives: [] }
    },
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "GN-Q42JFHD-N", brand: "Geant", model: "GN-Q42JFHD-N", sku: null, name: 'Geant 42" QLED TV', category: "TV", subcategory: "QLED TV", variant: null, confidenceScore: 62, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 42, resolution: { width: 1920, height: 1080, label: "Full HD" }, panelType: "QLED", refreshRate: "60Hz", power: null },
            display: { brightness: "250 cd/m²", contrastRatio: "4000:1", hdr: false, hdrFormats: [], viewingAngle: null },
            smart: { platform: null, os: null, processor: null, ram: null, storage: null, voiceAssistants: [] },
            connectivity: { wifi: false, wifiSpec: null, bluetooth: false, btVersion: null, hdmiPorts: 2, hdmiSpec: null, usbPorts: 2, ethernet: false, casting: [] },
            audio: { output: "16W (8W x 2)", technology: ["Stereo"], speakers: "2.0" },
            comparisonTags: ["fhd", "qled", "42-inch", "basic"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: null, riskFlags: [] },
        strategic: { productRole: "core", marginBehavior: "unknown", discountSensitivity: "medium", bundleEligibility: true, bundleRole: "addon", seasonalRelevance: ["year-round"], targetAudience: ["budget-buyers"], competitivePosition: "niche" },
        marketing: { sellingAngles: ["QLED color at mid-range price", "No smart = no complexity"], emotionalDrivers: ["Superior colors"], hooks: ["QLED Full HD — colors that pop!"], captions: { short: "QLED colors at Full HD", medium: 'Geant 42" QLED — quantum dot vibrant colors in Full HD clarity', long: null }, benefits_dz: ["ألوان QLED حية بزاف", "Full HD واضح", "بسيط — بلا تعقيد"], ramadanAngle: null, adFormats: ["banner"] },
        relationships: { complementary: [], comparisons: [{ productId: "GN-Q32JHDT-N", relationship: "downgrade" }, { productId: "GN-TE42FHDS", relationship: "same-tier" }], upgradePath: { from: ["GN-Q32JHDT-N"], to: ["GN-Q75J4KSW-N"] }, bundleFamilies: [], alternatives: [{ productId: "GN-TE42FHD", reason: "LED version, cheaper" }] }
    },
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "GN-TE42FHD", brand: "Geant", model: "GN-TE42FHD", sku: null, name: 'Geant 42" LED TV', category: "TV", subcategory: "LED TV", variant: null, confidenceScore: 60, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 42, resolution: { width: 1920, height: 1080, label: "Full HD" }, panelType: "LED", refreshRate: "60Hz", power: null },
            display: { brightness: "250 cd/m²", contrastRatio: "3000:1", hdr: false, hdrFormats: [], viewingAngle: null },
            smart: { platform: null, os: null, processor: null, ram: null, storage: null, voiceAssistants: [] },
            connectivity: { wifi: false, wifiSpec: null, bluetooth: false, btVersion: null, hdmiPorts: 2, hdmiSpec: null, usbPorts: 1, ethernet: false, casting: [] },
            audio: { output: "16W (8W x 2)", technology: ["Stereo"], speakers: "2.0" },
            comparisonTags: ["fhd", "led", "42-inch", "basic"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: null, riskFlags: [] },
        strategic: { productRole: "entry", marginBehavior: "volume-play", discountSensitivity: "high", bundleEligibility: false, bundleRole: null, seasonalRelevance: ["year-round"], targetAudience: ["budget-buyers"], competitivePosition: "price-leader" },
        marketing: { sellingAngles: ["Budget Full HD 42-inch", "Simple, no-fuss TV"], emotionalDrivers: ["Affordable big screen"], hooks: ["Big screen, small price!"], captions: { short: "42\" Full HD at lowest price", medium: 'Geant 42" LED — simple Full HD TV for everyday viewing', long: null }, benefits_dz: ["شاشة كبيرة بسعر صغير", "بسيط — شغل و تفرج", "ماركة جزائرية"], ramadanAngle: null, adFormats: ["banner"] },
        relationships: { complementary: [], comparisons: [{ productId: "GN-Q42JFHD-N", relationship: "same-tier" }], upgradePath: { from: [], to: ["GN-G50EXL4K"] }, bundleFamilies: [], alternatives: [{ productId: "MS40FAT4", reason: "Multismart 40\" LED similar" }] }
    },
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "GN-G50EXL4K", brand: "Geant", model: "GN-G50EXL4K", sku: null, name: 'Geant 50" 4K Smart Google TV', category: "TV", subcategory: "Smart TV", variant: null, confidenceScore: 72, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 50, resolution: { width: 3840, height: 2160, label: "4K UHD" }, panelType: "LED", refreshRate: "60Hz", power: null },
            display: { brightness: "300 cd/m²", contrastRatio: "5000:1", hdr: true, hdrFormats: ["HDR10"], viewingAngle: null },
            smart: { platform: "Google TV", os: "Google TV", processor: null, ram: "2GB", storage: "8GB", voiceAssistants: ["Google Assistant"] },
            connectivity: { wifi: true, wifiSpec: null, bluetooth: false, btVersion: null, hdmiPorts: 3, hdmiSpec: null, usbPorts: 2, ethernet: true, casting: ["Chromecast"] },
            audio: { output: "20W (10W x 2)", technology: ["Dolby Audio"], speakers: "2.0" },
            comparisonTags: ["4k", "smart", "google-tv", "50-inch", "hdr"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: null, riskFlags: [] },
        strategic: { productRole: "core", marginBehavior: "unknown", discountSensitivity: "medium", bundleEligibility: true, bundleRole: "anchor", seasonalRelevance: ["ramadan", "year-round"], targetAudience: ["families"], competitivePosition: "value-sweet-spot" },
        marketing: { sellingAngles: ["4K Google TV — Algerian brand", "Netflix, Disney+, YouTube built-in"], emotionalDrivers: ["4K upgrade with local brand"], hooks: ["4K Google TV from Geant — all apps included!"], captions: { short: "4K Google TV, Algerian made", medium: 'Geant 50" 4K Google TV — 2GB RAM, Netflix, Disney+, YouTube, voice search', long: null }, benefits_dz: ["4K جزائري بسعر مناسب", "Google TV فيه كل التطبيقات", "Netflix و Disney+ جاهزين"], ramadanAngle: "Stream all Ramadan series in 4K", adFormats: ["carousel", "story", "reel"] },
        relationships: { complementary: [], comparisons: [{ productId: "GN-Q75J4KSW-N", relationship: "upgrade" }], upgradePath: { from: ["GN-TE42FHDS", "GN-TE42FHD"], to: ["GN-Q75J4KSW-N"] }, bundleFamilies: [], alternatives: [{ productId: "A50S1", reason: "ARTCOOL 50\" VIDAA" }, { productId: "UA50AU7000", reason: "Samsung 50\" Crystal UHD" }] }
    },
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "GN-Q75J4KSW-N", brand: "Geant", model: "GN-Q75J4KSW-N", sku: null, name: 'Geant 75" QLED 4K Smart TV', category: "TV", subcategory: "Smart TV", variant: null, confidenceScore: 70, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 75, resolution: { width: 3840, height: 2160, label: "4K UHD" }, panelType: "QLED", refreshRate: "60Hz", power: null },
            display: { brightness: "400 cd/m²", contrastRatio: "5000:1", hdr: true, hdrFormats: ["HDR10"], viewingAngle: null },
            smart: { platform: "WebOS", os: "WebOS 2.0", processor: null, ram: null, storage: null, voiceAssistants: [] },
            connectivity: { wifi: true, wifiSpec: "Dual-Band", bluetooth: true, btVersion: null, hdmiPorts: 3, hdmiSpec: null, usbPorts: 3, ethernet: true, casting: [] },
            audio: { output: "20W (10W x 2)", technology: ["Dolby Audio"], speakers: "2.0" },
            comparisonTags: ["4k", "qled", "smart", "webos", "75-inch", "hdr"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: null, riskFlags: [] },
        strategic: { productRole: "premium", marginBehavior: "high-margin", discountSensitivity: "low", bundleEligibility: true, bundleRole: "anchor", seasonalRelevance: ["ramadan"], targetAudience: ["premium-seekers"], competitivePosition: "premium-tier" },
        marketing: { sellingAngles: ["75-inch QLED 4K — ultimate size", "WebOS smart platform"], emotionalDrivers: ["Biggest screen in the room", "Prestige"], hooks: ["75 inches of QLED 4K — Geant's flagship!"], captions: { short: "75\" QLED 4K flagship", medium: 'Geant 75" QLED 4K — WebOS, Dual-Band WiFi, Dolby Audio, 400 cd/m² brightness', long: null }, benefits_dz: ["أكبر شاشة QLED", "ألوان خيالية مع كوانتوم دوت", "واي فاي ثنائي النطاق — سريع"], ramadanAngle: "The Ramadan showpiece — 75\" QLED cinema", adFormats: ["reel", "carousel"] },
        relationships: { complementary: [], comparisons: [], upgradePath: { from: ["GN-G50EXL4K", "GN-Q42JFHD-N"], to: [] }, bundleFamilies: [], alternatives: [{ productId: "75A6K", reason: "Hisense 75\" VIDAA competitor" }] }
    },
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "GN-32LDJHD-N", brand: "Geant", model: "GN-32LDJHD-N", sku: null, name: 'Geant 32" LED TV', category: "TV", subcategory: "LED TV", variant: null, confidenceScore: 60, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 32, resolution: { width: 1366, height: 768, label: "HD Ready" }, panelType: "LED", refreshRate: "60Hz", power: null },
            display: { brightness: "200 cd/m²", contrastRatio: "3000:1", hdr: false, hdrFormats: [], viewingAngle: "178°" },
            smart: { platform: null, os: null, processor: null, ram: null, storage: null, voiceAssistants: [] },
            connectivity: { wifi: false, wifiSpec: null, bluetooth: false, btVersion: null, hdmiPorts: 2, hdmiSpec: null, usbPorts: 1, ethernet: false, casting: [] },
            audio: { output: "10W (5W x 2)", technology: ["Stereo"], speakers: "2.0" },
            comparisonTags: ["hd", "led", "32-inch", "basic"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: null, riskFlags: [] },
        strategic: { productRole: "entry", marginBehavior: "volume-play", discountSensitivity: "high", bundleEligibility: false, bundleRole: null, seasonalRelevance: ["year-round"], targetAudience: ["budget-buyers"], competitivePosition: "price-leader" },
        marketing: { sellingAngles: ["Cheapest 32-inch from Geant", "VGA input for PC monitor use"], emotionalDrivers: ["Lowest price", "Dual-purpose TV/monitor"], hooks: ["32\" TV at the lowest price!"], captions: { short: "Budget 32\" LED TV", medium: 'Geant 32" LED — 178° viewing angle, VGA input, energy saving', long: null }, benefits_dz: ["أرخص تلفزيون 32 بوصة", "يصلح كشاشة PC", "اقتصادي فالضو"], ramadanAngle: null, adFormats: ["banner"] },
        relationships: { complementary: [], comparisons: [], upgradePath: { from: [], to: ["GN-Q32JHDT-N"] }, bundleFamilies: [], alternatives: [{ productId: "32E30", reason: "IRIS 32\" LED" }, { productId: "32D3200", reason: "TCL 32\" LED" }] }
    },
    // ═══════════════════ HISENSE ═══════════════════
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "43A4G", brand: "Hisense", model: "43A4G", sku: null, name: 'Hisense 43" VIDAA Smart TV', category: "TV", subcategory: "Smart TV", variant: null, confidenceScore: 82, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 43, resolution: { width: 1920, height: 1080, label: "Full HD" }, panelType: "LED", refreshRate: "60Hz", power: null },
            display: { brightness: "250 cd/m²", contrastRatio: "4000:1", hdr: true, hdrFormats: ["HDR10"], viewingAngle: null },
            smart: { platform: "VIDAA U5", os: "VIDAA U5", processor: null, ram: null, storage: null, voiceAssistants: [] },
            connectivity: { wifi: true, wifiSpec: null, bluetooth: true, btVersion: null, hdmiPorts: 2, hdmiSpec: null, usbPorts: 2, ethernet: true, casting: [] },
            audio: { output: "12W (6W x 2)", technology: ["DTS Virtual:X"], speakers: "2.0" },
            comparisonTags: ["fhd", "smart", "vidaa", "43-inch", "hdr"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: "2 years", riskFlags: [] },
        strategic: { productRole: "core", marginBehavior: "standard", discountSensitivity: "medium", bundleEligibility: true, bundleRole: "anchor", seasonalRelevance: ["ramadan", "year-round"], targetAudience: ["families"], competitivePosition: "value-sweet-spot" },
        marketing: { sellingAngles: ["International brand quality", "VIDAA smart platform"], emotionalDrivers: ["Trusted global brand", "Smart features"], hooks: ["Hisense quality at Algerian price!"], captions: { short: "Hisense 43\" Full HD Smart", medium: 'Hisense 43A4G — VIDAA U5, DTS Virtual:X, HDR10, trusted international quality', long: null }, benefits_dz: ["ماركة عالمية موثوقة", "VIDAA سهل الاستعمال", "صوت DTS محيطي", "ضمان سنتين"], ramadanAngle: "International quality for Ramadan", adFormats: ["carousel", "story"] },
        relationships: { complementary: [], comparisons: [{ productId: "75A6K", relationship: "upgrade" }], upgradePath: { from: [], to: ["75A6K"] }, bundleFamilies: [], alternatives: [{ productId: "A43S1", reason: "ARTCOOL VIDAA same-tier" }, { productId: "S5400A", reason: "TCL Google TV alternative" }] }
    },
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "75A6K", brand: "Hisense", model: "75A6K", sku: null, name: 'Hisense 75" 4K Smart TV', category: "TV", subcategory: "Smart TV", variant: null, confidenceScore: 80, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 75, resolution: { width: 3840, height: 2160, label: "4K UHD" }, panelType: "LED", refreshRate: "60Hz", power: null },
            display: { brightness: "350 cd/m²", contrastRatio: "5000:1", hdr: true, hdrFormats: ["Dolby Vision", "HDR10+", "HLG"], viewingAngle: null },
            smart: { platform: "VIDAA U6", os: "VIDAA U6", processor: null, ram: null, storage: null, voiceAssistants: ["Alexa"] },
            connectivity: { wifi: true, wifiSpec: "Dual-Band", bluetooth: true, btVersion: "5.0", hdmiPorts: 3, hdmiSpec: "HDMI 2.0", usbPorts: 2, ethernet: true, casting: ["AirPlay 2"] },
            audio: { output: "30W", technology: ["DTS Virtual:X", "Dolby Audio"], speakers: "2.0" },
            comparisonTags: ["4k", "smart", "vidaa", "75-inch", "hdr", "dolby-vision", "hdr10+"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: "2 years", riskFlags: [] },
        strategic: { productRole: "premium", marginBehavior: "high-margin", discountSensitivity: "low", bundleEligibility: true, bundleRole: "anchor", seasonalRelevance: ["ramadan"], targetAudience: ["premium-seekers"], competitivePosition: "premium-tier" },
        marketing: { sellingAngles: ["75-inch Dolby Vision + HDR10+", "International brand premium", "Alexa voice control"], emotionalDrivers: ["Premium home cinema", "Brand prestige"], hooks: ["75\" Hisense 4K — Dolby Vision + Alexa!"], captions: { short: "75\" 4K Dolby Vision premium", medium: 'Hisense 75A6K — Dolby Vision, HDR10+, 30W audio, Alexa, AirPlay 2', long: null }, benefits_dz: ["شاشة 75 بوصة — سينما فدارك", "Dolby Vision + HDR10+ ألوان خيالية", "Alexa تحكم بالصوت", "30 واط صوت قوي"], ramadanAngle: "The ultimate Ramadan cinema — 75\" Hisense", adFormats: ["reel", "carousel"] },
        relationships: { complementary: [], comparisons: [], upgradePath: { from: ["43A4G"], to: [] }, bundleFamilies: [], alternatives: [{ productId: "GN-Q75J4KSW-N", reason: "Geant 75\" QLED local brand" }] }
    },
    // ═══════════════════ IRIS ═══════════════════
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "32E30", brand: "IRIS", model: "32E30", sku: null, name: 'IRIS 32" LED TV', category: "TV", subcategory: "LED TV", variant: null, confidenceScore: 60, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 32, resolution: { width: 1366, height: 768, label: "HD Ready" }, panelType: "LED", refreshRate: "60Hz", power: null },
            display: { brightness: "200 cd/m²", contrastRatio: "3000:1", hdr: false, hdrFormats: [], viewingAngle: null },
            smart: { platform: null, os: null, processor: null, ram: null, storage: null, voiceAssistants: [] },
            connectivity: { wifi: false, wifiSpec: null, bluetooth: false, btVersion: null, hdmiPorts: 2, hdmiSpec: null, usbPorts: 1, ethernet: false, casting: [] },
            audio: { output: "12W (6W x 2)", technology: ["Stereo"], speakers: "2.0" },
            comparisonTags: ["hd", "led", "32-inch", "basic"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: null, riskFlags: [] },
        strategic: { productRole: "entry", marginBehavior: "volume-play", discountSensitivity: "high", bundleEligibility: false, bundleRole: null, seasonalRelevance: ["year-round"], targetAudience: ["budget-buyers"], competitivePosition: "price-leader" },
        marketing: { sellingAngles: ["Cheapest 32-inch basic TV", "Algerian brand"], emotionalDrivers: ["Lowest price entry"], hooks: ["32\" TV — lowest price!"], captions: { short: "Budget 32\" LED from IRIS", medium: 'IRIS 32E30 — basic HD Ready TV for bedrooms and kitchens', long: null }, benefits_dz: ["أرخص تلفزيون", "بسيط وسهل", "ماركة جزائرية"], ramadanAngle: null, adFormats: ["banner"] },
        relationships: { complementary: [], comparisons: [{ productId: "43E30", relationship: "upgrade" }], upgradePath: { from: [], to: ["43E30", "32C3010"] }, bundleFamilies: [], alternatives: [{ productId: "GN-32LDJHD-N", reason: "Geant 32\" LED" }, { productId: "32D3200", reason: "TCL 32\" LED" }] }
    },
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "43E30", brand: "IRIS", model: "43E30", sku: null, name: 'IRIS 43" DLED TV', category: "TV", subcategory: "LED TV", variant: null, confidenceScore: 60, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 43, resolution: { width: 1920, height: 1080, label: "Full HD" }, panelType: "DLED", refreshRate: "60Hz", power: null },
            display: { brightness: "250 cd/m²", contrastRatio: "4000:1", hdr: false, hdrFormats: [], viewingAngle: null },
            smart: { platform: null, os: null, processor: null, ram: null, storage: null, voiceAssistants: [] },
            connectivity: { wifi: false, wifiSpec: null, bluetooth: false, btVersion: null, hdmiPorts: 2, hdmiSpec: null, usbPorts: 1, ethernet: false, casting: [] },
            audio: { output: "16W (8W x 2)", technology: ["Stereo"], speakers: "2.0" },
            comparisonTags: ["fhd", "dled", "43-inch", "basic"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: null, riskFlags: [] },
        strategic: { productRole: "entry", marginBehavior: "volume-play", discountSensitivity: "high", bundleEligibility: false, bundleRole: null, seasonalRelevance: ["year-round"], targetAudience: ["budget-buyers"], competitivePosition: "price-leader" },
        marketing: { sellingAngles: ["Budget 43-inch Full HD", "No-fuss basic TV"], emotionalDrivers: ["Affordable Full HD"], hooks: ["43\" Full HD at budget price!"], captions: { short: "43\" Full HD basic TV", medium: 'IRIS 43E30 — Full HD DLED TV, simple and reliable', long: null }, benefits_dz: ["Full HD بسعر مناسب", "بسيط بلا تعقيد", "ماركة جزائرية"], ramadanAngle: null, adFormats: ["banner"] },
        relationships: { complementary: [], comparisons: [{ productId: "32E30", relationship: "downgrade" }], upgradePath: { from: ["32E30"], to: ["C3020"] }, bundleFamilies: [], alternatives: [{ productId: "MS40FAT4", reason: "Multismart basic similar" }] }
    },
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "32C3010", brand: "IRIS", model: "32C3010", sku: null, name: 'IRIS 32" Tizen Smart TV', category: "TV", subcategory: "Smart TV", variant: null, confidenceScore: 65, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 32, resolution: { width: 1366, height: 768, label: "HD Ready" }, panelType: "LED", refreshRate: "60Hz", power: null },
            display: { brightness: "200 cd/m²", contrastRatio: "3000:1", hdr: false, hdrFormats: [], viewingAngle: null },
            smart: { platform: "Tizen (Samsung)", os: "Tizen", processor: null, ram: null, storage: null, voiceAssistants: [] },
            connectivity: { wifi: true, wifiSpec: null, bluetooth: false, btVersion: null, hdmiPorts: 2, hdmiSpec: null, usbPorts: 2, ethernet: false, casting: [] },
            audio: { output: "20W (10W x 2)", technology: ["Stereo"], speakers: "2.0" },
            comparisonTags: ["hd", "smart", "tizen", "32-inch"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: null, riskFlags: [] },
        strategic: { productRole: "core", marginBehavior: "unknown", discountSensitivity: "medium", bundleEligibility: true, bundleRole: "anchor", seasonalRelevance: ["year-round"], targetAudience: ["budget-buyers"], competitivePosition: "value-sweet-spot" },
        marketing: { sellingAngles: ["Samsung Tizen OS at IRIS price", "20W powerful audio"], emotionalDrivers: ["Samsung quality, local price"], hooks: ["Samsung Tizen in an IRIS TV!"], captions: { short: "Tizen smart TV at local price", medium: 'IRIS 32C3010 — Samsung Tizen OS, 20W audio, WiFi, local brand pricing', long: null }, benefits_dz: ["نظام Samsung Tizen", "صوت قوي 20 واط", "سمارت بسعر محلي"], ramadanAngle: null, adFormats: ["story"] },
        relationships: { complementary: [], comparisons: [{ productId: "32E30", relationship: "same-tier" }], upgradePath: { from: ["32E30"], to: ["C3020"] }, bundleFamilies: [], alternatives: [{ productId: "A32S1", reason: "ARTCOOL VIDAA 32\"" }, { productId: "MS32HAS1", reason: "Multismart Android 32\"" }] }
    },
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "C3020", brand: "IRIS", model: "C3020", sku: null, name: 'IRIS 40" Smart TV', category: "TV", subcategory: "Smart TV", variant: null, confidenceScore: 62, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 40, resolution: { width: 1920, height: 1080, label: "Full HD" }, panelType: "LED", refreshRate: "60Hz", power: null },
            display: { brightness: "250 cd/m²", contrastRatio: "4000:1", hdr: false, hdrFormats: [], viewingAngle: null },
            smart: { platform: "Smart TV OS", os: "Smart TV OS", processor: null, ram: null, storage: null, voiceAssistants: [] },
            connectivity: { wifi: true, wifiSpec: null, bluetooth: false, btVersion: null, hdmiPorts: 2, hdmiSpec: null, usbPorts: 2, ethernet: false, casting: [] },
            audio: { output: "20W (10W x 2)", technology: ["Stereo"], speakers: "2.0" },
            comparisonTags: ["fhd", "smart", "40-inch"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: null, riskFlags: [] },
        strategic: { productRole: "core", marginBehavior: "unknown", discountSensitivity: "medium", bundleEligibility: true, bundleRole: "anchor", seasonalRelevance: ["year-round"], targetAudience: ["families", "budget-buyers"], competitivePosition: "price-leader" },
        marketing: { sellingAngles: ["40-inch Full HD Smart TV", "Powerful 20W audio"], emotionalDrivers: ["Smart TV at budget price"], hooks: ["Smart TV at IRIS price!"], captions: { short: "40\" Full HD Smart from IRIS", medium: 'IRIS C3020 — 40\" Full HD, WiFi smart, 20W powerful speakers', long: null }, benefits_dz: ["سمارت بسعر IRIS", "صوت قوي 20 واط", "40 بوصة للصالون"], ramadanAngle: null, adFormats: ["story", "banner"] },
        relationships: { complementary: [], comparisons: [], upgradePath: { from: ["32C3010", "43E30"], to: [] }, bundleFamilies: [], alternatives: [{ productId: "40SG630", reason: "Condor Google TV 40\"" }] }
    },
    // ═══════════════════ MULTISMART ═══════════════════
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "MS32HAS1", brand: "Multismart", model: "MS32HAS1", sku: null, name: 'Multismart 32" Android TV 14', category: "TV", subcategory: "Smart TV", variant: null, confidenceScore: 65, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 32, resolution: { width: 1366, height: 768, label: "HD Ready" }, panelType: "LED", refreshRate: "60Hz", power: null },
            display: { brightness: "200 cd/m²", contrastRatio: "3000:1", hdr: false, hdrFormats: [], viewingAngle: null },
            smart: { platform: "Android TV 14", os: "Android 14", processor: null, ram: null, storage: null, voiceAssistants: ["Google Assistant"] },
            connectivity: { wifi: true, wifiSpec: null, bluetooth: true, btVersion: null, hdmiPorts: 2, hdmiSpec: null, usbPorts: 2, ethernet: false, casting: ["Chromecast"] },
            audio: { output: "10W (5W x 2)", technology: ["Stereo"], speakers: "2.0" },
            comparisonTags: ["hd", "smart", "android-tv", "32-inch"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: null, riskFlags: [] },
        strategic: { productRole: "entry", marginBehavior: "unknown", discountSensitivity: "high", bundleEligibility: true, bundleRole: "anchor", seasonalRelevance: ["year-round"], targetAudience: ["budget-buyers"], competitivePosition: "price-leader" },
        marketing: { sellingAngles: ["Android 14 at entry price", "Google Play Store access"], emotionalDrivers: ["Latest Android", "App access"], hooks: ["Android 14 TV at lowest price!"], captions: { short: "32\" Android 14 Smart TV", medium: 'Multismart 32" — Android 14, Chromecast, Google Play Store, budget friendly', long: null }, benefits_dz: ["Android 14 أحدث نظام", "Google Play Store فيه كلش", "سعر مناسب بزاف"], ramadanAngle: null, adFormats: ["story"] },
        relationships: { complementary: [], comparisons: [{ productId: "MS32HAS4", relationship: "same-tier" }], upgradePath: { from: [], to: ["MS43FAT1"] }, bundleFamilies: [], alternatives: [{ productId: "S32MS", reason: "Cristor Android 32\"" }, { productId: "A32S1", reason: "ARTCOOL VIDAA 32\"" }] }
    },
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "MS32HAS4", brand: "Multismart", model: "MS32HAS4", sku: null, name: 'Multismart 32" Google TV', category: "TV", subcategory: "Smart TV", variant: null, confidenceScore: 62, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 32, resolution: { width: 1366, height: 768, label: "HD Ready" }, panelType: "LED", refreshRate: "60Hz", power: null },
            display: { brightness: "200 cd/m²", contrastRatio: "3000:1", hdr: false, hdrFormats: [], viewingAngle: null },
            smart: { platform: "Google TV (Android 11)", os: "Android 11", processor: null, ram: null, storage: null, voiceAssistants: ["Google Assistant"] },
            connectivity: { wifi: true, wifiSpec: null, bluetooth: true, btVersion: null, hdmiPorts: 2, hdmiSpec: null, usbPorts: 1, ethernet: false, casting: ["Chromecast"] },
            audio: { output: "12W (6W x 2)", technology: ["Stereo"], speakers: "2.0" },
            comparisonTags: ["hd", "smart", "google-tv", "32-inch"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: null, riskFlags: [] },
        strategic: { productRole: "entry", marginBehavior: "unknown", discountSensitivity: "high", bundleEligibility: true, bundleRole: "anchor", seasonalRelevance: ["year-round"], targetAudience: ["budget-buyers"], competitivePosition: "price-leader" },
        marketing: { sellingAngles: ["Google TV interface", "Chromecast built-in"], emotionalDrivers: ["Google ecosystem"], hooks: ["Google TV for under budget!"], captions: { short: "32\" Google TV smart", medium: 'Multismart 32" Google TV — Chromecast, Google Assistant, smart recommendations', long: null }, benefits_dz: ["Google TV واجهة سهلة", "Chromecast مدمج", "سعر مناسب"], ramadanAngle: null, adFormats: ["story"] },
        relationships: { complementary: [], comparisons: [{ productId: "MS32HAS1", relationship: "same-tier" }], upgradePath: { from: [], to: ["MS43FAT1"] }, bundleFamilies: [], alternatives: [{ productId: "S32MS", reason: "Cristor Android 32\"" }] }
    },
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "MS40FAT4", brand: "Multismart", model: "MS40FAT4", sku: null, name: 'Multismart 40" LED TV', category: "TV", subcategory: "LED TV", variant: null, confidenceScore: 58, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 40, resolution: { width: 1920, height: 1080, label: "Full HD" }, panelType: "LED", refreshRate: "60Hz", power: null },
            display: { brightness: "250 cd/m²", contrastRatio: "3000:1", hdr: false, hdrFormats: [], viewingAngle: null },
            smart: { platform: null, os: null, processor: null, ram: null, storage: null, voiceAssistants: [] },
            connectivity: { wifi: false, wifiSpec: null, bluetooth: false, btVersion: null, hdmiPorts: 2, hdmiSpec: null, usbPorts: 1, ethernet: false, casting: [] },
            audio: { output: "16W (8W x 2)", technology: ["Stereo"], speakers: "2.0" },
            comparisonTags: ["fhd", "led", "40-inch", "basic"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: null, riskFlags: [] },
        strategic: { productRole: "entry", marginBehavior: "volume-play", discountSensitivity: "high", bundleEligibility: false, bundleRole: null, seasonalRelevance: ["year-round"], targetAudience: ["budget-buyers"], competitivePosition: "price-leader" },
        marketing: { sellingAngles: ["Budget 40-inch Full HD", "Simple basic TV"], emotionalDrivers: ["Affordable big screen"], hooks: ["40\" Full HD — budget price!"], captions: { short: "40\" Full HD basic TV", medium: 'Multismart 40" LED — Full HD for everyday viewing at budget price', long: null }, benefits_dz: ["شاشة كبيرة بسعر صغير", "Full HD واضح", "بسيط بلا تعقيد"], ramadanAngle: null, adFormats: ["banner"] },
        relationships: { complementary: [], comparisons: [], upgradePath: { from: [], to: ["MS43FAT1"] }, bundleFamilies: [], alternatives: [{ productId: "GN-TE42FHD", reason: "Geant 42\" LED" }] }
    },
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "MS43FAT1", brand: "Multismart", model: "MS43FAT1", sku: null, name: 'Multismart 43" Android TV 14', category: "TV", subcategory: "Smart TV", variant: null, confidenceScore: 65, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 43, resolution: { width: 1920, height: 1080, label: "Full HD" }, panelType: "LED", refreshRate: "60Hz", power: null },
            display: { brightness: "250 cd/m²", contrastRatio: "4000:1", hdr: false, hdrFormats: [], viewingAngle: null },
            smart: { platform: "Android TV 14", os: "Android 14", processor: null, ram: null, storage: null, voiceAssistants: ["Google Assistant"] },
            connectivity: { wifi: true, wifiSpec: null, bluetooth: true, btVersion: null, hdmiPorts: 2, hdmiSpec: null, usbPorts: 1, ethernet: false, casting: ["Chromecast"] },
            audio: { output: "16W (8W x 2)", technology: ["Stereo"], speakers: "2.0" },
            comparisonTags: ["fhd", "smart", "android-tv", "43-inch"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: null, riskFlags: [] },
        strategic: { productRole: "core", marginBehavior: "unknown", discountSensitivity: "medium", bundleEligibility: true, bundleRole: "anchor", seasonalRelevance: ["ramadan", "year-round"], targetAudience: ["families"], competitivePosition: "value-sweet-spot" },
        marketing: { sellingAngles: ["43-inch Android 14 Smart TV", "Full HD + Chromecast"], emotionalDrivers: ["Family smart TV"], hooks: ["Android 14 family TV!"], captions: { short: "43\" Android 14 smart TV", medium: 'Multismart 43" — Android 14, Chromecast, Google Play, family-friendly Full HD', long: null }, benefits_dz: ["Android 14 للعايلة", "Chromecast + Google Play", "43 بوصة مناسبة للصالون"], ramadanAngle: "Smart family TV for Ramadan", adFormats: ["carousel", "story"] },
        relationships: { complementary: [], comparisons: [], upgradePath: { from: ["MS32HAS1", "MS32HAS4", "MS40FAT4"], to: ["MS50UAT"] }, bundleFamilies: [], alternatives: [{ productId: "A43S1", reason: "ARTCOOL VIDAA 43\"" }, { productId: "S5400A", reason: "TCL Google TV 43\"" }] }
    },
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "MS50UAT", brand: "Multismart", model: "MS50UAT", sku: null, name: 'Multismart 50" 4K WebOS TV', category: "TV", subcategory: "Smart TV", variant: null, confidenceScore: 65, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 50, resolution: { width: 3840, height: 2160, label: "4K UHD" }, panelType: "LED", refreshRate: "60Hz", power: null },
            display: { brightness: "300 cd/m²", contrastRatio: "5000:1", hdr: true, hdrFormats: ["HDR10"], viewingAngle: null },
            smart: { platform: "WebOS", os: "WebOS", processor: null, ram: null, storage: null, voiceAssistants: [] },
            connectivity: { wifi: true, wifiSpec: null, bluetooth: false, btVersion: null, hdmiPorts: 3, hdmiSpec: null, usbPorts: 2, ethernet: true, casting: [] },
            audio: { output: "20W (10W x 2)", technology: ["Dolby Audio"], speakers: "2.0" },
            comparisonTags: ["4k", "smart", "webos", "50-inch", "hdr"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: null, riskFlags: [] },
        strategic: { productRole: "core", marginBehavior: "unknown", discountSensitivity: "medium", bundleEligibility: true, bundleRole: "anchor", seasonalRelevance: ["ramadan", "year-round"], targetAudience: ["families"], competitivePosition: "value-sweet-spot" },
        marketing: { sellingAngles: ["4K WebOS at local price", "HDR10 + Dolby Audio"], emotionalDrivers: ["4K upgrade"], hooks: ["4K WebOS TV — local brand price!"], captions: { short: "50\" 4K WebOS smart TV", medium: 'Multismart 50" 4K — WebOS smart platform, HDR10, Dolby Audio', long: null }, benefits_dz: ["4K بسعر محلي", "WebOS سهل الاستعمال", "HDR10 ألوان حية"], ramadanAngle: "4K for Ramadan viewing", adFormats: ["carousel", "story"] },
        relationships: { complementary: [], comparisons: [{ productId: "MS65UAG3", relationship: "upgrade" }], upgradePath: { from: ["MS43FAT1"], to: ["MS65UAG3", "MS-65UAS2"] }, bundleFamilies: [], alternatives: [{ productId: "A50S1", reason: "ARTCOOL VIDAA 50\"" }, { productId: "UA50AU7000", reason: "Samsung Crystal 50\"" }] }
    },
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "MS65UAG3", brand: "Multismart", model: "MS65UAG3", sku: null, name: 'Multismart 65" 4K Google TV', category: "TV", subcategory: "Smart TV", variant: null, confidenceScore: 68, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 65, resolution: { width: 3840, height: 2160, label: "4K UHD" }, panelType: "LED", refreshRate: "60Hz", power: null },
            display: { brightness: "350 cd/m²", contrastRatio: "5000:1", hdr: true, hdrFormats: ["HDR10"], viewingAngle: null },
            smart: { platform: "Google TV", os: "Google TV", processor: null, ram: null, storage: null, voiceAssistants: ["Google Assistant"] },
            connectivity: { wifi: true, wifiSpec: null, bluetooth: true, btVersion: null, hdmiPorts: 3, hdmiSpec: null, usbPorts: 2, ethernet: true, casting: ["Chromecast"] },
            audio: { output: "20W (10W x 2)", technology: ["Dolby Audio"], speakers: "2.0" },
            comparisonTags: ["4k", "smart", "google-tv", "65-inch", "hdr"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: null, riskFlags: [] },
        strategic: { productRole: "premium", marginBehavior: "high-margin", discountSensitivity: "low", bundleEligibility: true, bundleRole: "anchor", seasonalRelevance: ["ramadan"], targetAudience: ["premium-seekers", "families"], competitivePosition: "value-sweet-spot" },
        marketing: { sellingAngles: ["65\" 4K Google TV at local price", "Chromecast + Google Assistant"], emotionalDrivers: ["Big screen prestige", "Google ecosystem"], hooks: ["65\" 4K Google TV — local brand pricing!"], captions: { short: "65\" 4K Google TV", medium: 'Multismart 65" 4K — Google TV, Chromecast, voice control, Dolby Audio', long: null }, benefits_dz: ["65 بوصة 4K — سينما فدارك", "Google TV فيه كل التطبيقات", "سعر محلي مقابل ماركة عالمية"], ramadanAngle: "65\" for the ultimate Ramadan family setup", adFormats: ["reel", "carousel"] },
        relationships: { complementary: [], comparisons: [{ productId: "MS-65UAS2", relationship: "same-tier" }], upgradePath: { from: ["MS50UAT"], to: [] }, bundleFamilies: [], alternatives: [{ productId: "A65S1", reason: "ARTCOOL VIDAA 65\"" }] }
    },
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "MS-32HAT2", brand: "Multismart", model: "MS-32HAT2", sku: null, name: 'Multismart 32" LED Basic TV', category: "TV", subcategory: "LED TV", variant: null, confidenceScore: 55, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 32, resolution: { width: 1366, height: 768, label: "HD Ready" }, panelType: "LED", refreshRate: "60Hz", power: null },
            display: { brightness: "200 cd/m²", contrastRatio: "3000:1", hdr: false, hdrFormats: [], viewingAngle: null },
            smart: { platform: null, os: null, processor: null, ram: null, storage: null, voiceAssistants: [] },
            connectivity: { wifi: false, wifiSpec: null, bluetooth: false, btVersion: null, hdmiPorts: 2, hdmiSpec: null, usbPorts: 1, ethernet: false, casting: [] },
            audio: { output: "16W (8W x 2)", technology: ["Stereo"], speakers: "2.0" },
            comparisonTags: ["hd", "led", "32-inch", "basic"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: null, riskFlags: [] },
        strategic: { productRole: "entry", marginBehavior: "volume-play", discountSensitivity: "high", bundleEligibility: false, bundleRole: null, seasonalRelevance: ["year-round"], targetAudience: ["budget-buyers"], competitivePosition: "price-leader" },
        marketing: { sellingAngles: ["Cheapest 32-inch option", "16W decent audio"], emotionalDrivers: ["Lowest price"], hooks: ["Budget 32\" TV!"], captions: { short: "32\" basic LED TV", medium: 'Multismart 32" basic LED — simple, affordable, 16W speakers', long: null }, benefits_dz: ["أرخص تلفزيون 32", "صوت 16 واط مقبول", "بسيط و اقتصادي"], ramadanAngle: null, adFormats: ["banner"] },
        relationships: { complementary: [], comparisons: [], upgradePath: { from: [], to: ["MS32HAS1"] }, bundleFamilies: [], alternatives: [{ productId: "32E30", reason: "IRIS 32\" LED" }, { productId: "GN-32LDJHD-N", reason: "Geant 32\" LED" }] }
    },
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "MS-65UAS2", brand: "Multismart", model: "MS-65UAS2", sku: null, name: 'Multismart 65" 4K Android TV', category: "TV", subcategory: "Smart TV", variant: null, confidenceScore: 65, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 65, resolution: { width: 3840, height: 2160, label: "4K UHD" }, panelType: "LED", refreshRate: "60Hz", power: null },
            display: { brightness: "350 cd/m²", contrastRatio: "5000:1", hdr: true, hdrFormats: ["HDR10"], viewingAngle: null },
            smart: { platform: "Android 11", os: "Android 11", processor: null, ram: null, storage: null, voiceAssistants: ["Google Assistant"] },
            connectivity: { wifi: true, wifiSpec: null, bluetooth: true, btVersion: null, hdmiPorts: 3, hdmiSpec: null, usbPorts: 2, ethernet: true, casting: ["Chromecast"] },
            audio: { output: "20W (10W x 2)", technology: ["Dolby Audio"], speakers: "2.0" },
            comparisonTags: ["4k", "smart", "android-tv", "65-inch", "hdr"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: null, riskFlags: [] },
        strategic: { productRole: "premium", marginBehavior: "high-margin", discountSensitivity: "low", bundleEligibility: true, bundleRole: "anchor", seasonalRelevance: ["ramadan"], targetAudience: ["premium-seekers"], competitivePosition: "value-sweet-spot" },
        marketing: { sellingAngles: ["65\" 4K Android TV", "Google Play Store + Chromecast"], emotionalDrivers: ["Premium Android experience"], hooks: ["65\" Android 4K — local price!"], captions: { short: "65\" 4K Android smart TV", medium: 'Multismart 65" — 4K, Android 11, Chromecast, Google Play, voice control', long: null }, benefits_dz: ["65 بوصة أندرويد", "Google Play فيه كلش", "4K + HDR ألوان رائعة"], ramadanAngle: "Premium Ramadan screen", adFormats: ["reel", "carousel"] },
        relationships: { complementary: [], comparisons: [{ productId: "MS65UAG3", relationship: "same-tier" }], upgradePath: { from: ["MS50UAT"], to: [] }, bundleFamilies: [], alternatives: [{ productId: "A65S1", reason: "ARTCOOL 65\" VIDAA" }] }
    },
    // ═══════════════════ SAMSUNG ═══════════════════
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "UA50AU7000", brand: "Samsung", model: "UA50AU7000", sku: null, name: 'Samsung 50" Crystal UHD 4K', category: "TV", subcategory: "Smart TV", variant: null, confidenceScore: 90, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 50, resolution: { width: 3840, height: 2160, label: "4K UHD" }, panelType: "LED", refreshRate: "60Hz", power: null },
            display: { brightness: "300 cd/m²", contrastRatio: "5000:1", hdr: true, hdrFormats: ["HDR10", "HDR10+", "HLG"], viewingAngle: null },
            smart: { platform: "Tizen", os: "Tizen", processor: "Crystal 4K Processor", ram: null, storage: null, voiceAssistants: ["Bixby", "Alexa", "Google Assistant"] },
            connectivity: { wifi: true, wifiSpec: "Dual-Band", bluetooth: true, btVersion: "5.0", hdmiPorts: 3, hdmiSpec: "HDMI 2.0", usbPorts: 1, ethernet: true, casting: ["AirPlay 2", "SmartThings"] },
            audio: { output: "20W (10W x 2)", technology: ["Adaptive Sound", "Q-Symphony"], speakers: "2.0" },
            comparisonTags: ["4k", "smart", "tizen", "50-inch", "hdr", "hdr10+", "crystal-uhd"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: "2 years", riskFlags: [] },
        strategic: { productRole: "premium", marginBehavior: "high-margin", discountSensitivity: "low", bundleEligibility: true, bundleRole: "anchor", seasonalRelevance: ["ramadan", "year-round"], targetAudience: ["premium-seekers", "families"], competitivePosition: "premium-tier" },
        marketing: { sellingAngles: ["Samsung Crystal 4K Processor", "Triple voice assistant", "SmartThings ecosystem"], emotionalDrivers: ["Samsung brand prestige", "Premium quality"], hooks: ["Samsung Crystal 4K — the name says it all!"], captions: { short: "Samsung 50\" Crystal UHD 4K", medium: 'Samsung 50" Crystal UHD — HDR10+, Crystal Processor, Bixby + Alexa + Google, AirPlay 2', long: null }, benefits_dz: ["Samsung — الماركة رقم واحد", "Crystal 4K صورة خيالية", "3 مساعدين صوتيين", "AirPlay من الآيفون"], ramadanAngle: "Samsung quality for Ramadan prestige", adFormats: ["reel", "carousel", "story"] },
        relationships: { complementary: [], comparisons: [{ productId: "55AU7000", relationship: "upgrade" }], upgradePath: { from: [], to: ["55AU7000"] }, bundleFamilies: [], alternatives: [{ productId: "A50S1", reason: "ARTCOOL 50\" budget option" }, { productId: "GN-G50EXL4K", reason: "Geant 50\" Google TV local" }] }
    },
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "55AU7000", brand: "Samsung", model: "55AU7000", sku: null, name: 'Samsung 55" Crystal UHD 4K', category: "TV", subcategory: "Smart TV", variant: null, confidenceScore: 90, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 55, resolution: { width: 3840, height: 2160, label: "4K UHD" }, panelType: "LED", refreshRate: "60Hz", power: null },
            display: { brightness: "300 cd/m²", contrastRatio: "5000:1", hdr: true, hdrFormats: ["HDR10", "HDR10+", "HLG"], viewingAngle: null },
            smart: { platform: "Tizen", os: "Tizen", processor: "Crystal 4K Processor", ram: null, storage: null, voiceAssistants: ["Bixby", "Alexa", "Google Assistant"] },
            connectivity: { wifi: true, wifiSpec: "Dual-Band", bluetooth: true, btVersion: "5.0", hdmiPorts: 3, hdmiSpec: "HDMI 2.0", usbPorts: 1, ethernet: true, casting: ["AirPlay 2", "SmartThings"] },
            audio: { output: "20W (10W x 2)", technology: ["Adaptive Sound", "Q-Symphony"], speakers: "2.0" },
            comparisonTags: ["4k", "smart", "tizen", "55-inch", "hdr", "hdr10+", "crystal-uhd"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: "2 years", riskFlags: [] },
        strategic: { productRole: "premium", marginBehavior: "high-margin", discountSensitivity: "low", bundleEligibility: true, bundleRole: "anchor", seasonalRelevance: ["ramadan", "year-round"], targetAudience: ["premium-seekers", "gamers"], competitivePosition: "premium-tier" },
        marketing: { sellingAngles: ["55\" Samsung Crystal 4K", "Premium ecosystem", "Game Mode"], emotionalDrivers: ["Samsung prestige", "Best-in-class"], hooks: ["Samsung 55\" Crystal 4K — premium redefined!"], captions: { short: "Samsung 55\" Crystal UHD 4K", medium: 'Samsung 55" Crystal UHD — HDR10+, Crystal Processor, triple voice assistant, SmartThings', long: null }, benefits_dz: ["55 بوصة Samsung — الأفضل", "HDR10+ ألوان سينمائية", "SmartThings للتحكم بالدار", "ضمان سنتين"], ramadanAngle: "Samsung 55\" — the premium Ramadan choice", adFormats: ["reel", "carousel", "story"] },
        relationships: { complementary: [], comparisons: [{ productId: "UA50AU7000", relationship: "downgrade" }], upgradePath: { from: ["UA50AU7000"], to: [] }, bundleFamilies: [], alternatives: [{ productId: "A55S1", reason: "ARTCOOL 55\" Dolby Vision" }, { productId: "55P635", reason: "TCL 55\" Google TV" }] }
    },
    // ═══════════════════ TCL ═══════════════════
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "32D3200", brand: "TCL", model: "32D3200", sku: null, name: 'TCL 32" LED TV', category: "TV", subcategory: "LED TV", variant: null, confidenceScore: 75, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 32, resolution: { width: 1366, height: 768, label: "HD Ready" }, panelType: "LED", refreshRate: "60Hz", power: null },
            display: { brightness: "200 cd/m²", contrastRatio: "3000:1", hdr: false, hdrFormats: [], viewingAngle: null },
            smart: { platform: null, os: null, processor: null, ram: null, storage: null, voiceAssistants: [] },
            connectivity: { wifi: false, wifiSpec: null, bluetooth: false, btVersion: null, hdmiPorts: 2, hdmiSpec: null, usbPorts: 1, ethernet: false, casting: [] },
            audio: { output: "10W (5W x 2)", technology: ["Stereo"], speakers: "2.0" },
            comparisonTags: ["hd", "led", "32-inch", "basic"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: null, riskFlags: [] },
        strategic: { productRole: "entry", marginBehavior: "volume-play", discountSensitivity: "high", bundleEligibility: false, bundleRole: null, seasonalRelevance: ["year-round"], targetAudience: ["budget-buyers"], competitivePosition: "price-leader" },
        marketing: { sellingAngles: ["TCL international quality at budget", "Simple reliable TV"], emotionalDrivers: ["International brand trust"], hooks: ["TCL 32\" — international quality!"], captions: { short: "TCL 32\" budget LED", medium: 'TCL 32D3200 — reliable HD Ready LED from a global brand', long: null }, benefits_dz: ["ماركة عالمية بسعر محلي", "بسيط وموثوق", "TCL جودة مضمونة"], ramadanAngle: null, adFormats: ["banner"] },
        relationships: { complementary: [], comparisons: [], upgradePath: { from: [], to: ["S5400A"] }, bundleFamilies: [], alternatives: [{ productId: "32E30", reason: "IRIS 32\" LED" }, { productId: "GN-32LDJHD-N", reason: "Geant 32\" LED" }] }
    },
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "55P635", brand: "TCL", model: "55P635", sku: null, name: 'TCL 55" 4K Google TV', category: "TV", subcategory: "Smart TV", variant: null, confidenceScore: 82, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 55, resolution: { width: 3840, height: 2160, label: "4K UHD" }, panelType: "LED", refreshRate: "60Hz", power: null },
            display: { brightness: "300 cd/m²", contrastRatio: "5000:1", hdr: true, hdrFormats: ["HDR10", "Dolby Vision", "HLG"], viewingAngle: null },
            smart: { platform: "Google TV (Android 11)", os: "Android 11", processor: null, ram: null, storage: null, voiceAssistants: ["Google Assistant"] },
            connectivity: { wifi: true, wifiSpec: "Dual-Band", bluetooth: true, btVersion: "5.0", hdmiPorts: 3, hdmiSpec: "HDMI 2.1", usbPorts: 1, ethernet: true, casting: ["Chromecast"] },
            audio: { output: "20W (10W x 2)", technology: ["Dolby Audio"], speakers: "2.0" },
            comparisonTags: ["4k", "smart", "google-tv", "55-inch", "hdr", "dolby-vision", "hdmi-2.1"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: "2 years", riskFlags: [] },
        strategic: { productRole: "core", marginBehavior: "standard", discountSensitivity: "medium", bundleEligibility: true, bundleRole: "anchor", seasonalRelevance: ["ramadan", "year-round"], targetAudience: ["families", "gamers"], competitivePosition: "value-sweet-spot" },
        marketing: { sellingAngles: ["55\" Dolby Vision + HDMI 2.1", "Google TV international brand", "Great value 4K"], emotionalDrivers: ["Best value 4K", "Gaming-ready"], hooks: ["55\" 4K Dolby Vision + HDMI 2.1 — TCL value king!"], captions: { short: "TCL 55\" 4K Dolby Vision", medium: 'TCL 55P635 — Dolby Vision, HDMI 2.1, Google TV, international quality at value price', long: null }, benefits_dz: ["Dolby Vision ألوان سينمائية", "HDMI 2.1 للقيمنق", "Google TV فيه كلش", "TCL جودة عالمية بسعر مناسب"], ramadanAngle: "TCL 55\" — cinema quality for Ramadan nights", adFormats: ["reel", "carousel", "story"] },
        relationships: { complementary: [], comparisons: [], upgradePath: { from: ["S5400A", "32D3200"], to: [] }, bundleFamilies: [], alternatives: [{ productId: "A55S1", reason: "ARTCOOL Dolby Vision 55\"" }, { productId: "55AU7000", reason: "Samsung Crystal 55\"" }] }
    },
    {
        _meta: { schemaVersion: "2.0", createdBy: "pkos-workflow" },
        identity: { id: "S5400A", brand: "TCL", model: "S5400A", sku: null, name: 'TCL 43" Full HD Google TV', category: "TV", subcategory: "Smart TV", variant: null, confidenceScore: 78, dataSource: ["web-research"], lastUpdated: "2026-02-12" },
        visual: { heroImage: "", gallery: [], marketingVisuals: [], videoUrl: null, thumbnailUrl: null, imageStatus: "missing" },
        technical: {
            quickSpecs: { screenSize: 43, resolution: { width: 1920, height: 1080, label: "Full HD" }, panelType: "LED", refreshRate: "60Hz", power: null },
            display: { brightness: "250 cd/m²", contrastRatio: "4000:1", hdr: true, hdrFormats: ["HDR10"], viewingAngle: null },
            smart: { platform: "Google TV (Android 11)", os: "Android 11", processor: null, ram: null, storage: null, voiceAssistants: ["Google Assistant"] },
            connectivity: { wifi: true, wifiSpec: null, bluetooth: true, btVersion: "5.0", hdmiPorts: 2, hdmiSpec: null, usbPorts: 1, ethernet: true, casting: ["Chromecast"] },
            audio: { output: "16W (8W x 2)", technology: ["Dolby Audio"], speakers: "2.0" },
            comparisonTags: ["fhd", "smart", "google-tv", "43-inch", "hdr"]
        },
        commercial: { priceRange: { min: null, max: null, typical: null, currency: "DZD" }, priceConfidence: "unknown", priceSources: [], availability: "unknown", warranty: "2 years", riskFlags: [] },
        strategic: { productRole: "core", marginBehavior: "standard", discountSensitivity: "medium", bundleEligibility: true, bundleRole: "anchor", seasonalRelevance: ["ramadan", "year-round"], targetAudience: ["families"], competitivePosition: "value-sweet-spot" },
        marketing: { sellingAngles: ["TCL Google TV at 43\"", "International brand + HDR10"], emotionalDrivers: ["Trusted brand smart TV"], hooks: ["TCL 43\" Google TV — global quality!"], captions: { short: "TCL 43\" Full HD Google TV", medium: 'TCL S5400A — Google TV, Chromecast, Dolby Audio, HDR10, BT 5.0', long: null }, benefits_dz: ["TCL ماركة عالمية", "Google TV واجهة سهلة", "Chromecast + Dolby Audio", "ضمان سنتين"], ramadanAngle: "Smart family TV for Ramadan", adFormats: ["carousel", "story"] },
        relationships: { complementary: [], comparisons: [{ productId: "55P635", relationship: "upgrade" }], upgradePath: { from: ["32D3200"], to: ["55P635"] }, bundleFamilies: [], alternatives: [{ productId: "43A4G", reason: "Hisense VIDAA 43\"" }, { productId: "A43S1", reason: "ARTCOOL VIDAA 43\"" }] }
    }
];

