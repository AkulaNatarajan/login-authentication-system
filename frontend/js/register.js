/**
 * Registration Page Handler
 */

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Clear previous errors
    clearAllErrors();

    // Get form values
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate username
    const usernameValidation = Auth.validateUsername(username);
    if (!usernameValidation.isValid) {
        document.getElementById('usernameError').textContent = usernameValidation.errors[0];
        return;
    }

    // Validate email if provided
    if (email && !Auth.validateEmail(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address';
        return;
    }

    // Validate password
    const passwordValidation = Auth.validatePassword(password);
    if (!passwordValidation.isValid) {
        document.getElementById('passwordError').textContent = passwordValidation.errors[0];
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        document.getElementById('confirmError').textContent = 'Passwords do not match';
        return;
    }

    // Check if username/email already exists
    if (Auth.userExists(username, email)) {
        document.getElementById('usernameError').textContent = 'Username or email already registered';
        return;
    }

    // Register user
    const result = Auth.register(username, password, email);

    if (result.success) {
        document.getElementById('successMessage').textContent = '✓ ' + result.message;
        document.getElementById('registerForm').reset();

        // Redirect to login after 2 seconds
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } else {
        document.getElementById('usernameError').textContent = result.message;
    }
});

/**
 * Clear all error messages
 */
function clearAllErrors() {
    document.getElementById('usernameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    document.getElementById('confirmError').textContent = '';
    document.getElementById('successMessage').textContent = '';
}

/**
 * Real-time password validation feedback
 */
document.getElementById('password').addEventListener('input', function() {
    const validation = Auth.validatePassword(this.value);
    if (this.value && !validation.isValid) {
        document.getElementById('passwordError').textContent = validation.errors[0];
    } else {
        document.getElementById('passwordError').textContent = '';
    }
});

/**
 * Confirm password validation
 */
document.getElementById('confirmPassword').addEventListener('input', function() {
    const password = document.getElementById('password').value;
    if (this.value && password !== this.value) {
        document.getElementById('confirmError').textContent = 'Passwords do not match';
    } else {
        document.getElementById('confirmError').textContent = '';
    }
});
