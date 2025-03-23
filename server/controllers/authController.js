const authService = require('../services/authService');

/**
 * Authentication Controller
 * Handles user registration and login requests.
 */
exports.register = async (req, res) => {
    try {
        // Call the authentication service to register a new user
        const user = await authService.register(req.body);
        // Respond with a success message and the created user data
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error during registration:', error);
        // Respond with a 500 Internal Server Error status and error message
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        // Call the authentication service to verify credentials and generate a token
        const result = await authService.login(req.body);
        // Respond with a success message, the JWT token, and user information
        res.json({ 
            message: 'Login successful', 
            token: result.token,
            user: result.user
        });
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error during login:', error);
        // Respond with a 401 Unauthorized status and error message if credentials are invalid
        res.status(401).json({ error: error.message });
    }
};
