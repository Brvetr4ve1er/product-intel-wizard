/* ═══════════════════════════════════════════════════════════════════
   PKOS Dashboard Engine — Multi-Category Product Intelligence
   ═══════════════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  //  STATE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════
  class AppStore {
    constructor() {
      this.state = {
        products: [],
        analytics: null,
        filters: { category: 'all', brand: 'all', stock: 'all' },
        sort: 'name',
        searchQuery: ''
      };
      this.listeners = [];
    }

    subscribe(listener) {
      this.listeners.push(listener);
    }

    notify(changedKeys) {
      this.listeners.forEach(l => l(this.state, changedKeys));
    }

    setProducts(products) {
      if (typeof ProductEnrichments !== 'undefined') {
        products = ProductEnrichments.enrichProducts(products);
      }
      this.state.products = products;
      this.state.analytics = InventoryParser.analyze(products);
      this.persist();
      this.notify(new Set(['products', 'analytics']));
    }

    setFilter(key, val) {
      if (this.state.filters[key] !== val) {
        this.state.filters[key] = val;
        this.notify(new Set(['filters']));
      }
    }

    setSort(val) {
      if (this.state.sort !== val) {
        this.state.sort = val;
        this.notify(new Set(['sort']));
      }
    }

    setSearch(query) {
      const q = query.trim().toLowerCase();
      if (this.state.searchQuery !== q) {
        this.state.searchQuery = q;
        this.notify(new Set(['search']));
      }
    }

    getFilteredAndSorted() {
      const s = this.state;
      const q = s.searchQuery;

      const filtered = s.products.filter(p => {
        if (s.filters.category !== 'all' && p.category.id !== s.filters.category) return false;
        if (s.filters.brand !== 'all' && p.brand !== s.filters.brand) return false;
        if (s.filters.stock !== 'all' && p.commercial.stockStatus !== s.filters.stock) return false;
        if (q) {
          const hay = [p.name, p.brand, p.model, p.category.label, p.color || '', ...p.features].join(' ').toLowerCase();
          return hay.includes(q);
        }
        return true;
      });

      const sorted = [...filtered];
      switch (s.sort) {
        case 'name': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
        case 'margin-desc': sorted.sort((a, b) => b.commercial.margin - a.commercial.margin); break;
        case 'margin-asc': sorted.sort((a, b) => a.commercial.margin - b.commercial.margin); break;
        case 'price-desc': sorted.sort((a, b) => b.commercial.retailPrice - a.commercial.retailPrice); break;
        case 'price-asc': sorted.sort((a, b) => a.commercial.retailPrice - b.commercial.retailPrice); break;
        case 'stock-asc': sorted.sort((a, b) => a.commercial.stockQty - b.commercial.stockQty); break;
      }
      return sorted;
    }

    persist() {
      try {
        localStorage.setItem('pkos_inventory', JSON.stringify(this.state.products));
      } catch (e) { /* ignore */ }
    }

    loadPersisted() {
      const saved = localStorage.getItem('pkos_inventory');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.length > 0) {
            this.setProducts(parsed);
            return true;
          }
        } catch (e) { /* ignore */ }
      }
      return false;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  UI COMPONENTS
  // ═══════════════════════════════════════════════════════════════
  const ProductComponents = {
    truncate: (str, len) => str.length > len ? str.substring(0, len) + '…' : str,

    renderCard(p, idx) {
      const margin = p.commercial.margin;
      const mColor = InventoryParser.marginColor(margin);
      // Removed 0.03s delay to speed up large list rendering, using simpler transition

      const gradients = {
        tv: 'linear-gradient(135deg, #1e3a5f, #2d5a87)',
        washing_machine: 'linear-gradient(135deg, #1a3a4a, #2a5a6a)',
        refrigerator: 'linear-gradient(135deg, #1a2e4a, #2a4e6a)',
        freezer: 'linear-gradient(135deg, #1a2e4a, #2a4e6a)',
        cooker: 'linear-gradient(135deg, #3a2a1a, #5a4a2a)',
        microwave: 'linear-gradient(135deg, #2a2a3a, #4a4a5a)',
        air_fryer: 'linear-gradient(135deg, #3a1a2a, #5a2a4a)',
        stand_mixer: 'linear-gradient(135deg, #2a1a3a, #4a2a5a)',
        coffee_maker: 'linear-gradient(135deg, #3a2a1a, #5a3a2a)',
      };
      const bg = gradients[p.category.id] || 'linear-gradient(135deg, #1e2030, #2a2c45)';

      const tags = p.features.slice(0, 4).map(f => `<span class="feature-tag">${f}</span>`).join('');

      const stockBadge = p.commercial.stockStatus === 'Rupture'
        ? `<span class="badge badge-rupture">Rupture</span>`
        : p.commercial.stockStatus === 'Faible'
          ? `<span class="badge badge-faible">Faible</span>`
          : `<span class="badge badge-stock">${p.commercial.stockQty} en stock</span>`;

      const enrichBadge = p.enrichment ? `<span class="badge badge-enriched" title="Intel enrichi">🧠</span>` : '';
      const descPreview = p.enrichment && p.enrichment.description
        ? `<div class="card-description">${this.truncate(p.enrichment.description, 80)}</div>` : '';

      const compHint = p.enrichment && p.enrichment.competitorPrices && p.enrichment.competitorPrices.length > 0
        ? (() => {
          const prices = p.enrichment.competitorPrices.map(c => c.price).filter(Boolean);
          const min = Math.min(...prices);
          const diff = p.commercial.retailPrice - min;
          const competColor = diff > 0 ? '#22c55e' : diff < 0 ? '#ef4444' : '#9898a8';
          return `<div class="card-competitor" style="color:${competColor}">
              ${diff > 0 ? '↑' : diff < 0 ? '↓' : '='} Marché: ${InventoryParser.formatPrice(min)}
            </div>`;
        })()
        : '';

      return `
        <div class="product-card ${p.enrichment ? 'card-enriched' : ''}" data-id="${p.id}">
          <div class="card-image-wrap" style="background:${bg}">
            <div class="card-category-icon">${p.category.icon}</div>
            <div class="card-badges">
              ${enrichBadge}
              ${p.primarySpec ? `<span class="badge badge-spec">${p.primarySpec}</span>` : ''}
              ${p.color ? `<span class="badge badge-color"><span class="color-dot" style="background:${p.colorHex || '#888'}"></span>${p.color}</span>` : ''}
            </div>
            <div class="badge-panel">${p.category.label}</div>
          </div>
          <div class="card-body">
            <div class="card-brand">${p.brand}</div>
            <div class="card-name">${this.truncate(p.name, 55)}</div>
            <div class="card-model">${p.model}</div>
            ${descPreview}
            ${tags ? `<div class="card-features">${tags}</div>` : ''}
            <div class="card-commercial">
              <div class="card-price-row">
                <span class="card-price">${InventoryParser.formatPrice(p.commercial.retailPrice)}</span>
                ${stockBadge}
              </div>
              <div class="card-margin-bar">
                <div class="margin-track">
                  <div class="margin-fill" style="width:${Math.min(margin, 100)}%;background:${mColor}"></div>
                </div>
                <span class="margin-label" style="color:${mColor}">${margin > 0 ? margin.toFixed(0) + '%' : '—'}</span>
              </div>
              ${compHint}
              ${p.commercial.wholesalePrice ? `<div class="card-wholesale">Gros: ${InventoryParser.formatPrice(p.commercial.wholesalePrice)}</div>` : ''}
            </div>
          </div>
        </div>`;
    }
  };

  class DashboardController {
    constructor(store) {
      this.store = store;
      this.store.subscribe((state, changes) => this.onStateChange(state, changes));
    }

    init() {
      // Initialize Three.js graph canvas
      const canvas = document.getElementById('node-canvas');
      if (canvas && typeof GraphEngine !== 'undefined') {
        GraphEngine.init(canvas);
      }

      this.bindEvents();

      if (this.store.loadPersisted()) {
        this.showStatus(`✅ ${this.store.state.products.length} produits (session précédente)`);
        // Hide intro, show graph
        const intro = document.getElementById('intro-screen');
        if (intro) intro.classList.add('hidden');
      }
    }

    showStatus(msg, isError = false) {
      const el = document.getElementById('csv-status-text');
      if (el) {
        el.textContent = msg;
        el.style.color = isError ? '#ef4444' : '';
      }
    }

    onStateChange(state, changes) {
      const hasProducts = state.products.length > 0;

      // List-view visibility toggles (these now live inside #list-view-drawer)
      const el = (id) => document.getElementById(id);
      if (el('controls-section')) el('controls-section').style.display = hasProducts ? '' : 'none';
      if (el('results-info'))     el('results-info').style.display = hasProducts ? '' : 'none';
      if (el('kpi-strip'))        el('kpi-strip').style.display = hasProducts ? '' : 'none';
      if (el('csv-export-btn'))   el('csv-export-btn').disabled = !hasProducts;

      if (!hasProducts) return;

      if (changes.has('analytics') || changes.has('products')) {
        this.updateKPIs(state.analytics);
        this.buildFilters(state.analytics);

        // ── Build the node graph ──
        if (typeof GraphEngine !== 'undefined') {
          GraphEngine.buildGraph(state.products);
        }

        // Hide intro + processing overlays
        const intro = document.getElementById('intro-screen');
        const proc  = document.getElementById('graph-processing');
        if (intro) intro.classList.add('hidden');
        if (proc)  proc.classList.remove('visible');
      }

      // List view grid rendering
      if (changes.has('products') || changes.has('filters') || changes.has('sort') || changes.has('search')) {
        this.renderGrid(state, changes.has('products'));
      }
    }

    updateKPIs(analytics) {
      if (!analytics) return;
      document.getElementById('kpi-retail-value').textContent = InventoryParser.formatPrice(analytics.totalRetailValue);
      document.getElementById('kpi-capital').textContent = InventoryParser.formatPrice(analytics.totalCost);
      document.getElementById('kpi-units').textContent = analytics.totalSKUs.toLocaleString('fr-DZ');

      const total = analytics.stockHealth.normal + analytics.stockHealth.rupture + analytics.stockHealth.faible;
      const bar = document.getElementById('kpi-health-bar');
      if (total > 0 && bar) {
        const normalPct = (analytics.stockHealth.normal / total * 100).toFixed(0);
        const rupturePct = (analytics.stockHealth.rupture / total * 100).toFixed(0);
        const faiblePct = (analytics.stockHealth.faible / total * 100).toFixed(0);
        bar.innerHTML = `
          <div class="health-segments">
            <div class="health-seg health-ok" style="width:${normalPct}%" title="${analytics.stockHealth.normal} Normal"></div>
            <div class="health-seg health-warn" style="width:${faiblePct}%" title="${analytics.stockHealth.faible} Faible"></div>
            <div class="health-seg health-danger" style="width:${rupturePct}%" title="${analytics.stockHealth.rupture} Rupture"></div>
          </div>
          <div class="health-labels">
            <span class="health-label ok">✅ ${analytics.stockHealth.normal}</span>
            <span class="health-label warn">🟡 ${analytics.stockHealth.faible}</span>
            <span class="health-label danger">🔴 ${analytics.stockHealth.rupture}</span>
          </div>`;
      }
    }

    updateHeaderStats(analytics, products) {
      if (!analytics) return;
      // These elements are now optional (removed from graph view header)
      const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      set('stat-products', analytics.totalProducts);
      set('stat-brands', analytics.brands.length);
      set('stat-categories', analytics.categories.length);
      set('stat-margin', analytics.avgMargin);

      if (typeof ProductEnrichments !== 'undefined') {
        const eStats = ProductEnrichments.getStats(products);
        document.getElementById('stat-enriched').textContent = eStats.coverage;
      }
    }

    buildFilters(analytics) {
      const catGroup = document.getElementById('cat-filter-group');
      if (catGroup) {
        catGroup.querySelectorAll('[data-cat]:not([data-cat="all"])').forEach(b => b.remove());
        analytics.categories.forEach(cat => {
          const btn = document.createElement('button');
          btn.className = 'filter-pill';
          btn.dataset.cat = cat.id;
          btn.textContent = `${cat.icon} ${cat.label} (${cat.count})`;
          catGroup.appendChild(btn);
        });
      }

      const brandGroup = document.getElementById('brand-filter-group');
      if (brandGroup) {
        brandGroup.querySelectorAll('[data-brand]:not([data-brand="all"])').forEach(b => b.remove());
        analytics.brands.slice(0, 12).forEach(brand => {
          const btn = document.createElement('button');
          btn.className = 'filter-pill';
          btn.dataset.brand = brand.name;
          btn.textContent = `${brand.name} (${brand.count})`;
          brandGroup.appendChild(btn);
        });
      }
    }

    renderGrid(state, isNewData = false) {
      const filtered = this.store.getFilteredAndSorted();
      const grid = document.getElementById('products-grid');
      const info = document.getElementById('results-count');
      const loader = document.getElementById('grid-loader');

      if (info) {
        info.innerHTML = `<strong>${filtered.length}</strong> produit${filtered.length !== 1 ? 's' : ''} sur ${state.products.length}`;
      }

      if (isNewData && loader) {
        loader.classList.add('active');
        // Clear existing grid items but keep loader
        Array.from(grid.children).forEach(child => {
          if (child !== loader) child.remove();
        });
      }

      const render = () => {
        if (filtered.length === 0 && grid) {
          if (loader) loader.classList.remove('active');
          Array.from(grid.children).forEach(child => {
            if (child !== loader) child.remove();
          });

          const div = document.createElement('div');
          div.className = 'no-results';
          div.innerHTML = `
            <div class="no-results-icon">🔍</div>
            <div class="no-results-text">Aucun produit trouvé</div>
            <div class="no-results-sub">Essayez un autre filtre ou terme de recherche</div>`;
          grid.appendChild(div);
          return;
        }

        if (grid) {
          const html = filtered.map((p, i) => ProductComponents.renderCard(p, i)).join('');
          grid.innerHTML = (loader ? loader.outerHTML : '') + html;
          const newLoader = document.getElementById('grid-loader');
          if (newLoader) newLoader.classList.remove('active');
        }
      };

      if (isNewData) {
        setTimeout(render, 50);
      } else {
        render();
      }
    }

    async handleCSVUpload(csvText, fileName) {
      try {
        // Show processing overlay for graph view
        const proc = document.getElementById('graph-processing');
        if (proc) proc.classList.add('visible');

        this.showStatus('⏳ Analyse adaptative du CSV via IA local...', false);
        
        // 1. Extract sample for LLM mapping
        const lines = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(Boolean);
        if (lines.length < 2) throw new Error("Fichier vide ou invalide");
        
        // Basic split (not accounting for quotes in this crude sample split, just for LLM)
        const headers = lines[0].split(',').map(s => s.trim().replace(/^"|"$/g, ''));
        const sampleRows = lines.slice(1, 4).map(l => {
             const row = l.split(',');
             let obj = {};
             headers.forEach((h, i) => obj[h] = (row[i] || '').trim().replace(/^"|"$/g, ''));
             return obj;
        });

        try {
            const aiMapping = await LLMEngine.adaptCsvMapping(headers, sampleRows);
            console.log("🪄 [AI Mapping Insight] Adaptive Mapping:", aiMapping);
            
            // Map the CSV backwards to the standard format that InventoryParser expects 
            // since InventoryParser expects "Nom", "Prix de Vente (Détail)", "SKU", etc.
            if (aiMapping && aiMapping.name) {
                // We'll rename the headers in the string directly for seamless integration
                if (aiMapping.name) csvText = csvText.replace(aiMapping.name, 'Nom');
                if (aiMapping.price) csvText = csvText.replace(aiMapping.price, 'Prix de Vente (Détail)');
                if (aiMapping.cost) csvText = csvText.replace(aiMapping.cost, "Prix d'Achat");
                if (aiMapping.brand) csvText = csvText.replace(aiMapping.brand, 'Marque');
                if (aiMapping.model) csvText = csvText.replace(aiMapping.model, 'SKU');
                if (aiMapping.stockQty) csvText = csvText.replace(aiMapping.stockQty, 'Quantité en Stock');
            }
        } catch (e) {
            console.warn("⚠️ Mode Adaptatif IA introuvable. Mode classique activé.", e);
        }

        const products = InventoryParser.parse(csvText);
        if (products.length === 0) {
          this.showStatus('⚠️ Aucun produit trouvé dans le fichier.', true);
          return;
        }
        
        this.showStatus('⏳ Activation des catégories dynamiques IA...', false);
        try {
            const sampleSet = products.slice(0, 10).map(p => p.name);
            const aiCats = await LLMEngine.determineCategories(sampleSet);
            console.log("🪄 [AI Hierarchy] Adaptive Categories:", aiCats);
        } catch(e) {}
        
        this.store.setProducts(products);
        this.showStatus(`✅ ${products.length} produits chargés — ${fileName || 'fichier'}`);
      } catch (err) {
        this.showStatus('❌ Erreur: ' + err.message, true);
        console.error(err);
      }
    }

    exportCSV() {
      const products = this.store.state.products;
      const headers = ['ID', 'Marque', 'Nom', 'SKU', 'Catégorie', 'Spec Principale', 'Couleur', 'Caractéristiques', 'Prix Détail', 'Prix Gros', 'Coût', 'Marge %', 'Stock'];
      const esc = v => {
        const s = String(v ?? '');
        return s.includes(',') || s.includes('"') ? '"' + s.replace(/"/g, '""') + '"' : s;
      };
      const rows = [headers.join(',')];
      products.forEach(p => {
        rows.push([p.id, p.brand, p.name, p.model, p.category.label, p.primarySpec || '', p.color || '', Object.values(p.features).join('; '), p.commercial.retailPrice, p.commercial.wholesalePrice, p.commercial.cost, p.commercial.margin, p.commercial.stockQty].map(esc).join(','));
      });
      const blob = new Blob(['\uFEFF' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pkos-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }

    bindEvents() {
      document.getElementById('csv-file-input')?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => this.handleCSVUpload(ev.target.result, file.name);
        reader.readAsText(file, 'UTF-8');
        e.target.value = '';
      });

      document.getElementById('csv-export-btn')?.addEventListener('click', () => this.exportCSV());

      document.getElementById('search-input')?.addEventListener('input', (e) => {
        this.store.setSearch(e.target.value);
      });

      // Filter Delegation
      document.getElementById('category-filters')?.addEventListener('click', (e) => {
        if (!e.target.matches('.filter-pill')) return;
        const btn = e.target;

        // Handle visual activation
        btn.parentElement.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (btn.dataset.cat) this.store.setFilter('category', btn.dataset.cat);
        if (btn.dataset.brand) this.store.setFilter('brand', btn.dataset.brand);
        if (btn.dataset.stock) this.store.setFilter('stock', btn.dataset.stock);
        if (btn.dataset.sort) this.store.setSort(btn.dataset.sort);
      });

      // Delegate modal opens
      document.getElementById('products-grid')?.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        if (card && card.dataset.id) {
          const product = this.store.state.products.find(p => p.id === card.dataset.id);
          if (product) ModalComponent.open(product);
        }
      });

      // Drag & Drop
      const overlay = document.getElementById('drag-overlay');
      if (overlay) {
        let dragCounter = 0;
        document.body.addEventListener('dragenter', (e) => {
          e.preventDefault();
          dragCounter++;
          overlay.classList.add('active');
        });
        document.body.addEventListener('dragleave', () => {
          dragCounter--;
          if (dragCounter === 0) overlay.classList.remove('active');
        });
        document.body.addEventListener('dragover', (e) => e.preventDefault());
        document.body.addEventListener('drop', (e) => {
          e.preventDefault();
          dragCounter = 0;
          overlay.classList.remove('active');
          const file = e.dataTransfer.files[0];
          if (file && (file.name.endsWith('.csv') || file.name.endsWith('.txt'))) {
            const reader = new FileReader();
            reader.onload = (ev) => this.handleCSVUpload(ev.target.result, file.name);
            reader.readAsText(file, 'UTF-8');
          }
        });
      }
    }
  }


  ModalComponent.bind();

  const store = new AppStore();
  const ui = new DashboardController(store);

  document.addEventListener('DOMContentLoaded', () => ui.init());

})();
