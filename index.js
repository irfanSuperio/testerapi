const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS

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
    { username: 'testuser', password: 'password123' }
];

const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 requests per windowMs
    message: { error: 'Too many login attempts, please try again later.' },
});

// Login route (with rate limiting)
apiRouter.post('/login', loginLimiter, (req, res) => {
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


// Home route
app.get('/home', (req, res) => {
    return res.status(200).json({ message: 'Welcome to the home page!' });
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
