const express = require('express');
const path = require('path');
const cors = require('cors');

// Fixed Path imports: All modules imported directly from root folder
const db = require('./db'); 
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Endpoint Routers
app.use('/api', routes);

/**
 * CRITICAL FIX FOR FLATTENED LAYOUT:
 * Configures Express to serve all static assets (HTML, CSS, JS) directly 
 * out of the root folder, allowing deployment platforms like Render or Railway 
 * to render your client pages flawlessly.
 */
app.use(express.static(path.join(__dirname, '.')));

// Root Route fallback to handle initial browser rendering requests safely
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Specific route fallbacks to catch unescaped browser requests for spaces smoothly
app.get('/stu-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'stu dashboard 10.html'));
});

// Server Initialization
app.listen(PORT, () => {
    console.log(`LMS Full-Stack Server executing securely on port ${PORT}`);
});

module.exports = app;
