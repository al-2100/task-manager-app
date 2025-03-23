const authService = require('../../services/authService');
const userRepository = require('../../repositories/userRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock the userRepository
jest.mock('../../repositories/userRepository');

describe('Auth Service', () => {
    describe('register', () => {
        it('should register a new user and return the created user', async () => {
            // Sample input for registration
            const userData = { username: 'testuser', email: 'testuser@example.com', password: 'password123' };
            const hashedPassword = 'hashedPassword123';

            // Mock bcrypt.hash to return a fake hashed password
            jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);

            // Prepare a fake user returned from the repository
            const mockUser = { id: 1, username: 'testuser', email: 'testuser@example.com', password: hashedPassword };
            userRepository.createUser.mockResolvedValue(mockUser);

            // Call the service method
            const result = await authService.register(userData);

            // Check that the result matches the mock user
            expect(result).toEqual(mockUser);
            expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
            expect(userRepository.createUser).toHaveBeenCalledWith({
                username: userData.username,
                email: userData.email,
                hashedPassword,
            });
        });
    });

    describe('login', () => {
        it('should login and return a token when credentials are valid', async () => {
            const loginData = { email: 'testuser@example.com', password: 'password123' };
            const mockUser = { id: 1, username: 'testuser', email: 'testuser@example.com', password: 'hashedPassword123' };

            // Mock repository to return our fake user for a valid email
            userRepository.findByEmail.mockResolvedValue(mockUser);
            // Simulate a successful password comparison
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
            // Mock JWT signing to return a fake token
            jest.spyOn(jwt, 'sign').mockReturnValue('mockedToken');

            const result = await authService.login(loginData);
            // Updated expected output to include the user object.
            expect(result).toEqual({ token: 'mockedToken', user: { id: mockUser.id, username: mockUser.username, email: mockUser.email } });
            expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
            expect(jwt.sign).toHaveBeenCalledWith({ id: mockUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        });

        it('should throw an error if user is not found', async () => {
            // Simulate no user found
            userRepository.findByEmail.mockResolvedValue(null);
            await expect(authService.login({ email: 'notfound@example.com', password: 'password123' }))
                .rejects.toThrow('Incorrect email or password');
        });

        it('should throw an error if password is invalid', async () => {
            const loginData = { email: 'testuser@example.com', password: 'wrongpassword' };
            const mockUser = { id: 1, username: 'testuser', email: 'testuser@example.com', password: 'hashedPassword123' };
            userRepository.findByEmail.mockResolvedValue(mockUser);
            // Simulate an unsuccessful password comparison
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
            await expect(authService.login(loginData))
                .rejects.toThrow('Incorrect email or password');
        });
    });
});
