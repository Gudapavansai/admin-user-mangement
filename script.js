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

// SWITCH TABS - CLEAR ERRORS
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

    // Clear all error messages
    document.getElementById('adminMessage').textContent = '';
    document.getElementById('regMessage').textContent = '';
    document.getElementById('errorMessage').textContent = '';
    document.getElementById('errorMessage').classList.remove('show');
}

// PAGE NAVIGATION - CLEAR ALL ERRORS
function showPage(page) {
    document.getElementById('portalPage').classList.add('hidden');
    document.getElementById('successPage').classList.add('hidden');
    document.getElementById('regSuccessPage').classList.add('hidden');
    document.getElementById('dashboardPage').classList.add('hidden');

    // Clear all messages
    document.getElementById('adminMessage').textContent = '';
    document.getElementById('regMessage').textContent = '';
    document.getElementById('errorMessage').textContent = '';
    document.getElementById('successNotification').textContent = '';
    document.getElementById('errorMessage').classList.remove('show');
    document.getElementById('successNotification').classList.remove('show');

    if (page === 'portal') {
        document.getElementById('portalPage').classList.remove('hidden');
        switchTab('admin');
    } else if (page === 'success') {
        document.getElementById('successPage').classList.remove('hidden');
    } else if (page === 'regSuccess') {
        document.getElementById('regSuccessPage').classList.remove('hidden');
        // Auto redirect to portal after 3 seconds
        setTimeout(() => {
            showPage('portal');
        }, 3000);
    } else if (page === 'dashboard') {
        document.getElementById('dashboardPage').classList.remove('hidden');
        renderUsers();
    }
    appState.currentPage = page;
}

// ADMIN LOGIN
function handleAdminLogin() {
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    const messageEl = document.getElementById('adminMessage');

    messageEl.textContent = '';

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

// USER REGISTRATION
function handleRegister() {
    const firstName = document.getElementById('regFirstName').value.trim();
    const lastName = document.getElementById('regLastName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const messageEl = document.getElementById('regMessage');

    messageEl.textContent = '';

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
    document.getElementById('regFirstName').value = '';
    document.getElementById('regLastName').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regPassword').value = '';

    // Clear form and notify dashboard if admin is logged in
    notifyNewUser(newUser);
    showPage('regSuccess');
}

// NOTIFY DASHBOARD OF NEW USER
function notifyNewUser(newUser) {
    if (appState.currentPage === 'dashboard') {
        const successEl = document.getElementById('successNotification');
        successEl.textContent = `✓ New user registered: ${newUser.firstName} ${newUser.lastName}`;
        successEl.classList.add('show');
        setTimeout(() => successEl.classList.remove('show'), 4000);
        renderUsers();
    }
}

// DASHBOARD FUNCTIONS
function goToDashboard() {
    document.getElementById('dashboardUsername').textContent = appState.adminUsername;
    showPage('dashboard');
}

function goToPortal() {
    showPage('portal');
}

function refreshDashboard() {
    const notification = document.getElementById('successNotification');
    notification.textContent = '✓ Dashboard refreshed! Data updated.';
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 3000);
}

function handleLogout() {
    appState.users = appState.users.map(u => ({ ...u, isActive: false }));
    appState.isLoggedIn = false;
    appState.adminUsername = '';
    showPage('portal');
}

// DELETE USER
function deleteUser(userId) {
    appState.users = appState.users.filter(u => u.id !== userId);
    const successEl = document.getElementById('successNotification');
    successEl.textContent = '✓ User deleted successfully!';
    successEl.classList.add('show');
    setTimeout(() => successEl.classList.remove('show'), 3000);
    renderUsers();
}

// TOGGLE USER STATUS
function toggleUserStatus(userId) {
    const user = appState.users.find(u => u.id === userId);
    if (user) {
        user.isActive = !user.isActive;
        renderUsers();
    }
}

// RENDER USERS TABLE
function renderUsers() {
    const tbody = document.getElementById('usersTableBody');
    const totalUsersEl = document.getElementById('userCount');
    const totalStats = document.getElementById('totalUsers');
    const activeStats = document.getElementById('activeUsers');
    const inactiveStats = document.getElementById('inactiveUsers');

    totalUsersEl.textContent = appState.users.length;
    totalStats.textContent = appState.users.length;
    activeStats.textContent = appState.users.filter(u => u.isActive).length;
    inactiveStats.textContent = appState.users.filter(u => !u.isActive).length;

    tbody.innerHTML = appState.users.map((user, idx) => `
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
                <button class="btn-delete" onclick="deleteUser(${user.id})" title="Delete user">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    showPage('portal');
});
