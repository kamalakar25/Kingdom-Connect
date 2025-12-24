import { Request, Response } from 'express';
import * as DevotionalService from './devotionals.service';
import { ApiResponse } from '../../utils/api.utils';

export const list = async (req: Request, res: Response) => {
    const devotionals = await DevotionalService.getAllDevotionals();
    return ApiResponse.success(res, devotionals);
};

export const create = async (req: Request, res: Response) => {
    // Assuming user is attached to req by auth middleware
    const userId = (req as any).user?.id;
    const devotional = await DevotionalService.createDevotional({ ...req.body, createdBy: userId });
    return ApiResponse.success(res, devotional, 'Devotional created successfully', 201);
};

export const getOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    const devotional = await DevotionalService.getDevotionalById(id);
    if (!devotional) {
        return ApiResponse.error(res, 'Devotional not found', 404);
    }
    return ApiResponse.success(res, devotional);
};
