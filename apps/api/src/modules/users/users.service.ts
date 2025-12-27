import prisma from '../../config/database';

export const getProfile = async (userId: string) => {
    return prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            displayName: true,
            avatarUrl: true,
            locale: true,
            role: true,
            settings: true,
            createdAt: true,
        },
    });
};

export const updateProfile = async (userId: string, data: { displayName?: string; avatarUrl?: string; locale?: string; settings?: any }) => {
    return prisma.user.update({
        where: { id: userId },
        data,
        select: {
            id: true,
            email: true,
            displayName: true,
            avatarUrl: true,
            locale: true,
            role: true,
            settings: true,
        },
    });
};

import bcrypt from 'bcryptjs';

export const deleteAccount = async (userId: string, password?: string) => {
    // If password provided, verify it (unless logic handled elsewhere, but requested "like delete repo")
    if (password) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.passwordHash) {
            throw new Error("Cannot verify password.");
        }
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            throw new Error("Incorrect password");
        }
    }

    return prisma.user.delete({
        where: { id: userId },
    });
};
