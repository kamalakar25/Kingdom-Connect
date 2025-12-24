import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAnnouncements = async () => {
    // Get active announcements
    const now = new Date();
    return prisma.announcement.findMany({
        where: {
            endAt: { gt: now }
        },
        orderBy: { createdAt: 'desc' }
    });
};

export const seedAnnouncements = async () => {
    const existing = await prisma.announcement.count();
    if (existing > 0) return;

    await prisma.announcement.createMany({
        data: [
            {
                title: 'Youth Retreat Registration Open',
                body: 'Register now for the annual youth retreat! Early bird pricing ends soon.',
                language: 'en',
                startAt: new Date(),
                endAt: new Date(new Date().setMonth(new Date().getMonth() + 1))
            },
            {
                title: 'Sunday Service Time Change',
                body: 'Please note that service starts at 9:30 AM this week.',
                language: 'en',
                startAt: new Date(),
                endAt: new Date(new Date().setDate(new Date().getDate() + 7))
            }
        ]
    });
    console.log('Seeded Announcements');
}
