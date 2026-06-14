const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'VAVUNIYA_HERITAGE_PURPLE_SECRET_KEY_2026';

/**
 * Validates the stateless incoming JWT Bearer token inside the Authorization Header.
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: 'Access Denied: Missing Bearer token from authorization header.' });
    }

    try {
        const verifiedUser = jwt.verify(token, JWT_SECRET);
        req.user = verifiedUser; // Attach user payload metadata (user_id, email, role)
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Access Denied: Provided token is invalid or expired.' });
    }
};

/**
 * Dynamic Role-Based Access Control matrix logic.
 * @param {Array<string>} allowedRoles 
 */
const authorizeRoles = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: `Forbidden Action: Your current privilege tier (${req.user ? req.user.role : 'Guest'}) cannot execute this route operation.` 
            });
        }
        next();
    };
};

module.exports = { authenticateToken, authorizeRoles, JWT_SECRET };