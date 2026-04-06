const ModalComponent = {
  renderBody(p) {
    const m = p.commercial;
    const e = p.enrichment;

    return `
      ${e && e.description ? `
      <!-- Enriched Description -->
      <div class="modal-section">
        <div class="modal-section-title">🧠 Intelligence Produit <span class="enriched-badge">Scraped</span></div>
        <div class="enrichment-description">${e.description}</div>
        ${e.metaDescription ? `<div class="enrichment-meta">"${e.metaDescription}"</div>` : ''}
      </div>` : ''}

      <!-- Category & Specs -->
      <div class="modal-section">
        <div class="modal-section-title">📋 Identité Produit</div>
        <div class="modal-specs-grid">
          <div class="modal-spec">
            <div class="modal-spec-label">Catégorie</div>
            <div class="modal-spec-value">${p.category.icon} ${p.category.label}</div>
          </div>
          <div class="modal-spec">
            <div class="modal-spec-label">Marque</div>
            <div class="modal-spec-value highlight">${p.brand}</div>
          </div>
          ${p.primarySpec ? `
          <div class="modal-spec">
            <div class="modal-spec-label">Spec. Principale</div>
            <div class="modal-spec-value highlight">${p.primarySpec}</div>
          </div>` : ''}
          ${p.color ? `
          <div class="modal-spec">
            <div class="modal-spec-label">Couleur</div>
            <div class="modal-spec-value"><span class="color-dot" style="background:${p.colorHex}"></span> ${p.color}</div>
          </div>` : ''}
          ${p.specs.material ? `
          <div class="modal-spec">
            <div class="modal-spec-label">Matériau</div>
            <div class="modal-spec-value">${p.specs.material}</div>
          </div>` : ''}
        </div>
      </div>

      ${e && e.coreAttributes && e.categoryId && typeof CategorySchema !== 'undefined' && CategorySchema.hasSchema(e.categoryId) ? (() => {
        const template = CategorySchema.getTemplate(e.categoryId);
        const attrs = e.coreAttributes;
        const attrDefs = Object.entries(template.coreAttributes)
          .sort((a, b) => a[1].priority - b[1].priority);
        return `
      <!-- Category-Aware Technical Specs -->
      <div class="modal-section">
        <div class="modal-section-title">
          ⚙️ Fiche Technique 
          <span class="enriched-badge ${e.matchedBy === 'auto' ? 'auto-badge' : ''}">
            ${e.matchedBy === 'auto' ? '🔮 AI Auto-Scan' : '🧠 Expert Data'}
          </span>
          <span class="enriched-badge-category">${template.icon} ${template.label}</span>
        </div>
        <div class="layered-specs-grid">
          ${attrDefs.map(([key, def]) => {
          const val = attrs[key];
          if (val === undefined || val === null) return '';
          const displayVal = CategorySchema.formatAttributeValue(key, val, def);
          const filterBadge = def.filterable ? '<span class="attr-filter-badge">🔍</span>' : '';
          return `<div class="layered-spec-row${def.filterable ? ' filterable' : ''}">
              <span class="layered-spec-key">${def.label} ${filterBadge}</span>
              <span class="layered-spec-val">${displayVal}</span>
            </div>`;
        }).filter(Boolean).join('')}
        </div>
      </div>`;
      })() : e && e.specs ? `
      <!-- Fallback: Generic Specs -->
      <div class="modal-section">
        <div class="modal-section-title">⚙️ Fiche Technique <span class="enriched-badge">Scraped</span></div>
        <div class="scraped-specs-grid">
          ${Object.entries(e.specs).filter(([k, v]) => typeof v === 'string').map(([k, v]) =>
        `<div class="scraped-spec-row">
              <span class="scraped-spec-key">${k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span>
              <span class="scraped-spec-val">${v}</span>
            </div>`
      ).join('')}
        </div>
      </div>` : ''}

      ${e && e.intelligence ? (() => {
        const intel = e.intelligence;
        return `
      <!-- AI Intelligence: Pros & Cons -->
      <div class="modal-section">
        <div class="modal-section-title">🤖 Analyse Intelligence <span class="enriched-badge ai-badge">AI Generated</span></div>
        <div class="intel-buyer-fit" style="background: linear-gradient(135deg, rgba(139,92,246,0.12), rgba(99,102,241,0.08));">
          <div class="intel-buyer-label">Verdict Acheteur</div>
          <div class="intel-buyer-text">${intel.buyerFit}</div>
          <div class="intel-position-badge ${intel.pricePosition}">${intel.pricePosition === 'budget' ? '💰 Budget' : intel.pricePosition === 'premium' ? '👑 Premium' : '⚖️ Milieu de gamme'}</div>
        </div>
        <div class="pros-cons-grid">
          <div class="pros-panel">
            <div class="pros-title">✅ Avantages</div>
            ${intel.pros.length > 0 ? intel.pros.map(p => `<div class="pro-item">✔ ${p}</div>`).join('') : '<div class="pro-item muted">Aucun avantage notable détecté</div>'}
          </div>
          <div class="cons-panel">
            <div class="cons-title">⚠️ Faiblesses</div>
            ${intel.cons.length > 0 ? intel.cons.map(c => `<div class="con-item">✖ ${c}</div>`).join('') : '<div class="con-item muted">Aucune faiblesse notable détectée</div>'}
          </div>
        </div>
      </div>`;
      })() : ''}

      ${p.features.length > 0 ? `
      <div class="modal-section">
        <div class="modal-section-title">✨ Caractéristiques</div>
        <div class="modal-features">
          ${p.features.map(f => `<span class="modal-feature-tag">${f}</span>`).join('')}
        </div>
      </div>` : ''}

      <!-- Commercial Intelligence -->
      <div class="modal-section">
        <div class="modal-section-title">💰 Intelligence Commerciale</div>
        <div class="commercial-grid">
          <div class="comm-card">
            <div class="comm-label">Prix Détail</div>
            <div class="comm-value comm-big">${InventoryParser.formatPrice(m.retailPrice)}</div>
          </div>
          <div class="comm-card">
            <div class="comm-label">Prix Gros</div>
            <div class="comm-value">${InventoryParser.formatPrice(m.wholesalePrice)}</div>
            <div class="comm-sub">Remise: ${m.wholesaleDiscount}%</div>
          </div>
          <div class="comm-card">
            <div class="comm-label">Coût Réel (CUMP)</div>
            <div class="comm-value">${InventoryParser.formatPrice(m.cost)}</div>
          </div>
          <div class="comm-card comm-margin" style="border-color:${InventoryParser.marginColor(m.margin)}">
            <div class="comm-label">Marge</div>
            <div class="comm-value comm-big" style="color:${InventoryParser.marginColor(m.margin)}">${m.margin}%</div>
            <div class="comm-sub">Markup: ${m.markup}%</div>
          </div>
        </div>
      </div>

      ${e && e.competitorPrices && e.competitorPrices.length > 0 ? `
      <!-- Competitor Prices with Source Links -->
      <div class="modal-section">
        <div class="modal-section-title">📊 Prix Marché <span class="enriched-badge">Web Scraped</span></div>
        <div class="competitor-table">
          ${e.competitorPrices.map(c => {
        const diff = m.retailPrice > 0 && c.price > 0 ? m.retailPrice - c.price : null;
        const pct = diff !== null && m.retailPrice > 0 ? Math.round(diff / m.retailPrice * 100) : null;
        const diffColor = diff === null ? '#9898a8' : diff > 0 ? '#22c55e' : diff < 0 ? '#ef4444' : '#9898a8';
        const diffLabel = pct !== null ? (diff > 0 ? `+${pct}%` : `${pct}%`) : '—';
        const priceLabel = c.price > 0 ? InventoryParser.formatPrice(c.price) : 'Prix non extrait';
        const linkHtml = c.url
          ? `<a class="comp-link" href="${c.url}" target="_blank" rel="noopener noreferrer" title="Voir sur ${c.source}">🔗 Voir →</a>`
          : '';
        return `<div class="comp-row comp-row-linked">
              <div class="comp-info">
                <span class="comp-source">${c.source}</span>
                ${linkHtml}
              </div>
              <span class="comp-price">${priceLabel}</span>
              <span class="comp-diff" style="color:${diffColor}">${diffLabel}</span>
            </div>`;
      }).join('')}
        </div>
      </div>` : ''}

      ${e && e._sourceLinks && e._sourceLinks.length > 0 ? `
      <!-- All Scraped Source Links -->
      <div class="modal-section">
        <div class="modal-section-title">🌐 Sources Web Consultées <span class="enriched-badge">Live</span></div>
        <div class="sources-list">
          ${e._sourceLinks.map(s => `
          <a class="source-link" href="${s.url}" target="_blank" rel="noopener noreferrer">
            <span class="source-name">${s.title || s.url}</span>
            ${s.snippet ? `<span class="source-snippet">${s.snippet.substring(0, 100)}...</span>` : ''}
            <span class="source-arrow">→</span>
          </a>`).join('')}
        </div>
      </div>` : ''}

      <!-- Stock Intelligence -->
      <div class="modal-section">
        <div class="modal-section-title">📦 Stock</div>
        <div class="modal-specs-grid">
          <div class="modal-spec">
            <div class="modal-spec-label">Quantité</div>
            <div class="modal-spec-value">${m.stockQty}</div>
          </div>
          <div class="modal-spec">
            <div class="modal-spec-label">Statut</div>
            <div class="modal-spec-value" style="color:${InventoryParser.stockColor(m.stockStatus)}">${m.stockStatus}</div>
          </div>
          <div class="modal-spec">
            <div class="modal-spec-label">Valeur Stock</div>
            <div class="modal-spec-value">${InventoryParser.formatPrice(m.stockValue)}</div>
          </div>
        </div>
      </div>

      ${e && e.sources && e.sources.length > 0 ? `
      <!-- Sources -->
      <div class="modal-section">
        <div class="modal-section-title">🔗 Sources <span class="enriched-badge">Scraped</span></div>
        <div class="sources-list">
          ${e.sources.map(s =>
        `<a class="source-link" href="${s.url}" target="_blank" rel="noopener">
              <span class="source-type-badge source-type-${s.type}">${s.type === 'official' ? '🏢' : s.type === 'marketplace' ? '🛒' : '🏪'}</span>
              <span class="source-name">${s.name}</span>
              <span class="source-arrow">→</span>
            </a>`
      ).join('')}
        </div>
      </div>` : ''}
    `;
  },

  open(p) {
    this.currentProduct = p;
    document.getElementById('modal-brand').textContent = p.brand;
    document.getElementById('modal-name').textContent = p.name;
    document.getElementById('modal-model').innerHTML = `SKU: <span class="copy-sku" title="Cliquer pour copier">${p.model}</span> | Code Barre: ${p.barcode || '—'}
    <button id="ai-enrich-btn" class="ai-enrich-btn" style="margin-top:10px; padding:6px 12px; background:linear-gradient(135deg, #6366f1, #8b5cf6); border:none; border-radius:6px; color:white; cursor:pointer;" onclick="ModalComponent.enrichWithAI()">✨ Enrichir avec l'IA</button>`;

    // Bind copy SKU
    document.querySelector('.copy-sku')?.addEventListener('click', function () {
      navigator.clipboard.writeText(p.model);
      const originalText = this.innerHTML;
      this.textContent = 'Copié !';
      this.classList.add('copied');
      setTimeout(() => {
        this.textContent = originalText;
        this.classList.remove('copied');
      }, 2000);
    });

    document.getElementById('modal-body').innerHTML = this.renderBody(p);

    document.getElementById('modal-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  async enrichWithAI() {
     const p = this.currentProduct;
     const btn = document.getElementById('ai-enrich-btn');
     if (!p || !btn) return;

     btn.innerHTML = '⏳ Scraping + IA...';
     btn.disabled = true;
     btn.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';

     try {
         const insight = await LLMEngine.enrichProductData(p);

         if (insight && !insight.error) {
             p.enrichment = p.enrichment || {};
             if (insight.description)       p.enrichment.description      = insight.description;
             if (insight.ai_insights)       p.enrichment.intelligence     = insight.ai_insights;
             if (insight.specs)             p.enrichment.specs            = insight.specs;
             if (insight.competitorPrices)  p.enrichment.competitorPrices = insight.competitorPrices;
             if (insight._sourceLinks)      p.enrichment._sourceLinks     = insight._sourceLinks;
             p.enrichment.matchedBy = 'ai-local';

             // Update the button BEFORE re-rendering body (btn lives in modal-model header, not modal-body)
             btn.innerHTML = '✅ Enrichi par IA';
             btn.disabled = true;
             btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

             // Re-render only the body section
             document.getElementById('modal-body').innerHTML = this.renderBody(p);

         } else {
             btn.disabled = false;
             btn.innerHTML = '⚠️ ' + (insight && insight.error ? insight.error : 'Erreur IA');
             btn.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
         }
     } catch (e) {
         console.error('[PKOS AI Enrichment Error]', e);
         if (btn) {
             btn.disabled = false;
             btn.innerHTML = '❌ ' + e.message.substring(0, 55);
             btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
         }
     }
  },

  close() {
    document.getElementById('modal-overlay').classList.remove('active');
    document.body.style.overflow = '';
  },

  bind() {
    document.getElementById('modal-close')?.addEventListener('click', () => this.close());
    document.getElementById('modal-overlay')?.addEventListener('click', e => {
      if (e.target === e.currentTarget) this.close();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.close();
    });
  }
};
