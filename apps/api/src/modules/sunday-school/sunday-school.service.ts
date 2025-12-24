import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getResources = async (classId?: number) => {
    return prisma.sundaySchoolResource.findMany({
        where: {
            ...(classId ? { classId: Number(classId) } : {})
        },
        include: { class: true }
    });
};

export const seedSundaySchool = async () => {
    const existing = await prisma.sundaySchoolClass.count();
    if (existing > 0) return;

    // Seed Classes
    const c1 = await prisma.sundaySchoolClass.create({ data: { code: 'BEGINNER', name: 'Beginner (3-5 yrs)' } });
    const c2 = await prisma.sundaySchoolClass.create({ data: { code: 'PRIMARY', name: 'Primary (6-9 yrs)' } });
    await prisma.sundaySchoolClass.create({ data: { code: 'JUNIOR', name: 'Junior (10-12 yrs)' } });

    // Seed Resources
    await prisma.sundaySchoolResource.createMany({
        data: [
            {
                classId: c1.id,
                title: 'Creation Story Coloring Page',
                language: 'en',
                resourceType: 'PDF',
                url: 'https://example.com/creation.pdf',
                thumbnailUrl: 'https://placehold.co/400x500/1e293b/white?text=PDF'
            },
            {
                classId: c2.id,
                title: 'David and Goliath Lesson',
                language: 'en',
                resourceType: 'VIDEO',
                url: 'https://example.com/david.mp4',
                thumbnailUrl: 'https://placehold.co/600x400/1e293b/white?text=Video'
            }
        ]
    });
    console.log('Seeded Sunday School');
}
