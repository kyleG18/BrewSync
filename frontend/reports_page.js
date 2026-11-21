(function() {
    'use strict';

    // Baseline historical constants
    const BASELINE = {
        revenue: 84250,
        orders: 1240,
        customers: 412,
        topProducts: [
            { name: 'Classic Milk Tea', sold: 142, category: 'Classic Milk Teas' },
            { name: 'Brown Sugar Boba', sold: 118, category: 'Classic Milk Teas' },
            { name: 'Matcha Latte', sold: 94, category: 'Classic Milk Teas' },
            { name: 'Taro Milk Tea', sold: 76, category: 'Classic Milk Teas' },
            { name: 'Thai Tea', sold: 68, category: 'Classic Milk Teas' }
        ],
        categories: {
            'Classic Milk Teas': 42100,
            'Fruit Teas': 18500,
            'Smoothies': 15200,
            'Add-ons / Toppings': 8450
        },
        payments: {
            'cash': 52300,
            'gcash': 20100,
            'maya': 11850
        },
        dailySales: [
            { date: 'Nov 4, 2024', day: 'Monday', orders: 87, revenue: 5890, avg: 67.70, topProduct: 'Brown Sugar Boba' },
            { date: 'Nov 3, 2024', day: 'Sunday', orders: 142, revenue: 9420, avg: 66.34, topProduct: 'Classic Milk Tea' },
            { date: 'Nov 2, 2024', day: 'Saturday', orders: 156, revenue: 10250, avg: 65.71, topProduct: 'Brown Sugar Boba' },
            { date: 'Nov 1, 2024', day: 'Friday', orders: 124, revenue: 8180, avg: 65.97, topProduct: 'Matcha Latte' },
            { date: 'Oct 31, 2024', day: 'Thursday', orders: 98, revenue: 6450, avg: 65.82, topProduct: 'Taro Milk Tea' },
            { date: 'Oct 30, 2024', day: 'Wednesday', orders: 105, revenue: 7120, avg: 67.81, topProduct: 'Classic Milk Tea' },
            { date: 'Oct 29, 2024', day: 'Tuesday', orders: 92, revenue: 6240, avg: 67.83, topProduct: 'Mango Green Tea' }
        ]
    };

    let salesChartInstance = null;

    function getLiveOrders() {
        try {
            const raw = localStorage.getItem('brewsync_orders');
            return raw ? JSON.parse(raw) : [];
        } catch (_) {
            return [];
        }
    }

    function syncReports() {
        const liveOrders = getLiveOrders();

        let liveRevenue = 0;
        let liveCash = 0;
        let liveGcash = 0;
        let liveMaya = 0;
        const liveProductCounts = {};
        const liveCategoryRevenue = {};
        const liveCustomersSet = new Set();

        liveOrders.forEach(ord => {
            const tot = parseFloat(ord.total) || 0;
            liveRevenue += tot;

            // Payment methods
            const method = (ord.paymentMethod || 'cash').toLowerCase();
            if (method.includes('gcash')) {
                liveGcash += tot;
            } else if (method.includes('maya')) {
                liveMaya += tot;
            } else {
                liveCash += tot;
            }

            // Customer names
            if (ord.customer && ord.customer !== 'Walk-in Customer') {
                liveCustomersSet.add(ord.customer.trim().toLowerCase());
            }

            // Items breakdown
            if (Array.isArray(ord.items)) {
                ord.items.forEach(item => {
                    const itemName = item.name || 'Drink';
                    const qty = parseInt(item.qty) || 1;
                    const itemRevenue = (parseFloat(item.price) || 0) * qty;

                    liveProductCounts[itemName] = (liveProductCounts[itemName] || 0) + qty;

                    // Category determination
                    let cat = 'Classic Milk Teas';
                    const lowerName = itemName.toLowerCase();
                    if (lowerName.includes('fruit') || lowerName.includes('mango') || lowerName.includes('strawberry') || lowerName.includes('passion')) {
                        cat = 'Fruit Teas';
                    } else if (lowerName.includes('smoothie') || lowerName.includes('oreo')) {
                        cat = 'Smoothies';
                    } else if (lowerName.includes('pearl') || lowerName.includes('pudding') || lowerName.includes('jelly') || lowerName.includes('topping')) {
                        cat = 'Add-ons / Toppings';
                    } else if (item.category) {
                        cat = item.category;
                    }
                    liveCategoryRevenue[cat] = (liveCategoryRevenue[cat] || 0) + itemRevenue;
                });
            }
        });

        const totalRevenue = BASELINE.revenue + liveRevenue;
        const totalOrders = BASELINE.orders + liveOrders.length;
        const totalCustomers = BASELINE.customers + liveCustomersSet.size;
        const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

        // 1. Update Key Metric Cards
        const revEl = document.getElementById('reportTotalRevenue');
        const ordEl = document.getElementById('reportTotalOrders');
        const custEl = document.getElementById('reportUniqueCustomers');
        const avgEl = document.getElementById('reportAvgOrderValue');
        const trendTotalEl = document.getElementById('reportDailySalesTotal');

        if (revEl) revEl.textContent = '₱' + totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (ordEl) ordEl.textContent = totalOrders.toLocaleString();
        if (custEl) custEl.textContent = totalCustomers.toLocaleString();
        if (avgEl) avgEl.textContent = '₱' + avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (trendTotalEl) trendTotalEl.textContent = '₱' + totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        // 2. Update Top Selling Products
        const mergedProductsMap = {};
        BASELINE.topProducts.forEach(p => {
            mergedProductsMap[p.name] = p.sold;
        });
        Object.entries(liveProductCounts).forEach(([name, count]) => {
            mergedProductsMap[name] = (mergedProductsMap[name] || 0) + count;
        });

        const sortedProducts = Object.entries(mergedProductsMap)
            .map(([name, sold]) => ({ name, sold }))
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 5);

        const topProductsListEl = document.getElementById('reportTopProductsList');
        if (topProductsListEl) {
            topProductsListEl.innerHTML = sortedProducts.map(p => {
                const liveCount = liveProductCounts[p.name];
                const liveBadge = liveCount ? `<span class="badge bg-success-subtle text-success ms-1" style="font-size: 0.65rem;">+${liveCount} live</span>` : '';
                return `
                    <div class="list-group-item d-flex justify-content-between align-items-center bg-transparent border-0 py-2">
                        <span class="text-secondary small">${p.name} ${liveBadge}</span>
                        <span class="text-primary fw-medium">${p.sold} sold</span>
                    </div>
                `;
            }).join('');
        }

        // 3. Update Revenue by Category
        const mergedCategories = { ...BASELINE.categories };
        Object.entries(liveCategoryRevenue).forEach(([cat, amt]) => {
            mergedCategories[cat] = (mergedCategories[cat] || 0) + amt;
        });
        const catTotalSum = Object.values(mergedCategories).reduce((s, v) => s + v, 0) || 1;

        const catRevListEl = document.getElementById('reportCategoryRevenueList');
        if (catRevListEl) {
            catRevListEl.innerHTML = Object.entries(mergedCategories).map(([cat, amt]) => {
                const pct = Math.round((amt / catTotalSum) * 100);
                return `
                    <div class="list-group-item d-flex justify-content-between align-items-center bg-transparent border-0 py-2">
                        <span class="text-secondary small">${cat}</span>
                        <span class="text-primary fw-medium">₱${amt.toLocaleString(undefined, { maximumFractionDigits: 0 })} (${pct}%)</span>
                    </div>
                `;
            }).join('');
        }

        // 4. Update Payment Methods
        const totalCash = BASELINE.payments.cash + liveCash;
        const totalGcash = BASELINE.payments.gcash + liveGcash;
        const totalMaya = BASELINE.payments.maya + liveMaya;
        const totalPaySum = (totalCash + totalGcash + totalMaya) || 1;

        const payCashPct = Math.round((totalCash / totalPaySum) * 100);
        const payGcashPct = Math.round((totalGcash / totalPaySum) * 100);
        const payMayaPct = Math.round((totalMaya / totalPaySum) * 100);

        const payListEl = document.getElementById('reportPaymentMethodsList');
        if (payListEl) {
            payListEl.innerHTML = `
                <div class="list-group-item d-flex justify-content-between align-items-center bg-transparent border-0 py-2">
                    <span class="text-secondary small"><i class="bi bi-cash-stack text-success me-1"></i> Cash</span>
                    <span class="text-primary fw-medium">₱${totalCash.toLocaleString(undefined, { maximumFractionDigits: 0 })} (${payCashPct}%)</span>
                </div>
                <div class="list-group-item d-flex justify-content-between align-items-center bg-transparent border-0 py-2">
                    <span class="text-secondary small"><i class="bi bi-wallet2 text-primary me-1"></i> GCash</span>
                    <span class="text-primary fw-medium">₱${totalGcash.toLocaleString(undefined, { maximumFractionDigits: 0 })} (${payGcashPct}%)</span>
                </div>
                <div class="list-group-item d-flex justify-content-between align-items-center bg-transparent border-0 py-2">
                    <span class="text-secondary small"><i class="bi bi-credit-card text-success me-1"></i> Maya</span>
                    <span class="text-primary fw-medium">₱${totalMaya.toLocaleString(undefined, { maximumFractionDigits: 0 })} (${payMayaPct}%)</span>
                </div>
            `;
        }

        // 5. Update Daily Sales Detail Table
        const tableBody = document.getElementById('reportsSalesTableBody');
        if (tableBody) {
            let todayRow = '';
            if (liveOrders.length > 0) {
                const now = new Date();
                const todayDateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const todayDayStr = now.toLocaleDateString('en-US', { weekday: 'long' });
                const todayAvg = liveRevenue / liveOrders.length;
                const topTodayProduct = Object.entries(liveProductCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Assorted Drinks';

                todayRow = `
                    <tr style="background: rgba(184, 93, 25, 0.08); font-weight: 500;">
                        <td><strong>${todayDateStr}</strong> <span class="badge bg-warning text-dark ms-1" style="font-size: 0.65rem;">LIVE TODAY</span></td>
                        <td class="d-none d-md-table-cell">${todayDayStr}</td>
                        <td><span class="badge bg-primary">${liveOrders.length}</span></td>
                        <td><strong class="text-primary">₱${liveRevenue.toFixed(2)}</strong></td>
                        <td class="d-none d-sm-table-cell">₱${todayAvg.toFixed(2)}</td>
                        <td>${topTodayProduct}</td>
                    </tr>
                `;
            }

            const historicalRows = BASELINE.dailySales.map(d => `
                <tr>
                    <td><strong>${d.date}</strong></td>
                    <td class="d-none d-md-table-cell">${d.day}</td>
                    <td><span class="badge bg-secondary">${d.orders}</span></td>
                    <td><strong>₱${d.revenue.toLocaleString()}</strong></td>
                    <td class="d-none d-sm-table-cell">₱${d.avg.toFixed(2)}</td>
                    <td>${d.topProduct}</td>
                </tr>
            `).join('');

            tableBody.innerHTML = todayRow + historicalRows;
        }

        // 6. Update or Render Chart.js
        renderSalesChart(liveRevenue);
    }

    function renderSalesChart(liveRevenue) {
        const canvas = document.getElementById('reportsDailyChart');
        if (!canvas || typeof Chart === 'undefined') return;

        const baseChartData = [8200, 9100, 7800, 10500, 12400, 14200, 11800 + liveRevenue];
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun (Today)'];

        if (salesChartInstance) {
            salesChartInstance.data.datasets[0].data = baseChartData;
            salesChartInstance.update();
            return;
        }

        const ctx = canvas.getContext('2d');
        salesChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Daily Revenue (₱)',
                    data: baseChartData,
                    borderColor: '#B85D19',
                    backgroundColor: 'rgba(184, 93, 25, 0.12)',
                    fill: true,
                    tension: 0.35,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#B85D19',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `₱${context.parsed.y.toLocaleString()}`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (val) => '₱' + (val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val)
                        }
                    }
                }
            }
        });
    }

    function exportReportCSV() {
        const liveOrders = getLiveOrders();
        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += 'Date,Day,Orders,Revenue (PHP),Avg Order (PHP),Top Product\n';

        if (liveOrders.length > 0) {
            const now = new Date();
            const todayDateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const todayDayStr = now.toLocaleDateString('en-US', { weekday: 'long' });
            const liveRevenue = liveOrders.reduce((s, o) => s + (parseFloat(o.total) || 0), 0);
            const todayAvg = liveRevenue / liveOrders.length;
            csvContent += `"${todayDateStr}","${todayDayStr}",${liveOrders.length},${liveRevenue.toFixed(2)},${todayAvg.toFixed(2)},"POS Live Sales"\n`;
        }

        BASELINE.dailySales.forEach(d => {
            csvContent += `"${d.date}","${d.day}",${d.orders},${d.revenue},${d.avg},"${d.topProduct}"\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `brewsync_sales_report_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    document.addEventListener('DOMContentLoaded', () => {
        syncReports();

        // Export Report button
        document.getElementById('btnExportReport')?.addEventListener('click', () => {
            window.print();
        });

        // Export CSV button
        document.getElementById('btnExportCsv')?.addEventListener('click', exportReportCSV);

        // Period filter dropdown
        document.getElementById('reportPeriodSelect')?.addEventListener('change', (e) => {
            const period = e.target.value;
            const periodLabel = e.target.options[e.target.selectedIndex]?.text || 'Selected Period';
            const periodTextEl = document.getElementById('reportPeriodText');
            if (periodTextEl) periodTextEl.textContent = periodLabel;
            syncReports();
        });
    });

    // Cross-tab and window focus sync
    window.addEventListener('storage', (e) => {
        if (e.key === 'brewsync_orders') {
            syncReports();
        }
    });
    window.addEventListener('focus', () => {
        syncReports();
    });
})();
