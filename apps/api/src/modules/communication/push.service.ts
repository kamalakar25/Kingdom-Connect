import prisma from '../../config/database';

export const saveSubscription = async (userId: string | undefined, subscription: any) => {
    return prisma.pushSubscription.create({
        data: {
            userId,
            endpoint: subscription.endpoint,
            keys: subscription.keys,
        },
    });
};
