import { Request, Response } from 'express';
import * as notificationsService from './notifications.service';

export const subscribe = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user!.id;
        const subscription = req.body;

        await notificationsService.saveSubscription(userId, subscription);

        res.status(201).json({ success: true, message: 'Subscribed to notifications' });
    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({ success: false, message: 'Failed to subscribe' });
    }
};

export const getVapidKey = (req: Request, res: Response) => {
    try {
        const key = notificationsService.getVapidPublicKey();
        res.status(200).json({ success: true, publicKey: key });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch VAPID key' });
    }
};

export const sendTestNotification = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user!.id; // Send to self for test
        const payload = {
            title: 'Test Notification',
            body: 'This is a test notification from Kingdom Connect!',
            icon: '/icon-192x192.png'
        };

        await notificationsService.sendNotificationToUser(userId, payload);

        res.status(200).json({ success: true, message: 'Notification sent' });
    } catch (error) {
        console.error('Notification error:', error);
        res.status(500).json({ success: false, message: 'Failed to send notification' });
    }
};
