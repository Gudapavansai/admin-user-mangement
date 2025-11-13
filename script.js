
// ===== LOAD STATE FROM LOCAL STORAGE =====
let appState = JSON.parse(localStorage.getItem("appState")) || {
    currentPage: 'portal',
    isLoggedIn: false,
    adminUsername: '',
    users: [],       // 👈 EMPTY (will fill dynamically)
    nextUserId: 1    // 👈 Dynamic ID
};

// ===== SAVE STATE TO LOCAL STORAGE =====
function saveState() {
    localStorage.setItem("appState", JSON.stringify(appState));
}


// SWITCH TABS
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

// PAGE NAVIGATION
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
        setTimeout(() => showPage('portal'), 3000);
    } else if (page === 'dashboard') {
        document.getElementById('dashboardPage').classList.remove('hidden');
        renderUsers();
    }

    appState.currentPage = page;
}

// ADMIN LOGIN
function handleUserLogin() {
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

    if (appState.users.some(u => u.email === email)) {
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
    saveState();

    notifyNewUser(newUser);

    // ⭐ ONLY show success page (NO redirect, NO auto movement)
    showPage('regSuccess');
}
// NOTIFY ADMIN OF NEW USER
function notifyNewUser(newUser) {
    if (appState.currentPage === 'dashboard') {
        const successEl = document.getElementById('successNotification');
        successEl.textContent = `✓ New user registered: ${newUser.firstName} ${newUser.lastName}`;
        successEl.classList.add('show');
        setTimeout(() => successEl.classList.remove('show'), 4000);
        renderUsers();
    }
}

// GO TO DASHBOARD
function goToDashboard() {
    document.getElementById('dashboardUsername').textContent = appState.adminUsername;
    showPage('dashboard');
}

// USER LOGOUT 
function handleLogout() {
    showPage('portal');
    switchTab('register');
}

// ADMIN LOGOUT (from Login Successful Page)
function handleAdminLogout() {
    appState.isLoggedIn = false;
    appState.adminUsername = '';
    showPage('portal');
    switchTab('admin');
}

// BACK BUTTON TO ADMIN LOGIN
function goBackToAdmin() {
    appState.isLoggedIn = false;
    appState.adminUsername = '';
    showPage('portal');
    switchTab('admin');
}

// REFRESH DASHBOARD
function refreshDashboard() {
    const notification = document.getElementById('successNotification');
    notification.textContent = '✓ Dashboard refreshed! Data updated.';
    notification.classList.add('show');

    renderUsers();

    setTimeout(() => notification.classList.remove('show'), 3000);
}

// DELETE USER
function deleteUser(userId) {
    appState.users = appState.users.filter(user => user.id !== userId);

    const successEl = document.getElementById('successNotification');
    successEl.textContent = '✓ User deleted successfully!';
    successEl.classList.add('show');

    setTimeout(() => successEl.classList.remove('show'), 3000);

    renderUsers();
}

// TOGGLE USER STATUS
function handleAdminLogout() {
    // Deactivate all users automatically
    appState.users = appState.users.map(user => ({
        ...user,
        isActive: false
    }));

    appState.isLoggedIn = false;
    appState.adminUsername = '';

    showPage('portal');
    switchTab('admin');
}


// RENDER TABLE
function renderUsers() {
    const tbody = document.getElementById('usersTableBody');

    document.getElementById('userCount').textContent = appState.users.length;
    document.getElementById('totalUsers').textContent = appState.users.length;
    document.getElementById('activeUsers').textContent = appState.users.filter(u => u.isActive).length;
    document.getElementById('inactiveUsers').textContent = appState.users.filter(u => !u.isActive).length;

    tbody.innerHTML = appState.users
        .map((user, idx) => `
            <tr>
                <td>${idx + 1}</td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.password}</td>
                <td>
                    <button class="toggle ${user.isActive ? 'active' : 'inactive'}"
                            onclick="toggleUserStatus(${user.id})"
                            title="${user.isActive ? 'Click to deactivate' : 'Click to activate'}">
                        <span class="toggle-slider"></span>
                    </button>
                </td>
                <td>
                    <button class="btn-delete" onclick="deleteUser(${user.id})">🗑️</button>
                </td>
            </tr>
        `)
        .join('');
}
