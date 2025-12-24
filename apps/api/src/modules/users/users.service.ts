import prisma from '../../config/database';

export const getProfile = async (userId: string) => {
    return prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            displayName: true,
            locale: true,
            role: true,
            settings: true,
            createdAt: true,
        },
    });
};

export const updateProfile = async (userId: string, data: { displayName?: string; locale?: string; settings?: any }) => {
    return prisma.user.update({
        where: { id: userId },
        data,
        select: {
            id: true,
            email: true,
            displayName: true,
            locale: true,
            role: true,
            settings: true,
        },
    });
};

export const deleteAccount = async (userId: string) => {
    return prisma.user.delete({
        where: { id: userId },
    });
};
