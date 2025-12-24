import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getEvents = async () => {
    const now = new Date();
    return prisma.event.findMany({
        where: {
            startsAt: { gt: now }
        },
        orderBy: { startsAt: 'asc' }
    });
};

export const seedEvents = async () => {
    const existing = await prisma.event.count();
    if (existing > 0) return;

    await prisma.event.createMany({
        data: [
            {
                title: 'Christmas Eve Service',
                description: 'Join us for a special candlelit service.',
                startsAt: new Date('2025-12-24T18:00:00Z'),
                endsAt: new Date('2025-12-24T20:00:00Z'),
                location: 'Main Sanctuary',
                language: 'en'
            },
            {
                title: 'New Year Prayer',
                description: 'Reviewing the year with gratitude.',
                startsAt: new Date('2025-12-31T22:00:00Z'),
                endsAt: new Date('2026-01-01T00:30:00Z'),
                location: 'Main Sanctuary',
                language: 'en'
            }
        ]
    });
    console.log('Seeded Events');
}
