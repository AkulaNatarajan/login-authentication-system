# Frontend Setup Guide

## Quick Start (No Server Required!)

### Installation

1. **Open the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Open in browser:**
   - Double-click `index.html`, or
   - Use a local server (recommended):
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Python 2
     python -m SimpleHTTPServer 8000
     
     # Using Node.js (http-server)
     npx http-server
     ```

3. **Visit in browser:**
   ```
   http://localhost:8000
   ```

---

## File Structure

```
frontend/
├── index.html          # Home/landing page
├── register.html       # Registration page
├── login.html          # Login page
├── dashboard.html      # Protected dashboard
├── css/
│   └── style.css       # Responsive styling
└── js/
    ├── auth.js         # Core authentication logic
    ├── register.js     # Registration handler
    ├── login.js        # Login handler
    └── dashboard.js    # Dashboard logic
```

---

## How It Works

### 1. Password Hashing
- Uses **CryptoJS SHA-256** for client-side hashing
- Passwords are hashed before storage in localStorage
- Never stored as plain text

### 2. User Storage
- Data stored in browser's `localStorage`
- Key: `users` (array of all users)
- Format:
  ```json
  {
    "username": "testuser",
    "email": "test@example.com",
    "password": "[SHA256 hash]",
    "createdAt": "2026-09-11T..."
  }
  ```

### 3. Session Management
- Key: `currentSession`
- Stores current logged-in user info
- Cleared on logout
- Example:
  ```json
  {
    "username": "testuser",
    "email": "test@example.com",
    "loginTime": "2026-09-11T..."
  }
  ```

### 4. Authentication Flow
```
User → Registration → Validate → Hash Password → Store → Success
         ↓
      Login → Find User → Hash & Compare → Set Session → Dashboard
         ↓
      Dashboard → Check Session → Show Content (if auth) OR Redirect to Login
         ↓
      Logout → Clear Session → Redirect to Login
```

---

## Features Implemented

✅ **Registration**
- Username validation (3+ chars, alphanumeric + underscore)
- Email validation (optional)
- Password requirements (8+ chars, 1+ number)
- Duplicate username/email check
- Real-time validation feedback

✅ **Login**
- Username or email login
- Password verification
- Generic error messages (security)
- Session creation
- Auto-redirect to dashboard

✅ **Dashboard**
- Protected route (redirects to login if not authenticated)
- Display user information
- Session refresh functionality
- Logout button with confirmation
- Session timeout warning (30 minutes)

✅ **Security**
- Passwords hashed with SHA-256
- No plain text storage
- Generic error messages
- Session-based access control
- Form validation

---

## Testing

### Test User Flow

1. **Register:**
   - Visit `register.html`
   - Username: `testuser`
   - Email: `test@example.com` (optional)
   - Password: `Password123`
   - Confirm: `Password123`
   - Click "Register"
   - Should redirect to login

2. **Login:**
   - Visit `login.html`
   - Enter: `testuser` / `Password123`
   - Click "Login"
   - Should redirect to dashboard

3. **Dashboard:**
   - View user info
   - Click "Refresh Session"
   - Click "Logout"
   - Should redirect to login

4. **Protected Route:**
   - Open `dashboard.html` directly without logging in
   - Should auto-redirect to login

---

## Validation Rules

### Username
- Minimum 3 characters
- Only letters, numbers, and underscores
- Must not already exist

### Email (Optional)
- Valid email format (if provided)
- Must not already exist

### Password
- Minimum 8 characters
- At least 1 number
- Confirmation must match

---

## Browser Storage

### Check localStorage

Open browser DevTools (F12) and run:

```javascript
// View all users
JSON.parse(localStorage.getItem('users'))

// View current session
JSON.parse(localStorage.getItem('currentSession'))

// Clear all data
Auth.clearAll()
```

### Debugging

Enable console logs for debugging:

```javascript
// In auth.js, add console.log() calls:
console.log('Registering user:', username);
console.log('Hashed password:', hashedPassword);
console.log('All users:', this.getAllUsers());
```

---

## Limitations (Why Backend is Better)

⚠️ **localStorage Limitations:**
- Data is not encrypted
- Vulnerable to XSS attacks
- Data persists across sessions
- No server-side validation
- Not suitable for production

✅ **Use Backend For:**
- Production systems
- Sensitive data
- Server-side validation
- Secure session management
- Rate limiting
- Audit logs

---

## Customization

### Change Session Timeout

Edit `dashboard.js`:
```javascript
const SESSION_TIMEOUT = 30 * 60 * 1000; // Change this (in milliseconds)
```

### Change Password Requirements

Edit `auth.js`:
```javascript
validatePassword: function(password) {
    const errors = [];
    
    if (password.length < 8) {  // Change minimum length
        errors.push('Password must be at least 8 characters');
    }
    // Add more rules as needed
}
```

### Change Styling

Edit `css/style.css` to customize colors, fonts, and layout.

---

## Troubleshooting

**CORS Error:**
- Make sure you're using a local server, not opening file directly
- Use `python -m http.server` or `npx http-server`

**Data Not Persisting:**
- Check if localStorage is enabled in browser
- Check browser privacy settings
- Open DevTools → Application → localStorage

**CryptoJS Not Loading:**
- Make sure HTML includes CDN link:
  ```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
  ```

**Validation Not Working:**
- Check browser console for JavaScript errors
- Verify auth.js is loaded before register.js/login.js

---

## Production Deployment

This frontend-only approach is **NOT recommended for production**.

### Better Alternatives:
1. Use the Node.js + Express backend
2. Deploy with a real database
3. Add HTTPS/SSL
4. Implement JWT tokens
5. Add email verification
6. Add password reset
7. Implement rate limiting
8. Add audit logging

---

## Next Steps

1. Try the backend implementation for production use
2. Add more validation rules as needed
3. Customize styling to match your brand
4. Add additional features (2FA, OAuth, etc.)
5. Integrate with a real database
