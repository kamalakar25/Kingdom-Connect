import { Request, Response } from 'express';
import * as SermonService from './sermons.service';
import { ApiResponse } from '../../utils/api.utils';

export const list = async (req: Request, res: Response) => {
    const sermons = await SermonService.getSermons();
    return ApiResponse.success(res, sermons);
};

export const seed = async (req: Request, res: Response) => {
    await SermonService.seedSermons();
    return ApiResponse.success(res, null, 'Sermons seeded');
}
