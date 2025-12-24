"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSermons = exports.getSermons = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getSermons = async () => {
    return prisma.sermon.findMany({
        orderBy: { publishedAt: 'desc' }
    });
};
exports.getSermons = getSermons;
const seedSermons = async () => {
    const existing = await prisma.sermon.count();
    if (existing > 0)
        return;
    await prisma.sermon.createMany({
        data: [
            {
                title: 'Walking in the Light',
                speaker: 'Pastor John',
                language: 'en',
                mediaType: 'VIDEO',
                mediaUrl: 'https://example.com/sermon1.mp4',
                thumbnailUrl: 'https://placehold.co/600x400/1e293b/white?text=Sermon+1',
                publishedAt: new Date()
            },
            {
                title: 'विश्वास की शक्ति (Power of Faith)',
                speaker: 'Pastor Amit',
                language: 'hi',
                mediaType: 'AUDIO',
                mediaUrl: 'https://example.com/sermon2.mp3',
                thumbnailUrl: 'https://placehold.co/600x400/1e293b/white?text=Sermon+2',
                publishedAt: new Date()
            }
        ]
    });
    console.log('Seeded Sermons');
};
exports.seedSermons = seedSermons;
