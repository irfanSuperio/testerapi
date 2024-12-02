const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// Simulate lag for all API requests
app.use((req, res, next) => {
    const delay = 2000; // 2 seconds delay
    setTimeout(() => next(), delay);
});

// Mock users
const users = [
    { username: 'testuser', password: 'password123' },
    { username: 'admin', password: 'admin123' }
];

// Rate Limiter for Login
const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 requests per windowMs
    message: { error: 'Too many login attempts, please try again later.' },
});

// Login API
app.post('/login', loginLimiter, (req, res) => {
    const { username, password } = req.body;

    // Input validation
    if (!username || typeof username !== 'string' || username.length < 3) {
        return res.status(400).json({ error: 'Invalid or missing username.' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ error: 'Invalid or missing password.' });
    }

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        return res.status(200).json({ message: 'Login successful' });
    } else {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Home API
app.get('/home', (req, res) => {
    return res.status(200).json({ message: 'Welcome to the home page!' });
});

// API to Trigger Server-Side Error
app.get('/server-error', (req, res) => {
    throw new Error('Simulated server error');
});

// API for Unauthorized Access
app.get('/unauthorized', (req, res) => {
    res.status(403).json({ error: 'Access forbidden: Unauthorized access' });
});

// API for Bad Request
app.post('/bad-request', (req, res) => {
    const { input } = req.body;
    if (!input || typeof input !== 'string') {
        return res.status(400).json({ error: 'Invalid input: A valid string is required.' });
    }
    return res.status(200).json({ message: `Received input: ${input}` });
});

// API for Slow Response (Simulated Timeout)
app.get('/slow-response', (req, res) => {
    setTimeout(() => {
        res.status(200).json({ message: 'This is a delayed response.' });
    }, 5000); // 5 seconds delay
});

// API for Not Found Example
app.get('/not-found-example', (req, res) => {
    res.status(404).json({ error: 'This is a custom not found error.' });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(`[Error]: ${err.message}`);
    res.status(500).json({ error: 'Internal server error occurred. Please try again later.' });
});

// Handle undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
