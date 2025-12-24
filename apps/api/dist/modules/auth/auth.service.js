"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const client_1 = require("@prisma/client");
const auth_utils_1 = require("../../utils/auth.utils");
const prisma = new client_1.PrismaClient();
const register = async (email, password, locale = 'en') => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('User already exists');
    }
    const passwordHash = await (0, auth_utils_1.hashPassword)(password);
    const user = await prisma.user.create({
        data: {
            email,
            passwordHash,
            locale,
            role: 'USER', // Default role
        },
    });
    const token = (0, auth_utils_1.signAccessToken)({ id: user.id, role: user.role, email: user.email });
    const refreshToken = (0, auth_utils_1.signRefreshToken)({ id: user.id });
    return { user, token, refreshToken };
};
exports.register = register;
const login = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Invalid credentials');
    }
    const isValid = await (0, auth_utils_1.verifyPassword)(password, user.passwordHash);
    if (!isValid) {
        throw new Error('Invalid credentials');
    }
    const token = (0, auth_utils_1.signAccessToken)({ id: user.id, role: user.role, email: user.email });
    const refreshToken = (0, auth_utils_1.signRefreshToken)({ id: user.id });
    return { user, token, refreshToken };
};
exports.login = login;
