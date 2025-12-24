import { Request, Response } from 'express';
import * as AnnouncementService from './announcements.service';
import * as EventService from './events.service';
import { ApiResponse } from '../../utils/api.utils';

export const listAnnouncements = async (req: Request, res: Response) => {
    const list = await AnnouncementService.getAnnouncements();
    return ApiResponse.success(res, list);
};

export const listEvents = async (req: Request, res: Response) => {
    const list = await EventService.getEvents();
    return ApiResponse.success(res, list);
};

import * as PushService from './push.service';

export const subscribeToPush = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const subscription = req.body;
    await PushService.saveSubscription(userId, subscription);
    return ApiResponse.success(res, null, 'Subscribed to push notifications', 201);
};

export const seed = async (req: Request, res: Response) => {
    await AnnouncementService.seedAnnouncements();
    await EventService.seedEvents();
    return ApiResponse.success(res, null, 'Communication data seeded');
}
