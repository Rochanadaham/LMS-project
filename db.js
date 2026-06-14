const mysql = require('mysql2/promise');

// Initialize database connection pool with secure resource limitations
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'vavuniya_admin',
    password: process.env.DB_PASSWORD || 'SecureVavuniyaLMS2026!',
    database: process.env.DB_NAME || 'vavuniya_lms_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;