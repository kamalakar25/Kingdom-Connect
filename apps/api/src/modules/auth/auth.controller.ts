import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../../config/database';
import { ApiResponse } from '../../utils/api.utils';
import { mailService } from '../mail/mail.service';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req: Request, res: Response) => {
    const { email, password, displayName, name } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return ApiResponse.error(res, 'User already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            email,
            passwordHash: hashedPassword,
            displayName: name || displayName,
            role: 'USER',
            locale: 'en',
            settings: { theme: 'dark' }
        },
    });

    // Send Welcome Email
    await mailService.sendWelcomeEmail(email, displayName || 'friend');

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    const { passwordHash: _passwordHash, ...userWithoutPassword } = user;
    return ApiResponse.success(res, { user: userWithoutPassword, token }, 'Registration successful', 201);
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log(`[Login Attempt] Email: ${email}`);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        console.log('[Login Failed] User not found');
        return ApiResponse.error(res, 'User not found. Please register.', 404);
    }

    if (!user.passwordHash) {
        console.log('[Login Failed] No password hash (likely Google auth)');
        return ApiResponse.error(res, 'This account uses Google Sign-In. Please use that.', 400);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
        console.log('[Login Failed] Password mismatch');
        return ApiResponse.error(res, 'Incorrect password. Please try again.', 401);
    }

    // Send Login Alert
    await mailService.sendSecurityAlert(email, 'LOGIN');

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    const { passwordHash: _passwordHash, ...userWithoutPassword } = user;
    return ApiResponse.success(res, { user: userWithoutPassword, token }, 'Login successful');
};

export const googleLogin = async (req: Request, res: Response) => {
    const { credential } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            return ApiResponse.error(res, 'Invalid Google token', 400);
        }

        const { email, name, picture } = payload;

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    displayName: name,
                    avatarUrl: picture,
                    role: 'USER',
                    locale: 'en',
                    settings: { theme: 'dark' }
                },
            });
            await mailService.sendWelcomeEmail(email, name || 'friend');
        } else {
            await mailService.sendSecurityAlert(email, 'LOGIN');
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        const { passwordHash: _passwordHash, ...userWithoutPassword } = user;
        return ApiResponse.success(res, { user: userWithoutPassword, token }, 'Google Login successful');
    } catch (_error) {
        return ApiResponse.error(res, 'Google authentication failed', 400);
    }
};

export const me = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        return ApiResponse.error(res, 'User not found', 404);
    }

    const { passwordHash: _passwordHash, ...userWithoutPassword } = user;
    return ApiResponse.success(res, { user: userWithoutPassword });
};

// --- Secure Management ---

export const changePassword = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { oldPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.passwordHash) {
        return ApiResponse.error(res, 'Account uses external auth. Cannot change password.', 400);
    }

    const isValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isValid) {
        return ApiResponse.error(res, 'Incorrect current password', 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: { id: userId },
        data: { passwordHash: hashedPassword }
    });

    await mailService.sendSecurityAlert(user.email, 'PASSWORD_CHANGE');

    return ApiResponse.success(res, null, 'Password changed successfully');
};

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        return ApiResponse.success(res, null, 'If an account exists, a reset link has been sent.');
    }

    if (!user.passwordHash) {
        // Google auth user
        return ApiResponse.success(res, null, 'If an account exists, a reset link has been sent.');
    }

    const resetToken = jwt.sign({ id: user.id, type: 'reset' }, JWT_SECRET, { expiresIn: '1h' });
    await mailService.sendPasswordResetEmail(email, resetToken);

    return ApiResponse.success(res, null, 'If an account exists, a reset link has been sent.');
};

export const resetPassword = async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        if (decoded.type !== 'reset') throw new Error('Invalid token type');

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: decoded.id },
            data: { passwordHash: hashedPassword }
        });

        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (user) {
            await mailService.sendSecurityAlert(user.email, 'PASSWORD_CHANGE');
        }

        return ApiResponse.success(res, null, 'Password reset successfully');
    } catch (_error) {
        return ApiResponse.error(res, 'Invalid or expired token', 400);
    }
};
