let appState = {
    currentPage: 'portal',
    isLoggedIn: false,
    adminUsername: '',
    users: [
        { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: '****', isActive: true },
        { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', password: '****', isActive: true },
        { id: 3, firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', password: '****', isActive: false },
        { id: 4, firstName: 'Sarah', lastName: 'Williams', email: 'sarah@example.com', password: '****', isActive: true },
        { id: 5, firstName: 'Tom', lastName: 'Brown', email: 'tom@example.com', password: '****', isActive: true },
    ],
    nextUserId: 6
};

// ================= SWITCH TABS =================
function switchTab(tab) {
    const adminForm = document.getElementById('adminForm');
    const registerForm = document.getElementById('registerForm');
    const adminBtn = document.querySelectorAll('.tab-btn')[0];
    const registerBtn = document.querySelectorAll('.tab-btn')[1];

    adminForm.classList.remove('active');
    registerForm.classList.remove('active');
    adminBtn.classList.remove('active');
    registerBtn.classList.remove('active');

    if (tab === 'admin') {
        adminForm.classList.add('active');
        adminBtn.classList.add('active');
        document.getElementById('adminUsername').focus();
    } else {
        registerForm.classList.add('active');
        registerBtn.classList.add('active');
        document.getElementById('regFirstName').focus();
    }

    document.getElementById('adminMessage').textContent = '';
    document.getElementById('regMessage').textContent = '';
    document.getElementById('errorMessage').textContent = '';
}

// =================== PAGE NAVIGATION ===================
function showPage(page) {
    document.getElementById('portalPage').classList.add('hidden');
    document.getElementById('successPage').classList.add('hidden');
    document.getElementById('regSuccessPage').classList.add('hidden');
    document.getElementById('dashboardPage').classList.add('hidden');

    document.getElementById('adminMessage').textContent = '';
    document.getElementById('regMessage').textContent = '';
    document.getElementById('errorMessage').textContent = '';
    document.getElementById('successNotification').textContent = '';

    if (page === 'portal') {
        document.getElementById('portalPage').classList.remove('hidden');
        switchTab('admin');
    } else if (page === 'success') {
        document.getElementById('successPage').classList.remove('hidden');
    } else if (page === 'regSuccess') {
        document.getElementById('regSuccessPage').classList.remove('hidden');
        // ❌ AUTO REDIRECT REMOVED (as per your request)
    } else if (page === 'dashboard') {
        document.getElementById('dashboardPage').classList.remove('hidden');
        renderUsers();
    }

    appState.currentPage = page;
}

// =================== ADMIN LOGIN ===================
function handleAdminLogin() {
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    const messageEl = document.getElementById('adminMessage');

    if (username === 'admin' && password === 'Admin@123') {
        appState.isLoggedIn = true;
        appState.adminUsername = username;
        document.getElementById('successUsername').textContent = username;

        document.getElementById('adminUsername').value = '';
        document.getElementById('adminPassword').value = '';

        showPage('success');
    } else {
        messageEl.textContent = '❌ Invalid credentials';
    }
}

// ================= USER REGISTRATION =================
function handleRegister() {
    const firstName = document.getElementById('regFirstName').value.trim();
    const lastName = document.getElementById('regLastName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const messageEl = document.getElementById('regMessage');

    if (!firstName || !lastName || !email || !password) {
        messageEl.textContent = '❌ All fields required';
        return;
    }

    if (!email.includes('@')) {
        messageEl.textContent = '❌ Invalid email';
        return;
    }

    if (appState.users.some(user => user.email === email)) {
        messageEl.textContent = '❌ Email already exists';
        return;
    }

    const newUser = {
        id: appState.nextUserId++,
        firstName,
        lastName,
        email,
        password: '****',
        isActive: true
    };

    appState.users.unshift(newUser);

    document.getElementById('regFirstName').value = '';
    document.getElementById('regLastName').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regPassword').value = '';

    showPage('regSuccess');  // ⭐ ONLY SHOW SUCCESS PAGE
}

// ================= MANUAL BACK TO LOGIN BUTTON =================
function goBackToLogin() {
    showPage("portal");
    switchTab("admin");
}

// ================= ADMIN LOGOUT =================
function handleLogout() {
    appState.isLoggedIn = false;
    appState.adminUsername = '';
    showPage("portal");
    switchTab("admin");
}

// ================= DASHBOARD =================
function goToDashboard() {
    document.getElementById('dashboardUsername').textContent = appState.adminUsername;
    showPage('dashboard');
}

function goBack() {
showPage("portal");      // Show login page
witchTab("admin");      // Switch to admin login tab
}


function refreshDashboard() {
    const msg = document.getElementById('successNotification');
    msg.textContent = '✓ Dashboard refreshed!';
    msg.classList.add('show');
    setTimeout(() => msg.classList.remove('show'), 3000);
}

// ================= DELETE USER =================
function deleteUser(id) {
    appState.users = appState.users.filter(u => u.id !== id);
    renderUsers();
}

// ================= TOGGLE USER ACTIVE =================
function toggleUserStatus(id) {
    const user = appState.users.find(u => u.id === id);
    if (user) {
        user.isActive = !user.isActive;
        renderUsers();
    }
}

// ================= RENDER USERS TABLE =================
function renderUsers() {
    const tbody = document.getElementById('usersTableBody');

    document.getElementById('userCount').textContent = appState.users.length;
    document.getElementById('totalUsers').textContent = appState.users.length;
    document.getElementById('activeUsers').textContent = appState.users.filter(u => u.isActive).length;
    document.getElementById('inactiveUsers').textContent = appState.users.filter(u => !u.isActive).length;

    tbody.innerHTML = appState.users.map((user, idx) => `
        <tr>
            <td>${idx + 1}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.password}</td>
            <td>
                <button class="toggle ${user.isActive ? 'active' : 'inactive'}"
                        onclick="toggleUserStatus(${user.id})">
                    <span class="toggle-slider"></span>
                </button>
            </td>
            <td>
                <button class="btn-delete" onclick="deleteUser(${user.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// ================= INIT =================
window.addEventListener('DOMContentLoaded', () => {
    showPage('portal');
});
