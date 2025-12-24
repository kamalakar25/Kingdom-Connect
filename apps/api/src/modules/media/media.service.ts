import { PrismaClient, AssetType } from '@prisma/client';

const prisma = new PrismaClient();

export const getAssets = async (type?: AssetType) => {
    return prisma.mediaAsset.findMany({
        where: {
            ...(type ? { assetType: type } : {})
        },
        orderBy: { createdAt: 'desc' }
    });
};

export const seedMedia = async () => {
    const existing = await prisma.mediaAsset.count();
    if (existing > 0) return;

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
}
