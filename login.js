document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const userTypeUser = document.getElementById('userTypeUser');
    const userTypeAdmin = document.getElementById('userTypeAdmin');
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const emailInput = document.getElementById('email');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const forgotPasswordLink = document.querySelector('.forgot-password');
    
    // Initialize the page
    initializePage();
    
    // User type selection
    userTypeUser.addEventListener('click', function() {
        selectUserType('student');
    });
    
    userTypeAdmin.addEventListener('click', function() {
        selectUserType('admin');
    });
    
    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        togglePasswordVisibility();
    });
    
    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    // Forgot password link
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        handleForgotPassword();
    });
    
    // Real-time validation
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);
    
    // Initialize page function
    function initializePage() {
        // Check for stored credentials
        checkStoredCredentials();
        
        // Set default user type to student
        selectUserType('student');
    }
    
    // Select user type
    function selectUserType(type) {
        if (type === 'student') {
            userTypeUser.classList.add('active');
            userTypeAdmin.classList.remove('active');
        } else {
            userTypeAdmin.classList.add('active');
            userTypeUser.classList.remove('active');
        }
        
        // Clear any previous error messages
        clearErrorMessages();
    }
    
    // Toggle password visibility
    function togglePasswordVisibility() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle eye icon
        const icon = togglePassword.querySelector('i');
        if (type === 'password') {
            icon.className = 'fas fa-eye';
        } else {
            icon.className = 'fas fa-eye-slash';
        }
    }
    
    // Check if user data exists in localStorage
    function checkStoredCredentials() {
        try {
            const storedEmail = localStorage.getItem('rememberedEmail');
            const rememberMe = localStorage.getItem('rememberMe') === 'true';
            
            if (storedEmail && rememberMe) {
                emailInput.value = storedEmail;
                rememberMeCheckbox.checked = true;
            }
        } catch (error) {
            console.error('Error loading stored credentials:', error);
        }
    }
    
    // Handle login
    function handleLogin() {
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = rememberMeCheckbox.checked;
        const isAdmin = userTypeAdmin.classList.contains('active');
        
        // Clear previous errors
        clearErrorMessages();
        
        // Validate form
        if (!validateForm(email, password)) {
            return;
        }
        
        // Get users from localStorage
        const users = getUsersFromStorage();
        
        // Find user
        const user = users.find(u => 
            u.email.toLowerCase() === email.toLowerCase() && 
            u.password === password && 
            u.userType === (isAdmin ? 'admin' : 'user')
        );
        
        if (!user) {
            showError('Invalid email or password. Please try again.');
            return;
        }
        
        // Check if user account is active (you could add this field to your user object)
        if (user.status === 'inactive') {
            showError('Your account has been deactivated. Please contact support.');
            return;
        }
        
        // Store remember me preference
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
            localStorage.setItem('rememberMe', 'true');
        } else {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberMe');
        }
        
        // Store current user session
        storeUserSession(user);
        
        // Show login success and redirect
        processLoginSuccess(user, isAdmin);
    }
    
    // Get users from localStorage
    function getUsersFromStorage() {
        try {
            const usersJson = localStorage.getItem('users');
            return usersJson ? JSON.parse(usersJson) : [];
        } catch (error) {
            console.error('Error loading users:', error);
            return [];
        }
    }
    
    // Store user session
    function storeUserSession(user) {
        // Remove password from session storage for security
        const userSession = { ...user };
        delete userSession.password;
        
        sessionStorage.setItem('currentUser', JSON.stringify(userSession));
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('loginTime', new Date().toISOString());
    }
    
    // Process successful login
    function processLoginSuccess(user, isAdmin) {
        const loginBtn = document.querySelector('.btn-primary');
        const originalText = loginBtn.innerHTML;
        
        // Disable form and show loading state
        loginForm.querySelectorAll('input, button').forEach(element => {
            element.disabled = true;
        });
        
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        
        // Simulate API call delay
        setTimeout(function() {
            // Show success message
            showSuccessMessage(`Welcome back, ${user.firstName}!`);
            
            // Additional delay before redirect
            setTimeout(function() {
                // Redirect based on user type
                if (isAdmin) {
                    window.location.href = 'backend.html';
                } else {
                    window.location.href = 'frontend.html';
                }
            }, 1000);
            
        }, 1500);
    }
    
    // Validate form
    function validateForm(email, password) {
        let isValid = true;
        
        // Email validation
        if (!email) {
            showFieldError('email', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Password validation
        if (!password) {
            showFieldError('password', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            showFieldError('password', 'Password must be at least 6 characters');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Validate email in real-time
    function validateEmail() {
        const email = emailInput.value.trim();
        const errorElement = document.getElementById('email-error');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        if (email && !isValidEmail(email)) {
            showFieldError('email', 'Please enter a valid email address');
        }
    }
    
    // Validate password in real-time
    function validatePassword() {
        const password = passwordInput.value;
        const errorElement = document.getElementById('password-error');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        if (password && password.length < 6) {
            showFieldError('password', 'Password must be at least 6 characters');
        }
    }
    
    // Check if email is valid
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Show field error
    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        field.classList.add('error');
        
        // Remove existing error message for this field
        const existingError = document.getElementById(`${fieldId}-error`);
        if (existingError) {
            existingError.remove();
        }
        
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.id = `${fieldId}-error`;
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        // Insert after the field
        field.parentNode.appendChild(errorDiv);
    }
    
    // Show general error message
    function showError(message) {
        // Remove any existing general error messages
        const existingError = document.getElementById('general-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Create and show error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.id = 'general-error';
        errorDiv.style.display = 'block';
        errorDiv.style.marginBottom = '1rem';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        // Insert before the login button
        loginForm.insertBefore(errorDiv, loginForm.querySelector('.btn-primary'));
        
        // Remove error after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
    
    // Show success message
    function showSuccessMessage(message) {
        // Remove any existing success messages
        const existingSuccess = document.getElementById('login-success');
        if (existingSuccess) {
            existingSuccess.remove();
        }
        
        // Create and show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.id = 'login-success';
        successDiv.style.display = 'block';
        successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        
        loginForm.appendChild(successDiv);
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 3000);
    }
    
    // Clear all error messages
    function clearErrorMessages() {
        // Remove error classes from fields
        document.querySelectorAll('.form-control.error').forEach(field => {
            field.classList.remove('error');
        });
        
        // Remove all error messages
        document.querySelectorAll('.error-message').forEach(error => {
            error.remove();
        });
    }
    
    // Handle forgot password
    function handleForgotPassword() {
        const email = prompt('Please enter your email address to reset your password:');
        
        if (!email) {
            return;
        }
        
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Check if email exists in users
        const users = getUsersFromStorage();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
            alert('No account found with that email address.');
            return;
        }
        
        // In a real application, you would send a password reset email here
        // For this demo, we'll just show a success message
        
        alert(`Password reset instructions have been sent to ${email}.\n\n(In a real application, this would send an email with reset link)`);
        
        // Log the reset request (for demo purposes)
        console.log('Password reset requested for:', email);
        
        // Simulate sending reset email
        simulatePasswordResetEmail(email);
    }
    
    // Simulate sending password reset email
    function simulatePasswordResetEmail(email) {
        // In a real app, this would be an API call to your backend
        setTimeout(() => {
            console.log('Password reset email simulated for:', email);
        }, 1000);
    }
    
    // Auto-focus email field on page load
    window.addEventListener('load', function() {
        if (!emailInput.value) {
            emailInput.focus();
        }
    });
    
    // Handle Enter key in password field
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
    
    // Add demo account info for testing (remove in production)
    initializeDemoAccounts();
});

// Initialize demo accounts for testing
function initializeDemoAccounts() {
    // Check if demo accounts are already created
    if (!localStorage.getItem('demoAccountsInitialized')) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Demo student account
        const demoStudent = {
            id: 'demo-student-001',
            firstName: 'John',
            lastName: 'Doe',
            email: 'student@demo.com',
            phone: '+256 700 000 001',
            password: 'student123', // In production, never store plain passwords!
            userType: 'user',
            studentId: 'MUNI2023001',
            hostelName: null,
            status: 'active',
            createdAt: new Date().toISOString()
        };
        
        // Demo admin account
        const demoAdmin = {
            id: 'demo-admin-001',
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@demo.com',
            phone: '+256 700 000 002',
            password: 'admin123', // In production, never store plain passwords!
            userType: 'admin',
            studentId: null,
            hostelName: 'Green Valley Hostel',
            status: 'active',
            createdAt: new Date().toISOString()
        };
        
        // Check if demo accounts already exist
        const studentExists = users.some(u => u.email === demoStudent.email);
        const adminExists = users.some(u => u.email === demoAdmin.email);
        
        if (!studentExists) {
            users.push(demoStudent);
        }
        
        if (!adminExists) {
            users.push(demoAdmin);
        }
        
        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('demoAccountsInitialized', 'true');
        
        console.log('Demo accounts initialized');
    }
}
