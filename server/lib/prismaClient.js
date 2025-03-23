const { PrismaClient } = require('@prisma/client');

// Create and export an instance of PrismaClient for database operations
const prisma = new PrismaClient();
module.exports = prisma;
