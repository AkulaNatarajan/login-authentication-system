/**
 * Core Authentication Module
 * Handles password hashing, validation, and session management
 */

const Auth = {
    /**
     * Hash password using SHA-256
     * @param {string} password - Plain text password
     * @returns {string} - SHA-256 hash
     */
    hashPassword: function(password) {
        return CryptoJS.SHA256(password).toString();
    },

    /**
     * Validate password requirements
     * @param {string} password - Password to validate
     * @returns {object} - { isValid: boolean, errors: array }
     */
    validatePassword: function(password) {
        const errors = [];

        if (!password) {
            errors.push('Password is required');
        } else {
            if (password.length < 8) {
                errors.push('Password must be at least 8 characters');
            }
            if (!/\d/.test(password)) {
                errors.push('Password must contain at least 1 number');
            }
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },

    /**
     * Validate username format
     * @param {string} username - Username to validate
     * @returns {object} - { isValid: boolean, errors: array }
     */
    validateUsername: function(username) {
        const errors = [];

        if (!username) {
            errors.push('Username is required');
        } else if (username.length < 3) {
            errors.push('Username must be at least 3 characters');
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            errors.push('Username can only contain letters, numbers, and underscores');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean}
     */
    validateEmail: function(email) {
        if (!email) return true; // Email is optional
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Register new user
     * @param {string} username - Username
     * @param {string} password - Plain text password
     * @param {string} email - Email (optional)
     * @returns {object} - { success: boolean, message: string }
     */
    register: function(username, password, email = '') {
        // Check if user already exists
        if (this.userExists(username, email)) {
            return {
                success: false,
                message: 'Username or email already registered'
            };
        }

        // Hash password
        const hashedPassword = this.hashPassword(password);

        // Store user
        const user = {
            username: username,
            email: email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        let users = this.getAllUsers();
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));

        return {
            success: true,
            message: 'Registration successful! Please login.'
        };
    },

    /**
     * Login user
     * @param {string} usernameOrEmail - Username or email
     * @param {string} password - Plain text password
     * @returns {object} - { success: boolean, message: string, user: object }
     */
    login: function(usernameOrEmail, password) {
        const user = this.findUser(usernameOrEmail);

        if (!user) {
            return {
                success: false,
                message: 'Invalid credentials'
            };
        }

        // Compare passwords
        const hashedPassword = this.hashPassword(password);
        if (user.password !== hashedPassword) {
            return {
                success: false,
                message: 'Invalid credentials'
            };
        }

        // Set session
        const session = {
            username: user.username,
            email: user.email,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('currentSession', JSON.stringify(session));

        return {
            success: true,
            message: 'Login successful!',
            user: session
        };
    },

    /**
     * Logout user
     */
    logout: function() {
        localStorage.removeItem('currentSession');
    },

    /**
     * Get current logged-in user
     * @returns {object|null} - Current user or null
     */
    getCurrentUser: function() {
        const session = localStorage.getItem('currentSession');
        return session ? JSON.parse(session) : null;
    },

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated: function() {
        return this.getCurrentUser() !== null;
    },

    /**
     * Find user by username or email
     * @param {string} usernameOrEmail - Username or email to find
     * @returns {object|null} - User object or null
     */
    findUser: function(usernameOrEmail) {
        const users = this.getAllUsers();
        return users.find(user =>
            user.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
            user.email.toLowerCase() === usernameOrEmail.toLowerCase()
        ) || null;
    },

    /**
     * Check if user already exists
     * @param {string} username - Username to check
     * @param {string} email - Email to check
     * @returns {boolean}
     */
    userExists: function(username, email) {
        const users = this.getAllUsers();
        return users.some(user =>
            user.username.toLowerCase() === username.toLowerCase() ||
            (email && user.email.toLowerCase() === email.toLowerCase())
        );
    },

    /**
     * Get all users from storage
     * @returns {array}
     */
    getAllUsers: function() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    },

    /**
     * Clear all data (for testing/development only)
     */
    clearAll: function() {
        localStorage.removeItem('users');
        localStorage.removeItem('currentSession');
    }
};

// Initialize storage if empty
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}
