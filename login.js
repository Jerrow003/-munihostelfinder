document.addEventListener('DOMContentLoaded', function() {
    const userTypeUser = document.getElementById('userTypeUser');
    const userTypeAdmin = document.getElementById('userTypeAdmin');
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    // User type selection
    userTypeUser.addEventListener('click', function() {
        userTypeUser.classList.add('active');
        userTypeAdmin.classList.remove('active');
    });
    
    userTypeAdmin.addEventListener('click', function() {
        userTypeAdmin.classList.add('active');
        userTypeUser.classList.remove('active');
    });
    
    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle eye icon
        if (type === 'password') {
            togglePassword.innerHTML = '<i class="fas fa-eye"></i>';
        } else {
            togglePassword.innerHTML = '<i class="fas fa-eye-slash"></i>';
        }
    });
    
    // Check if user data exists in localStorage
    function checkStoredCredentials() {
        const storedEmail = localStorage.getItem('userEmail');
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        
        if (storedEmail && rememberMe) {
            document.getElementById('email').value = storedEmail;
            document.getElementById('rememberMe').checked = true;
        }
    }
    
    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        const isAdmin = userTypeAdmin.classList.contains('active');
        
        // Simple validation
        if (!email || !password) {
            showError('Please fill in all fields');
            return;
        }
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Find user
        const user = users.find(u => u.email === email && u.password === password && u.userType === (isAdmin ? 'admin' : 'user'));
        
        if (!user) {
            showError('Invalid email or password');
            return;
        }
        
        // Store remember me preference
        if (rememberMe) {
            localStorage.setItem('userEmail', email);
            localStorage.setItem('rememberMe', 'true');
        } else {
            localStorage.removeItem('userEmail');
            localStorage.removeItem('rememberMe');
        }
        
        // Store current user session
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        
        // Simulate login process
        const loginBtn = document.querySelector('.btn-primary');
        const originalText = loginBtn.innerHTML;
        
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        loginBtn.disabled = true;
        
        setTimeout(function() {
            // Redirect based on user type
            if (isAdmin) {
                alert('Login successful! Redirecting to admin dashboard...');
                window.location.href = 'backend.html';
            } else {
                alert('Login successful! Redirecting to hostel finder...');
                window.location.href = 'frontend.html';
            }
            
            loginBtn.innerHTML = originalText;
            loginBtn.disabled = false;
        }, 1500);
    });
    
    function showError(message) {
        // Remove any existing error messages
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Create and show error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.display = 'block';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        loginForm.appendChild(errorDiv);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
    
    // Check for stored credentials on page load
    checkStoredCredentials();
});