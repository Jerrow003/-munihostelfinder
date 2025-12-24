// backend.js - Complete Admin Dashboard with Role-based Access

// Check authentication
const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
if (!currentUser) {
    window.location.href = 'index.html';
    throw new Error('Not authenticated');
}

// Check if user has admin access
if (currentUser.role === 'user') {
    alert('You do not have permission to access the admin dashboard.');
    window.location.href = 'frontend.html';
    throw new Error('Unauthorized access');
}

// DOM Elements
const addHostelBtn = document.getElementById('addHostelBtn');
const addHostelModal = document.getElementById('addHostelModal');
const closeModal = document.querySelector('.close');
const cancelBtn = document.getElementById('cancelBtn');
const saveHostelBtn = document.getElementById('saveHostelBtn');
const hostelForm = document.getElementById('hostelForm');
const hostelsTableBody = document.getElementById('hostelsTableBody');
const bookingsTableBody = document.getElementById('bookingsTableBody');
const exportBtn = document.getElementById('exportBtn');
const statsContainer = document.querySelector('.stats-container');

// Data storage functions
function getHostels() {
    return JSON.parse(localStorage.getItem('hostels') || '[]');
}

function saveHostels(hostels) {
    localStorage.setItem('hostels', JSON.stringify(hostels));
}

function getBookings() {
    return JSON.parse(localStorage.getItem('bookings') || '[]');
}

function saveBookings(bookings) {
    localStorage.setItem('bookings', JSON.stringify(bookings));
}

function getUsers() {
    return JSON.parse(localStorage.getItem('secureUsers') || '[]');
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Display user info with role
    displayUserInfo();
    
    // Update stats based on role
    updateDashboardStats();
    
    // Display filtered data
    displayHostels();
    displayBookings();
    
    // Setup event listeners
    setupEventListeners();
    
    // Show/hide features based on role
    configureUIByRole();
    
    // Setup menu navigation
    setupMenuNavigation();
});

function displayUserInfo() {
    const userInfoDiv = document.querySelector('.user-info div:last-child div');
    const roleBadge = document.createElement('span');
    
    roleBadge.className = 'role-badge';
    roleBadge.textContent = currentUser.role.replace('_', ' ').toUpperCase();
    roleBadge.style.marginLeft = '10px';
    roleBadge.style.padding = '2px 8px';
    roleBadge.style.borderRadius = '3px';
    roleBadge.style.fontSize = '0.7rem';
    roleBadge.style.fontWeight = '600';
    
    // Color code by role
    if (currentUser.role === 'super_admin') {
        roleBadge.style.backgroundColor = '#dc3545';
        roleBadge.style.color = 'white';
    } else if (currentUser.role === 'hostel_admin') {
        roleBadge.style.backgroundColor = '#28a745';
        roleBadge.style.color = 'white';
    } else {
        roleBadge.style.backgroundColor = '#6c757d';
        roleBadge.style.color = 'white';
    }
    
    userInfoDiv.appendChild(roleBadge);
    
    // Update username display
    const usernameDiv = userInfoDiv.parentNode.querySelector('div:first-child');
    usernameDiv.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
}

function updateDashboardStats() {
    const hostels = securityManager.filterHostelsByRole(currentUser);
    const bookings = securityManager.filterBookingsByRole(currentUser);
    const users = getUsers();
    
    // Calculate stats
    const totalHostels = hostels.length;
    const totalBookings = bookings.length;
    
    // Calculate revenue (sum of booking amounts)
    let totalRevenue = 0;
    bookings.forEach(booking => {
        const amount = parseFloat(booking.amount.replace(/[^0-9.]/g, '')) || 0;
        totalRevenue += amount;
    });
    
    // Count active users
    const activeUsers = users.filter(u => u.status === 'active' && u.role === 'user').length;
    
    // Update stats cards
    const statCards = statsContainer.querySelectorAll('.stat-card');
    
    // Total Hostels
    statCards[0].querySelector('h3').textContent = totalHostels;
    
    // Registered Users (show only for super admin)
    if (currentUser.role === 'super_admin') {
        statCards[1].querySelector('h3').textContent = activeUsers;
        statCards[1].style.display = 'flex';
    } else {
        statCards[1].style.display = 'none';
    }
    
    // Active Bookings
    const activeBookings = bookings.filter(b => b.status === 'confirmed').length;
    statCards[2].querySelector('h3').textContent = activeBookings;
    
    // Total Revenue
    statCards[3].querySelector('h3').textContent = formatCurrency(totalRevenue);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: 'UGX',
        minimumFractionDigits: 0
    }).format(amount);
}

function displayHostels() {
    hostelsTableBody.innerHTML = '';
    
    const hostels = securityManager.filterHostelsByRole(currentUser);
    
    if (hostels.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="6" style="text-align: center; padding: 2rem;">
                <i class="fas fa-info-circle" style="font-size: 2rem; color: #6c757d; margin-bottom: 1rem;"></i>
                <p>No hostels found</p>
                ${currentUser.role === 'hostel_admin' ? 
                    '<p>Contact the system administrator to assign you a hostel.</p>' : ''}
            </td>
        `;
        hostelsTableBody.appendChild(row);
        return;
    }
    
    hostels.forEach(hostel => {
        const row = document.createElement('tr');
        
        let statusClass = '';
        let statusText = '';
        
        switch(hostel.status) {
            case 'active': statusClass = 'status-active'; statusText = 'Active'; break;
            case 'pending': statusClass = 'status-pending'; statusText = 'Pending'; break;
            case 'inactive': statusClass = 'status-cancelled'; statusText = 'Inactive'; break;
            default: statusClass = 'status-pending'; statusText = 'Pending';
        }
        
        row.innerHTML = `
            <td>${hostel.name}</td>
            <td>${hostel.location}</td>
            <td>UGX ${hostel.price}</td>
            <td>${hostel.capacity}</td>
            <td class="${statusClass}">${statusText}</td>
            <td>
                ${securityManager.canAccessHostel(currentUser, hostel.id) ? 
                    `<button class="btn btn-secondary btn-sm edit-hostel" data-id="${hostel.id}">
                        <i class="fas fa-edit"></i>
                    </button>` : ''}
                ${securityManager.hasPermission(currentUser, 'manage_all_hostels') ? 
                    `<button class="btn btn-danger btn-sm delete-hostel" data-id="${hostel.id}">
                        <i class="fas fa-trash"></i>
                    </button>` : ''}
            </td>
        `;
        
        hostelsTableBody.appendChild(row);
    });
    
    // Add event listeners
    document.querySelectorAll('.edit-hostel').forEach(button => {
        button.addEventListener('click', function() {
            const hostelId = parseInt(this.getAttribute('data-id'));
            editHostel(hostelId);
        });
    });
    
    document.querySelectorAll('.delete-hostel').forEach(button => {
        button.addEventListener('click', function() {
            const hostelId = parseInt(this.getAttribute('data-id'));
            deleteHostel(hostelId);
        });
    });
}

function displayBookings() {
    bookingsTableBody.innerHTML = '';
    
    const bookings = securityManager.filterBookingsByRole(currentUser);
    
    if (bookings.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="7" style="text-align: center; padding: 2rem;">
                <i class="fas fa-info-circle" style="font-size: 2rem; color: #6c757d; margin-bottom: 1rem;"></i>
                <p>No bookings found</p>
            </td>
        `;
        bookingsTableBody.appendChild(row);
        return;
    }
    
    bookings.forEach(booking => {
        const row = document.createElement('tr');
        
        let statusClass = '';
        let statusText = '';
        
        switch(booking.status) {
            case 'confirmed': statusClass = 'status-confirmed'; statusText = 'Confirmed'; break;
            case 'pending': statusClass = 'status-pending'; statusText = 'Pending'; break;
            case 'cancelled': statusClass = 'status-cancelled'; statusText = 'Cancelled'; break;
            default: statusClass = 'status-pending'; statusText = 'Pending';
        }
        
        row.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.userName || booking.userEmail}</td>
            <td>${booking.hostelName}</td>
            <td>${formatDate(booking.checkIn)}</td>
            <td>${formatDate(booking.checkOut)}</td>
            <td>${booking.amount}</td>
            <td class="${statusClass}">${statusText}</td>
        `;
        
        bookingsTableBody.appendChild(row);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-UG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function setupEventListeners() {
    // Modal functionality
    if (addHostelBtn) {
        addHostelBtn.addEventListener('click', () => {
            addHostelModal.style.display = 'flex';
            hostelForm.reset();
            resetCheckboxes();
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            addHostelModal.style.display = 'none';
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            addHostelModal.style.display = 'none';
        });
    }
    
    if (saveHostelBtn) {
        saveHostelBtn.addEventListener('click', saveHostel);
    }
    
    // Export button
    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === addHostelModal) {
            addHostelModal.style.display = 'none';
        }
    });
}

function resetCheckboxes() {
    document.getElementById('featureWifi').checked = true;
    document.getElementById('featureWater').checked = true;
    document.getElementById('featureElectricity').checked = true;
    document.getElementById('featureSecurity').checked = true;
}

function saveHostel() {
    // Only super admins can add new hostels
    if (!securityManager.hasPermission(currentUser, 'manage_all_hostels')) {
        alert('You do not have permission to add new hostels.');
        addHostelModal.style.display = 'none';
        return;
    }
    
    const name = document.getElementById('hostelName').value;
    const price = document.getElementById('hostelPrice').value;
    const location = document.getElementById('hostelLocation').value;
    const capacity = document.getElementById('hostelCapacity').value;
    const address = document.getElementById('hostelAddress').value;
    const phone = document.getElementById('hostelPhone').value;
    const email = document.getElementById('hostelEmail').value;
    const description = document.getElementById('hostelDescription').value;
    const image = document.getElementById('hostelImage').value;
    
    const features = {
        wifi: document.getElementById('featureWifi').checked,
        water: document.getElementById('featureWater').checked,
        electricity: document.getElementById('featureElectricity').checked,
        security: document.getElementById('featureSecurity').checked
    };
    
    // Validate form
    if (!name || !price || !location || !capacity || !address || !phone || !email) {
        alert('Please fill in all required fields');
        return;
    }
    
    const hostels = getHostels();
    const newHostel = {
        id: hostels.length > 0 ? Math.max(...hostels.map(h => h.id)) + 1 : 1,
        name,
        price,
        location,
        address,
        phone,
        email,
        capacity: parseInt(capacity),
        description,
        features,
        image: image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        status: 'active',
        ownerId: null,
        createdBy: currentUser.id,
        createdAt: new Date().toISOString()
    };
    
    hostels.push(newHostel);
    saveHostels(hostels);
    
    // Log security event
    securityManager.logSecurityEvent('hostel_created', {
        hostelId: newHostel.id,
        createdBy: currentUser.id
    });
    
    displayHostels();
    updateDashboardStats();
    
    addHostelModal.style.display = 'none';
    alert('Hostel saved successfully!');
}

function editHostel(id) {
    const hostels = getHostels();
    const hostel = hostels.find(h => h.id === id);
    
    if (!hostel) {
        alert('Hostel not found');
        return;
    }
    
    if (!securityManager.canAccessHostel(currentUser, hostel.id)) {
        alert('You do not have permission to edit this hostel.');
        return;
    }
    
    document.getElementById('hostelName').value = hostel.name;
    document.getElementById('hostelPrice').value = hostel.price;
    document.getElementById('hostelLocation').value = hostel.location;
    document.getElementById('hostelCapacity').value = hostel.capacity;
    document.getElementById('hostelAddress').value = hostel.address;
    document.getElementById('hostelPhone').value = hostel.phone;
    document.getElementById('hostelEmail').value = hostel.email;
    document.getElementById('hostelDescription').value = hostel.description;
    document.getElementById('hostelImage').value = hostel.image;
    
    document.getElementById('featureWifi').checked = hostel.features.wifi;
    document.getElementById('featureWater').checked = hostel.features.water;
    document.getElementById('featureElectricity').checked = hostel.features.electricity;
    document.getElementById('featureSecurity').checked = hostel.features.security;
    
    saveHostelBtn.textContent = 'Update Hostel';
    saveHostelBtn.onclick = function() {
        updateHostel(id);
    };
    
    addHostelModal.style.display = 'flex';
}

function updateHostel(id) {
    const hostels = getHostels();
    const hostelIndex = hostels.findIndex(h => h.id === id);
    
    if (hostelIndex === -1) {
        alert('Hostel not found');
        return;
    }
    
    if (!securityManager.canAccessHostel(currentUser, id)) {
        alert('You do not have permission to update this hostel.');
        addHostelModal.style.display = 'none';
        return;
    }
    
    hostels[hostelIndex].name = document.getElementById('hostelName').value;
    hostels[hostelIndex].price = document.getElementById('hostelPrice').value;
    hostels[hostelIndex].location = document.getElementById('hostelLocation').value;
    hostels[hostelIndex].capacity = parseInt(document.getElementById('hostelCapacity').value);
    hostels[hostelIndex].address = document.getElementById('hostelAddress').value;
    hostels[hostelIndex].phone = document.getElementById('hostelPhone').value;
    hostels[hostelIndex].email = document.getElementById('hostelEmail').value;
    hostels[hostelIndex].description = document.getElementById('hostelDescription').value;
    hostels[hostelIndex].image = document.getElementById('hostelImage').value;
    
    hostels[hostelIndex].features = {
        wifi: document.getElementById('featureWifi').checked,
        water: document.getElementById('featureWater').checked,
        electricity: document.getElementById('featureElectricity').checked,
        security: document.getElementById('featureSecurity').checked
    };
    
    hostels[hostelIndex].updatedBy = currentUser.id;
    hostels[hostelIndex].updatedAt = new Date().toISOString();
    
    saveHostels(hostels);
    
    // Log security event
    securityManager.logSecurityEvent('hostel_updated', {
        hostelId: id,
        updatedBy: currentUser.id
    });
    
    displayHostels();
    
    addHostelModal.style.display = 'none';
    alert('Hostel updated successfully!');
    
    saveHostelBtn.textContent = 'Save Hostel';
    saveHostelBtn.onclick = saveHostel;
}

function deleteHostel(id) {
    if (!securityManager.hasPermission(currentUser, 'manage_all_hostels')) {
        alert('You do not have permission to delete hostels.');
        return;
    }
    
    if (!confirm('Are you sure you want to delete this hostel? This action cannot be undone.')) {
        return;
    }
    
    const hostels = getHostels();
    const hostelIndex = hostels.findIndex(h => h.id === id);
    
    if (hostelIndex === -1) {
        alert('Hostel not found');
        return;
    }
    
    // Log before deletion
    securityManager.logSecurityEvent('hostel_deleted', {
        hostelId: id,
        deletedBy: currentUser.id,
        hostelName: hostels[hostelIndex].name
    });
    
    hostels.splice(hostelIndex, 1);
    saveHostels(hostels);
    
    displayHostels();
    updateDashboardStats();
    
    alert('Hostel deleted successfully!');
}

function exportData() {
    if (!securityManager.hasPermission(currentUser, 'export_data')) {
        alert('You do not have permission to export data.');
        return;
    }
    
    if (!confirm('Export data? This may contain sensitive information.')) {
        return;
    }
    
    const exportData = {
        timestamp: new Date().toISOString(),
        exportedBy: currentUser.id,
        userRole: currentUser.role,
        data: {
            hostels: securityManager.filterHostelsByRole(currentUser),
            bookings: securityManager.filterBookingsByRole(currentUser)
        }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileName = `muni-hostel-data-${currentUser.role}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    
    securityManager.logSecurityEvent('data_exported', {
        exportedBy: currentUser.id,
        userRole: currentUser.role
    });
}

function configureUIByRole() {
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    
    menuItems.forEach(item => {
        const linkText = item.querySelector('span')?.textContent;
        
        switch(linkText) {
            case 'Users':
                if (!securityManager.hasPermission(currentUser, 'manage_users')) {
                    item.style.display = 'none';
                } else {
                    item.querySelector('a').href = 'admin-management.html';
                }
                break;
                
            case 'Locations':
            case 'Settings':
                if (currentUser.role !== 'super_admin') {
                    item.style.display = 'none';
                }
                break;
                
            case 'Hostels':
                // Hostel admins can view their hostel
                break;
                
            case 'Bookings':
                // All admins can view their bookings
                break;
        }
    });
    
    // Hide "Add New Hostel" button for non-super admins
    if (!securityManager.hasPermission(currentUser, 'manage_all_hostels')) {
        if (addHostelBtn) {
            addHostelBtn.style.display = 'none';
        }
    }
}

function setupMenuNavigation() {
    // Handle navigation to admin management for super admins
    const usersMenuItem = document.querySelector('a[href="#"] span');
    if (usersMenuItem && usersMenuItem.textContent === 'Users') {
        const link = usersMenuItem.parentNode;
        if (securityManager.hasPermission(currentUser, 'manage_users')) {
            link.href = 'admin-management.html';
        }
    }
}

// Logout functionality
document.addEventListener('DOMContentLoaded', function() {
    const logoutLink = document.querySelector('a[href="index.html"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                securityManager.logSecurityEvent('logout', { userId: currentUser.id });
                sessionStorage.clear();
                window.location.href = 'index.html';
            }
        });
    }
});
