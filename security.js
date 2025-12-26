// Sample hostel data (contact info is included but will be hidden)
const hostels = [
    {
        id: 1,
        name: "Green Valley Hostel",
        price: "250,000",
        location: "2.3 km from Campus",
        address: "Plot 45, Arua Road",
        phone: "+256 772 123 456",
        email: "info@greenvalleyhostel.com",
        capacity: 120,
        description: "A serene environment with spacious rooms and 24/7 security. Located in a quiet neighborhood with easy access to campus.",
        features: {
            wifi: true,
            water: true,
            electricity: true,
            security: true
        },
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
    },
    {
        id: 2,
        name: "Campus View Hostel",
        price: "300,000",
        location: "1.2 km from Campus",
        address: "Plot 12, University Road",
        phone: "+256 752 987 654",
        email: "bookings@campusview.com",
        capacity: 80,
        description: "Modern facilities with study areas and recreational spaces. Perfect for serious students who value comfort.",
        features: {
            wifi: true,
            water: true,
            electricity: true,
            security: true
        },
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80"
    },
    {
        id: 3,
        name: "Student Comfort Hostel",
        price: "200,000",
        location: "3.1 km from Campus",
        address: "Plot 67, Mvara Road",
        phone: "+256 782 456 789",
        email: "comfort@studentcomfort.com",
        capacity: 100,
        description: "Affordable accommodation with clean facilities and friendly staff. We prioritize student comfort and safety.",
        features: {
            wifi: true,
            water: true,
            electricity: true,
            security: true
        },
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
        id: 4,
        name: "Muni Elite Hostel",
        price: "350,000",
        location: "0.8 km from Campus",
        address: "Plot 23, Campus Close",
        phone: "+256 712 345 678",
        email: "elite@munielite.com",
        capacity: 60,
        description: "Premium accommodation with ensuite rooms and modern amenities. The best choice for discerning students.",
        features: {
            wifi: true,
            water: true,
            electricity: true,
            security: true
        },
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
    }
];

// Check if user is logged in
function isUserLoggedIn() {
    const currentUser = sessionStorage.getItem('currentUser');
    return currentUser !== null;
}

// Function to display hostels (contact info hidden for non-logged users)
function displayHostels() {
    const container = document.getElementById('hostels-container');
    container.innerHTML = '';

    const loggedIn = isUserLoggedIn();
    
    // Update auth link text
    const authLink = document.getElementById('authLink');
    if (loggedIn) {
        const user = JSON.parse(sessionStorage.getItem('currentUser'));
        authLink.innerHTML = `<i class="fas fa-user"></i> ${user.firstName}`;
        authLink.href = "#";
    } else {
        authLink.innerHTML = '<i class="fas fa-user"></i> Login';
        authLink.href = "index.html";
    }

    hostels.forEach(hostel => {
        const card = document.createElement('div');
        card.className = 'hostel-card';
        
        card.innerHTML = `
            <img src="${hostel.image}" alt="${hostel.name}" class="hostel-img">
            <div class="hostel-info">
                <h3>${hostel.name}</h3>
                <div class="hostel-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${hostel.location}</span>
                </div>
                <div class="hostel-features">
                    <div class="hostel-feature">
                        <i class="fas fa-wifi ${hostel.features.wifi ? 'text-success' : 'text-muted'}"></i>
                        <span>WiFi</span>
                        // Basic security manager providing in-browser authentication and helpers
                        const securityManager = (function() {
                            function loadUsers() {
                                const users = JSON.parse(localStorage.getItem('secureUsers') || 'null');
                                if (!users) {
                                    // Create a default super admin for development
                                    const defaultAdmin = [{
                                        id: 'sa-1',
                                        firstName: 'Super',
                                        lastName: 'Admin',
                                        email: 'admin@muni.test',
                                        phone: '+256700000000',
                                        password: 'Admin@123',
                                        role: 'super_admin',
                                        status: 'active',
                                        createdAt: new Date().toISOString()
                                    }];
                                    localStorage.setItem('secureUsers', JSON.stringify(defaultAdmin));
                                    return defaultAdmin;
                                }
                                return users;
                            }

                            function saveUsers(users) {
                                localStorage.setItem('secureUsers', JSON.stringify(users));
                            }

                            function getUsers() {
                                return loadUsers();
                            }

                            function authenticate(email, password) {
                                const users = loadUsers();
                                const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase() && u.password === password);
                                if (!user) return null;
                                return Object.assign({}, user); // return copy (includes password for session in this simple demo)
                            }

                            function createUser(data) {
                                const users = loadUsers();
                                if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
                                    throw new Error('A user with that email already exists');
                                }
                                const id = 'u-' + Date.now();
                                const newUser = Object.assign({
                                    id,
                                    createdAt: new Date().toISOString(),
                                    status: 'pending'
                                }, data);
                                users.push(newUser);
                                saveUsers(users);
                                return newUser;
                            }

                            function updateUserRole(userId, newRole, actingUser) {
                                const users = loadUsers();
                                if (!actingUser || actingUser.role !== 'super_admin') throw new Error('Only super admins may change roles');
                                const idx = users.findIndex(u => u.id === userId);
                                if (idx === -1) throw new Error('User not found');
                                users[idx].role = newRole;
                                saveUsers(users);
                            }

                            function assignHostelToAdmin(userId, hostelId) {
                                const hostelsList = JSON.parse(localStorage.getItem('hostels') || JSON.stringify(hostels));
                                const users = loadUsers();
                                const hostel = hostelsList.find(h => h.id === hostelId);
                                if (!hostel) throw new Error('Hostel not found');
                                hostel.ownerId = userId;
                                localStorage.setItem('hostels', JSON.stringify(hostelsList));
                                const userIdx = users.findIndex(u => u.id === userId);
                                if (userIdx !== -1) {
                                    users[userIdx].hostelId = hostelId;
                                    users[userIdx].hostelName = hostel.name;
                                    saveUsers(users);
                                }
                            }

                            function hasPermission(user, permission) {
                                if (!user) return false;
                                if (user.role === 'super_admin') return true;
                                if (user.role === 'hostel_admin') return permission !== 'manage_all_hostels';
                                return false;
                            }

                            function canAccessHostel(user, hostelId) {
                                if (!user) return false;
                                if (user.role === 'super_admin') return true;
                                if (user.role === 'hostel_admin') return user.hostelId === hostelId;
                                return false;
                            }

                            function filterHostelsByRole(user) {
                                const hostelsList = JSON.parse(localStorage.getItem('hostels') || JSON.stringify(hostels));
                                if (!user) return hostelsList.filter(h => h.status === 'active');
                                if (user.role === 'super_admin') return hostelsList;
                                if (user.role === 'hostel_admin') return hostelsList.filter(h => h.ownerId === user.id);
                                return hostelsList.filter(h => h.status === 'active');
                            }

                            function filterBookingsByRole(user) {
                                const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
                                if (!user) return [];
                                if (user.role === 'super_admin') return bookings;
                                if (user.role === 'hostel_admin') return bookings.filter(b => {
                                    const hostelsList = JSON.parse(localStorage.getItem('hostels') || JSON.stringify(hostels));
                                    const owned = hostelsList.filter(h => h.ownerId === user.id).map(h => h.id);
                                    return owned.includes(b.hostelId);
                                });
                                return bookings.filter(b => b.userId === user.id);
                            }

                            function logSecurityEvent(eventType, details) {
                                const logs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
                                logs.push({ id: 'log-' + Date.now(), eventType, details, timestamp: new Date().toISOString() });
                                localStorage.setItem('securityLogs', JSON.stringify(logs));
                            }

                            return {
                                getUsers,
                                authenticate,
                                createUser,
                                updateUserRole,
                                assignHostelToAdmin,
                                hasPermission,
                                canAccessHostel,
                                filterHostelsByRole,
                                filterBookingsByRole,
                                logSecurityEvent
                            };
                        })();

                        // Utility: check if user is logged in
                        function isUserLoggedIn() {
                            return sessionStorage.getItem('currentUser') !== null;
                        }

                        // Display hostels for pages that use this file (basic implementation)
                        function displayHostels() {
                            const container = document.getElementById('hostels-container');
                            if (!container) return;
                            container.innerHTML = '';

                            const loggedIn = isUserLoggedIn();
                            const authLink = document.getElementById('authLink');
                            if (authLink) {
                                if (loggedIn) {
                                    const user = JSON.parse(sessionStorage.getItem('currentUser'));
                                    authLink.innerHTML = `<i class="fas fa-user"></i> ${user.firstName}`;
                                    authLink.href = '#';
                                } else {
                                    authLink.innerHTML = '<i class="fas fa-user"></i> Login';
                                    authLink.href = 'index.html';
                                }
                            }

                            const list = JSON.parse(localStorage.getItem('hostels') || JSON.stringify(hostels));
                            list.forEach(hostel => {
                                const card = document.createElement('div');
                                card.className = 'hostel-card';
                                card.innerHTML = `
                                    <img src="${hostel.image}" alt="${hostel.name}" class="hostel-img">
                                    <div class="hostel-info">
                                        <h3>${hostel.name}</h3>
                                        <div class="hostel-location"><i class="fas fa-map-marker-alt"></i> <span>${hostel.location}</span></div>
                                        <div class="hostel-features">
                                            <div class="hostel-feature"><i class="fas fa-wifi ${hostel.features.wifi ? 'text-success' : 'text-muted'}"></i><span>WiFi</span></div>
                                            <div class="hostel-feature"><i class="fas fa-tint ${hostel.features.water ? 'text-success' : 'text-muted'}"></i><span>Water</span></div>
                                            <div class="hostel-feature"><i class="fas fa-bolt ${hostel.features.electricity ? 'text-success' : 'text-muted'}"></i><span>Power</span></div>
                                            <div class="hostel-feature"><i class="fas fa-shield-alt ${hostel.features.security ? 'text-success' : 'text-muted'}"></i><span>Security</span></div>
                                        </div>
                                        <div class="hostel-price">UGX ${hostel.price}/month</div>
                                        <div class="hostel-actions">
                                            <button class="btn btn-primary view-details-btn" data-id="${hostel.id}"><i class="fas fa-eye"></i> View Details</button>
                                            <button class="btn btn-secondary get-directions-btn" data-address="${hostel.address}"><i class="fas fa-map-marked-alt"></i> Map</button>
                                        </div>
                                    </div>
                                `;
                                container.appendChild(card);
                            });

                            // Attach listeners safely
                            document.querySelectorAll('.view-details-btn').forEach(button => {
                                button.addEventListener('click', function() {
                                    const hostelId = parseInt(this.getAttribute('data-id'));
                                    if (typeof viewHostelDetails === 'function') viewHostelDetails(hostelId);
                                });
                            });

                            document.querySelectorAll('.get-directions-btn').forEach(button => {
                                button.addEventListener('click', function() {
                                    const address = this.getAttribute('data-address');
                                    if (typeof getDirections === 'function') getDirections(address);
                                });
                            });
                        }

                        // Show registration modal if present
                        function showRegistrationPrompt() {
                            const registrationModal = document.getElementById('registrationModal');
                            if (registrationModal) registrationModal.style.display = 'flex';
                        }

                        // Map and helpers
                        function getDirections(address) {
                            alert(`This would open Google Maps for: ${address}`);
                        }

                        function showAllHostelsOnMap() {
                            alert('This would display all hostels on a map in a production app.');
                        }

                        function initMap() {
                            const mapElement = document.getElementById('map');
                            if (!mapElement) return;
                            mapElement.innerHTML = `
                                <div style="height:100%; display:flex; align-items:center; justify-content:center; background:#e9ecef; color:#6c757d;">
                                    <div style="text-align:center;">
                                        <i class="fas fa-map-marked-alt" style="font-size:3rem; margin-bottom:1rem;"></i>
                                        <p>Interactive map showing hostel locations around Muni University</p>
                                        <button class="btn btn-primary" style="margin-top:1rem;" onclick="showAllHostelsOnMap()"><i class="fas fa-map"></i> View All Hostels on Map</button>
                                    </div>
                                </div>
                            `;
                        }

                        // Search setup (safe guards)
                        function setupSearch() {
                            const searchInput = document.getElementById('searchInput');
                            const searchButton = document.getElementById('searchBtn');
                            if (!searchInput || !searchButton) return;

                            const performSearch = () => {
                                const searchTerm = searchInput.value.toLowerCase().trim();
                                if (searchTerm === '') { displayHostels(); return; }
                                const list = JSON.parse(localStorage.getItem('hostels') || JSON.stringify(hostels));
                                const filtered = list.filter(h => (h.name || '').toLowerCase().includes(searchTerm) || (h.location || '').toLowerCase().includes(searchTerm) || (h.description || '').toLowerCase().includes(searchTerm) || (h.price || '').includes(searchTerm));
                                const container = document.getElementById('hostels-container');
                                if (!container) return;
                                container.innerHTML = '';
                                if (filtered.length === 0) {
                                    container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 2rem;"><i class="fas fa-search" style="font-size: 3rem; color: #6c757d; margin-bottom: 1rem;"></i><h3>No hostels found</h3><p>Try adjusting your search terms</p></div>`;
                                    return;
                                }
                                filtered.forEach(hostel => {
                                    const card = document.createElement('div');
                                    card.className = 'hostel-card';
                                    card.innerHTML = `
                                        <img src="${hostel.image}" alt="${hostel.name}" class="hostel-img">
                                        <div class="hostel-info">
                                            <h3>${hostel.name}</h3>
                                            <div class="hostel-location"><i class="fas fa-map-marker-alt"></i> <span>${hostel.location}</span></div>
                                            <div class="hostel-price">UGX ${hostel.price}/month</div>
                                            <div class="hostel-actions">
                                                <button class="btn btn-primary view-details-btn" data-id="${hostel.id}"><i class="fas fa-eye"></i> View Details</button>
                                                <button class="btn btn-secondary get-directions-btn" data-address="${hostel.address}"><i class="fas fa-map-marked-alt"></i> Map</button>
                                            </div>
                                        </div>
                                    `;
                                    container.appendChild(card);
                                });
                            };

                            searchButton.addEventListener('click', performSearch);
                            searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(); });
                        }

                        // Registration modal setup (guarded)
                        function setupRegistrationModal() {
                            const registrationModal = document.getElementById('registrationModal');
                            if (!registrationModal) return;
                            const cancelModalBtn = document.getElementById('cancelModalBtn');
                            const registerNowBtn = document.getElementById('registerNowBtn');
                            const closeModalBtn = registrationModal.querySelector('.close');
                            if (cancelModalBtn) cancelModalBtn.addEventListener('click', () => registrationModal.style.display = 'none');
                            if (closeModalBtn) closeModalBtn.addEventListener('click', () => registrationModal.style.display = 'none');
                            if (registerNowBtn) registerNowBtn.addEventListener('click', () => { registrationModal.style.display = 'none'; window.location.href = 'signup.html'; });
                            registrationModal.addEventListener('click', (e) => { if (e.target === registrationModal) registrationModal.style.display = 'none'; });
                        }

                        // Theme toggle injection for header
                        function ensureHeaderThemeToggle() {
                            const headerContainers = document.querySelectorAll('.header-container, .header');
                            if (!headerContainers || headerContainers.length === 0) return;

                            headerContainers.forEach(container => {
                                if (container.querySelector('#themeToggle')) return;
                                const btn = document.createElement('button');
                                btn.id = 'themeToggle';
                                btn.className = 'theme-toggle';
                                btn.type = 'button';
                                btn.setAttribute('aria-pressed', 'false');
                                btn.style.marginLeft = '1rem';
                                btn.innerHTML = '<i class="fas fa-moon"></i>';
                                btn.addEventListener('click', () => {
                                    const isDark = document.body.classList.toggle('dark-mode');
                                    btn.setAttribute('aria-pressed', String(isDark));
                                    const icon = btn.querySelector('i');
                                    if (isDark) { icon.className = 'fas fa-sun'; } else { icon.className = 'fas fa-moon'; }
                                    localStorage.setItem('theme', isDark ? 'dark' : 'light');
                                });
                                // Append to container's right side if possible
                                const right = container.querySelector('.header-right') || container.querySelector('nav') || container;
                                right.appendChild(btn);
                            });

                            // Apply saved theme
                            const saved = localStorage.getItem('theme');
                            if (saved === 'dark') {
                                document.body.classList.add('dark-mode');
                                document.querySelectorAll('#themeToggle i').forEach(i => i.className = 'fas fa-sun');
                            }
                        }

                        // Initialize the page
                        document.addEventListener('DOMContentLoaded', function() {
                            displayHostels();
                            initMap();
                            setupSearch();
                            setupRegistrationModal();
                            ensureHeaderThemeToggle();
                            // Smooth scrolling for navigation links
                            document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
                                anchor.addEventListener('click', function(e) {
                                    const targetId = this.getAttribute('href');
                                    if (targetId !== '#') {
                                        e.preventDefault();
                                        const targetElement = document.querySelector(targetId);
                                        if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                });
                            });
                        });