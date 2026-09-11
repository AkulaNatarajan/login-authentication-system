# Comprehensive Testing Guide

## Test Scenarios

### Approach A: Frontend Only (localStorage)

#### Test 1: User Registration
```
1. Open frontend/index.html → Click "Register"
2. Try submitting with empty fields → Error: "Please enter all fields"
3. Enter username "ab" → Error: "Username must be at least 3 characters"
4. Enter username "test!" → Error: "Username can only contain letters, numbers, and underscores"
5. Enter password "short" → Error: "Password must be at least 8 characters"
6. Enter password "Password" (no number) → Error: "Password must contain at least 1 number"
7. Enter passwords that don't match → Error: "Passwords do not match"
8. Register valid user: username="testuser", password="Password123"
9. Should redirect to login with success message
10. Check localStorage: Auth.getAllUsers() should show user with hashed password
```

#### Test 2: Duplicate Username/Email
```
1. After registering "testuser", try registering again
2. Should show error: "Username or email already registered"
3. Try registering with different username but same email
4. Should show error: "Username or email already registered"
```

#### Test 3: User Login
```
1. Open frontend/login.html
2. Try logging in with wrong username → Error: "Invalid credentials"
3. Try logging in with correct username but wrong password → Error: "Invalid credentials"
4. Login with correct credentials: "testuser" / "Password123"
5. Should show success message and redirect to dashboard
6. Check session: localStorage.getItem('currentSession') should show user
```

#### Test 4: Protected Dashboard
```
1. From login page, after successful login, verify redirect to dashboard
2. Dashboard should show:
   - Username: testuser
   - Email: (if entered)
   - Login Time: current time
3. Close browser and reopen frontend/dashboard.html
4. Should still show dashboard (session persists in localStorage)
5. Check console: Auth.getCurrentUser() should return user object
```

#### Test 5: Session Timeout Warning
```
1. Login and stay idle on dashboard for 30+ minutes
2. Should see alert: "Your session has expired. Please login again."
3. Automatically redirect to login page
```

#### Test 6: Logout
```
1. From dashboard, click "Logout"
2. Confirm logout in dialog
3. Should redirect to login page
4. Check session: localStorage.getItem('currentSession') should be null
5. Try accessing dashboard directly → Should redirect to login
```

#### Test 7: Refresh Session
```
1. Login and open dashboard
2. Note login time
3. Click "Refresh Session"
4. Login time should update
5. Session should continue for another 30 minutes
```

---

### Approach B: Backend (Node.js + Express)

#### Test 1: Server Startup
```bash
cd backend
npm install
npm start
# Should output: "Server running on http://localhost:3000"
```

#### Test 2: API - Register Endpoint
```bash
# Valid registration
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "apiuser",
    "email": "api@example.com",
    "password": "Password123",
    "confirmPassword": "Password123"
  }'
# Expected: {"success": true, "message": "Registration successful!"}

# Duplicate username
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "apiuser",
    "email": "another@example.com",
    "password": "Password123",
    "confirmPassword": "Password123"
  }'
# Expected: {"success": false, "message": "Username or email already registered"}

# Invalid password
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "password": "short",
    "confirmPassword": "short"
  }'
# Expected: {"success": false, "message": "Password must be at least 8 characters"}
```

#### Test 3: API - Login Endpoint
```bash
# Save cookies for session
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "username": "apiuser",
    "password": "Password123"
  }'
# Expected: {"success": true, "message": "Login successful!"}

# Wrong password
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "apiuser",
    "password": "WrongPassword"
  }'
# Expected: {"success": false, "message": "Invalid credentials"}
```

#### Test 4: API - Get User Endpoint
```bash
# Authenticated request
curl -X GET http://localhost:3000/api/user \
  -b cookies.txt
# Expected: {"success": true, "user": {"username": "apiuser", "email": "api@example.com"}}

# Without session
curl -X GET http://localhost:3000/api/user
# Expected: {"success": false, "message": "Not authenticated"}
```

#### Test 5: API - Logout Endpoint
```bash
curl -X POST http://localhost:3000/api/logout \
  -b cookies.txt
# Expected: {"success": true, "message": "Logged out successfully"}

# Try accessing user after logout
curl -X GET http://localhost:3000/api/user \
  -b cookies.txt
# Expected: {"success": false, "message": "Not authenticated"}
```

#### Test 6: UI - Registration Flow
```
1. Visit http://localhost:3000/register.html
2. Register new user
3. Should show success message
4. Auto-redirect to login.html
5. Check backend/data/users.json for new user (password hashed with bcryptjs)
```

#### Test 7: UI - Login Flow
```
1. Visit http://localhost:3000/login.html
2. Enter credentials from registration
3. Should redirect to dashboard.html
4. Dashboard should display user info
5. Session should be stored in server (not localStorage)
```

#### Test 8: UI - Protected Routes
```
1. Visit http://localhost:3000/dashboard without logging in
2. Should redirect to login.html
3. Login and navigate to dashboard
4. Should display normally
5. Click logout and try accessing dashboard again
6. Should redirect to login
```

---

## Security Tests

### Test 1: Password Hashing
```javascript
// Frontend approach
const pass1 = Auth.hashPassword('Password123');
const pass2 = Auth.hashPassword('Password123');
console.log(pass1 === pass2); // Should be true (same hash)
console.log(pass1); // Should show SHA256 hash

// Backend approach
// Check users.json - passwords should be bcrypt hashes starting with $2a$
```

### Test 2: Plain Text Password Never Stored
```
1. Register with password "Password123"
2. Frontend: Check localStorage - password should be hashed
3. Backend: Check users.json - password should be bcrypt hash
4. Search in localStorage/users.json for "Password123"
5. Should not find plain text password
```

### Test 3: Generic Error Messages
```
1. Try login with non-existent username → "Invalid credentials"
2. Try login with correct username, wrong password → "Invalid credentials"
3. Both should show same message (not revealing which field is wrong)
```

### Test 4: Session Expiration
```
1. Login to backend
2. Wait 30+ minutes (or modify SESSION_TIMEOUT in code)
3. Try accessing protected route
4. Should redirect to login or return 401 error
```

### Test 5: XSS Prevention (Backend)
```
# Try injecting script tag in username
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "<script>alert('xss')</script>",
    "password": "Password123",
    "confirmPassword": "Password123"
  }'
# Should either reject or sanitize the input
```

---

## Performance Tests

### Frontend
```
1. Register 100 users in localStorage
2. Try login - should still be fast (<100ms)
3. Dashboard load time - should be instant
4. Check browser performance: DevTools → Performance tab
```

### Backend
```bash
# Test concurrent logins
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/login \
    -H "Content-Type: application/json" \
    -d '{"username": "testuser", "password": "Password123"}' &
done
# All requests should succeed
```

---

## Browser Compatibility

Test on:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers (iOS Safari, Chrome Android)

Check:
- localStorage availability
- localStorage size limits
- Session persistence across tabs
- Password field visibility toggle

---

## Regression Tests (Run After Changes)

1. **Registration:**
   - [ ] Valid user registration
   - [ ] Duplicate prevention
   - [ ] Password validation
   - [ ] Email validation
   - [ ] Success redirect

2. **Login:**
   - [ ] Valid credentials login
   - [ ] Invalid credentials rejection
   - [ ] Generic error messages
   - [ ] Dashboard redirect

3. **Dashboard:**
   - [ ] Display user info correctly
   - [ ] Session check on page load
   - [ ] Logout functionality
   - [ ] Protected route redirect

4. **Security:**
   - [ ] Password hashing
   - [ ] No plain text storage
   - [ ] Session management
   - [ ] Logout clears session

---

## Test Data

### Valid Test Accounts
```
Username: testuser
Password: Password123
Email: test@example.com

Username: demo
Password: DemoPass456
Email: demo@example.com

Username: admin
Password: AdminSecure789
Email: admin@example.com
```

### Invalid Inputs
```
Invalid usernames:
- "ab" (too short)
- "test!" (invalid character)
- "test-user" (hyphen not allowed)
- "" (empty)

Invalid passwords:
- "short" (too short)
- "NoNumbers" (no number)
- "12345678" (no letters)
- "" (empty)

Invalid emails:
- "notanemail"
- "missing@domain"
- "@nodomain.com"
- "spaces in@email.com"
```

---

## Known Limitations

### Frontend Approach
- ⚠️ Data stored in plain localStorage (not encrypted)
- ⚠️ No server-side validation
- ⚠️ Not suitable for production
- ⚠️ Limited to single browser/device
- ⚠️ No audit logging

### Backend Approach
- ⚠️ Uses JSON file (not scalable)
- ⚠️ Requires Node.js to run
- ⚠️ No email verification
- ⚠️ No password reset
- ⚠️ Limited to single server (no clustering)

---

## Checklist Before Deployment

- [ ] All tests passing
- [ ] No console errors
- [ ] Responsive design verified
- [ ] Cross-browser tested
- [ ] Security tests passed
- [ ] Password hashing working
- [ ] Session management working
- [ ] Error messages are generic
- [ ] Database cleaned (no test data)
- [ ] Performance acceptable
