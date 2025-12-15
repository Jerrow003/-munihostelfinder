document.addEventListener('DOMContentLoaded', function() {
    const userTypeUser = document.getElementById('userTypeUser');
    const userTypeAdmin = document.getElementById('userTypeAdmin');
    const signupForm = document.getElementById('signupForm');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const studentFields = document.getElementById('studentFields');
    const hostelOwnerFields = document.getElementById('hostelOwnerFields');
    
    // User type selection
    userTypeUser.addEventListener('click', function() {
        userTypeUser.classList.add('active');
        userTypeAdmin.classList.remove('active');
        studentFields.style.display = 'block';
        hostelOwnerFields.style.display = 'none';
    });
    
    userTypeAdmin.addEventListener('click', function() {
        userTypeAdmin.classList.add('active');
        userTypeUser.classList.remove('active');
        studentFields.style.display = 'none';
        hostelOwnerFields.style.display = 'block';
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
    
    // Toggle confirm password visibility
    toggleConfirmPassword.addEventListener('click', function() {
        const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordInput.setAttribute('type', type);
        
        // Toggle eye icon
        if (type === 'password') {
            toggleConfirmPassword.innerHTML = '<i class="fas fa-eye"></i>';
        } else {
            toggleConfirmPassword.innerHTML = '<i class="fas fa-eye-slash"></i>';
        }
    });
    
    // Form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const isAdmin = userTypeAdmin.classList.contains('active');
        const studentId = document.getElementById('studentId').value;
        const hostelName = document.getElementById('hostelName').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        // Validation
        if (!validateForm()) {
            return;
        }
        
        // Get existing users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if email already exists
        if (users.find(u => u.email === email)) {
            showError('Email already exists. Please use a different email.');
            return;
        }
        
        // Create user object
        const newUser = {
            id: Date.now().toString(),
            firstName,
            lastName,
            email,
            phone,
            password,
            userType: isAdmin ? 'admin' : 'user',
            studentId: isAdmin ? null : studentId,
            hostelName: isAdmin ? hostelName : null,
            createdAt: new Date().toISOString()
        };
        
        // Add to users array
        users.push(newUser);
        
        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        // Show success message
        showSuccess('Account created successfully! Redirecting to login...');
        
        // Disable form and button
        const signupBtn = document.querySelector('.btn-primary');
        signupBtn.disabled = true;
        signupBtn.innerHTML = '<i class="fas fa-check"></i> Account Created';
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    });
    
    function validateForm() {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        // Clear previous errors
        clearErrors();
        
        let isValid = true;
        
        // Name validation
        if (!firstName.trim()) {
            showFieldError('firstName', 'First name is required');
            isValid = false;
        }
        
        if (!lastName.trim()) {
            showFieldError('lastName', 'Last name is required');
            isValid = false;
        }
        
        // Email validation
        if (!email.trim()) {
            showFieldError('email', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Phone validation
        if (!phone.trim()) {
            showFieldError('phone', 'Phone number is required');
            isValid = false;
        }
        
        // Password validation
        if (!password) {
            showFieldError('password', 'Password is required');
            isValid = false;
        } else if (password.length < 8) {
            showFieldError('password', 'Password must be at least 8 characters');
            isValid = false;
        } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
            showFieldError('password', 'Password must contain letters and numbers');
            isValid = false;
        }
        
        // Confirm password validation
        if (!confirmPassword) {
            showFieldError('confirmPassword', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showFieldError('confirmPassword', 'Passwords do not match');
            isValid = false;
        }
        
        // Terms agreement validation
        if (!agreeTerms) {
            showError('Please agree to the Terms of Service and Privacy Policy');
            isValid = false;
        }
        
        return isValid;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        field.parentNode.appendChild(errorDiv);
    }
    
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.display = 'block';
        errorDiv.style.marginBottom = '1rem';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        signupForm.insertBefore(errorDiv, signupForm.querySelector('.btn-primary'));
        
        // Remove error after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
    
    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.display = 'block';
        successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        
        signupForm.appendChild(successDiv);
    }
    
    function clearErrors() {
        // Remove error classes from fields
        document.querySelectorAll('.form-control.error').forEach(field => {
            field.classList.remove('error');
        });
        
        // Remove error messages
        document.querySelectorAll('.error-message').forEach(error => {
            error.remove();
        });
    }
    
    // Real-time password validation
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        clearErrors();
        
        if (password.length > 0 && password.length < 8) {
            showFieldError('password', 'Password must be at least 8 characters');
        } else if (password.length >= 8 && !/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
            showFieldError('password', 'Password must contain letters and numbers');
        }
    });
    
    // Real-time confirm password validation
    confirmPasswordInput.addEventListener('input', function() {
        const password = passwordInput.value;
        const confirmPassword = this.value;
        
        clearErrors();
        
        if (confirmPassword && password !== confirmPassword) {
            showFieldError('confirmPassword', 'Passwords do not match');
        }
    });
});