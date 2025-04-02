const jwt = require('jsonwebtoken');

// Authentication Middleware
const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = jwt.verify(token, 'your_secret_key'); // Same secret key used in login
        req.userId = decoded.userId; // Attach userId to the request

        next(); // Continue to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = auth;
