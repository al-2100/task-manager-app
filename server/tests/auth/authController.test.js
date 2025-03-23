const request = require('supertest');
const express = require('express');
const authRoutes = require('../../routes/auth');
const authService = require('../../services/authService');

// Mock the authService
jest.mock('../../services/authService');

// Create an instance of the Express app for testing
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Controller', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user and return 201 status with user data', async () => {
            const newUser = { id: 1, username: 'testuser', email: 'testuser@example.com' };
            // Simulate a successful registration
            authService.register.mockResolvedValue(newUser);

            const res = await request(app)
                .post('/api/auth/register')
                .send({ username: 'testuser', email: 'testuser@example.com', password: 'password123' });

            expect(res.status).toBe(201);
            expect(res.body).toEqual({ message: 'User registered successfully', user: newUser });
            expect(authService.register).toHaveBeenCalled();
        });

        it('should return 500 status if registration fails', async () => {
            // Simulate an error during registration
            authService.register.mockRejectedValue(new Error('Registration error'));

            const res = await request(app)
                .post('/api/auth/register')
                .send({ username: 'testuser', email: 'testuser@example.com', password: 'password123' });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Registration error' });
        });
    });

    describe('POST /api/auth/login', () => {
        it('should return 200 status and a token on successful login', async () => {
            // Simulate a successful login returning a token
            authService.login.mockResolvedValue({ token: 'mockedToken' });

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'testuser@example.com', password: 'password123' });

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Login successful', token: 'mockedToken' });
            expect(authService.login).toHaveBeenCalled();
        });

        it('should return 401 status if login fails', async () => {
            // Simulate an error during login
            authService.login.mockRejectedValue(new Error('Incorrect email or password'));

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'testuser@example.com', password: 'wrongpassword' });

            expect(res.status).toBe(401);
            expect(res.body).toEqual({ error: 'Incorrect email or password' });
        });
    });
});
