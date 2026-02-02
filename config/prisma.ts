import "dotenv/config";
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';

const prismaClientSingleton = () => {
    const adapter = new PrismaMariaDb({
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT) || 3306,
        user: process.env.DATABASE_USER,
        password: decodeURIComponent(process.env.DATABASE_PASSWORD || ""),
        database: process.env.DATABASE_NAME,
        connectionLimit: 5,
        connectTimeout: 30000,
        idleTimeout: 10000,
    });
    return new PrismaClient({ adapter });
};

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export { prisma };

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
