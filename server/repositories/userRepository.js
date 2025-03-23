const prisma = require('../lib/prismaClient');

exports.createUser = async ({ username, email, hashedPassword }) => {
    try {
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
        return user;
    } catch (error) {
        console.error('Error al crear usuario: ', error);
        throw error;
    }
}

exports.findByEmail = async (email) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        return user;
    } catch (error) {
        console.error('Error al buscar usuario por email: ', error);
        throw error;
    }
}