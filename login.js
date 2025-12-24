// login.js - Complete Authentication System

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
    
    // Initialize
    initializePage();
    
    // Event Listeners
    userTypeUser.addEventListener('click', () => selectUserType('student'));
    userTypeAdmin.addEventListener('click', () => selectUserType('admin'));
    togglePassword.addEventListener('click', togglePasswordVisibility);
    loginForm.addEventListener('submit', handleLogin);
    forgotPasswordLink.addEventListener('click', handleForgotPassword);
    
    // Real-time validation
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);
    
    function initializePage() {
        // Check for stored credentials
        checkStoredCredentials();
        
        // Set default user type
        selectUserType('student');
        
        // Auto-focus email field
        if (!emailInput.value) {
            emailInput.focus();
        }
    }
    
    function selectUserType(type) {
        clearErrorMessages();
        
        if (type === 'student') {
            userTypeUser.classList.add('active');
            userTypeAdmin.classList.remove('active');
        } else {
            userTypeAdmin.classList.add('active');
            userTypeUser.classList.remove('active');
        }
    }
    
    function togglePasswordVisibility() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = togglePassword.querySelector('i');
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    }
    
    async function handleLogin(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = rememberMeCheckbox.checked;
        const isAdmin = userTypeAdmin.classList.contains('active');
        
        clearErrorMessages();
        
        if (!validateForm(email, password)) {
            return;
        }
        
        try {
            // Authenticate user
            const user = securityManager.authenticate(email, password);
            
            if (!user) {
                showError('Invalid email or password. Please try again.');
                return;
            }
            
            // Check if user is trying to access correct portal
            if (isAdmin && user.role === 'user') {
                showError('This account does not have admin privileges. Please login as a student.');
                return;
            }
            
            if (!isAdmin && user.role !== 'user') {
                showError('Please use the admin login for this account.');
                return;
            }
            
            // Check account status
            if (user.status === 'pending') {
                showError('Your account is pending approval. Please contact the system administrator.');
                return;
            }
            
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
            
            // Store user session
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            // Show success and redirect
            showLoginSuccess(user);
            
        } catch (error) {
            showError('An error occurred during login. Please try again.');
            console.error('Login error:', error);
        }
    }
    
    function validateForm(email, password) {
        let isValid = true;
        
        if (!email) {
            showFieldError('email', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!password) {
            showFieldError('password', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            showFieldError('password', 'Password must be at least 6 characters');
            isValid = false;
        }
        
        return isValid;
    }
    
    function validateEmail() {
        const email = emailInput.value.trim();
        clearFieldError('email');
        
        if (email && !isValidEmail(email)) {
            showFieldError('email', 'Please enter a valid email address');
        }
    }
    
    function validatePassword() {
        const password = passwordInput.value;
        clearFieldError('password');
        
        if (password && password.length < 6) {
            showFieldError('password', 'Password must be at least 6 characters');
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showLoginSuccess(user) {
        const loginBtn = document.querySelector('.btn-primary');
        const originalText = loginBtn.innerHTML;
        
        // Disable form and show loading
        loginForm.querySelectorAll('input, button').forEach(el => el.disabled = true);
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        
        // Show success message
        showSuccessMessage(`Welcome back, ${user.firstName}!`);
        
        // Redirect after delay
        setTimeout(() => {
            if (user.role === 'user') {
                window.location.href = 'frontend.html';
            } else if (user.role === 'hostel_admin' || user.role === 'super_admin') {
                window.location.href = 'backend.html';
            }
        }, 1500);
    }
    
    function handleForgotPassword(e) {
        e.preventDefault();
        
        const email = prompt('Please enter your email address to reset your password:');
        if (!email) return;
        
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Check if user exists
        const users = securityManager.getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
            // Don't reveal if user exists or not
            alert('If an account exists with that email, reset instructions will be sent.');
            return;
        }
        
        // In a real app, send reset email here
        alert('Password reset instructions have been sent to your email.\n\n(In a real application, this would send an email with reset link)');
    }
    
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
    
    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.id = `${fieldId}-error`;
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        field.parentNode.appendChild(errorDiv);
    }
    
    function clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        field.classList.remove('error');
        
        const errorElement = document.getElementById(`${fieldId}-error`);
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    function showError(message) {
        const existingError = document.getElementById('general-error');
        if (existingError) {
            existingError.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.id = 'general-error';
        errorDiv.style.display = 'block';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        loginForm.insertBefore(errorDiv, loginForm.querySelector('.btn-primary'));
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
    
    function showSuccessMessage(message) {
        const existingSuccess = document.getElementById('login-success');
        if (existingSuccess) {
            existingSuccess.remove();
        }
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.id = 'login-success';
        successDiv.style.display = 'block';
        successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        
        loginForm.appendChild(successDiv);
    }
    
    function clearErrorMessages() {
        document.querySelectorAll('.form-control.error').forEach(field => {
            field.classList.remove('error');
        });
        
        document.querySelectorAll('.error-message').forEach(error => {
            error.remove();
        });
    }
    
    // Enter key support
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
});
