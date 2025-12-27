import prisma from '../../config/database';
import webpush from 'web-push';

// Initialize VAPID keys - normally these should be in env vars
const publicVapidKey = process.env.VAPID_PUBLIC_KEY || 'BHwM9...'; // Placeholder if not in env

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        'mailto:kkamalakar512@gmail.com',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
}

export const saveSubscription = async (userId: string, subscription: any) => {
    return prisma.pushSubscription.upsert({
        where: { endpoint: subscription.endpoint },
        update: {
            userId,
            keys: subscription.keys
        },
        create: {
            userId,
            endpoint: subscription.endpoint,
            keys: subscription.keys
        }
    });
};

export const sendNotificationToUser = async (userId: string, payload: any) => {
    const subscriptions = await prisma.pushSubscription.findMany({
        where: { userId }
    });

    const notifications = subscriptions.map(sub => {
        return webpush.sendNotification({
            endpoint: sub.endpoint,
            keys: sub.keys as any
        }, JSON.stringify(payload)).catch(err => {
            console.error('Error sending notification', err);
            // Optionally delete invalid subscription here
        });
    });

    return Promise.all(notifications);
};

export const getVapidPublicKey = () => {
    return publicVapidKey;
};
