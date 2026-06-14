// =============================================================================
// app.js — Express Backend Server
// FIXED: express.static now serves from the ROOT directory (flattened layout).
// FIXED: All require() paths for routes/middleware now use root-relative paths.
// =============================================================================

const express    = require('express');
const path       = require('path');
const cors       = require('cors');

// FIXED: All these files are now in the root, not subfolders
const db             = require('./db');
const routes         = require('./routes');
const authMiddleware = require('./authMiddleware');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS: allow your GitHub Pages domain during development
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5500',   // Live Server (VS Code)
    'https://rochanadaham.github.io' // GitHub Pages
  ],
  credentials: true
}));

// ─── Static Files ─────────────────────────────────────────────────────────────
// FIXED: Was express.static('LMS/Public') or express.static('Public')
// Now serves ALL HTML, CSS, JS files directly from the project root folder.
app.use(express.static(path.join(__dirname)));

// ─── API Routes ───────────────────────────────────────────────────────────────
// FIXED: was require('./LMS/API/routes') — now root-level
app.use('/api', routes);

// ─── SPA Fallback (optional) ──────────────────────────────────────────────────
// If a route like /faculty-dashboard doesn't match a file or API,
// serve index.html so the browser can handle routing.
app.get('*', (req, res) => {
  // Only fall back for non-API, non-asset requests
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    res.status(404).json({ message: 'API endpoint not found.' });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ LMS Server running at http://localhost:${PORT}`);
  console.log(`📂 Serving static files from: ${path.join(__dirname)}`);
});

module.exports = app;
