import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword, signAccessToken, signRefreshToken } from '../../utils/auth.utils';

const prisma = new PrismaClient();

export const register = async (email: string, password: string, name: string, locale: string = 'en') => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('User already exists');
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
        data: {
            email,
            passwordHash,
            displayName: name,
            locale,
            role: 'USER', // Default role
        },
    });

    const token = signAccessToken({ id: user.id, role: user.role, email: user.email });
    const refreshToken = signRefreshToken({ id: user.id });

    return { user, token, refreshToken };
};

export const login = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    if (!user.passwordHash) {
        throw new Error('Please login with Google');
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
        throw new Error('Invalid credentials');
    }

    const token = signAccessToken({ id: user.id, role: user.role, email: user.email });
    const refreshToken = signRefreshToken({ id: user.id });

    return { user, token, refreshToken };
};

import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const loginWithGoogle = async (credential: string) => {
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: [
            process.env.GOOGLE_CLIENT_ID!,
            process.env.GOOGLE_ANDROID_CLIENT_ID!
        ],
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
        throw new Error('Invalid Google Token');
    }

    const { email, sub: googleId, name: displayName, picture: avatarUrl } = payload;

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        // Create new user
        user = await prisma.user.create({
            data: {
                email,
                googleId,
                displayName,
                avatarUrl,
                locale: 'en',
                role: 'USER',
            }
        });
    } else if (!user.googleId) {
        // Merge existing user
        user = await prisma.user.update({
            where: { email },
            data: { googleId, avatarUrl }
        });
    }

    const token = signAccessToken({ id: user.id, role: user.role, email: user.email });
    const refreshToken = signRefreshToken({ id: user.id });

    return { user, token, refreshToken };
};
