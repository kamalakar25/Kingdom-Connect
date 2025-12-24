import { Request, Response } from 'express';
import * as SSMService from './sunday-school.service';
import { ApiResponse } from '../../utils/api.utils';

export const list = async (req: Request, res: Response) => {
    const { classId } = req.query;
    const resources = await SSMService.getResources(classId ? Number(classId) : undefined);
    return ApiResponse.success(res, resources);
};

export const seed = async (req: Request, res: Response) => {
    await SSMService.seedSundaySchool();
    return ApiResponse.success(res, null, 'Sunday School seeded');
}
