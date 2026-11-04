(function() {
    'use strict';

    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarNav = document.getElementById('sidebarNav');

    function initSidebar() {
        if (!sidebar) return;

        function openSidebar() {
            sidebar.classList.add('open');
            sidebarOverlay.classList.add('active');
            mobileSidebarToggle.setAttribute('aria-expanded', 'true');
            sidebarToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }

        function closeSidebar() {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('active');
            mobileSidebarToggle.setAttribute('aria-expanded', 'false');
            sidebarToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        function toggleSidebar() {
            if (sidebar.classList.contains('open')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        }

        if (mobileSidebarToggle) {
            mobileSidebarToggle.addEventListener('click', toggleSidebar);
        }

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', toggleSidebar);
        }

        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', closeSidebar);
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('open')) {
                closeSidebar();
            }
        });

        if (sidebarNav) {
            sidebarNav.addEventListener('click', (e) => {
                const link = e.target.closest('.nav-link');
                if (link && window.innerWidth < 992) {
                    closeSidebar();
                }
            });
        }

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 992 && sidebar.classList.contains('open')) {
                closeSidebar();
            }
        });
    }

    function initSalesChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx || typeof Chart === 'undefined') return;

        const data = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Sales (₱)',
                data: [8200, 9100, 7800, 10500, 12400, 14200, 11800],
                borderColor: '#E88D39',
                backgroundColor: 'rgba(232, 141, 57, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#E88D39',
                pointBorderColor: '#1A1614',
                pointBorderWidth: 2,
                pointHoverBackgroundColor: '#F0A55A',
                pointHoverBorderColor: '#1A1614',
                pointHoverBorderWidth: 2
            }]
        };

        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#241F1C',
                        titleColor: '#F5EBE0',
                        bodyColor: '#F5EBE0',
                        borderColor: '#3D322B',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: (context) => `₱${context.parsed.y.toLocaleString()}`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false, drawBorder: false },
                        ticks: { color: '#9A8A7A', font: { size: 12 } }
                    },
                    y: {
                        grid: { color: '#3D322B', drawBorder: false },
                        ticks: {
                            color: '#9A8A7A',
                            font: { size: 11 },
                            callback: (value) => '₱' + (value / 1000) + 'k'
                        },
                        beginAtZero: true
                    }
                },
                elements: {
                    line: { borderWidth: 3 }
                }
            }
        };

        new Chart(ctx, config);
    }

    function initChartPeriodButtons() {
        const buttons = document.querySelectorAll('[data-period]');
        if (!buttons.length) return;

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    function initDateRangeModal() {
        const presetButtons = document.querySelectorAll('[data-preset]');
        const startDate = document.getElementById('startDate');
        const endDate = document.getElementById('endDate');

        if (!presetButtons.length || !startDate || !endDate) return;

        function setDates(start, end) {
            startDate.value = start.toISOString().split('T')[0];
            endDate.value = end.toISOString().split('T')[0];
        }

        function updateActivePreset(preset) {
            presetButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.preset === preset);
            });
        }

        presetButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = btn.dataset.preset;
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                let start, end;

                switch (preset) {
                    case 'today':
                        start = end = new Date(today);
                        break;
                    case 'yesterday':
                        start = end = new Date(today);
                        start.setDate(start.getDate() - 1);
                        end.setDate(end.getDate() - 1);
                        break;
                    case '7d':
                        start = new Date(today);
                        start.setDate(start.getDate() - 6);
                        end = new Date(today);
                        break;
                    case '30d':
                        start = new Date(today);
                        start.setDate(start.getDate() - 29);
                        end = new Date(today);
                        break;
                    case 'custom':
                        updateActivePreset('custom');
                        return;
                }

                setDates(start, end);
                updateActivePreset(preset);
            });
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 6);
        setDates(weekAgo, today);
    }

    function initTableRowHover() {
        const rows = document.querySelectorAll('.table tbody tr');
        rows.forEach(row => {
            row.addEventListener('mouseenter', () => {
                row.style.background = 'rgba(232, 141, 57, 0.03)';
            });
            row.addEventListener('mouseleave', () => {
                row.style.background = '';
            });
        });
    }

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    function initActiveNavHighlight() {
        const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
        const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === '' && href === 'dashboard.html')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }

    function initFormValidation() {
        const forms = document.querySelectorAll('form[novalidate]');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                form.classList.add('was-validated');
            });
        });
    }

    function initTooltips() {
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(el => new bootstrap.Tooltip(el));
        }
    }

    function initPopovers() {
        if (typeof bootstrap !== 'undefined' && bootstrap.Popover) {
            const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
            popoverTriggerList.map(el => new bootstrap.Popover(el));
        }
    }

    function initDropdownCloseOnClick() {
        document.addEventListener('click', (e) => {
            const dropdowns = document.querySelectorAll('.dropdown-menu.show');
            dropdowns.forEach(menu => {
                const toggle = menu.previousElementSibling;
                if (toggle && !toggle.contains(e.target) && !menu.contains(e.target)) {
                    const instance = bootstrap.Dropdown.getInstance(toggle);
                    if (instance) instance.hide();
                }
            });
        });
    }

    function initAutoHideAlerts() {
        const alerts = document.querySelectorAll('.alert-dismissible:not(.alert-permanent)');
        alerts.forEach(alert => {
            setTimeout(() => {
                const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
                bsAlert.close();
            }, 5000);
        });
    }

    function initBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.className = 'btn btn-primary position-fixed bottom-0 end-0 m-4 rounded-circle shadow-lg';
        backToTop.style.cssText = 'width: 48px; height: 48px; z-index: 1000; opacity: 0; visibility: hidden; transform: translateY(20px); transition: all 0.3s ease;';
        backToTop.innerHTML = '<i class="bi bi-chevron-up"></i>';
        backToTop.setAttribute('aria-label', 'Back to top');
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        document.body.appendChild(backToTop);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
                backToTop.style.transform = 'translateY(0)';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
                backToTop.style.transform = 'translateY(20px)';
            }
        }, { passive: true });
    }

    function initResizeObserver() {
        if ('ResizeObserver' in window) {
            const resizeObserver = new ResizeObserver(entries => {
                entries.forEach(entry => {
                    if (entry.target === sidebar) {
                        document.documentElement.style.setProperty('--sidebar-width', entry.contentRect.width + 'px');
                    }
                });
            });
            if (sidebar) resizeObserver.observe(sidebar);
        }
    }

    function initThemeDetection() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
        function handleChange(e) {
            document.documentElement.classList.toggle('light-theme', e.matches);
        }
        mediaQuery.addEventListener('change', handleChange);
        handleChange(mediaQuery);
    }

    function initPerformanceMarks() {
        if ('performance' in window && 'mark' in performance) {
            performance.mark('app-init-start');
            window.addEventListener('load', () => {
                performance.mark('app-init-end');
                performance.measure('app-init', 'app-init-start', 'app-init-end');
            });
        }
    }

    // ── Session & User Info Sync Across Static Pages ─────────────────────────
    function initUserSessionDisplay() {
        const isGuest = sessionStorage.getItem('brewsync_guest') === 'true';
        const userNames = document.querySelectorAll('.user-name');
        const userRoles = document.querySelectorAll('.user-role');
        const userAvatars = document.querySelectorAll('.user-avatar, .user-avatar-sm');

        if (isGuest) {
            userNames.forEach(el => el.textContent = 'Demo User');
            userRoles.forEach(el => el.textContent = 'Guest Operator');
            userAvatars.forEach(el => el.textContent = 'DU');
        }

        // Attach global sign-out cleanup
        document.querySelectorAll('a[href*="login.html"], .logout-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                sessionStorage.removeItem('brewsync_guest');
            });
        });
    }

    // ── Live Orders Sync (Connects POS orders with orders.html) ───────────────
    function initOrdersSync() {
        const tableBody = document.querySelector('#ordersTable tbody');
        if (!tableBody) return;

        try {
            const raw = localStorage.getItem('brewsync_orders');
            if (!raw) return;
            const orders = JSON.parse(raw);
            if (!Array.isArray(orders) || orders.length === 0) return;

            // Generate rows for stored POS orders
            const rowsHtml = orders.map(ord => `
                <tr class="table-row-live" style="background: rgba(232, 141, 57, 0.04);">
                    <td><strong>${ord.orderNumber}</strong> <span class="badge bg-warning text-dark ms-1" style="font-size: 0.65rem;">NEW</span></td>
                    <td class="d-none d-md-table-cell">${ord.customer || 'Walk-in Customer'}</td>
                    <td class="d-none d-sm-table-cell" title="${ord.itemsList || ''}">${ord.itemsCount || 1} items</td>
                    <td><strong>₱${parseFloat(ord.total).toFixed(2)}</strong></td>
                    <td class="d-none d-sm-table-cell"><span class="badge bg-secondary">${ord.paymentMethod || 'CASH'}</span></td>
                    <td><span class="badge bg-success">${ord.status || 'Completed'}</span></td>
                    <td class="d-none d-lg-table-cell">${ord.timestamp || 'Just now'}</td>
                    <td>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-secondary btn-order-details" data-items="${ord.itemsList || ''}" data-num="${ord.orderNumber}" title="View Details">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-outline-secondary" onclick="window.print()" title="Print Receipt">
                                <i class="bi bi-printer"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');

            tableBody.insertAdjacentHTML('afterbegin', rowsHtml);

            // Wire up details button click
            document.querySelectorAll('.btn-order-details').forEach(btn => {
                btn.addEventListener('click', () => {
                    const num = btn.dataset.num;
                    const items = btn.dataset.items;
                    alert(`Order: ${num}\nItems: ${items || 'Details not available'}`);
                });
            });
        } catch (e) {
            console.warn('Orders sync error:', e);
        }
    }

    // ── Live Table Search & Filter Across Static Pages ─────────────────────────
    function initTableSearchAndFilter() {
        const searchInputs = document.querySelectorAll('.search-box input, input[type="search"]');
        searchInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase().trim();
                const table = document.querySelector('.table tbody');
                if (!table) return;

                const rows = table.querySelectorAll('tr');
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(term) ? '' : 'none';
                });
            });
        });

        // Category dropdown filter in products.html
        const catSelect = document.querySelector('select[aria-label="Filter by category"]');
        if (catSelect) {
            catSelect.addEventListener('change', (e) => {
                const cat = e.target.value.toLowerCase();
                const table = document.querySelector('.table tbody');
                if (!table) return;

                const rows = table.querySelectorAll('tr');
                rows.forEach(row => {
                    if (!cat) {
                        row.style.display = '';
                        return;
                    }
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(cat) ? '' : 'none';
                });
            });
        }
    }

    // ── Universal Table CSV Export ────────────────────────────────────────────
    function initCsvExport() {
        const exportBtns = document.querySelectorAll('.btn:has(.bi-download), button:has(.bi-download)');
        exportBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const table = document.querySelector('.table');
                if (!table) {
                    alert('No table data to export.');
                    return;
                }

                let csv = [];
                const rows = table.querySelectorAll('tr');
                rows.forEach(row => {
                    if (row.style.display === 'none') return; // Only exported visible filtered rows
                    const cols = row.querySelectorAll('th, td');
                    const rowData = [];
                    cols.forEach(col => {
                        // Exclude actions column
                        if (col.querySelector('.btn-group') || col.classList.contains('actions-cell')) return;
                        let text = col.innerText.replace(/"/g, '""').trim();
                        rowData.push(`"${text}"`);
                    });
                    if (rowData.length > 0) csv.push(rowData.join(','));
                });

                const csvBlob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(csvBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `BrewSync_Export_${new Date().toISOString().slice(0, 10)}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        initSidebar();
        initUserSessionDisplay();
        initOrdersSync();
        initTableSearchAndFilter();
        initCsvExport();
        initSalesChart();
        initChartPeriodButtons();
        initDateRangeModal();
        initTableRowHover();
        initSmoothScroll();
        initActiveNavHighlight();
        initFormValidation();
        initTooltips();
        initPopovers();
        initDropdownCloseOnClick();
        initAutoHideAlerts();
        initBackToTop();
        initResizeObserver();
        initThemeDetection();
        initPerformanceMarks();

        document.body.classList.add('loaded');
    });

    window.BrewSync = {
        sidebar: {
            open: () => sidebar?.classList.add('open'),
            close: () => sidebar?.classList.remove('open'),
            toggle: () => sidebar?.classList.toggle('open')
        },
        notify: (message, type = 'info') => {
            const alert = document.createElement('div');
            alert.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
            alert.style.zIndex = '1050';
            alert.style.minWidth = '300px';
            alert.setAttribute('role', 'alert');
            alert.innerHTML = `
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;
            document.body.appendChild(alert);
            setTimeout(() => {
                const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
                bsAlert.close();
            }, 5000);
        }
    };
})();