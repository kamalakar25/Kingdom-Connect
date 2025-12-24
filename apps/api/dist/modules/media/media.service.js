"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedMedia = exports.getAssets = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAssets = async (type) => {
    return prisma.mediaAsset.findMany({
        where: {
            ...(type ? { assetType: type } : {})
        },
        orderBy: { createdAt: 'desc' }
    });
};
exports.getAssets = getAssets;
const seedMedia = async () => {
    const existing = await prisma.mediaAsset.count();
    if (existing > 0)
        return;
    await prisma.mediaAsset.createMany({
        data: [
            {
                title: 'Youth Retreat 2025 Poster',
                language: 'en',
                assetType: 'POSTER',
                url: 'https://placehold.co/800x1200/1e293b/white?text=Retreat+Poster',
                tags: ['youth', 'event']
            },
            {
                title: 'Christmas Service Pamphlet',
                language: 'te',
                assetType: 'PAMPHLET',
                url: 'https://placehold.co/800x1200/1e293b/white?text=Christmas+Telugu',
                tags: ['christmas', 'service']
            }
        ]
    });
    console.log('Seeded Media');
};
exports.seedMedia = seedMedia;
