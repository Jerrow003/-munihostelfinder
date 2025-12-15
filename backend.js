// Sample data for the backend dashboard
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
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
        status: "active"
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
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80",
        status: "active"
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
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        status: "pending"
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
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
        status: "active"
    }
];

const bookings = [
    {
        id: "BK0012",
        user: "John Doe",
        hostel: "Green Valley Hostel",
        checkIn: "15 Sep 2023",
        checkOut: "15 Dec 2023",
        amount: "UGX 750,000",
        status: "confirmed"
    },
    {
        id: "BK0011",
        user: "Mary Smith",
        hostel: "Campus View Hostel",
        checkIn: "10 Sep 2023",
        checkOut: "10 Dec 2023",
        amount: "UGX 900,000",
        status: "confirmed"
    },
    {
        id: "BK0010",
        user: "Robert Johnson",
        hostel: "Muni Elite Hostel",
        checkIn: "05 Sep 2023",
        checkOut: "05 Dec 2023",
        amount: "UGX 1,050,000",
        status: "pending"
    },
    {
        id: "BK0009",
        user: "Sarah Williams",
        hostel: "Student Comfort Hostel",
        checkIn: "01 Sep 2023",
        checkOut: "01 Dec 2023",
        amount: "UGX 600,000",
        status: "cancelled"
    }
];

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

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    displayHostels();
    displayBookings();
    setupEventListeners();
});

// Display hostels in the table
function displayHostels() {
    hostelsTableBody.innerHTML = '';
    
    hostels.forEach(hostel => {
        const row = document.createElement('tr');
        
        // Determine status class
        let statusClass = '';
        let statusText = '';
        
        switch(hostel.status) {
            case 'active':
                statusClass = 'status-active';
                statusText = 'Active';
                break;
            case 'pending':
                statusClass = 'status-pending';
                statusText = 'Pending';
                break;
            case 'inactive':
                statusClass = 'status-cancelled';
                statusText = 'Inactive';
                break;
            default:
                statusClass = 'status-pending';
                statusText = 'Pending';
        }
        
        row.innerHTML = `
            <td>${hostel.name}</td>
            <td>${hostel.location}</td>
            <td>UGX ${hostel.price}</td>
            <td>${hostel.capacity}</td>
            <td class="${statusClass}">${statusText}</td>
            <td>
                <button class="btn btn-secondary btn-sm edit-hostel" data-id="${hostel.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm delete-hostel" data-id="${hostel.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        hostelsTableBody.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
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

// Display bookings in the table
function displayBookings() {
    bookingsTableBody.innerHTML = '';
    
    bookings.forEach(booking => {
        const row = document.createElement('tr');
        
        // Determine status class
        let statusClass = '';
        let statusText = '';
        
        switch(booking.status) {
            case 'confirmed':
                statusClass = 'status-confirmed';
                statusText = 'Confirmed';
                break;
            case 'pending':
                statusClass = 'status-pending';
                statusText = 'Pending';
                break;
            case 'cancelled':
                statusClass = 'status-cancelled';
                statusText = 'Cancelled';
                break;
            default:
                statusClass = 'status-pending';
                statusText = 'Pending';
        }
        
        row.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.user}</td>
            <td>${booking.hostel}</td>
            <td>${booking.checkIn}</td>
            <td>${booking.checkOut}</td>
            <td>${booking.amount}</td>
            <td class="${statusClass}">${statusText}</td>
        `;
        
        bookingsTableBody.appendChild(row);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Modal functionality
    addHostelBtn.addEventListener('click', () => {
        addHostelModal.style.display = 'flex';
        hostelForm.reset();
        // Reset checkboxes to checked
        document.getElementById('featureWifi').checked = true;
        document.getElementById('featureWater').checked = true;
        document.getElementById('featureElectricity').checked = true;
        document.getElementById('featureSecurity').checked = true;
    });

    closeModal.addEventListener('click', () => {
        addHostelModal.style.display = 'none';
    });

    cancelBtn.addEventListener('click', () => {
        addHostelModal.style.display = 'none';
    });

    saveHostelBtn.addEventListener('click', saveHostel);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === addHostelModal) {
            addHostelModal.style.display = 'none';
        }
    });
    
    // Export functionality
    exportBtn.addEventListener('click', exportData);
}

// Save hostel function
function saveHostel() {
    // Get form values
    const name = document.getElementById('hostelName').value;
    const price = document.getElementById('hostelPrice').value;
    const location = document.getElementById('hostelLocation').value;
    const capacity = document.getElementById('hostelCapacity').value;
    const address = document.getElementById('hostelAddress').value;
    const phone = document.getElementById('hostelPhone').value;
    const email = document.getElementById('hostelEmail').value;
    const description = document.getElementById('hostelDescription').value;
    const image = document.getElementById('hostelImage').value;
    
    // Get feature values
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
    
    // Create new hostel object
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
        image: image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        status: 'active'
    };
    
    // Add to hostels array
    hostels.push(newHostel);
    
    // Update the table
    displayHostels();
    
    // Close modal and show success message
    addHostelModal.style.display = 'none';
    alert('Hostel saved successfully!');
    
    // In a real application, you would send this data to a server
    console.log('New hostel added:', newHostel);
}

// Edit hostel function
function editHostel(id) {
    const hostel = hostels.find(h => h.id === id);
    if (hostel) {
        // Fill the form with hostel data
        document.getElementById('hostelName').value = hostel.name;
        document.getElementById('hostelPrice').value = hostel.price;
        document.getElementById('hostelLocation').value = hostel.location;
        document.getElementById('hostelCapacity').value = hostel.capacity;
        document.getElementById('hostelAddress').value = hostel.address;
        document.getElementById('hostelPhone').value = hostel.phone;
        document.getElementById('hostelEmail').value = hostel.email;
        document.getElementById('hostelDescription').value = hostel.description;
        document.getElementById('hostelImage').value = hostel.image;
        
        // Set feature checkboxes
        document.getElementById('featureWifi').checked = hostel.features.wifi;
        document.getElementById('featureWater').checked = hostel.features.water;
        document.getElementById('featureElectricity').checked = hostel.features.electricity;
        document.getElementById('featureSecurity').checked = hostel.features.security;
        
        // Change button text and functionality
        saveHostelBtn.textContent = 'Update Hostel';
        saveHostelBtn.onclick = function() {
            updateHostel(id);
        };
        
        // Open modal
        addHostelModal.style.display = 'flex';
    }
}

// Update hostel function
function updateHostel(id) {
    const hostelIndex = hostels.findIndex(h => h.id === id);
    
    if (hostelIndex !== -1) {
        // Get updated values from form
        hostels[hostelIndex].name = document.getElementById('hostelName').value;
        hostels[hostelIndex].price = document.getElementById('hostelPrice').value;
        hostels[hostelIndex].location = document.getElementById('hostelLocation').value;
        hostels[hostelIndex].capacity = parseInt(document.getElementById('hostelCapacity').value);
        hostels[hostelIndex].address = document.getElementById('hostelAddress').value;
        hostels[hostelIndex].phone = document.getElementById('hostelPhone').value;
        hostels[hostelIndex].email = document.getElementById('hostelEmail').value;
        hostels[hostelIndex].description = document.getElementById('hostelDescription').value;
        hostels[hostelIndex].image = document.getElementById('hostelImage').value;
        
        // Update features
        hostels[hostelIndex].features = {
            wifi: document.getElementById('featureWifi').checked,
            water: document.getElementById('featureWater').checked,
            electricity: document.getElementById('featureElectricity').checked,
            security: document.getElementById('featureSecurity').checked
        };
        
        // Update the table
        displayHostels();
        
        // Close modal and show success message
        addHostelModal.style.display = 'none';
        alert('Hostel updated successfully!');
        
        // Reset button to original state
        saveHostelBtn.textContent = 'Save Hostel';
        saveHostelBtn.onclick = saveHostel;
        
        // In a real application, you would send this data to a server
        console.log('Hostel updated:', hostels[hostelIndex]);
    }
}

// Delete hostel function
function deleteHostel(id) {
    if (confirm('Are you sure you want to delete this hostel? This action cannot be undone.')) {
        const hostelIndex = hostels.findIndex(h => h.id === id);
        
        if (hostelIndex !== -1) {
            // Remove hostel from array
            hostels.splice(hostelIndex, 1);
            
            // Update the table
            displayHostels();
            
            alert('Hostel deleted successfully!');
            
            // In a real application, you would send a delete request to a server
            console.log('Hostel deleted with ID:', id);
        }
    }
}

// Export data function
function exportData() {
    // In a real application, this would generate and download a CSV or Excel file
    alert('Export functionality would generate a CSV/Excel file with all data in a real application.');
    console.log('Exporting data:', { hostels, bookings });
}

// Additional utility functions for a real application would go here
// For example: API calls, authentication, data validation, etc.