(function() {
  'use strict';

  const STORAGE_KEY = 'brewsync_users';

  const DEFAULT_USERS = [
    {
      uid: "admin-user-01",
      displayName: "Store Administrator",
      email: "admin@brewsync.ph",
      role: "admin",
      status: "Active",
      password: "admin123",
      createdAt: "2026-10-01T08:00:00.000Z",
      lastLogin: "Just now"
    },
    {
      uid: "staff-user-01",
      displayName: "Counter Cashier",
      email: "staff@brewsync.ph",
      role: "staff",
      status: "Active",
      password: "staff123",
      createdAt: "2026-10-15T09:30:00.000Z",
      lastLogin: "2 hours ago"
    },
    {
      uid: "admin-user-02",
      displayName: "John Rich Montoya",
      email: "john@brewsync.com",
      role: "admin",
      status: "Active",
      password: "john123",
      createdAt: "2026-10-10T11:00:00.000Z",
      lastLogin: "Yesterday"
    },
    {
      uid: "staff-user-02",
      displayName: "Maria Santos",
      email: "maria@brewsync.com",
      role: "staff",
      status: "Active",
      password: "maria123",
      createdAt: "2026-10-20T14:15:00.000Z",
      lastLogin: "3 hours ago"
    },
    {
      uid: "staff-user-03",
      displayName: "Juan Dela Cruz",
      email: "juan@brewsync.com",
      role: "staff",
      status: "Active",
      password: "juan123",
      createdAt: "2026-10-25T16:00:00.000Z",
      lastLogin: "Yesterday"
    },
    {
      uid: "staff-user-04",
      displayName: "Anna Reyes",
      email: "anna@brewsync.com",
      role: "staff",
      status: "Inactive",
      password: "anna123",
      createdAt: "2026-11-01T10:00:00.000Z",
      lastLogin: "5 days ago"
    }
  ];

  function getUsers() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }

  function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  function renderTable() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    const users = getUsers();
    tbody.innerHTML = '';

    if (users.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No users found. Click "+ Add User" to provision an account.</td></tr>`;
      return;
    }

    users.forEach((u, idx) => {
      const tr = document.createElement('tr');
      const isAdmin = u.role === 'admin';
      const isActive = (u.status || 'Active') === 'Active';

      tr.innerHTML = `
        <td><strong>${idx + 1}</strong></td>
        <td>
          <div class="fw-semibold">${escapeHtml(u.displayName || 'User')}</div>
          <div class="small text-muted font-monospace d-md-none">${escapeHtml(u.email || '')}</div>
        </td>
        <td class="d-none d-md-table-cell">${escapeHtml(u.email || '—')}</td>
        <td>
          <span class="badge ${isAdmin ? 'bg-dark' : 'bg-primary'} text-uppercase">
            ${isAdmin ? 'Administrator' : 'Staff / Cashier'}
          </span>
        </td>
        <td class="d-none d-sm-table-cell">
          <span class="badge ${isActive ? 'bg-success' : 'bg-secondary'}">
            ${isActive ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td class="d-none d-lg-table-cell text-muted small">${escapeHtml(u.lastLogin || 'Never')}</td>
        <td>
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-secondary btn-toggle-status" data-uid="${u.uid}" title="${isActive ? 'Deactivate' : 'Activate'}">
              <i class="bi ${isActive ? 'bi-pause' : 'bi-play'}"></i>
            </button>
            <button class="btn btn-outline-danger btn-delete-user" data-uid="${u.uid}" title="Delete">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Wire actions
    tbody.querySelectorAll('.btn-toggle-status').forEach(btn => {
      btn.addEventListener('click', () => {
        const uid = btn.getAttribute('data-uid');
        const list = getUsers();
        const user = list.find(u => u.uid === uid);
        if (!user) return;
        user.status = (user.status === 'Active') ? 'Inactive' : 'Active';
        saveUsers(list);
        renderTable();
        if (window.BrewSync && BrewSync.notify) {
          BrewSync.notify(`${user.displayName} is now ${user.status}`, user.status === 'Active' ? 'success' : 'warning');
        }
      });
    });

    tbody.querySelectorAll('.btn-delete-user').forEach(btn => {
      btn.addEventListener('click', () => {
        const uid = btn.getAttribute('data-uid');
        const list = getUsers();
        const user = list.find(u => u.uid === uid);
        if (!user) return;
        if (confirm(`Are you sure you want to delete user ${user.displayName} (${user.email})?`)) {
          const updated = list.filter(u => u.uid !== uid);
          saveUsers(updated);
          renderTable();
          if (window.BrewSync && BrewSync.notify) {
            BrewSync.notify(`User ${user.displayName} was deleted.`, 'info');
          }
        }
      });
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, s => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[s]));
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderTable();

    // Wire Add User Form
    const addForm = document.getElementById('addUserForm');
    const addBtn = document.getElementById('btnSubmitAddUser');
    if (addBtn && addForm) {
      addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('newUserName');
        const emailInput = document.getElementById('newUserEmail');
        const roleInput = document.getElementById('newUserRole');
        const pwInput = document.getElementById('newUserPassword');

        const name = (nameInput?.value || '').trim();
        const email = (emailInput?.value || '').trim().toLowerCase();
        const role = roleInput?.value || 'staff';
        const password = (pwInput?.value || '').trim() || 'staff123';

        if (!name || !email) {
          alert('Please enter both Name and Email.');
          return;
        }

        const users = getUsers();
        if (users.some(u => u.email.toLowerCase() === email)) {
          alert('A user with this email already exists.');
          return;
        }

        const newUser = {
          uid: 'user-' + Date.now(),
          displayName: name,
          email: email,
          role: role,
          status: 'Active',
          password: password,
          createdAt: new Date().toISOString(),
          lastLogin: 'Never'
        };

        users.unshift(newUser);
        saveUsers(users);
        renderTable();

        // Close modal
        const modalEl = document.getElementById('addUserModal');
        if (modalEl && window.bootstrap) {
          const modalInst = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
          modalInst.hide();
        }

        // Reset form
        addForm.reset();

        if (window.BrewSync && BrewSync.notify) {
          BrewSync.notify(`User ${newUser.displayName} created successfully!`, 'success');
        }
      });
    }
  });
})();
