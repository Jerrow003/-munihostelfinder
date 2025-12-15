// Sample hostel data
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
    },
    {
        id: 5,
        name: "Arua Comfort Hostel",
        price: "180,000",
        location: "4.2 km from Campus",
        address: "Plot 89, Arua Town Road",
        phone: "+256 762 111 222",
        email: "arua@comforthostel.com",
        capacity: 150,
        description: "Budget-friendly option with basic amenities. Great for students looking to save on accommodation costs.",
        features: {
            wifi: false,
            water: true,
            electricity: true,
            security: true
        },
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80"
    },
    {
        id: 6,
        name: "University Gardens",
        price: "280,000",
        location: "1.5 km from Campus",
        address: "Plot 34, Garden Avenue",
        phone: "+256 782 333 444",
        email: "info@universitygardens.com",
        capacity: 90,
        description: "Beautiful hostel with garden views and peaceful environment. Ideal for students who appreciate nature.",
        features: {
            wifi: true,
            water: true,
            electricity: true,
            security: true
        },
        image: "https://images.unsplash.com/photo-1571624436279-b272aff752b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80"
    }
];

// Function to display hostels
function displayHostels() {
    const container = document.getElementById('hostels-container');
    container.innerHTML = '';

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
                    <button class="btn btn-primary" onclick="viewHostelDetails(${hostel.id})">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="btn btn-secondary" onclick="getDirections('${hostel.address}')">
                        <i class="fas fa-map-marked-alt"></i> Map
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Function to view hostel details
function viewHostelDetails(id) {
    const hostel = hostels.find(h => h.id === id);
    if (hostel) {
        const featuresList = Object.entries(hostel.features)
            .map(([feature, available]) => 
                `<li>${available ? '✓' : '✗'} ${feature.charAt(0).toUpperCase() + feature.slice(1)}</li>`
            )
            .join('');
            
        alert(`Hostel Details:\n\nName: ${hostel.name}\nPrice: UGX ${hostel.price}/month\nLocation: ${hostel.location}\nAddress: ${hostel.address}\nPhone: ${hostel.phone}\nEmail: ${hostel.email}\nCapacity: ${hostel.capacity} students\n\nDescription: ${hostel.description}\n\nFeatures:\n${featuresList}`);
    }
}

// Function to get directions (simulated)
function getDirections(address) {
    alert(`Opening Google Maps with directions to:\n\n${address}\n\nThis would open Google Maps in a real application.`);
    // In a real application, this would open Google Maps with the address
    // window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`);
}

// Initialize map (simulated)
function initMap() {
    // In a real application, this would initialize Google Maps
    const mapElement = document.getElementById('map');
    mapElement.innerHTML = `
        <div style="height:100%; display:flex; align-items:center; justify-content:center; background:#e9ecef; color:#6c757d;">
            <div style="text-align:center;">
                <i class="fas fa-map-marked-alt" style="font-size:3rem; margin-bottom:1rem;"></i>
                <p>Interactive map showing hostel locations around Muni University</p>
                <p>In a real application, this would display Google Maps with markers for each hostel</p>
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

// Initialize search functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    
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
                        <button class="btn btn-primary" onclick="viewHostelDetails(${hostel.id})">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button class="btn btn-secondary" onclick="getDirections('${hostel.address}')">
                            <i class="fas fa-map-marked-alt"></i> Map
                        </button>
                    </div>
                </div>
            `;
            
            container.appendChild(card);
        });
    };
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayHostels();
    initMap();
    setupSearch();
    
    // Smooth scrolling for navigation links (excluding logout link)
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Check if it's a hash link (internal section navigation)
            // Only prevent default for internal section links
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
            // If it's not a hash link (like index.html), allow default behavior
        });
    });
});