const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Verifies the JWT token provided in the request headers.
 */

exports.verifyToken = (req, res, next) => {
    // Retrieve the Authorization header from the request
    const authHeader = req.headers.authorization;

    // Check if the header exists and is in the format "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied, token missing' });
    }

    // Extract the token from the header
    const token = authHeader.split(' ')[1];

    try {
        // Verify the token using the secret key from the environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach the decoded user information (e.g., user ID) to the request object
        req.user = decoded;
        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Log token verification errors
        console.error('Token verification error:', error);
        // Respond with a 401 Unauthorized status if the token is invalid
        return res.status(401).json({ error: 'Invalid token' });
    }
};
