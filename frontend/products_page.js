(function() {
    'use strict';

    
    const DRINK_PHOTOS = {
        'classic milk tea': '/images/products/classic-milk-tea.svg',
        'brown sugar boba': '/images/products/brown-sugar-boba.svg',
        'matcha latte': '/images/products/matcha-latte.svg',
        'green matcha': '/images/products/green-matcha.svg',
        'taro milk tea': '/images/products/taro-milk-tea.svg',
        'thai tea': '/images/products/thai-tea.svg',
        'mango green tea': '/images/products/mango-green-tea.svg',
        'strawberry fruit tea': '/images/products/strawberry-tea.svg',
        'passion fruit tea': '/images/products/passion-fruit-tea.svg',
        'taro smoothie': '/images/products/taro-smoothie.svg',
        'mango smoothie': '/images/products/mango-smoothie.svg',
        'oreo smoothie': '/images/products/oreo-smoothie.svg',
        'tapioca pearls (black)': '/images/products/tapioca-pearls.svg',
        'tapioca pearls': '/images/products/tapioca-pearls.svg',
        'egg pudding': '/images/products/egg-pudding.svg',
        'grass jelly': '/images/products/grass-jelly.svg',
        'premium black tea leaves': '/images/products/tea-leaves.svg',
        'fresh milk (full cream)': '/images/products/fresh-milk.svg',
        'fresh milk': '/images/products/fresh-milk.svg',
        'brown sugar syrup': '/images/products/brown-sugar-syrup.svg',
        'cream cheese powder': '/images/products/cream-cheese-powder.svg'
    };

    function getItemPhoto(p) {
        if (p.image && typeof p.image === 'string' && (p.image.startsWith('data:') || p.image.startsWith('http') || p.image.startsWith('/images/'))) {
            return p.image;
        }
        if (p.photo && typeof p.photo === 'string' && (p.photo.startsWith('data:') || p.photo.startsWith('http') || p.photo.startsWith('/images/'))) {
            return p.photo;
        }
        const savedImgs = JSON.parse(localStorage.getItem('brewsync_item_images') || '{}');
        if (p.id && savedImgs[p.id]) return savedImgs[p.id];
        if (p.inventoryId && savedImgs[p.inventoryId]) return savedImgs[p.inventoryId];
        const name = (p.name || p.itemName || '').trim().toLowerCase();
        if (savedImgs[name]) return savedImgs[name];
        if (DRINK_PHOTOS[name]) return DRINK_PHOTOS[name];
        for (const [key, path] of Object.entries(DRINK_PHOTOS)) {
            if (name.includes(key) || key.includes(name)) return path;
        }
        const cat = (p.category || '').toLowerCase();
        if (cat.includes('smoothie')) return '/images/products/mango-smoothie.svg';
        if (cat.includes('fruit')) return '/images/products/mango-green-tea.svg';
        if (cat.includes('tea leaves') || cat.includes('tea')) return '/images/products/tea-leaves.svg';
        if (cat.includes('dairy') || cat.includes('milk') || cat.includes('syrup')) return '/images/products/brown-sugar-syrup.svg';
        if (cat.includes('topping')) return '/images/products/tapioca-pearls.svg';
        return '/images/products/classic-milk-tea.svg';
    }

    const baseCatalog = [
        { id: '1', sku: 'BS-101', name: 'Classic Milk Tea', category: 'Classic Milk Teas', cost: 28.00, price: 85.00, stock: '120 units', status: 'Active', icon: 'bi-cup-hot', desc: 'Premium black tea • 16oz' },
        { id: '2', sku: 'BS-102', name: 'Brown Sugar Boba', category: 'Classic Milk Teas', cost: 35.00, price: 110.00, stock: '85 units', status: 'Active', icon: 'bi-cup-straw', desc: 'Caramelized brown sugar syrup • 16oz' },
        { id: '3', sku: 'BS-103', name: 'Matcha Latte', category: 'Classic Milk Teas', cost: 42.00, price: 125.00, stock: '95 units', status: 'Active', icon: 'bi-cup-hot', desc: 'Uji matcha green tea • 16oz' },
        { id: '4', sku: 'BS-104', name: 'Taro Milk Tea', category: 'Classic Milk Teas', cost: 32.00, price: 95.00, stock: '60 units', status: 'Active', icon: 'bi-cup-hot', desc: 'Velvety purple taro root • 16oz' },
        { id: '5', sku: 'BS-105', name: 'Thai Tea', category: 'Classic Milk Teas', cost: 30.00, price: 90.00, stock: '45 units', status: 'Active', icon: 'bi-cup-hot', desc: 'Traditional spiced ceylon blend • 16oz' },
        { id: '6', sku: 'BS-201', name: 'Mango Green Tea', category: 'Fruit Teas', cost: 30.00, price: 95.00, stock: '110 units', status: 'Active', icon: 'bi-cup-straw', desc: 'Ripe mango juice with jasmine tea • 16oz' },
        { id: '7', sku: 'BS-202', name: 'Strawberry Fruit Tea', category: 'Fruit Teas', cost: 32.00, price: 100.00, stock: '75 units', status: 'Active', icon: 'bi-cup-straw', desc: 'Real strawberry infusion • 16oz' },
        { id: '8', sku: 'BS-203', name: 'Passion Fruit Tea', category: 'Fruit Teas', cost: 28.00, price: 90.00, stock: '50 units', status: 'Active', icon: 'bi-cup-straw', desc: 'Tangy passion fruit seed infusion • 16oz' },
        { id: '9', sku: 'BS-301', name: 'Taro Smoothie', category: 'Smoothies', cost: 45.00, price: 130.00, stock: '40 units', status: 'Active', icon: 'bi-cup', desc: 'Blended creamy taro shake • 24oz' },
        { id: '10', sku: 'BS-302', name: 'Mango Smoothie', category: 'Smoothies', cost: 42.00, price: 125.00, stock: '55 units', status: 'Active', icon: 'bi-cup', desc: 'Tropical mango crushed ice • 24oz' },
        { id: '11', sku: 'BS-303', name: 'Oreo Smoothie', category: 'Smoothies', cost: 40.00, price: 120.00, stock: '35 units', status: 'Active', icon: 'bi-cup', desc: 'Cookies and cream shake • 24oz' },
        { id: '12', sku: 'BS-401', name: 'Tapioca Pearls (Black)', category: 'Add-ons / Toppings', cost: 5.00, price: 15.00, stock: '300 units', status: 'Active', icon: 'bi-circle-fill', desc: 'Chewy brown sugar pearls' },
        { id: '13', sku: 'BS-402', name: 'Egg Pudding', category: 'Add-ons / Toppings', cost: 8.00, price: 20.00, stock: '90 units', status: 'Active', icon: 'bi-egg', desc: 'Silky custard pudding' },
        { id: '14', sku: 'BS-403', name: 'Grass Jelly', category: 'Add-ons / Toppings', cost: 5.00, price: 15.00, stock: '80 units', status: 'Active', icon: 'bi-square-fill', desc: 'Cooling herbal jelly' }
    ];

    let allProducts = [];

    async function fetchLiveInventory() {
        let items = [];
        try {
            const cached = localStorage.getItem('brewsync_inventory_v1');
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed)) items = parsed;
            }
        } catch (_) {}

        try {
            let res = await fetch('http://localhost:5000/api/inventory');
            if (!res.ok) res = await fetch('/api/inventory');
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    items = data;
                    localStorage.setItem('brewsync_inventory_v1', JSON.stringify(data));
                }
            }
        } catch (_) {}

        return items;
    }

    function getCustomProducts() {
        try {
            const raw = localStorage.getItem('brewsync_custom_products');
            return raw ? JSON.parse(raw) : [];
        } catch (_) {
            return [];
        }
    }

    async function syncAndRender() {
        const inventory = await fetchLiveInventory();
        const custom = getCustomProducts();

        const combined = baseCatalog.map(p => ({ ...p }));

        inventory.forEach(inv => {
            const invName = (inv.itemName || inv.name || '').trim();
            if (!invName) return;

            const qty = parseFloat(inv.quantity) || 0;
            const reorder = parseFloat(inv.reorderLevel) || 0;
            const statusStr = qty <= 0 ? 'Out of Stock' : (qty <= reorder ? 'Low Stock' : (inv.status || 'Active'));

            const existing = combined.find(p => p.name.trim().toLowerCase() === invName.toLowerCase());
            if (existing) {
                existing.stock = (qty + ' ' + (inv.unit || '')).trim();
                existing.status = statusStr;
                existing.fromInventory = true;
            } else {
                const cost = parseFloat(inv.cost) || (inv.category === 'Tea Leaves' ? 35 : (inv.category === 'Dairy/Syrup' ? 45 : 30));
                const price = parseFloat(inv.price) || (cost * 2.5);
                combined.unshift({
                    id: 'inv-' + inv.id,
                    sku: 'BS-INV-' + String(inv.id).padStart(3, '0'),
                    name: invName,
                    category: inv.category || 'Inventory Item',
                    cost: cost,
                    price: price,
                    stock: (qty + ' ' + (inv.unit || '')).trim(),
                    status: statusStr,
                    icon: 'bi-box-seam',
                    desc: qty + ' ' + (inv.unit || 'units') + ' available • ' + (inv.category || 'Inventory Item'),
                    fromInventory: true,
                    inventoryId: inv.id
                });
            }
        });

        custom.forEach(cp => {
            if (!combined.some(p => p.name.toLowerCase() === cp.name.toLowerCase())) {
                combined.unshift({
                    id: cp.id || ('prod-' + Math.random().toString(36).slice(2)),
                    sku: cp.sku || ('BS-' + Math.floor(100 + Math.random() * 900)),
                    name: cp.name,
                    category: cp.category || 'Custom Drink',
                    cost: parseFloat(cp.cost) || 30.00,
                    price: parseFloat(cp.price) || 100.00,
                    stock: cp.stock || '100 units',
                    status: cp.status || 'Active',
                    icon: 'bi-cup-hot',
                    desc: cp.desc || cp.category || 'Specialty Drink'
                });
            }
        });

        allProducts = combined;
        populateCategoryFilter();
        applyProductFilters();
        updateStats();
    }

    function populateCategoryFilter() {
        const select = document.getElementById('productCategoryFilter');
        if (!select) return;
        const currentVal = select.value;
        const categories = Array.from(new Set(allProducts.map(p => p.category).filter(Boolean)));

        select.innerHTML = '<option value="">All Categories</option>';
        categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            if (cat === currentVal) opt.selected = true;
            select.appendChild(opt);
        });
    }

    function applyProductFilters() {
        const searchVal = (document.getElementById('tableProductsSearch')?.value || document.getElementById('topProductsSearch')?.value || '').trim().toLowerCase();
        const catVal = (document.getElementById('productCategoryFilter')?.value || '').toLowerCase();
        const statusVal = (document.getElementById('productStatusFilter')?.value || '').toLowerCase();

        const filtered = allProducts.filter(p => {
            const matchSearch = !searchVal ||
                p.name.toLowerCase().includes(searchVal) ||
                p.sku.toLowerCase().includes(searchVal) ||
                p.category.toLowerCase().includes(searchVal) ||
                (p.desc && p.desc.toLowerCase().includes(searchVal));

            const matchCat = !catVal || p.category.toLowerCase() === catVal;

            let matchStatus = true;
            if (statusVal === 'active') {
                matchStatus = p.status.toLowerCase() === 'active' || p.status.toLowerCase() === 'in stock';
            } else if (statusVal === 'inactive') {
                matchStatus = p.status.toLowerCase() === 'inactive' || p.status.toLowerCase() === 'out of stock';
            } else if (statusVal === 'low') {
                matchStatus = p.status.toLowerCase() === 'low stock';
            }

            return matchSearch && matchCat && matchStatus;
        });

        renderTable(filtered, searchVal);
    }

    function renderTable(products, searchTerm) {
        const tbody = document.querySelector('#productsTable tbody');
        if (!tbody) return;

        if (products.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-5 text-muted">
                        <i class="bi bi-search me-2" style="font-size: 1.5rem;"></i>
                        <div class="mt-2 fw-medium">No products found matching "${searchTerm || 'selected filter'}"</div>
                        <small class="text-muted">Check your search spelling or change the category filter.</small>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = products.map((p, idx) => {
            const margin = p.price > 0 ? Math.round(((p.price - p.cost) / p.price) * 100) : 0;
            const marginBadgeClass = margin >= 60 ? 'bg-success' : (margin >= 45 ? 'bg-warning text-dark' : 'bg-danger');

            let statusBadge = '<span class="badge bg-success">Active</span>';
            const lowerStatus = p.status.toLowerCase();
            if (lowerStatus === 'out of stock' || lowerStatus === 'inactive') {
                statusBadge = '<span class="badge bg-danger">Out of Stock</span>';
            } else if (lowerStatus === 'low stock') {
                statusBadge = '<span class="badge bg-warning text-dark">Low Stock</span>';
            }

            const isInv = p.fromInventory;
            const invBadge = isInv ? '<span class="badge bg-info-subtle text-info border border-info-subtle ms-1" style="font-size: 0.65rem;">Inventory</span>' : '';

            return `
                <tr data-id="${p.id}">
                    <td><strong>${p.sku || (idx + 1)}</strong></td>
                    <td>
                        <div class="d-flex align-items-center gap-3">
                            <div class="product-thumb" style="width: 44px; height: 44px; border-radius: 8px; overflow: hidden; padding: 0; background: var(--bg-subtle); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <img src="${getItemPhoto(p)}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                <i class="bi ${p.icon || 'bi-cup-hot'}" style="display: none; font-size: 1.25rem;"></i>
                            </div>
                            <div>
                                <h6 class="mb-0">${p.name} ${invBadge}</h6>
                                <small class="text-muted">${p.desc || p.category}</small>
                            </div>
                        </div>
                    </td>
                    <td class="d-none d-md-table-cell">
                        <span class="badge ${isInv ? 'bg-info-subtle text-info' : 'bg-primary-subtle text-primary'}">${p.category}</span>
                    </td>
                    <td class="d-none d-sm-table-cell">₱${p.cost.toFixed(2)}</td>
                    <td><strong>₱${p.price.toFixed(2)}</strong></td>
                    <td class="d-none d-md-table-cell"><span class="badge ${marginBadgeClass}">${margin}%</span></td>
                    <td class="d-none d-sm-table-cell">${statusBadge}</td>
                    <td>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-secondary btn-action-edit" title="Edit" data-id="${p.id}"><i class="bi bi-pencil"></i></button>
                            <button class="btn btn-outline-secondary btn-action-toggle" title="Toggle Status" data-id="${p.id}"><i class="bi bi-toggle-on"></i></button>
                            <button class="btn btn-outline-danger btn-action-delete" title="Delete" data-id="${p.id}"><i class="bi bi-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function updateStats() {
        const total = allProducts.length;
        const active = allProducts.filter(p => p.status.toLowerCase() === 'active' || p.status.toLowerCase() === 'in stock').length;
        const inactive = allProducts.filter(p => p.status.toLowerCase() === 'inactive' || p.status.toLowerCase() === 'out of stock').length;
        const lowMargin = allProducts.filter(p => {
            const margin = p.price > 0 ? ((p.price - p.cost) / p.price) * 100 : 0;
            return margin < 50 || p.status.toLowerCase() === 'low stock';
        }).length;

        const elTotal = document.getElementById('statTotalProducts');
        const elActive = document.getElementById('statActiveProducts');
        const elInactive = document.getElementById('statInactiveProducts');
        const elLow = document.getElementById('statLowMarginProducts');

        if (elTotal) elTotal.textContent = total;
        if (elActive) elActive.textContent = active;
        if (elInactive) elInactive.textContent = inactive;
        if (elLow) elLow.textContent = lowMargin;
    }

    document.addEventListener('DOMContentLoaded', () => {
        syncAndRender();

        const topSearch = document.getElementById('topProductsSearch');
        const tableSearch = document.getElementById('tableProductsSearch');

        if (topSearch) {
            topSearch.addEventListener('input', (e) => {
                if (tableSearch) tableSearch.value = e.target.value;
                applyProductFilters();
            });
        }
        if (tableSearch) {
            tableSearch.addEventListener('input', (e) => {
                if (topSearch) topSearch.value = e.target.value;
                applyProductFilters();
            });
        }

        document.getElementById('productCategoryFilter')?.addEventListener('change', applyProductFilters);
        document.getElementById('productStatusFilter')?.addEventListener('change', applyProductFilters);

        const saveProductBtn = document.getElementById('saveProductBtn');
        if (saveProductBtn) {
            saveProductBtn.addEventListener('click', () => {
                const form = saveProductBtn.closest('.modal').querySelector('form');
                if (form && form.checkValidity()) {
                    form.classList.add('was-validated');
                    const inputs = form.querySelectorAll('input, select');
                    const name = inputs[0]?.value?.trim() || 'Custom Drink';
                    const sku = inputs[1]?.value?.trim() || ('BS-' + Math.floor(100 + Math.random() * 900));
                    const catSelect = form.querySelector('select');
                    const category = catSelect?.options[catSelect.selectedIndex]?.text || 'Classic Milk Tea';
                    const priceInput = form.querySelector('input[type="number"]');
                    const price = parseFloat(priceInput?.value) || 100;

                    const customList = getCustomProducts();
                    customList.unshift({
                        id: 'prod-' + Date.now(),
                        sku: sku,
                        name: name,
                        category: category,
                        cost: price * 0.35,
                        price: price,
                        stock: '100 units',
                        status: 'Active',
                        desc: category
                    });
                    localStorage.setItem('brewsync_custom_products', JSON.stringify(customList));

                    const modal = bootstrap.Modal.getInstance(saveProductBtn.closest('.modal'));
                    if (modal) modal.hide();
                    form.reset();
                    form.classList.remove('was-validated');

                    syncAndRender();
                    if (window.BrewSync?.notify) {
                        window.BrewSync.notify(`Product "${name}" saved and added to catalog!`, 'success');
                    }
                } else if (form) {
                    form.classList.add('was-validated');
                }
            });
        }

        const tbody = document.querySelector('#productsTable tbody');
        if (tbody) {
            tbody.addEventListener('click', (e) => {
                const tr = e.target.closest('tr');
                const prodId = tr?.dataset?.id;
                if (!prodId) return;

                if (e.target.closest('.btn-action-delete')) {
                    if (confirm('Are you sure you want to remove this product from the catalog view?')) {
                        allProducts = allProducts.filter(p => p.id !== prodId);
                        applyProductFilters();
                        updateStats();
                    }
                    return;
                }

                if (e.target.closest('.btn-action-toggle')) {
                    const prod = allProducts.find(p => p.id === prodId);
                    if (prod) {
                        prod.status = (prod.status === 'Active' || prod.status === 'In Stock') ? 'Inactive' : 'Active';
                        applyProductFilters();
                        updateStats();
                    }
                    return;
                }

                if (e.target.closest('.btn-action-edit')) {
                    const prod = allProducts.find(p => p.id === prodId);
                    if (prod) {
                        const newPrice = prompt(`Edit price for "${prod.name}":`, prod.price);
                        if (newPrice !== null && !isNaN(parseFloat(newPrice))) {
                            prod.price = parseFloat(newPrice);
                            applyProductFilters();
                            updateStats();
                        }
                    }
                }
            });
        }
    });

    window.addEventListener('storage', (e) => {
        if (e.key === 'brewsync_inventory_v1' || e.key === 'brewsync_custom_products') {
            syncAndRender();
        }
    });
    window.addEventListener('focus', () => {
        syncAndRender();
    });
})();
