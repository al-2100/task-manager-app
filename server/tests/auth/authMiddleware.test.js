const jwt = require('jsonwebtoken');
const authMiddleware = require('../../middlewares/authMiddleware');

describe('Auth Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        // Initialize dummy request and response objects before each test
        req = { headers: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return 401 if no authorization header is provided', () => {
        // No headers set in req
        authMiddleware.verifyToken(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Access denied, token missing' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if authorization header does not start with "Bearer "', () => {
        req.headers = { authorization: 'InvalidToken' };
        authMiddleware.verifyToken(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Access denied, token missing' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', () => {
        req.headers = { authorization: 'Bearer invalidtoken' };
        // Force jwt.verify to throw an error to simulate an invalid token
        jest.spyOn(jwt, 'verify').mockImplementation(() => { throw new Error('Invalid token'); });

        authMiddleware.verifyToken(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith('invalidtoken', process.env.JWT_SECRET);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next and attach decoded user info if token is valid', () => {
        const decodedToken = { id: 1 };
        req.headers = { authorization: 'Bearer validtoken' };
        // Mock jwt.verify to return a valid decoded token
        jest.spyOn(jwt, 'verify').mockReturnValue(decodedToken);

        authMiddleware.verifyToken(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith('validtoken', process.env.JWT_SECRET);
        expect(req.user).toEqual(decodedToken);
        expect(next).toHaveBeenCalled();
    });
});
