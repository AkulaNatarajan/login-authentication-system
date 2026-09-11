# Backend Setup Guide

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

   The server will run on `http://localhost:3000`

### Development Mode

For auto-reload during development, install nodemon:

```bash
npm install --save-dev nodemon
npm run dev
```

---

## File Structure

```
backend/
├── app.js                  # Express server with all routes
├── package.json            # Project dependencies
├── public/
│   ├── index.html          # Home page
│   ├── register.html       # Registration page
│   ├── login.html          # Login page
│   ├── dashboard.html      # Protected dashboard
│   ├── css/
│   │   └── style.css       # Shared styling
│   └── js/
│       ├── register.js     # Registration handler
│       ├── login.js        # Login handler
│       └── dashboard.js    # Dashboard logic
└── data/
    └── users.json          # User database (auto-created)
```

---

## API Endpoints

### Register User
**POST** `/api/register`

Request body:
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Password123",
  "confirmPassword": "Password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Registration successful! Please login."
}
```

Validation:
- Username: 3+ characters, alphanumeric + underscore only
- Password: 8+ characters, at least 1 number
- Email: Valid email format (optional)
- No duplicate usernames or emails

---

### Login User
**POST** `/api/login`

Request body:
```json
{
  "username": "testuser",
  "password": "Password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful!",
  "user": {
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

---

### Logout User
**POST** `/api/logout`

Response:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Get Current User
**GET** `/api/user`

Response (authenticated):
```json
{
  "success": true,
  "user": {
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

Response (not authenticated):
```json
{
  "success": false,
  "message": "Not authenticated"
}
```

---

## Session Management

- **Session Timeout:** 30 minutes of inactivity
- **Session Storage:** Server-side with httpOnly cookies
- **Secure Cookie:** Set to `false` for development (true with HTTPS in production)
- **Redirect:** Unauthenticated requests to protected routes redirect to login

---

## Security Features

✅ **Password Hashing:** bcryptjs with 10 salt rounds  
✅ **Session Management:** express-session with secure cookies  
✅ **Error Messages:** Generic messages (don't reveal which field is wrong)  
✅ **Duplicate Prevention:** Username and email uniqueness checks  
✅ **Form Validation:** Server-side validation for all inputs  
✅ **Protected Routes:** Dashboard requires authentication  

---

## Database

Users are stored in `backend/data/users.json`

Example user object:
```json
{
  "id": 1694425748000,
  "username": "testuser",
  "email": "test@example.com",
  "password": "$2a$10$...",
  "createdAt": "2026-09-11T11:57:48.000Z"
}
```

**Note:** Passwords are hashed using bcryptjs and cannot be reversed.

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Password123",
    "confirmPassword": "Password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "username": "testuser",
    "password": "Password123"
  }'
```

### Get User (requires session)
```bash
curl -X GET http://localhost:3000/api/user \
  -b cookies.txt
```

### Logout
```bash
curl -X POST http://localhost:3000/api/logout \
  -b cookies.txt
```

---

## Troubleshooting

**Port 3000 already in use:**
```bash
# Kill process on port 3000
# On macOS/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Module not found error:**
```bash
rm -rf node_modules
npm install
```

**Users.json missing:**
The file will be created automatically on first startup.

---

## Next Steps

1. **Database Integration:** Replace JSON storage with MongoDB or PostgreSQL
2. **JWT Tokens:** Implement JWT for stateless authentication
3. **Email Verification:** Add email verification on registration
4. **Password Reset:** Implement forgot password functionality
5. **Rate Limiting:** Add rate limiting for login attempts
6. **HTTPS:** Deploy with SSL/TLS certificates
7. **Environment Variables:** Use .env for configuration
8. **Logging:** Add winston or morgan for request logging

---

## Production Checklist

- [ ] Use HTTPS/SSL
- [ ] Set secure cookie flags
- [ ] Use strong session secret
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Use environment variables
- [ ] Implement proper logging
- [ ] Add email verification
- [ ] Use a real database
- [ ] Add error monitoring (Sentry, etc.)
