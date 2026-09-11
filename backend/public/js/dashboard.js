/**
 * Dashboard Page Handler - Backend Version
 */

// Check if user is authenticated on page load
window.addEventListener('DOMContentLoaded', async function() {
    try {
        // Check if user is authenticated
        const response = await fetch('/api/user');
        const data = await response.json();

        if (!data.success) {
            // Redirect to login if not authenticated
            window.location.href = 'login.html';
            return;
        }

        // Display user information
        displayUserInfo(data.user);
    } catch (error) {
        console.error('Error checking authentication:', error);
        window.location.href = 'login.html';
    }
});

/**
 * Display user information on dashboard
 */
function displayUserInfo(user) {
    document.getElementById('displayUsername').textContent = user.username || 'N/A';
    document.getElementById('displayEmail').textContent = user.email || 'Not provided';
    document.getElementById('loginTime').textContent = new Date().toLocaleString();
}

/**
 * Logout button handler
 */
document.getElementById('logoutBtn').addEventListener('click', async function() {
    if (confirm('Are you sure you want to logout?')) {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST'
            });

            const data = await response.json();

            if (data.success) {
                window.location.href = 'login.html';
            }
        } catch (error) {
            console.error('Logout error:', error);
            alert('Error logging out');
        }
    }
});

/**
 * Settings button handler (placeholder)
 */
document.getElementById('settingsBtn').addEventListener('click', function() {
    alert('Settings feature coming soon!');
});