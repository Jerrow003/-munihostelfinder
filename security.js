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
                    </div>
                    <div class="hostel-feature">
                        <i class="fas fa-tint ${hostel.features.water ? 'text-success' : 'text-muted'}"></i>
                        <span>Water</span>
                    </div>
                    <div class="hostel-feature">
                        <i class="fas fa-bolt ${hostel.features.electricity ? 'text-success' : 'text-muted'}"></i>
                        <span>Power</span>
                    </div>
                    <div class="hostel-feature">
                        <i class="fas fa-shield-alt ${hostel.features.security ? 'text-success' : 'text-muted'}"></i>
                        <span>Security</span>
                    </div>
                </div>
                <div class="hostel-price">UGX ${hostel.price}/month</div>
                <div class="hostel-actions">
                    <button class="btn btn-primary view-details-btn" data-id="${hostel.id}">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="btn btn-secondary get-directions-btn" data-address="${hostel.address}">
                        <i class="fas fa-map-marked-alt"></i> Map
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });

    // Add event listeners to the new buttons
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', function() {
            const hostelId = parseInt(this.getAttribute('data-id'));
            viewHostelDetails(hostelId);
        });
    });

    document.querySelectorAll('.get-directions-btn').forEach(button => {
        button.addEventListener('click', function() {
            const address = this.getAttribute('data-address');
            getDirections(address);
        });
    });
}

// Function to view hostel details with registration check
function viewHostelDetails(id) {
    const hostel = hostels.find(h => h.id === id);
    const loggedIn = isUserLoggedIn();
    
    if (!hostel) return;

    const featuresList = Object.entries(hostel.features)
        .map(([feature, available]) => 
            `<li>${available ? '✓' : '✗'} ${feature.charAt(0).toUpperCase() + feature.slice(1)}</li>`
        )
        .join('');

    let contactSection = '';
    
    if (loggedIn) {
        // Show contact info if logged in
        contactSection = `
            <div class="contact-info">
                <h4>Contact Information</h4>
                <p><strong>Address:</strong> ${hostel.address}</p>
                <p><strong>Phone:</strong> ${hostel.phone}</p>
                <p><strong>Email:</strong> ${hostel.email}</p>
            </div>
            <button class="btn btn-primary" onclick="bookHostel(${hostel.id})">
                <i class="fas fa-calendar-check"></i> Book Now
            </button>
        `;
    } else {
        // Show registration prompt if not logged in
        contactSection = `
            <div class="login-prompt">
                <p><strong>Registration Required</strong></p>
                <p>Register and login to view contact details and make bookings</p>
                <button class="btn btn-primary" onclick="showRegistrationPrompt()">
                    <i class="fas fa-user-plus"></i> Register Now
                </button>
            </div>
        `;
    }

    // Create modal for hostel details
    const modal = document.createElement('div');
    modal.className = 'modal hostel-detail-modal';
    modal.id = 'hostelDetailModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${hostel.name}</h3>
                <button class="close">&times;</button>
            </div>
            <div class="modal-body">
                <img src="${hostel.image}" alt="${hostel.name}" class="hostel-img">
                <p><strong>Location:</strong> ${hostel.location}</p>
                <p><strong>Price:</strong> UGX ${hostel.price}/month</p>
                <p><strong>Capacity:</strong> ${hostel.capacity} students</p>
                <p><strong>Description:</strong> ${hostel.description}</p>
                <h4>Features:</h4>
                <ul>${featuresList}</ul>
                ${contactSection}
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    
    // Show modal
    modal.style.display = 'flex';
    
    // Close button functionality
    modal.querySelector('.close').addEventListener('click', () => {
        modal.remove();
    });
    
    // Close when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Function to show registration prompt
function showRegistrationPrompt() {
    const registrationModal = document.getElementById('registrationModal');
    registrationModal.style.display = 'flex';
}

// Function to book hostel (for logged in users)
function bookHostel(id) {
    const hostel = hostels.find(h => h.id === id);
    if (hostel && isUserLoggedIn()) {
        alert(`Booking initiated for ${hostel.name}\n\nA booking form would open here for registered users.`);
    }
}

// Function to get directions (simulated)
function getDirections(address) {
    alert(`Opening Google Maps with directions to:\n\n${address}\n\nThis would open Google Maps in a real application.`);
}

// Initialize search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchBtn');
    
    const performSearch = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            displayHostels();
            return;
        }
        
        const filteredHostels = hostels.filter(hostel => 
            hostel.name.toLowerCase().includes(searchTerm) ||
            hostel.location.toLowerCase().includes(searchTerm) ||
            hostel.price.includes(searchTerm) ||
            hostel.description.toLowerCase().includes(searchTerm)
        );
        
        const container = document.getElementById('hostels-container');
        container.innerHTML = '';
        
        if (filteredHostels.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <i class="fas fa-search" style="font-size: 3rem; color: #6c757d; margin-bottom: 1rem;"></i>
                    <h3>No hostels found</h3>
                    <p>Try adjusting your search terms</p>
                </div>
            `;
            return;
        }
        
        filteredHostels.forEach(hostel => {
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
                        </div>
                        <div class="hostel-feature">
                            <i class="fas fa-tint ${hostel.features.water ? 'text-success' : 'text-muted'}"></i>
                            <span>Water</span>
                        </div>
                        <div class="hostel-feature">
                            <i class="fas fa-bolt ${hostel.features.electricity ? 'text-success' : 'text-muted'}"></i>
                            <span>Power</span>
                        </div>
                        <div class="hostel-feature">
                            <i class="fas fa-shield-alt ${hostel.features.security ? 'text-success' : 'text-muted'}"></i>
                            <span>Security</span>
                        </div>
                    </div>
                    <div class="hostel-price">UGX ${hostel.price}/month</div>
                    <div class="hostel-actions">
                        <button class="btn btn-primary view-details-btn" data-id="${hostel.id}">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button class="btn btn-secondary get-directions-btn" data-address="${hostel.address}">
                            <i class="fas fa-map-marked-alt"></i> Map
                        </button>
                    </div>
                </div>
            `;
            
            container.appendChild(card);
        });

        // Re-attach event listeners
        document.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', function() {
                const hostelId = parseInt(this.getAttribute('data-id'));
                viewHostelDetails(hostelId);
            });
        });

        document.querySelectorAll('.get-directions-btn').forEach(button => {
            button.addEventListener('click', function() {
                const address = this.getAttribute('data-address');
                getDirections(address);
            });
        });
    };
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Initialize registration modal functionality
function setupRegistrationModal() {
    const registrationModal = document.getElementById('registrationModal');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const registerNowBtn = document.getElementById('registerNowBtn');
    const closeModalBtn = registrationModal.querySelector('.close');

    // Close modal buttons
    cancelModalBtn.addEventListener('click', () => {
        registrationModal.style.display = 'none';
    });

    closeModalBtn.addEventListener('click', () => {
        registrationModal.style.display = 'none';
    });

    // Register now button
    registerNowBtn.addEventListener('click', () => {
        registrationModal.style.display = 'none';
        window.location.href = 'signup.html';
    });

    // Close when clicking outside
    registrationModal.addEventListener('click', (e) => {
        if (e.target === registrationModal) {
            registrationModal.style.display = 'none';
        }
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayHostels();
    initMap();
    setupSearch();
    setupRegistrationModal();
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// Initialize map (simulated)
function initMap() {
    const mapElement = document.getElementById('map');
    mapElement.innerHTML = `
        <div style="height:100%; display:flex; align-items:center; justify-content:center; background:#e9ecef; color:#6c757d;">
            <div style="text-align:center;">
                <i class="fas fa-map-marked-alt" style="font-size:3rem; margin-bottom:1rem;"></i>
                <p>Interactive map showing hostel locations around Muni University</p>
                <button class="btn btn-primary" style="margin-top:1rem;" onclick="showAllHostelsOnMap()">
                    <i class="fas fa-map"></i> View All Hostels on Map
                </button>
            </div>
        </div>
    `;
}

// Function to show all hostels on map (simulated)
function showAllHostelsOnMap() {
    alert("This would display all hostel locations on an interactive Google Map in a real application.\n\nHostels would be shown as markers with popup information.");
}