const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer'); 
const routes = require('./routes');

// Mount foundational safety protocol interpretation parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dynamic Route Isolation Mounting Frame
app.use('/api', routes);

// Serve Static Frontend UI files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Centralized error interpretation handler for processing unhandled file storage constraints
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `File Processing Boundary Exception: ${err.message}` });
    } else if (err) {
        return res.status(400).json({ error: `Pre-execution Interception Filter Error: ${err.message}` });
    }
    next();
});

// Default server initialization routine parameters
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[VAVUNIYA UNIVERSITY LMS BACKEND ENGINE ACTIVE] Online via operational port: ${PORT}`);
});

module.exports = app;