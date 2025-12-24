import { Request, Response } from 'express';
import * as DailyVerseService from './daily-verse.service';
import { ApiResponse } from '../../utils/api.utils';

export const getToday = async (req: Request, res: Response) => {
    const lang = req.query.lang as string || 'en';
    const verse = await DailyVerseService.getDailyVerse(new Date(), lang);
    return ApiResponse.success(res, verse);
};

export const create = async (req: Request, res: Response) => {
    const verse = await DailyVerseService.scheduleDailyVerse(req.body);
    return ApiResponse.success(res, verse, 'Daily verse created', 201);
}
