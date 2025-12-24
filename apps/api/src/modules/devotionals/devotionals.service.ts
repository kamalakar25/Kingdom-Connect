import prisma from '../../config/database';
import { Devotional } from '@prisma/client';

export const getAllDevotionals = async (): Promise<Devotional[]> => {
    return prisma.devotional.findMany({
        orderBy: { createdAt: 'desc' },
        include: { creator: { select: { displayName: true } } }
    });
};

export const createDevotional = async (data: any): Promise<Devotional> => {
    return prisma.devotional.create({
        data,
    });
};

export const getDevotionalById = async (id: string): Promise<Devotional | null> => {
    return prisma.devotional.findUnique({
        where: { id },
    });
};
