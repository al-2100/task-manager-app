const prisma = require('../../lib/prismaClient');
const { createUser, findByEmail } = require('../../repositories/userRepository');

// Mock the Prisma client methods
jest.mock('../../lib/prismaClient', () => ({
    user: {
        create: jest.fn(),
        findUnique: jest.fn(),
    },
}));

describe('User Repository', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('should call prisma.user.create with correct data and return user', async () => {
            const userInput = { username: 'testuser', email: 'test@example.com', hashedPassword: 'hashedPass' };
            const expectedUser = { id: 1, username: 'testuser', email: 'test@example.com', password: 'hashedPass' };

            prisma.user.create.mockResolvedValue(expectedUser);

            const result = await createUser(userInput);

            expect(prisma.user.create).toHaveBeenCalledTimes(1);
            expect(prisma.user.create).toHaveBeenCalledWith({
                data: {
                    username: userInput.username,
                    email: userInput.email,
                    password: userInput.hashedPassword,
                },
            });
            expect(result).toEqual(expectedUser);
        });

        it('should throw an error when prisma.user.create fails', async () => {
            const userInput = { username: 'testuser', email: 'test@example.com', hashedPassword: 'hashedPass' };
            const error = new Error('Create Error');

            prisma.user.create.mockRejectedValue(error);

            await expect(createUser(userInput)).rejects.toThrow('Create Error');
        });
    });

    describe('findByEmail', () => {
        it('should call prisma.user.findUnique with correct email and return user', async () => {
            const email = 'test@example.com';
            const expectedUser = { id: 1, username: 'testuser', email };

            prisma.user.findUnique.mockResolvedValue(expectedUser);

            const result = await findByEmail(email);

            expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { email },
            });
            expect(result).toEqual(expectedUser);
        });

        it('should throw an error when prisma.user.findUnique fails', async () => {
            const email = 'test@example.com';
            const error = new Error('Find Error');

            prisma.user.findUnique.mockRejectedValue(error);

            await expect(findByEmail(email)).rejects.toThrow('Find Error');
        });
    });
});