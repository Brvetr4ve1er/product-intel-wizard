/**
 * ═══════════════════════════════════════════════════════════════
 *  PKOS Graph Engine — Three.js Force-Directed Node Graph
 *  Obsidian-style drill-down: Categories → Brands → Products
 *  Pure rendering layer — zero coupling to parsers/enrichment
 * ═══════════════════════════════════════════════════════════════
 */
const GraphEngine = (() => {
    'use strict';

    // ── Three.js scene objects ──────────────────────────────────
    let scene, camera, renderer, raycaster, mouse;
    let animFrameId = null;
    let canvasEl = null;

    // ── State ───────────────────────────────────────────────────
    let allProducts = [];
    let graphNodes = [];       // currently visible nodes
    let graphEdges = [];       // currently visible edges
    let edgeLines = null;      // Three.js LineSegments
    let currentLevel = 'root'; // 'root' | 'category' | 'brand'
    let currentFilter = null;  // { category: 'TV' } or { category: 'TV', brand: 'Samsung' }
    let hoveredNode = null;
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let cameraTarget = { x: 0, y: 0 };
    let cameraZoomTarget = 1;

    // ── Physics config ─────────────────────────────────────────
    const REPULSION = 1200;
    const SPRING_K = 0.008;
    const SPRING_LEN = 180;
    const DAMPING = 0.88;
    const CENTER_GRAVITY = 0.002;

    // ── Color palette ──────────────────────────────────────────
    const CATEGORY_COLORS = [
        0x8b5cf6, 0x6366f1, 0x3b82f6, 0x06b6d4, 0x14b8a6,
        0x22c55e, 0xeab308, 0xf97316, 0xef4444, 0xec4899,
        0xa855f7, 0x0ea5e9, 0x84cc16, 0xf59e0b, 0xe11d48,
        0x7c3aed, 0x2563eb, 0x0891b2, 0x059669, 0xd97706
    ];

    // ══════════════════════════════════════════════════════════
    //  INIT
    // ══════════════════════════════════════════════════════════
    function init(canvas) {
        canvasEl = canvas;
        const W = window.innerWidth;
        const H = window.innerHeight;

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x08080e);

        camera = new THREE.OrthographicCamera(
            -W / 2, W / 2, H / 2, -H / 2, 1, 1000
        );
        camera.position.z = 500;
        camera.zoom = 1;

        renderer = new THREE.WebGLRenderer({
            canvas: canvasEl,
            antialias: true,
            alpha: true
        });
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        raycaster = new THREE.Raycaster();
        raycaster.params.Points = { threshold: 20 };
        mouse = new THREE.Vector2();

        // ── Ambient particles ──
        _createBackgroundParticles();

        // ── Events ──
        canvasEl.addEventListener('mousemove', _onMouseMove);
        canvasEl.addEventListener('click', _onClick);
        canvasEl.addEventListener('mousedown', _onMouseDown);
        canvasEl.addEventListener('mouseup', _onMouseUp);
        canvasEl.addEventListener('wheel', _onWheel, { passive: false });
        window.addEventListener('resize', _onResize);

        _animate();
    }

    // ══════════════════════════════════════════════════════════
    //  BUILD GRAPH from product data
    // ══════════════════════════════════════════════════════════
    function buildGraph(products) {
        allProducts = products;
        currentLevel = 'root';
        currentFilter = null;
        _showCategoryLevel();
        _updateHUD();
        _showBackBtn(false);

        // Show HUD + info badges
        const hud = document.getElementById('graph-hud');
        const info = document.getElementById('graph-info');
        const toggle = document.getElementById('view-toggle');
        if (hud) hud.classList.add('visible');
        if (info) info.classList.add('visible');
        if (toggle) toggle.classList.add('visible');
    }

    // ── LEVEL 1: Category nodes ────────────────────────────────
    function _showCategoryLevel() {
        _clearScene();
        currentLevel = 'root';
        currentFilter = null;

        // Group products by category
        const catMap = new Map();
        allProducts.forEach(p => {
            const cat = p.category ? p.category.label : 'Autre';
            if (!catMap.has(cat)) catMap.set(cat, { label: cat, icon: p.category ? p.category.icon : '📦', count: 0, products: [] });
            catMap.get(cat).count++;
            catMap.get(cat).products.push(p);
        });

        let i = 0;
        const cats = Array.from(catMap.values()).sort((a, b) => b.count - a.count);
        const total = cats.length;

        cats.forEach(cat => {
            const angle = (i / total) * Math.PI * 2;
            const radius = 200 + Math.random() * 100;
            const size = Math.max(12, Math.min(40, 8 + cat.count * 0.6));
            const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length];

            const node = _createNode({
                id: 'cat_' + cat.label,
                label: cat.label,
                icon: cat.icon,
                sublabel: cat.count + ' produits',
                type: 'category',
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
                size: size,
                color: color,
                data: cat
            });

            graphNodes.push(node);
            i++;
        });

        // Edges: link nearby categories for visual web
        _buildProximityEdges(0.5);

        _updateEdgeGeometry();
        _showBackBtn(false);
        _animateCameraTo(0, 0, 1);
    }

    // ── LEVEL 2: Brand nodes within a category ─────────────────
    function _showBrandLevel(categoryLabel) {
        _clearScene();
        currentLevel = 'category';
        currentFilter = { category: categoryLabel };

        const products = allProducts.filter(p =>
            (p.category ? p.category.label : 'Autre') === categoryLabel
        );

        // Group by brand
        const brandMap = new Map();
        products.forEach(p => {
            const b = p.brand || 'Sans marque';
            if (!brandMap.has(b)) brandMap.set(b, { label: b, count: 0, products: [] });
            brandMap.get(b).count++;
            brandMap.get(b).products.push(p);
        });

        const brands = Array.from(brandMap.values()).sort((a, b) => b.count - a.count);
        const total = brands.length;

        // Center "parent" node for context
        const parentNode = _createNode({
            id: 'parent_cat',
            label: categoryLabel,
            sublabel: products.length + ' produits',
            type: 'category-parent',
            x: 0, y: 0,
            size: 24,
            color: 0x6366f1,
            data: null
        });
        graphNodes.push(parentNode);

        let i = 0;
        brands.forEach(brand => {
            const angle = (i / total) * Math.PI * 2;
            const radius = 150 + Math.random() * 80;
            const size = Math.max(8, Math.min(28, 6 + brand.count * 1.5));
            const color = CATEGORY_COLORS[(i + 5) % CATEGORY_COLORS.length];

            const node = _createNode({
                id: 'brand_' + brand.label,
                label: brand.label,
                sublabel: brand.count + ' produits',
                type: 'brand',
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
                size: size,
                color: color,
                data: brand
            });
            graphNodes.push(node);

            // Edge from parent → brand
            graphEdges.push({ from: parentNode, to: node });
            i++;
        });

        _updateEdgeGeometry();
        _showBackBtn(true);
        _animateCameraTo(0, 0, 1.2);
    }

    // ── LEVEL 3: Product nodes within a brand ──────────────────
    function _showProductLevel(categoryLabel, brandLabel) {
        _clearScene();
        currentLevel = 'brand';
        currentFilter = { category: categoryLabel, brand: brandLabel };

        const products = allProducts.filter(p =>
            (p.category ? p.category.label : 'Autre') === categoryLabel &&
            (p.brand || 'Sans marque') === brandLabel
        );

        // Center "parent" brand node
        const parentNode = _createNode({
            id: 'parent_brand',
            label: brandLabel,
            sublabel: products.length + ' produits',
            type: 'brand-parent',
            x: 0, y: 0,
            size: 20,
            color: 0x6366f1,
            data: null
        });
        graphNodes.push(parentNode);

        products.forEach((product, i) => {
            const total = products.length;
            const angle = (i / total) * Math.PI * 2;
            const radius = 120 + Math.random() * 60;
            const size = 6;
            const margin = product.commercial ? product.commercial.margin : 0;

            // Color-code by margin: red < 15% < yellow < 30% < green
            let color;
            if (margin < 15) color = 0xef4444;
            else if (margin < 30) color = 0xeab308;
            else color = 0x22c55e;

            const node = _createNode({
                id: 'prod_' + (product.model || i),
                label: product.name || product.model || 'Produit',
                sublabel: product.commercial ? InventoryParser.formatPrice(product.commercial.retailPrice) : '',
                type: 'product',
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
                size: size,
                color: color,
                data: product
            });
            graphNodes.push(node);
            graphEdges.push({ from: parentNode, to: node });
        });

        _updateEdgeGeometry();
        _showBackBtn(true);
        _animateCameraTo(0, 0, Math.max(0.6, 2 - products.length * 0.02));
    }

    // ══════════════════════════════════════════════════════════
    //  NODE FACTORY
    // ══════════════════════════════════════════════════════════
    function _createNode(config) {
        const geometry = new THREE.CircleGeometry(config.size, 32);
        const material = new THREE.MeshBasicMaterial({
            color: config.color,
            transparent: true,
            opacity: 0.85
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(config.x, config.y, 0);
        scene.add(mesh);

        // Glow ring
        const glowGeo = new THREE.RingGeometry(config.size, config.size + 3, 32);
        const glowMat = new THREE.MeshBasicMaterial({
            color: config.color,
            transparent: true,
            opacity: 0.25
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        glow.position.copy(mesh.position);
        scene.add(glow);

        // Label sprite
        const labelSprite = _createTextSprite(config.label, config.size);
        labelSprite.position.set(config.x, config.y - config.size - 12, 0);
        scene.add(labelSprite);

        const node = {
            ...config,
            mesh,
            glow,
            labelSprite,
            vx: 0, vy: 0,
            targetScale: 1,
            currentScale: 0.01
        };

        // Store ref on mesh for raycasting
        mesh.userData.node = node;
        return node;
    }

    // ── Text Sprite ────────────────────────────────────────────
    function _createTextSprite(text, nodeSize) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const fontSize = Math.max(11, Math.min(16, nodeSize * 0.8));
        const maxWidth = 200;

        canvas.width = 256;
        canvas.height = 40;

        ctx.font = `600 ${fontSize}px Inter, sans-serif`;
        ctx.fillStyle = 'rgba(241, 245, 249, 0.85)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // Truncate if needed
        let displayText = text;
        if (ctx.measureText(text).width > maxWidth) {
            while (ctx.measureText(displayText + '…').width > maxWidth && displayText.length > 0) {
                displayText = displayText.slice(0, -1);
            }
            displayText += '…';
        }

        ctx.fillText(displayText, 128, 4);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.9 });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(128, 20, 1);
        return sprite;
    }

    // ── Proximity edges ────────────────────────────────────────
    function _buildProximityEdges(density) {
        graphEdges = [];
        for (let i = 0; i < graphNodes.length; i++) {
            for (let j = i + 1; j < graphNodes.length; j++) {
                if (Math.random() < density) {
                    graphEdges.push({ from: graphNodes[i], to: graphNodes[j] });
                }
            }
        }
    }

    // ── Edge geometry ──────────────────────────────────────────
    function _updateEdgeGeometry() {
        if (edgeLines) {
            scene.remove(edgeLines);
            edgeLines.geometry.dispose();
            edgeLines.material.dispose();
        }
        if (graphEdges.length === 0) return;

        const positions = new Float32Array(graphEdges.length * 6);
        graphEdges.forEach((edge, i) => {
            const a = edge.from.mesh.position;
            const b = edge.to.mesh.position;
            positions[i * 6 + 0] = a.x;
            positions[i * 6 + 1] = a.y;
            positions[i * 6 + 2] = 0;
            positions[i * 6 + 3] = b.x;
            positions[i * 6 + 4] = b.y;
            positions[i * 6 + 5] = 0;
        });

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const mat = new THREE.LineBasicMaterial({
            color: 0x6366f1,
            transparent: true,
            opacity: 0.12
        });
        edgeLines = new THREE.LineSegments(geo, mat);
        scene.add(edgeLines);
    }

    // ══════════════════════════════════════════════════════════
    //  PHYSICS (simple force-directed on CPU)
    // ══════════════════════════════════════════════════════════
    function _tickPhysics() {
        const N = graphNodes.length;
        for (let i = 0; i < N; i++) {
            const a = graphNodes[i];
            if (a.type === 'category-parent' || a.type === 'brand-parent') continue;

            // Repulsion
            for (let j = i + 1; j < N; j++) {
                const b = graphNodes[j];
                let dx = a.mesh.position.x - b.mesh.position.x;
                let dy = a.mesh.position.y - b.mesh.position.y;
                let distSq = dx * dx + dy * dy;
                if (distSq < 1) distSq = 1;
                const force = REPULSION / distSq;
                const dist = Math.sqrt(distSq);
                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;
                a.vx += fx;
                a.vy += fy;
                if (b.type !== 'category-parent' && b.type !== 'brand-parent') {
                    b.vx -= fx;
                    b.vy -= fy;
                }
            }

            // Center gravity
            a.vx -= a.mesh.position.x * CENTER_GRAVITY;
            a.vy -= a.mesh.position.y * CENTER_GRAVITY;
        }

        // Spring forces along edges
        graphEdges.forEach(edge => {
            const a = edge.from;
            const b = edge.to;
            const dx = b.mesh.position.x - a.mesh.position.x;
            const dy = b.mesh.position.y - a.mesh.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const displacement = dist - SPRING_LEN;
            const fx = (dx / dist) * displacement * SPRING_K;
            const fy = (dy / dist) * displacement * SPRING_K;

            if (a.type !== 'category-parent' && a.type !== 'brand-parent') {
                a.vx += fx;
                a.vy += fy;
            }
            if (b.type !== 'category-parent' && b.type !== 'brand-parent') {
                b.vx -= fx;
                b.vy -= fy;
            }
        });

        // Apply velocity
        graphNodes.forEach(node => {
            if (node.type === 'category-parent' || node.type === 'brand-parent') return;
            node.vx *= DAMPING;
            node.vy *= DAMPING;
            node.mesh.position.x += node.vx;
            node.mesh.position.y += node.vy;

            // Sync glow + label
            node.glow.position.copy(node.mesh.position);
            node.labelSprite.position.set(node.mesh.position.x, node.mesh.position.y - node.size - 12, 0);
        });

        // Update edge positions
        if (edgeLines && edgeLines.geometry) {
            const pos = edgeLines.geometry.attributes.position;
            if (pos) {
                graphEdges.forEach((edge, i) => {
                    pos.array[i * 6 + 0] = edge.from.mesh.position.x;
                    pos.array[i * 6 + 1] = edge.from.mesh.position.y;
                    pos.array[i * 6 + 3] = edge.to.mesh.position.x;
                    pos.array[i * 6 + 4] = edge.to.mesh.position.y;
                });
                pos.needsUpdate = true;
            }
        }
    }

    // ══════════════════════════════════════════════════════════
    //  ANIMATION LOOP
    // ══════════════════════════════════════════════════════════
    function _animate() {
        animFrameId = requestAnimationFrame(_animate);

        _tickPhysics();

        // Spawn-in animation (scale 0 → 1)
        graphNodes.forEach(node => {
            if (node.currentScale < node.targetScale) {
                node.currentScale += (node.targetScale - node.currentScale) * 0.08;
                const s = node.currentScale;
                node.mesh.scale.set(s, s, 1);
                node.glow.scale.set(s, s, 1);
                node.labelSprite.material.opacity = Math.min(s, 0.9);
            }
        });

        // Smooth camera pan + zoom
        const cx = camera.position.x + (cameraTarget.x - camera.position.x) * 0.06;
        const cy = camera.position.y + (cameraTarget.y - camera.position.y) * 0.06;
        camera.position.x = cx;
        camera.position.y = cy;
        camera.zoom += (cameraZoomTarget - camera.zoom) * 0.06;
        camera.updateProjectionMatrix();

        // Hover glow pulse
        graphNodes.forEach(node => {
            const isHovered = hoveredNode === node;
            const targetOpacity = isHovered ? 0.5 : 0.25;
            node.glow.material.opacity += (targetOpacity - node.glow.material.opacity) * 0.1;
            const sc = isHovered ? 1.08 : 1;
            node.mesh.scale.x += (sc - node.mesh.scale.x) * 0.1;
            node.mesh.scale.y += (sc - node.mesh.scale.y) * 0.1;
        });

        renderer.render(scene, camera);
    }

    // ══════════════════════════════════════════════════════════
    //  CAMERA
    // ══════════════════════════════════════════════════════════
    function _animateCameraTo(x, y, zoom) {
        cameraTarget.x = x;
        cameraTarget.y = y;
        cameraZoomTarget = zoom;
    }

    // ══════════════════════════════════════════════════════════
    //  EVENTS
    // ══════════════════════════════════════════════════════════
    function _onMouseMove(event) {
        const rect = canvasEl.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const meshes = graphNodes.map(n => n.mesh);
        const intersects = raycaster.intersectObjects(meshes);

        const tooltip = document.getElementById('node-tooltip');

        if (intersects.length > 0) {
            const node = intersects[0].object.userData.node;
            hoveredNode = node;
            canvasEl.style.cursor = 'pointer';

            if (tooltip) {
                tooltip.classList.add('visible');
                tooltip.style.left = (event.clientX + 14) + 'px';
                tooltip.style.top = (event.clientY - 10) + 'px';
                tooltip.querySelector('.tooltip-label').textContent = node.label;
                tooltip.querySelector('.tooltip-sub').textContent = node.sublabel || '';
            }
        } else {
            hoveredNode = null;
            canvasEl.style.cursor = 'default';
            if (tooltip) tooltip.classList.remove('visible');
        }

        // Camera drag
        if (isDragging) {
            const dx = (event.clientX - dragStart.x) / camera.zoom;
            const dy = -(event.clientY - dragStart.y) / camera.zoom;
            cameraTarget.x -= dx * 0.5;
            cameraTarget.y -= dy * 0.5;
            dragStart.x = event.clientX;
            dragStart.y = event.clientY;
        }
    }

    function _onMouseDown(event) {
        if (!hoveredNode) {
            isDragging = true;
            dragStart.x = event.clientX;
            dragStart.y = event.clientY;
        }
    }

    function _onMouseUp() {
        isDragging = false;
    }

    function _onClick() {
        if (!hoveredNode) return;
        const node = hoveredNode;

        if (node.type === 'category') {
            _showBrandLevel(node.data.label);
            _updateHUD();
        } else if (node.type === 'brand') {
            const catLabel = currentFilter ? currentFilter.category : 'Autre';
            _showProductLevel(catLabel, node.data.label);
            _updateHUD();
        } else if (node.type === 'product') {
            // Open existing modal
            if (typeof ModalComponent !== 'undefined') {
                ModalComponent.open(node.data);
            }
        } else if (node.type === 'category-parent') {
            goBack();
        } else if (node.type === 'brand-parent') {
            goBack();
        }
    }

    function _onWheel(event) {
        event.preventDefault();
        const delta = event.deltaY > 0 ? -0.08 : 0.08;
        cameraZoomTarget = Math.max(0.3, Math.min(3, cameraZoomTarget + delta));
    }

    function _onResize() {
        const W = window.innerWidth;
        const H = window.innerHeight;
        camera.left = -W / 2;
        camera.right = W / 2;
        camera.top = H / 2;
        camera.bottom = -H / 2;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H);
    }

    // ══════════════════════════════════════════════════════════
    //  NAVIGATION
    // ══════════════════════════════════════════════════════════
    function goBack() {
        if (currentLevel === 'brand' && currentFilter) {
            _showBrandLevel(currentFilter.category);
        } else {
            _showCategoryLevel();
        }
        _updateHUD();
    }

    // ══════════════════════════════════════════════════════════
    //  HUD
    // ══════════════════════════════════════════════════════════
    function _updateHUD() {
        const bc = document.getElementById('hud-breadcrumb');
        const kpis = document.getElementById('hud-kpis');
        const info = document.getElementById('graph-info');
        if (!bc) return;

        let crumbs = '<span class="hud-crumb" onclick="GraphEngine.goBack()">🏠 Tous</span>';

        let products = allProducts;
        if (currentFilter) {
            if (currentFilter.category) {
                crumbs += '<span class="hud-crumb-sep">›</span>';
                crumbs += `<span class="hud-crumb ${!currentFilter.brand ? 'active' : ''}" onclick="GraphEngine._showBrandLevel('${currentFilter.category}'); GraphEngine._updateHUD();">${currentFilter.category}</span>`;
                products = allProducts.filter(p => (p.category ? p.category.label : 'Autre') === currentFilter.category);
            }
            if (currentFilter.brand) {
                crumbs += '<span class="hud-crumb-sep">›</span>';
                crumbs += `<span class="hud-crumb active">${currentFilter.brand}</span>`;
                products = products.filter(p => (p.brand || 'Sans marque') === currentFilter.brand);
            }
        }

        bc.innerHTML = crumbs;

        // Calculate KPIs for current set
        const count = products.length;
        const avgMargin = count > 0 ? (products.reduce((s, p) => s + (p.commercial ? p.commercial.margin : 0), 0) / count).toFixed(1) : 0;
        const totalValue = products.reduce((s, p) => s + (p.commercial ? p.commercial.stockValue : 0), 0);

        if (kpis) {
            kpis.innerHTML = `
                <div class="hud-kpi"><div class="hud-kpi-label">Produits</div><div class="hud-kpi-value accent">${count}</div></div>
                <div class="hud-kpi"><div class="hud-kpi-label">Marge Moy.</div><div class="hud-kpi-value">${avgMargin}%</div></div>
                <div class="hud-kpi"><div class="hud-kpi-label">Valeur</div><div class="hud-kpi-value">${_formatCompact(totalValue)}</div></div>
            `;
        }

        if (info) {
            info.innerHTML = `
                <div class="info-badge"><span class="count">${allProducts.length}</span> Produits</div>
                <div class="info-badge"><span class="count">${new Set(allProducts.map(p => p.brand)).size}</span> Marques</div>
            `;
        }
    }

    function _formatCompact(num) {
        if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M DA';
        if (num >= 1e3) return (num / 1e3).toFixed(0) + 'K DA';
        return num + ' DA';
    }

    function _showBackBtn(show) {
        const btn = document.getElementById('graph-back-btn');
        if (btn) btn.classList.toggle('visible', show);
    }

    // ══════════════════════════════════════════════════════════
    //  CLEANUP
    // ══════════════════════════════════════════════════════════
    function _clearScene() {
        graphNodes.forEach(node => {
            scene.remove(node.mesh);
            scene.remove(node.glow);
            scene.remove(node.labelSprite);
            node.mesh.geometry.dispose();
            node.mesh.material.dispose();
            node.glow.geometry.dispose();
            node.glow.material.dispose();
            node.labelSprite.material.map.dispose();
            node.labelSprite.material.dispose();
        });

        if (edgeLines) {
            scene.remove(edgeLines);
            edgeLines.geometry.dispose();
            edgeLines.material.dispose();
            edgeLines = null;
        }

        graphNodes = [];
        graphEdges = [];
        hoveredNode = null;
    }

    // ── Background particle field ──────────────────────────────
    function _createBackgroundParticles() {
        const count = 300;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3]     = (Math.random() - 0.5) * 2000;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
            positions[i * 3 + 2] = -10;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const mat = new THREE.PointsMaterial({
            color: 0x6366f1,
            size: 2,
            transparent: true,
            opacity: 0.15
        });
        const particles = new THREE.Points(geo, mat);
        scene.add(particles);
    }

    // ══════════════════════════════════════════════════════════
    //  PUBLIC API
    // ══════════════════════════════════════════════════════════
    return {
        init,
        buildGraph,
        goBack,
        // Exposed for HUD onclick callbacks
        _showBrandLevel,
        _showProductLevel,
        _updateHUD
    };
})();
