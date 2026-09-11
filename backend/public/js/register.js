/**
 * Registration Page Handler - Backend Version
 */

document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Clear previous errors
    clearAllErrors();

    // Get form values
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Basic validation
    if (!username || !password || !confirmPassword) {
        document.getElementById('usernameError').textContent = 'Please fill in all required fields';
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        document.getElementById('confirmError').textContent = 'Passwords do not match';
        return;
    }

    try {
        // Send registration request to backend
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                confirmPassword: confirmPassword
            })
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById('successMessage').textContent = '✓ ' + data.message;
            document.getElementById('registerForm').reset();

            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            document.getElementById('usernameError').textContent = data.message;
        }
    } catch (error) {
        console.error('Registration error:', error);
        document.getElementById('usernameError').textContent = 'Error connecting to server';
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
    const password = this.value;
    const errors = [];

    if (password) {
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters');
        }
        if (!/\d/.test(password)) {
            errors.push('Password must contain at least 1 number');
        }
    }

    document.getElementById('passwordError').textContent = errors[0] || '';
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