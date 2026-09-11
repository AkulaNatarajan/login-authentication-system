/**
 * Login Page Handler
 */

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Clear previous messages
    document.getElementById('loginError').textContent = '';
    document.getElementById('loginSuccess').textContent = '';

    // Get form values
    const usernameOrEmail = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Basic validation
    if (!usernameOrEmail || !password) {
        document.getElementById('loginError').textContent = 'Please enter both username/email and password';
        return;
    }

    // Attempt login
    const result = Auth.login(usernameOrEmail, password);

    if (result.success) {
        document.getElementById('loginSuccess').textContent = '✓ ' + result.message;
        
        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        // Generic error message (don't reveal which field is wrong)
        document.getElementById('loginError').textContent = result.message;
        
        // Clear password field for security
        document.getElementById('loginPassword').value = '';
    }
});

/**
 * Clear error on input
 */
document.getElementById('loginUsername').addEventListener('input', function() {
    if (this.value) {
        document.getElementById('loginError').textContent = '';
    }
});

document.getElementById('loginPassword').addEventListener('input', function() {
    if (this.value) {
        document.getElementById('loginError').textContent = '';
    }
});
