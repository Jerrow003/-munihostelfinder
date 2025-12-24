// admin-management.js - Complete Super Admin Management

// Check if user is super admin
const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
if (!currentUser || currentUser.role !== 'super_admin') {
    alert('❌ Access denied. Super admin privileges required.');
    window.location.href = 'backend.html';
}

// DOM Elements
const usersContainer = document.getElementById('usersContainer');
const searchUsersInput = document.getElementById('searchUsers');
const roleStatsDiv = document.getElementById('roleStats');
const addUserBtn = document.getElementById('addUserBtn');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadAllUsers();
    displayRoleStats();
    setupEventListeners();
    setupLogout();
});

function loadAllUsers(filter = '') {
    usersContainer.innerHTML = '';
    
    const users = securityManager.getUsers(currentUser);
    
    // Filter users if search term provided
    const filteredUsers = users.filter(user => 
        user.firstName?.toLowerCase().includes(filter.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(filter.toLowerCase()) ||
        user.email?.toLowerCase().includes(filter.toLowerCase()) ||
        user.role?.toLowerCase().includes(filter.toLowerCase()) ||
        user.hostelName?.toLowerCase().includes(filter.toLowerCase())
    );
    
    if (filteredUsers.length === 0) {
        usersContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <i class="fas fa-users" style="font-size: 3rem; color: #6c757d;"></i>
                <p>No users found</p>
                ${filter ? '<p>Try a different search term</p>' : ''}
            </div>
        `;
        return;
    }
    
    // Sort users: super admins first, then by creation date
    filteredUsers.sort((a, b) => {
        if (a.role === 'super_admin' && b.role !== 'super_admin') return -1;
        if (a.role !== 'super_admin' && b.role === 'super_admin') return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    filteredUsers.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'admin-card';
        
        const roleClass = `role-${user.role.split('_')[0]}`;
        const roleDisplay = user.role.replace('_', ' ').toUpperCase();
        const statusClass = `status-${user.status}`;
        
        let hostelInfo = '';
        if (user.role === 'hostel_admin') {
            const hostels = JSON.parse(localStorage.getItem('hostels') || '[]');
            const assignedHostel = hostels.find(h => h.ownerId === user.id);
            
            hostelInfo = `
                <div class="hostel-assignment">
                    <strong>Hostel Assignment:</strong><br>
                    ${assignedHostel ? 
                        `<span class="text-success">✓ ${assignedHostel.name}</span>` : 
                        `<span class="text-danger">✗ Not assigned</span>`}
                </div>
            `;
        }
        
        userCard.innerHTML = `
            <div class="admin-header">
                <div>
                    <h3>${user.firstName} ${user.lastName}</h3>
                    <small>${user.email}</small>
                </div>
                <div style="text-align: right;">
                    <span class="admin-role ${roleClass}">${roleDisplay}</span><br>
                    <span class="${statusClass}" style="font-size: 0.8rem;">${user.status.toUpperCase()}</span>
                </div>
            </div>
            
            <div class="admin-info">
                <p><strong>Phone:</strong> ${user.phone}</p>
                <p><strong>Member Since:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
                ${user.lastLogin ? `<p><strong>Last Login:</strong> ${new Date(user.lastLogin).toLocaleString()}</p>` : ''}
                <p><strong>User ID:</strong> <code>${user.id}</code></p>
            </div>
            
            ${hostelInfo}
            
            <div class="admin-actions">
                ${user.role !== 'super_admin' ? `
                    <button class="btn btn-sm btn-primary edit-role-btn" data-user-id="${user.id}">
                        <i class="fas fa-user-cog"></i> Edit Role
                    </button>
                ` : ''}
                
                ${user.role === 'hostel_admin' ? `
                    <button class="btn btn-sm btn-secondary assign-hostel-btn" data-user-id="${user.id}">
                        <i class="fas fa-bed"></i> Assign Hostel
                    </button>
                ` : ''}
                
                <button class="btn btn-sm btn-info view-permissions-btn" data-user-id="${user.id}">
                    <i class="fas fa-key"></i> Permissions
                </button>
                
                ${user.role !== 'super_admin' ? `
                    <button class="btn btn-sm ${user.status === 'active' ? 'btn-warning' : 'btn-success'} toggle-status-btn" 
                            data-user-id="${user.id}" data-status="${user.status}">
                        <i class="fas fa-power-off"></i> ${user.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                ` : ''}
            </div>
        `;
        
        usersContainer.appendChild(userCard);
    });
    
    attachEventListenersToCards();
}

function displayRoleStats() {
    const users = securityManager.getUsers(currentUser);
    const hostels = JSON.parse(localStorage.getItem('hostels') || '[]');
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    const roleCounts = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
    }, {});
    
    const activeUsers = users.filter(u => u.status === 'active').length;
    const pendingUsers = users.filter(u => u.status === 'pending').length;
    const assignedHostels = hostels.filter(h => h.ownerId).length;
    const unassignedHostels = hostels.filter(h => !h.ownerId).length;
    
    roleStatsDiv.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
            <div class="stat-card">
                <div class="stat-icon users" style="background-color: rgba(160, 44, 44, 0.1); color: #a02c2c;">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-info">
                    <h3>${users.length}</h3>
                    <p>Total Users</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background-color: rgba(40, 167, 69, 0.1); color: #28a745;">
                    <i class="fas fa-user-check"></i>
                </div>
                <div class="stat-info">
                    <h3>${activeUsers}</h3>
                    <p>Active Users</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background-color: rgba(255, 193, 7, 0.1); color: #ffc107;">
                    <i class="fas fa-user-clock"></i>
                </div>
                <div class="stat-info">
                    <h3>${pendingUsers}</h3>
                    <p>Pending Approval</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background-color: rgba(0, 123, 255, 0.1); color: #007bff;">
                    <i class="fas fa-bed"></i>
                </div>
                <div class="stat-info">
                    <h3>${assignedHostels}</h3>
                    <p>Assigned Hostels</p>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 2rem;">
            <h3>Quick Actions</h3>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem;">
                <button class="btn btn-primary" id="createHostelAdminBtn">
                    <i class="fas fa-user-shield"></i> Create Hostel Admin
                </button>
                <button class="btn btn-secondary" id="viewSecurityLogsBtn">
                    <i class="fas fa-shield-alt"></i> View Security Logs
                </button>
                <button class="btn btn-info" id="exportSystemDataBtn">
                    <i class="fas fa-download"></i> Export System Data
                </button>
                <button class="btn btn-warning" id="assignAllHostelsBtn">
                    <i class="fas fa-tasks"></i> Bulk Assign Hostels
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners to quick action buttons
    document.getElementById('createHostelAdminBtn').addEventListener('click', createHostelAdmin);
    document.getElementById('viewSecurityLogsBtn').addEventListener('click', viewSecurityLogs);
    document.getElementById('exportSystemDataBtn').addEventListener('click', exportSystemData);
    document.getElementById('assignAllHostelsBtn').addEventListener('click', bulkAssignHostels);
}

function setupEventListeners() {
    if (searchUsersInput) {
        searchUsersInput.addEventListener('input', function() {
            loadAllUsers(this.value);
        });
    }
    
    if (addUserBtn) {
        addUserBtn.addEventListener('click', createNewUser);
    }
}

function attachEventListenersToCards() {
    document.querySelectorAll('.edit-role-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            editUserRole(userId);
        });
    });
    
    document.querySelectorAll('.assign-hostel-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            assignHostelToAdmin(userId);
        });
    });
    
    document.querySelectorAll('.view-permissions-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            viewUserPermissions(userId);
        });
    });
    
    document.querySelectorAll('.toggle-status-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            const currentStatus = this.getAttribute('data-status');
            toggleUserStatus(userId, currentStatus);
        });
    });
}

function editUserRole(userId) {
    const users = securityManager.getUsers(currentUser);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        alert('User not found');
        return;
    }
    
    if (user.role === 'super_admin') {
        alert('Cannot change super admin role');
        return;
    }
    
    const newRole = prompt(`Change role for ${user.firstName} ${user.lastName}\n\nCurrent: ${user.role}\n\nEnter new role (hostel_admin or user):`, user.role);
    
    if (!newRole || !['hostel_admin', 'user'].includes(newRole)) {
        alert('Invalid role');
        return;
    }
    
    try {
        securityManager.updateUserRole(userId, newRole, currentUser);
        alert('✅ Role updated successfully');
        loadAllUsers();
        displayRoleStats();
    } catch (error) {
        alert('❌ Error: ' + error.message);
    }
}

function assignHostelToAdmin(userId) {
    const users = securityManager.getUsers(currentUser);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        alert('User not found');
        return;
    }
    
    if (user.role !== 'hostel_admin') {
        alert('User is not a hostel admin');
        return;
    }
    
    const hostels = JSON.parse(localStorage.getItem('hostels') || '[]');
    const unassignedHostels = hostels.filter(h => !h.ownerId);
    const assignedHostels = hostels.filter(h => h.ownerId === userId);
    
    if (unassignedHostels.length === 0 && assignedHostels.length === 0) {
        alert('No unassigned hostels available');
        return;
    }
    
    let message = `Assign hostel to ${user.firstName} ${user.lastName}\n\n`;
    
    if (assignedHostels.length > 0) {
        message += `Currently assigned: ${assignedHostels.map(h => h.name).join(', ')}\n\n`;
    }
    
    message += 'Available hostels:\n';
    unassignedHostels.forEach((hostel, index) => {
        message += `${index + 1}. ${hostel.name} - ${hostel.location}\n`;
    });
    
    const selection = prompt(message + '\nEnter hostel number to assign (or leave empty to unassign):');
    
    if (selection === null) return;
    
    if (selection === '') {
        // Unassign all hostels from this admin
        hostels.forEach(h => {
            if (h.ownerId === userId) {
                h.ownerId = null;
            }
        });
        
        // Update user
        const userIndex = users.findIndex(u => u.id === userId);
        users[userIndex].hostelId = null;
        users[userIndex].hostelName = null;
        
        localStorage.setItem('hostels', JSON.stringify(hostels));
        localStorage.setItem('secureUsers', JSON.stringify(users));
        
        alert('✅ Hostel unassigned successfully');
        loadAllUsers();
        return;
    }
    
    const hostelIndex = parseInt(selection) - 1;
    
    if (isNaN(hostelIndex) || hostelIndex < 0 || hostelIndex >= unassignedHostels.length) {
        alert('Invalid selection');
        return;
    }
    
    const selectedHostel = unassignedHostels[hostelIndex];
    
    try {
        securityManager.assignHostelToAdmin(userId, selectedHostel.id);
        alert(`✅ Successfully assigned ${selectedHostel.name} to ${user.firstName}`);
        loadAllUsers();
    } catch (error) {
        alert('❌ Error: ' + error.message);
    }
}

function viewUserPermissions(userId) {
    const users = securityManager.getUsers(currentUser);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        alert('User not found');
        return;
    }
    
    const permissions = user.permissions || [];
    const permissionList = permissions.length > 0 ? 
        permissions.map(p => `• ${p}`).join('\n') : 
        'No specific permissions';
    
    alert(`Permissions for ${user.firstName} ${user.lastName} (${user.role}):\n\n${permissionList}`);
}

function toggleUserStatus(userId, currentStatus) {
    const users = securityManager.getUsers(currentUser);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        alert('User not found');
        return;
    }
    
    const user = users[userIndex];
    
    if (user.role === 'super_admin') {
        alert('Cannot deactivate super admin');
        return;
    }
    
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'deactivate';
    
    if (!confirm(`Are you sure you want to ${action} ${user.firstName} ${user.lastName}?`)) {
        return;
    }
    
    users[userIndex].status = newStatus;
    localStorage.setItem('secureUsers', JSON.stringify(users));
    
    securityManager.logSecurityEvent('user_status_changed', {
        userId: userId,
        oldStatus: currentStatus,
        newStatus: newStatus,
        changedBy: currentUser.id
    });
    
    alert(`✅ User ${action}d successfully`);
    loadAllUsers();
    displayRoleStats();
}

function createNewUser() {
    // Show user creation form
    const formHtml = `
        <div style="max-width: 500px; margin: 0 auto;">
            <h3>Create New User</h3>
            <div class="form-group">
                <label>First Name</label>
                <input type="text" id="newFirstName" class="form-control" placeholder="Enter first name" required>
            </div>
            <div class="form-group">
                <label>Last Name</label>
                <input type="text" id="newLastName" class="form-control" placeholder="Enter last name" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="newEmail" class="form-control" placeholder="Enter email" required>
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="tel" id="newPhone" class="form-control" placeholder="Enter phone" required>
            </div>
            <div class="form-group">
                <label>Role</label>
                <select id="newRole" class="form-control">
                    <option value="user">Student User</option>
                    <option value="hostel_admin">Hostel Admin</option>
                </select>
            </div>
            <div class="form-group" id="hostelNameField" style="display: none;">
                <label>Hostel Name (Optional)</label>
                <input type="text" id="newHostelName" class="form-control" placeholder="Enter hostel name">
            </div>
            <div class="form-group">
                <label>Temporary Password</label>
                <input type="text" id="newPassword" class="form-control" value="${generateTempPassword()}" readonly>
                <small class="text-muted">User will be prompted to change password on first login</small>
            </div>
        </div>
    `;
    
    const modal = createModal('Create User', formHtml, 'Create User', 'Cancel');
    
    // Show/hide hostel name field based on role
    const roleSelect = modal.querySelector('#newRole');
    const hostelNameField = modal.querySelector('#hostelNameField');
    
    roleSelect.addEventListener('change', function() {
        hostelNameField.style.display = this.value === 'hostel_admin' ? 'block' : 'none';
    });
    
    // Handle create button click
    modal.querySelector('.modal-primary-btn').addEventListener('click', function() {
        const firstName = modal.querySelector('#newFirstName').value.trim();
        const lastName = modal.querySelector('#newLastName').value.trim();
        const email = modal.querySelector('#newEmail').value.trim();
        const phone = modal.querySelector('#newPhone').value.trim();
        const role = modal.querySelector('#newRole').value;
        const hostelName = modal.querySelector('#newHostelName')?.value.trim() || '';
        const password = modal.querySelector('#newPassword').value;
        
        if (!firstName || !lastName || !email || !phone) {
            alert('Please fill in all required fields');
            return;
        }
        
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        try {
            const userData = {
                firstName,
                lastName,
                email,
                phone,
                password,
                role,
                hostelName: role === 'hostel_admin' ? hostelName : null,
                hostelId: null,
                mustChangePassword: true
            };
            
            const newUser = securityManager.createUser(userData);
            
            alert(`✅ User created successfully!\n\nEmail: ${email}\nTemporary Password: ${password}\n\nUser must change password on first login.`);
            
            modal.remove();
            loadAllUsers();
            displayRoleStats();
            
        } catch (error) {
            alert('❌ Error: ' + error.message);
        }
    });
}

function createHostelAdmin() {
    // Set role to hostel admin and open create user modal
    createNewUser();
    // Note: The modal will handle the rest
}

function viewSecurityLogs() {
    const logs = securityManager.getSecurityLogs();
    
    if (logs.length === 0) {
        alert('No security logs found.');
        return;
    }
    
    const logHtml = `
        <div style="max-height: 400px; overflow-y: auto;">
            <h4>Security Logs (${logs.length} entries)</h4>
            <table class="table" style="font-size: 0.9rem;">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Event</th>
                        <th>User</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    ${logs.reverse().map(log => `
                        <tr>
                            <td>${new Date(log.timestamp).toLocaleTimeString()}</td>
                            <td><span class="badge ${getLogBadgeClass(log.event)}">${log.event}</span></td>
                            <td>${log.userId || 'anonymous'}</td>
                            <td><small>${JSON.stringify(log.details)}</small></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    createModal('Security Logs', logHtml, 'Clear Logs', 'Close');
    
    // Handle clear logs button
    const clearBtn = document.querySelector('.modal-primary-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('Clear all security logs? This action cannot be undone.')) {
                securityManager.clearSecurityLogs();
                alert('✅ Security logs cleared');
                document.querySelector('.modal').remove();
            }
        });
    }
}

function getLogBadgeClass(event) {
    if (event.includes('failed') || event.includes('error')) return 'badge-danger';
    if (event.includes('success') || event.includes('created')) return 'badge-success';
    if (event.includes('login') || event.includes('logout')) return 'badge-primary';
    if (event.includes('updated') || event.includes('changed')) return 'badge-warning';
    return 'badge-secondary';
}

function exportSystemData() {
    if (!confirm('Export complete system data? This contains sensitive information.')) {
        return;
    }
    
    const exportData = {
        timestamp: new Date().toISOString(),
        exportedBy: currentUser.id,
        data: {
            users: securityManager.getUsers(currentUser).map(user => {
                const { password, ...safeUser } = user;
                return safeUser;
            }),
            hostels: JSON.parse(localStorage.getItem('hostels') || '[]'),
            bookings: JSON.parse(localStorage.getItem('bookings') || '[]'),
            securityLogs: securityManager.getSecurityLogs()
        }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileName = `muni-hostel-system-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    
    securityManager.logSecurityEvent('system_data_exported', {
        exportedBy: currentUser.id
    });
}

function bulkAssignHostels() {
    const hostelAdmins = securityManager.getAllHostelAdmins();
    const unassignedHostels = securityManager.getUnassignedHostels();
    
    if (unassignedHostels.length === 0) {
        alert('No unassigned hostels available');
        return;
    }
    
    if (hostelAdmins.length === 0) {
        alert('No hostel admins available');
        return;
    }
    
    let message = 'Bulk Assign Hostels\n\n';
    message += `Unassigned Hostels: ${unassignedHostels.length}\n`;
    message += `Available Hostel Admins: ${hostelAdmins.length}\n\n`;
    
    message += 'Unassigned Hostels:\n';
    unassignedHostels.forEach((hostel, index) => {
        message += `${index + 1}. ${hostel.name}\n`;
    });
    
    message += '\nAvailable Admins:\n';
    hostelAdmins.forEach((admin, index) => {
        const assignedHostels = JSON.parse(localStorage.getItem('hostels') || '[]')
            .filter(h => h.ownerId === admin.id).length;
        message += `${index + 1}. ${admin.firstName} ${admin.lastName} (${assignedHostels} assigned)\n`;
    });
    
    alert(message + '\nThis feature would assign hostels to admins automatically in a real implementation.');
}

function generateTempPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function createModal(title, content, primaryBtnText, secondaryBtnText) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="close">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary modal-secondary-btn">${secondaryBtnText}</button>
                <button class="btn btn-primary modal-primary-btn">${primaryBtnText}</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal buttons
    modal.querySelector('.close').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-secondary-btn').addEventListener('click', () => modal.remove());
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    return modal;
}

function setupLogout() {
    const logoutLinks = document.querySelectorAll('a[href="index.html"]');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                securityManager.logSecurityEvent('logout', { userId: currentUser.id });
                sessionStorage.clear();
                window.location.href = 'index.html';
            }
        });
    });
}