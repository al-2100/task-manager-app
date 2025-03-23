const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

/**
 * Authentication Service
 * Contains business logic for user registration and login.
 */

exports.register = async ({ username, email, password }) => {
    // Hash the password using bcrypt for security
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user record in the database using the repository
    const user = await userRepository.createUser({ username, email, hashedPassword });
    return user;
};

exports.login = async ({ email, password }) => {
    // Retrieve the user from the database by email
    const user = await userRepository.findByEmail(email);
    if (!user) {
        // Throw an error if the user is not found
        throw new Error('Incorrect email or password');
    }

    // Compare the provided password with the stored hashed password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        // Throw an error if the password does not match
        throw new Error('Incorrect email or password');
    }

    // Generate a JWT token containing the user's ID, valid for 1 hour
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { 
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    };
};
