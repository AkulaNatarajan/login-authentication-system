# Login Authentication System

A complete authentication system with two implementations:
- **Approach A**: Front-end only (HTML/CSS/JavaScript with localStorage)
- **Approach B**: Full-stack (Node.js + Express + bcryptjs)

## Features

✅ User registration with validation  
✅ Password hashing (SHA-256 for front-end, bcrypt for backend)  
✅ Login validation with error handling  
✅ Duplicate username/email check  
✅ Protected dashboard (redirects to login if not authenticated)  
✅ Logout functionality  
✅ Responsive design  
✅ Form validation (no empty submissions)  

## Approach A: Front-End Only (localStorage)

### Quick Start
1. Navigate to the `frontend/` directory
2. Open `index.html` in your browser
3. No server required!

### File Structure
```
frontend/
├── index.html          # Main entry page
├── register.html       # Registration page
├── login.html          # Login page
├── dashboard.html      # Protected dashboard
├── css/
│   └── style.css       # Styling
└── js/
    ├── auth.js         # Core authentication logic
    ├── register.js     # Registration handler
    ├── login.js        # Login handler
    └── dashboard.js    # Dashboard logic
```

### Password Requirements
- Minimum 8 characters
- At least 1 number
- Hashed using SHA-256 before storage

### How It Works
1. Passwords are hashed using CryptoJS SHA-256
2. User data stored in browser's localStorage
3. Login session tracked with `loggedInUser` key
4. Dashboard checks for active session on page load

---

## Approach B: Full-Stack (Node.js + Express)

### Setup
```bash
cd backend
npm install
npm start
```

Server runs on `http://localhost:3000`

### File Structure
```
backend/
├── app.js              # Express server & routes
├── package.json        # Dependencies
├── public/
│   ├── index.html
│   ├── register.html
│   ├── login.html
│   ├── dashboard.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── auth.js
│       ├── register.js
│       ├── login.js
│       └── dashboard.js
└── data/
    └── users.json      # User database
```

### Dependencies
- **express** - Web framework
- **bcryptjs** - Password hashing
- **body-parser** - JSON parsing
- **express-session** - Session management

### API Endpoints
- `POST /api/register` - Create new user
- `POST /api/login` - Authenticate user
- `POST /api/logout` - Clear session
- `GET /api/user` - Get current user info
- `GET /dashboard` - Protected route

### Password Validation
- Minimum 8 characters
- At least 1 number
- Checked on registration

### Session Management
- Server-side sessions using express-session
- Secure cookies (httpOnly)
- Automatic redirect to login if not authenticated

---

## Testing

### Approach A (Front-End)
1. Open `frontend/index.html`
2. Register: username `testuser`, password `Password123`
3. Login with same credentials
4. Access dashboard
5. Logout and verify redirect

### Approach B (Full-Stack)
```bash
cd backend
npm install
npm start
```
Then visit `http://localhost:3000` and repeat the above steps.

---

## Security Features

✅ **Password Hashing**: Passwords never stored in plain text  
✅ **Error Handling**: Generic error messages (don't reveal which field is wrong)  
✅ **Form Validation**: Client-side and server-side validation  
✅ **Session Protection**: Protected routes require authentication  
✅ **XSS Prevention**: Input sanitization in backend  
✅ **Duplicate Check**: Prevent duplicate username registration  

---

## Learning Resources

- [MDN: HTTP Cookies and Sessions](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [CryptoJS Documentation](https://cryptojs.gitbook.io/docs/)
- [bcryptjs Documentation](https://github.com/dcodeIO/bcrypt.js)
- [Express.js Guide](https://expressjs.com/)

---

## Next Steps for Production

1. Use a real database (MongoDB, PostgreSQL, SQLite)
2. Implement HTTPS/SSL
3. Add JWT tokens with expiration
4. Use secure, httpOnly cookies
5. Implement rate limiting
6. Add email verification
7. Add password reset functionality
8. Use environment variables for sensitive data
9. Add CSRF protection
10. Implement 2FA (Two-Factor Authentication)

---

## License

MIT
