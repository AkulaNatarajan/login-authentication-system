/**
 * Login Page Handler - Backend Version
 */

document.getElementById('loginForm').addEventListener('submit', async function(e) {
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

    try {
        // Send login request to backend
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameOrEmail,
                password: password
            })
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById('loginSuccess').textContent = '✓ ' + data.message;
            
            // Redirect to dashboard after 1.5 seconds
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            // Generic error message
            document.getElementById('loginError').textContent = data.message;
            
            // Clear password field for security
            document.getElementById('loginPassword').value = '';
        }
    } catch (error) {
        console.error('Login error:', error);
        document.getElementById('loginError').textContent = 'Error connecting to server';
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