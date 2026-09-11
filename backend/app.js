/**
 * Login Authentication System - Node.js + Express Backend
 * Full-stack implementation with bcryptjs password hashing
 */

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: 'your-secret-key', // Change in production
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true with HTTPS
        httpOnly: true,
        maxAge: 30 * 60 * 1000 // 30 minutes
    }
}));

// User database file
const usersFile = path.join(__dirname, 'data', 'users.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize users.json if it doesn't exist
if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([]));
}

/**
 * Load all users from JSON file
 */
function loadUsers() {
    try {
        const data = fs.readFileSync(usersFile, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error loading users:', err);
        return [];
    }
}

/**
 * Save users to JSON file
 */
function saveUsers(users) {
    try {
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    } catch (err) {
        console.error('Error saving users:', err);
    }
}

/**
 * Find user by username or email
 */
function findUser(usernameOrEmail) {
    const users = loadUsers();
    return users.find(user => 
        user.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
        user.email.toLowerCase() === usernameOrEmail.toLowerCase()
    );
}

/**
 * Check if username or email already exists
 */
function userExists(username, email) {
    const users = loadUsers();
    return users.some(user => 
        user.username.toLowerCase() === username.toLowerCase() ||
        (email && user.email.toLowerCase() === email.toLowerCase())
    );
}

/**
 * Validate password
 */
function validatePassword(password) {
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
}

/**
 * Validate username
 */
function validateUsername(username) {
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
}

/**
 * Validate email format
 */
function validateEmail(email) {
    if (!email) return true; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Registration endpoint
 */
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        // Validate username
        const usernameValidation = validateUsername(username);
        if (!usernameValidation.isValid) {
            return res.status(400).json({ 
                success: false, 
                message: usernameValidation.errors[0] 
            });
        }

        // Validate email if provided
        if (email && !validateEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email format' 
            });
        }

        // Validate password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({ 
                success: false, 
                message: passwordValidation.errors[0] 
            });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Passwords do not match' 
            });
        }

        // Check if user already exists
        if (userExists(username, email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username or email already registered' 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = {
            id: Date.now(),
            username: username,
            email: email || '',
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        // Save user
        const users = loadUsers();
        users.push(newUser);
        saveUsers(users);

        res.status(201).json({ 
            success: true, 
            message: 'Registration successful! Please login.' 
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during registration' 
        });
    }
});

/**
 * Login endpoint
 */
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Find user
        const user = findUser(username);
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Set session
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.email = user.email;

        res.json({ 
            success: true, 
            message: 'Login successful!',
            user: {
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
});

/**
 * Logout endpoint
 */
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Error logging out' 
            });
        }
        res.json({ 
            success: true, 
            message: 'Logged out successfully' 
        });
    });
});

/**
 * Get current user endpoint
 */
app.get('/api/user', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ 
            success: false, 
            message: 'Not authenticated' 
        });
    }

    res.json({
        success: true,
        user: {
            username: req.session.username,
            email: req.session.email
        }
    });
});

/**
 * Protected dashboard route
 */
app.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login.html');
    }
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

/**
 * Redirect protected routes to login if not authenticated
 */
app.get('/api/protected', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ 
            success: false, 
            message: 'Please login first' 
        });
    }
    res.json({ 
        success: true, 
        message: 'Access granted' 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop');
});