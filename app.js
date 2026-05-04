// ===== Auth Check =====
(function checkAuth() {
    const session = localStorage.getItem('staffhub_session');
    if (!session) {
        window.location.href = 'login.html';
        return;
    }
    try {
        const data = JSON.parse(session);
        if (!data.loggedIn) window.location.href = 'login.html';
    } catch (e) {
        window.location.href = 'login.html';
    }
})();

// ===== Sample Data & State =====
const AVATAR_COLORS = [
    '#6366f1','#8b5cf6','#ec4899','#10b981','#f59e0b',
    '#3b82f6','#ef4444','#14b8a6','#f97316','#06b6d4'
];

const DEPT_COLORS = ['#6366f1','#8b5cf6','#ec4899','#10b981','#f59e0b','#3b82f6','#ef4444','#14b8a6'];

const SAMPLE_EMPLOYEES = [
    { id: 1, firstName: 'Aarav', lastName: 'Sharma', email: 'aarav.sharma@company.com', phone: '+91 98765 43210', department: 'Engineering', role: 'Senior Developer', salary: 95000, status: 'Active', doj: '2023-03-15' },
    { id: 2, firstName: 'Priya', lastName: 'Patel', email: 'priya.patel@company.com', phone: '+91 98765 43211', department: 'Design', role: 'UI/UX Designer', salary: 82000, status: 'Active', doj: '2023-06-01' },
    { id: 3, firstName: 'Rohan', lastName: 'Kumar', email: 'rohan.kumar@company.com', phone: '+91 98765 43212', department: 'Engineering', role: 'Full Stack Developer', salary: 88000, status: 'Active', doj: '2023-01-20' },
    { id: 4, firstName: 'Ananya', lastName: 'Gupta', email: 'ananya.gupta@company.com', phone: '+91 98765 43213', department: 'Marketing', role: 'Marketing Manager', salary: 78000, status: 'On Leave', doj: '2022-11-10' },
    { id: 5, firstName: 'Vikram', lastName: 'Singh', email: 'vikram.singh@company.com', phone: '+91 98765 43214', department: 'Engineering', role: 'DevOps Engineer', salary: 92000, status: 'Active', doj: '2023-08-05' },
    { id: 6, firstName: 'Neha', lastName: 'Reddy', email: 'neha.reddy@company.com', phone: '+91 98765 43215', department: 'HR', role: 'HR Specialist', salary: 65000, status: 'Active', doj: '2022-09-12' },
    { id: 7, firstName: 'Arjun', lastName: 'Nair', email: 'arjun.nair@company.com', phone: '+91 98765 43216', department: 'Engineering', role: 'Backend Developer', salary: 90000, status: 'Active', doj: '2024-01-08' },
    { id: 8, firstName: 'Kavya', lastName: 'Iyer', email: 'kavya.iyer@company.com', phone: '+91 98765 43217', department: 'Design', role: 'Graphic Designer', salary: 70000, status: 'Inactive', doj: '2021-05-20' },
    { id: 9, firstName: 'Siddharth', lastName: 'Joshi', email: 'sid.joshi@company.com', phone: '+91 98765 43218', department: 'Finance', role: 'Financial Analyst', salary: 85000, status: 'Active', doj: '2023-04-18' },
    { id: 10, firstName: 'Meera', lastName: 'Deshmukh', email: 'meera.d@company.com', phone: '+91 98765 43219', department: 'Marketing', role: 'Content Strategist', salary: 72000, status: 'Active', doj: '2023-10-02' },
];

// ===== State =====
let employees = [];
let editingId = null;
let deleteId = null;

// ===== Init =====
function init() {
    const stored = localStorage.getItem('staffhub_employees');
    employees = stored ? JSON.parse(stored) : [...SAMPLE_EMPLOYEES];
    if (!stored) saveEmployees();

    loadUserInfo();
    setupNavigation();
    setupModal();
    setupSearch();
    setupFilters();
    setupLogout();
    renderAll();
}

function loadUserInfo() {
    const session = localStorage.getItem('staffhub_session');
    if (session) {
        try {
            const data = JSON.parse(session);
            const user = data.user;
            if (user) {
                const nameEl = document.querySelector('.user-name');
                const roleEl = document.querySelector('.user-role');
                const avatarEl = document.querySelector('.user-avatar');
                if (nameEl) nameEl.textContent = user.name || 'Admin User';
                if (roleEl) roleEl.textContent = user.role || 'HR Manager';
                if (avatarEl) avatarEl.textContent = (user.avatar || user.name?.charAt(0) || 'A');
            }
        } catch (e) { /* ignore */ }
    }
}

function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('staffhub_session');
            window.location.href = 'login.html';
        });
    }
}

function saveEmployees() {
    localStorage.setItem('staffhub_employees', JSON.stringify(employees));
}

function getNextId() {
    return employees.length ? Math.max(...employees.map(e => e.id)) + 1 : 1;
}

// ===== Navigation =====
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(item.dataset.page);
        });
    });

    document.querySelectorAll('.view-all-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.dataset.page);
        });
    });

    // Mobile menu
    const toggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));

    // Close sidebar on outside click (mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
}

function navigateTo(page) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`.nav-item[data-page="${page}"]`).classList.add('active');
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${page}`).classList.add('active');
    document.getElementById('sidebar').classList.remove('open');
}

// ===== Modal =====
function setupModal() {
    const modal = document.getElementById('employee-modal');
    const deleteModal = document.getElementById('delete-modal');
    const form = document.getElementById('employee-form');

    document.getElementById('add-employee-btn').addEventListener('click', () => openModal());
    document.getElementById('modal-close').addEventListener('click', () => closeModal());
    document.getElementById('modal-cancel').addEventListener('click', () => closeModal());
    document.getElementById('delete-modal-close').addEventListener('click', () => closeDeleteModal());
    document.getElementById('delete-cancel').addEventListener('click', () => closeDeleteModal());
    document.getElementById('delete-confirm').addEventListener('click', () => confirmDelete());

    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    deleteModal.addEventListener('click', (e) => { if (e.target === deleteModal) closeDeleteModal(); });

    form.addEventListener('submit', handleFormSubmit);
}

function openModal(emp = null) {
    editingId = emp ? emp.id : null;
    const modal = document.getElementById('employee-modal');
    const title = document.getElementById('modal-title');
    const submit = document.getElementById('modal-submit');

    // Populate department suggestions
    const depts = [...new Set(employees.map(e => e.department))];
    const datalist = document.getElementById('dept-suggestions');
    datalist.innerHTML = depts.map(d => `<option value="${d}">`).join('');

    if (emp) {
        title.textContent = 'Edit Employee';
        submit.textContent = 'Save Changes';
        document.getElementById('emp-first-name').value = emp.firstName;
        document.getElementById('emp-last-name').value = emp.lastName;
        document.getElementById('emp-email').value = emp.email;
        document.getElementById('emp-phone').value = emp.phone || '';
        document.getElementById('emp-department').value = emp.department;
        document.getElementById('emp-role').value = emp.role;
        document.getElementById('emp-salary').value = emp.salary || '';
        document.getElementById('emp-status').value = emp.status;
        document.getElementById('emp-doj').value = emp.doj || '';
    } else {
        title.textContent = 'Add Employee';
        submit.textContent = 'Add Employee';
        document.getElementById('employee-form').reset();
    }

    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('employee-modal').classList.remove('active');
    editingId = null;
}

function openDeleteModal(id) {
    deleteId = id;
    const emp = employees.find(e => e.id === id);
    document.getElementById('delete-emp-name').textContent = `${emp.firstName} ${emp.lastName}`;
    document.getElementById('delete-modal').classList.add('active');
}

function closeDeleteModal() {
    document.getElementById('delete-modal').classList.remove('active');
    deleteId = null;
}

function confirmDelete() {
    if (deleteId !== null) {
        employees = employees.filter(e => e.id !== deleteId);
        saveEmployees();
        renderAll();
        showToast('Employee deleted successfully', 'success');
    }
    closeDeleteModal();
}

function handleFormSubmit(e) {
    e.preventDefault();

    const data = {
        firstName: document.getElementById('emp-first-name').value.trim(),
        lastName: document.getElementById('emp-last-name').value.trim(),
        email: document.getElementById('emp-email').value.trim(),
        phone: document.getElementById('emp-phone').value.trim(),
        department: document.getElementById('emp-department').value.trim(),
        role: document.getElementById('emp-role').value.trim(),
        salary: parseInt(document.getElementById('emp-salary').value) || 0,
        status: document.getElementById('emp-status').value,
        doj: document.getElementById('emp-doj').value,
    };

    if (editingId) {
        const idx = employees.findIndex(e => e.id === editingId);
        employees[idx] = { ...employees[idx], ...data };
        showToast('Employee updated successfully', 'success');
    } else {
        employees.push({ id: getNextId(), ...data });
        showToast('Employee added successfully', 'success');
    }

    saveEmployees();
    renderAll();
    closeModal();
}

// ===== Search & Filters =====
function setupSearch() {
    document.getElementById('employee-search').addEventListener('input', renderEmployeesTable);
    document.getElementById('global-search').addEventListener('input', (e) => {
        if (e.target.value.trim()) {
            navigateTo('employees');
            document.getElementById('employee-search').value = e.target.value;
            renderEmployeesTable();
        }
    });
}

function setupFilters() {
    document.getElementById('filter-department').addEventListener('change', renderEmployeesTable);
    document.getElementById('filter-status').addEventListener('change', renderEmployeesTable);
}

function getFilteredEmployees() {
    const search = document.getElementById('employee-search').value.toLowerCase().trim();
    const dept = document.getElementById('filter-department').value;
    const status = document.getElementById('filter-status').value;

    return employees.filter(emp => {
        const matchSearch = !search ||
            `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(search) ||
            emp.email.toLowerCase().includes(search) ||
            emp.role.toLowerCase().includes(search);
        const matchDept = !dept || emp.department === dept;
        const matchStatus = !status || emp.status === status;
        return matchSearch && matchDept && matchStatus;
    });
}

// ===== Rendering =====
function renderAll() {
    renderDashboard();
    renderEmployeesTable();
    renderDepartments();
    updateDepartmentFilter();
}

function getAvatarColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(first, last) {
    return (first.charAt(0) + last.charAt(0)).toUpperCase();
}

function getStatusClass(status) {
    return status.toLowerCase().replace(/\s+/g, '-');
}

// ===== Dashboard =====
function renderDashboard() {
    const total = employees.length;
    const depts = [...new Set(employees.map(e => e.department))];
    const active = employees.filter(e => e.status === 'Active').length;
    const onLeave = employees.filter(e => e.status === 'On Leave').length;

    animateCounter('total-employees', total);
    animateCounter('total-departments', depts.length);
    animateCounter('active-employees', active);
    animateCounter('onleave-employees', onLeave);

    // Recent employees (last 5 added)
    const recent = [...employees].reverse().slice(0, 5);
    const recentList = document.getElementById('recent-employees-list');

    if (recent.length === 0) {
        recentList.innerHTML = '<div class="empty-state" style="padding:30px"><p>No employees yet.</p></div>';
    } else {
        recentList.innerHTML = recent.map(emp => {
            const color = getAvatarColor(emp.firstName + emp.lastName);
            return `
                <div class="recent-item">
                    <div class="emp-avatar" style="background: ${color}">${getInitials(emp.firstName, emp.lastName)}</div>
                    <div class="emp-info">
                        <div class="emp-name">${emp.firstName} ${emp.lastName}</div>
                        <div class="emp-role-small">${emp.role} · ${emp.department}</div>
                    </div>
                    <span class="emp-status-badge ${getStatusClass(emp.status)}">${emp.status}</span>
                </div>
            `;
        }).join('');
    }

    // Department breakdown chart
    const deptCounts = {};
    employees.forEach(emp => {
        deptCounts[emp.department] = (deptCounts[emp.department] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(deptCounts), 1);
    const chartEl = document.getElementById('department-chart');

    if (Object.keys(deptCounts).length === 0) {
        chartEl.innerHTML = '<div class="empty-state" style="padding:30px"><p>No data yet.</p></div>';
    } else {
        chartEl.innerHTML = Object.entries(deptCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([dept, count], i) => {
                const pct = (count / maxCount) * 100;
                const color = DEPT_COLORS[i % DEPT_COLORS.length];
                return `
                    <div class="dept-bar-item">
                        <div class="dept-bar-header">
                            <span class="dept-bar-name">${dept}</span>
                            <span class="dept-bar-count">${count} member${count !== 1 ? 's' : ''}</span>
                        </div>
                        <div class="dept-bar-track">
                            <div class="dept-bar-fill" style="width: 0%; background: linear-gradient(90deg, ${color}, ${color}88);" data-width="${pct}"></div>
                        </div>
                    </div>
                `;
            }).join('');

        // Animate bars
        requestAnimationFrame(() => {
            chartEl.querySelectorAll('.dept-bar-fill').forEach(bar => {
                bar.style.width = bar.dataset.width + '%';
            });
        });
    }
}

function animateCounter(id, target) {
    const el = document.getElementById(id);
    const current = parseInt(el.textContent) || 0;
    if (current === target) return;

    const duration = 600;
    const start = performance.now();

    function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(current + (target - current) * eased);
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

// ===== Employees Table =====
function renderEmployeesTable() {
    const filtered = getFilteredEmployees();
    const tbody = document.getElementById('employees-table-body');
    const empty = document.getElementById('employees-empty');
    const table = document.querySelector('.table-card .table-wrapper');

    if (filtered.length === 0) {
        table.style.display = 'none';
        empty.style.display = 'flex';
    } else {
        table.style.display = 'block';
        empty.style.display = 'none';

        tbody.innerHTML = filtered.map(emp => {
            const color = getAvatarColor(emp.firstName + emp.lastName);
            return `
                <tr>
                    <td>
                        <div class="emp-cell">
                            <div class="emp-avatar" style="background: ${color}">${getInitials(emp.firstName, emp.lastName)}</div>
                            <div>
                                <div class="emp-name">${emp.firstName} ${emp.lastName}</div>
                            </div>
                        </div>
                    </td>
                    <td style="color: var(--text-secondary)">${emp.email}</td>
                    <td>${emp.department}</td>
                    <td style="color: var(--text-secondary)">${emp.role}</td>
                    <td><span class="emp-status-badge ${getStatusClass(emp.status)}">${emp.status}</span></td>
                    <td>
                        <div class="actions-cell">
                            <button class="btn-icon" onclick="editEmployee(${emp.id})" aria-label="Edit employee" title="Edit">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button class="btn-icon danger" onclick="deleteEmployee(${emp.id})" aria-label="Delete employee" title="Delete">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }
}

// ===== Departments =====
function renderDepartments() {
    const deptMap = {};
    employees.forEach(emp => {
        if (!deptMap[emp.department]) deptMap[emp.department] = [];
        deptMap[emp.department].push(emp);
    });

    const grid = document.getElementById('departments-grid');
    const empty = document.getElementById('departments-empty');

    const deptEntries = Object.entries(deptMap);
    if (deptEntries.length === 0) {
        grid.style.display = 'none';
        empty.style.display = 'flex';
    } else {
        grid.style.display = 'grid';
        empty.style.display = 'none';

        grid.innerHTML = deptEntries.map(([dept, members], i) => {
            const color = DEPT_COLORS[i % DEPT_COLORS.length];
            const shown = members.slice(0, 4);
            const remaining = members.length - shown.length;

            const avatars = shown.map(emp => {
                const c = getAvatarColor(emp.firstName + emp.lastName);
                return `<div class="emp-avatar" style="background: ${c}">${getInitials(emp.firstName, emp.lastName)}</div>`;
            }).join('');

            const moreEl = remaining > 0 ? `<div class="dept-card-more">+${remaining}</div>` : '';

            return `
                <div class="dept-card" style="--dept-color: ${color}">
                    <div class="dept-card-icon" style="color: ${color}; background: ${color}18;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <h3>${dept}</h3>
                    <div class="dept-card-count">${members.length} member${members.length !== 1 ? 's' : ''}</div>
                    <div class="dept-card-members">
                        ${avatars}${moreEl}
                    </div>
                </div>
            `;
        }).join('');
    }
}

function updateDepartmentFilter() {
    const depts = [...new Set(employees.map(e => e.department))].sort();
    const select = document.getElementById('filter-department');
    const current = select.value;
    select.innerHTML = '<option value="">All Departments</option>' +
        depts.map(d => `<option value="${d}" ${d === current ? 'selected' : ''}>${d}</option>`).join('');
}

// ===== Global Actions =====
function editEmployee(id) {
    const emp = employees.find(e => e.id === id);
    if (emp) openModal(emp);
}

function deleteEmployee(id) {
    openDeleteModal(id);
}

// ===== Toast =====
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success'
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';

    toast.innerHTML = `${icon}<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeDeleteModal();
    }
});

// ===== Start =====
document.addEventListener('DOMContentLoaded', init);
