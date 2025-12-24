// frontend.js - Complete Student Hostel Finder with Registration Requirement

// Sample hostel data (will be loaded from localStorage)
let hostels = [];

// Load hostels from localStorage
function loadHostels() {
    const storedHostels = localStorage.getItem('hostels');
    if (storedHostels) {
        hostels = JSON.parse(storedHostels);
    }
    return hostels.filter(hostel => hostel.status === 'active');
}

// Check if user is logged in
function isUserLoggedIn() {
    return sessionStorage.getItem('currentUser') !== null;
}

// Get current user
function getCurrentUser() {
    const userJson = sessionStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

// Display hostels on page
function displayHostels(hostelList = null) {
    const container = document.getElementById('hostels-container');
    if (!container) return;
    
    const displayList = hostelList || loadHostels();
    
    container.innerHTML = '';
    
    if (displayList.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <i class="fas fa-bed" style="font-size: 3rem; color: #6c757d; margin-bottom: 1rem;"></i>
                <h3>No hostels available</h3>
                <p>Check back later for new hostel listings</p>
            </div>
        `;
        return;
    }
    
    displayList.forEach(hostel => {
        const card = document.createElement('div');
        card.className = 'hostel-card';
        
        card.innerHTML = `
            <img src="${hostel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}" 
                 alt="${hostel.name}" 
                 class="hostel-img"
                 onerror="this.src='https://images.unsplash.com/photo-1566073771259-6a8506099945'">
            <div class="hostel-info">
                <h3>${hostel.name}</h3>
                <div class="hostel-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${hostel.location}</span>
                </div>
                <div class="hostel-features">
                    <div class="hostel-feature">
                        <i class="fas fa-wifi ${hostel.features?.wifi ? 'text-success' : 'text-muted'}"></i>
                        <span>WiFi</span>
                    </div>
                    <div class="hostel-feature">
                        <i class="fas fa-tint ${hostel.features?.water ? 'text-success' : 'text-muted'}"></i>
                        <span>Water</span>
                    </div>
                    <div class="hostel-feature">
                        <i class="fas fa-bolt ${hostel.features?.electricity ? 'text-success' : 'text-muted'}"></i>
                        <span>Power</span>
                    </div>
                    <div class="hostel-feature">
                        <i class="fas fa-shield-alt ${hostel.features?.security ? 'text-success' : 'text-muted'}"></i>
                        <span>Security</span>
                    </div>
                </div>
                <div class="hostel-price">UGX ${hostel.price}/month</div>
                <div class="hostel-actions">
                    <button class="btn btn-primary view-details-btn" data-id="${hostel.id}">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="btn btn-secondary get-directions-btn" data-address="${hostel.address}">
                        <i class="fas fa-map-marked-alt"></i> Directions
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    // Add event listeners
    attachHostelEventListeners();
}

// Show hostel details with registration check
function showHostelDetails(hostelId) {
    const hostel = loadHostels().find(h => h.id === hostelId);
    if (!hostel) return;
    
    const user = getCurrentUser();
    const loggedIn = isUserLoggedIn();
    
    const featuresList = hostel.features ? Object.entries(hostel.features)
        .map(([feature, available]) => 
            `<li><i class="fas fa-${available ? 'check' : 'times'} text-${available ? 'success' : 'danger'}"></i> ${feature.charAt(0).toUpperCase() + feature.slice(1)}</li>`
        )
        .join('') : '';
    
    let contactSection = '';
    let actionButtons = '';
    
    if (loggedIn && user.role === 'user') {
        // Show contact info for logged in students
        contactSection = `
            <div class="contact-info" style="background: #f8f9fa; padding: 1rem; border-radius: 5px; margin: 1rem 0;">
                <h4><i class="fas fa-address-card"></i> Contact Information</h4>
                <p><strong><i class="fas fa-map-pin"></i> Address:</strong> ${hostel.address}</p>
                <p><strong><i class="fas fa-phone"></i> Phone:</strong> ${hostel.phone}</p>
                <p><strong><i class="fas fa-envelope"></i> Email:</strong> ${hostel.email}</p>
            </div>
        `;
        
        actionButtons = `
            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <button class="btn btn-primary" onclick="bookHostel(${hostel.id})" style="flex: 1;">
                    <i class="fas fa-calendar-check"></i> Book Now
                </button>
                <button class="btn btn-secondary" onclick="saveToFavorites(${hostel.id})" style="flex: 1;">
                    <i class="fas fa-heart"></i> Save to Favorites
                </button>
            </div>
        `;
    } else {
        // Show registration prompt
        contactSection = `
            <div class="login-prompt" style="background: #fff3cd; padding: 1rem; border-radius: 5px; margin: 1rem 0; border: 1px solid #ffeaa7;">
                <h4><i class="fas fa-lock"></i> Registration Required</h4>
                <p>Register and login to view contact details and make bookings</p>
                <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                    <button class="btn btn-primary" onclick="redirectToLogin()">
                        <i class="fas fa-sign-in-alt"></i> Login
                    </button>
                    <button class="btn btn-success" onclick="redirectToSignup()">
                        <i class="fas fa-user-plus"></i> Register
                    </button>
                </div>
            </div>
        `;
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header" style="background: #a02c2c; color: white;">
                <h3>${hostel.name}</h3>
                <button class="close" style="color: white;">&times;</button>
            </div>
            <div class="modal-body">
                <img src="${hostel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}" 
                     alt="${hostel.name}" 
                     style="width: 100%; height: 200px; object-fit: cover; border-radius: 5px; margin-bottom: 1rem;"
                     onerror="this.src='https://images.unsplash.com/photo-1566073771259-6a8506099945'">
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                    <div>
                        <p><strong><i class="fas fa-map-marker-alt"></i> Location:</strong><br>${hostel.location}</p>
                        <p><strong><i class="fas fa-money-bill-wave"></i> Price:</strong><br>UGX ${hostel.price}/month</p>
                    </div>
                    <div>
                        <p><strong><i class="fas fa-users"></i> Capacity:</strong><br>${hostel.capacity} students</p>
                        <p><strong><i class="fas fa-home"></i> Type:</strong><br>Student Hostel</p>
                    </div>
                </div>
                
                <p><strong><i class="fas fa-align-left"></i> Description:</strong><br>${hostel.description}</p>
                
                <h4><i class="fas fa-list-check"></i> Features:</h4>
                <ul style="columns: 2; list-style: none; padding-left: 0;">
                    ${featuresList}
                </ul>
                
                ${contactSection}
                ${actionButtons}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.querySelector('.close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Book hostel (for logged in users)
function bookHostel(hostelId) {
    const hostel = loadHostels().find(h => h.id === hostelId);
    const user = getCurrentUser();
    
    if (!user || user.role !== 'user') {
        alert('Please login as a student to book hostels.');
        redirectToLogin();
        return;
    }
    
    if (!hostel) {
        alert('Hostel not found');
        return;
    }
    
    // Show booking form
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header" style="background: #28a745; color: white;">
                <h3>Book ${hostel.name}</h3>
                <button class="close" style="color: white;">&times;</button>
            </div>
            <div class="modal-body">
                <p><strong>Student:</strong> ${user.firstName} ${user.lastName}</p>
                <p><strong>Price:</strong> UGX ${hostel.price} per month</p>
                
                <div class="form-group">
                    <label>Check-in Date</label>
                    <input type="date" id="checkinDate" class="form-control" min="${new Date().toISOString().split('T')[0]}" required>
                </div>
                
                <div class="form-group">
                    <label>Duration (months)</label>
                    <select id="duration" class="form-control">
                        <option value="3">3 months</option>
                        <option value="6">6 months</option>
                        <option value="9">9 months</option>
                        <option value="12">12 months</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Special Requirements (Optional)</label>
                    <textarea id="requirements" class="form-control" rows="3" placeholder="Any special requirements..."></textarea>
                </div>
                
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 5px; margin: 1rem 0;">
                    <p><strong>Total Amount:</strong> <span id="totalAmount">UGX ${hostel.price}</span></p>
                    <small class="text-muted">Payment instructions will be sent after booking confirmation</small>
                </div>
                
                <button class="btn btn-primary" onclick="confirmBooking(${hostelId})" style="width: 100%;">
                    <i class="fas fa-calendar-check"></i> Confirm Booking
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Calculate total amount when duration changes
    const durationSelect = modal.querySelector('#duration');
    const totalAmountSpan = modal.querySelector('#totalAmount');
    
    function calculateTotal() {
        const duration = parseInt(durationSelect.value);
        const price = parseInt(hostel.price.replace(/[^0-9]/g, ''));
        const total = price * duration;
        totalAmountSpan.textContent = `UGX ${total.toLocaleString()}`;
    }
    
    durationSelect.addEventListener('change', calculateTotal);
    calculateTotal();
    
    // Close modal
    modal.querySelector('.close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function confirmBooking(hostelId) {
    const hostel = loadHostels().find(h => h.id === hostelId);
    const user = getCurrentUser();
    const checkinDate = document.querySelector('#checkinDate').value;
    const duration = document.querySelector('#duration').value;
    const requirements = document.querySelector('#requirements').value;
    
    if (!checkinDate) {
        alert('Please select a check-in date');
        return;
    }
    
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkin);
    checkout.setMonth(checkout.getMonth() + parseInt(duration));
    
    const bookingId = `BK${Date.now()}`;
    const price = parseInt(hostel.price.replace(/[^0-9]/g, ''));
    const totalAmount = price * parseInt(duration);
    
    const booking = {
        id: bookingId,
        userId: user.id,
        userEmail: user.email,
        userName: `${user.firstName} ${user.lastName}`,
        hostelId: hostel.id,
        hostelName: hostel.name,
        checkIn: checkin.toISOString().split('T')[0],
        checkOut: checkout.toISOString().split('T')[0],
        duration: duration,
        amount: `UGX ${totalAmount.toLocaleString()}`,
        status: 'pending',
        requirements: requirements,
        bookingDate: new Date().toISOString()
    };
    
    // Save booking
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Log security event
    if (window.securityManager) {
        securityManager.logSecurityEvent('booking_created', {
            bookingId: bookingId,
            userId: user.id,
            hostelId: hostel.id
        });
    }
    
    // Close modal
    document.querySelector('.modal').remove();
    
    // Show success message
    alert(`
        ✅ Booking Request Submitted!
        
        Booking ID: ${bookingId}
        Hostel: ${hostel.name}
        Check-in: ${checkin.toLocaleDateString()}
        Duration: ${duration} months
        Total: UGX ${totalAmount.toLocaleString()}
        
        Your booking is pending confirmation. 
        You will receive an email with payment instructions.
    `);
}

function saveToFavorites(hostelId) {
    const user = getCurrentUser();
    if (!user) {
        redirectToLogin();
        return;
    }
    
    const hostel = loadHostels().find(h => h.id === hostelId);
    const favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
    
    if (favorites.some(fav => fav.id === hostelId)) {
        alert('This hostel is already in your favorites.');
        return;
    }
    
    favorites.push({
        id: hostel.id,
        name: hostel.name,
        image: hostel.image,
        price: hostel.price,
        location: hostel.location,
        addedAt: new Date().toISOString()
    });
    
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites));
    alert('✅ Hostel added to favorites!');
}

function redirectToLogin() {
    window.location.href = 'index.html';
}

function redirectToSignup() {
    window.location.href = 'signup.html';
}

function getDirections(address) {
    alert(`Directions to:\n\n${address}\n\nIn a real application, this would open Google Maps.`);
}

function setupSearch() {
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    
    if (!searchInput || !searchButton) return;
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (!searchTerm) {
            displayHostels();
            return;
        }
        
        const filteredHostels = loadHostels().filter(hostel => 
            hostel.name.toLowerCase().includes(searchTerm) ||
            hostel.location.toLowerCase().includes(searchTerm) ||
            hostel.description?.toLowerCase().includes(searchTerm) ||
            hostel.address?.toLowerCase().includes(searchTerm)
        );
        
        displayHostels(filteredHostels);
    }
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function attachHostelEventListeners() {
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', function() {
            const hostelId = parseInt(this.getAttribute('data-id'));
            showHostelDetails(hostelId);
        });
    });
    
    document.querySelectorAll('.get-directions-btn').forEach(button => {
        button.addEventListener('click', function() {
            const address = this.getAttribute('data-address');
            getDirections(address);
        });
    });
}

function initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    mapElement.innerHTML = `
        <div style="height:100%; display:flex; align-items:center; justify-content:center; background:#e9ecef; color:#6c757d; border-radius: 10px;">
            <div style="text-align:center;">
                <i class="fas fa-map-marked-alt" style="font-size:3rem; margin-bottom:1rem;"></i>
                <h3>Hostel Locations Map</h3>
                <p>Interactive map showing hostel locations around Muni University</p>
                <button class="btn btn-primary" style="margin-top:1rem;" onclick="showAllHostelsOnMap()">
                    <i class="fas fa-map"></i> View All Hostels
                </button>
            </div>
        </div>
    `;
}

function showAllHostelsOnMap() {
    const hostels = loadHostels();
    let message = 'Hostel Locations:\n\n';
    
    hostels.forEach((hostel, index) => {
        message += `${index + 1}. ${hostel.name}\n`;
        message += `   Location: ${hostel.location}\n`;
        message += `   Address: ${hostel.address}\n\n`;
    });
    
    alert(message);
}

function updateUserNavigation() {
    const authLink = document.getElementById('authLink');
    if (!authLink) return;
    
    const user = getCurrentUser();
    
    if (user) {
        authLink.innerHTML = `<i class="fas fa-user"></i> ${user.firstName}`;
        authLink.href = '#';
        authLink.onclick = function(e) {
            e.preventDefault();
            showUserMenu();
        };
    } else {
        authLink.innerHTML = '<i class="fas fa-user"></i> Login';
        authLink.href = 'index.html';
    }
}

function showUserMenu() {
    const user = getCurrentUser();
    if (!user) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header" style="background: #a02c2c; color: white;">
                <h3>My Account</h3>
                <button class="close" style="color: white;">&times;</button>
            </div>
            <div class="modal-body" style="text-align: center;">
                <div style="width: 80px; height: 80px; background: #a02c2c; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 2rem;">
                    ${user.firstName.charAt(0)}${user.lastName.charAt(0)}
                </div>
                <h4>${user.firstName} ${user.lastName}</h4>
                <p>${user.email}</p>
                <p><small>Student Account</small></p>
                
                <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1.5rem;">
                    <button class="btn btn-outline-primary" onclick="viewMyBookings()">
                        <i class="fas fa-calendar-alt"></i> My Bookings
                    </button>
                    <button class="btn btn-outline-secondary" onclick="viewFavorites()">
                        <i class="fas fa-heart"></i> Favorites
                    </button>
                    <button class="btn btn-outline-info" onclick="editProfile()">
                        <i class="fas fa-user-edit"></i> Edit Profile
                    </button>
                    <button class="btn btn-danger" onclick="logout()" style="margin-top: 1rem;">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function viewMyBookings() {
    const user = getCurrentUser();
    if (!user) return;
    
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const myBookings = bookings.filter(b => b.userEmail === user.email);
    
    if (myBookings.length === 0) {
        alert('You have no bookings yet.');
        return;
    }
    
    let message = 'My Bookings:\n\n';
    myBookings.forEach((booking, index) => {
        message += `${index + 1}. ${booking.hostelName}\n`;
        message += `   Booking ID: ${booking.id}\n`;
        message += `   Dates: ${booking.checkIn} to ${booking.checkOut}\n`;
        message += `   Amount: ${booking.amount}\n`;
        message += `   Status: ${booking.status}\n\n`;
    });
    
    alert(message);
}

function viewFavorites() {
    const user = getCurrentUser();
    if (!user) {
        alert('Please login to view favorites.');
        return;
    }
    
    const favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
    
    if (favorites.length === 0) {
        alert('You have no favorite hostels yet.');
        return;
    }
    
    let message = 'Favorite Hostels:\n\n';
    favorites.forEach((fav, index) => {
        message += `${index + 1}. ${fav.name}\n`;
        message += `   Price: UGX ${fav.price}/month\n`;
        message += `   Location: ${fav.location}\n\n`;
    });
    
    alert(message);
}

function editProfile() {
    alert('Profile editing feature will be available soon.');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        if (window.securityManager) {
            securityManager.logSecurityEvent('logout', { 
                userId: getCurrentUser()?.id 
            });
        }
        sessionStorage.clear();
        window.location.href = 'index.html';
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Display hostels
    displayHostels();
    
    // Initialize map
    initMap();
    
    // Setup search
    setupSearch();
    
    // Update user navigation
    updateUserNavigation();
    
    // Smooth scrolling for navigation
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});
