import { Request, Response } from 'express';
import * as MediaService from './media.service';
import { AssetType } from '@prisma/client';
import { ApiResponse } from '../../utils/api.utils';

export const list = async (req: Request, res: Response) => {
    const type = req.query.type as AssetType | undefined;
    const assets = await MediaService.getAssets(type);
    return ApiResponse.success(res, assets);
};

export const seed = async (req: Request, res: Response) => {
    await MediaService.seedMedia();
    return ApiResponse.success(res, null, 'Media seeded');
}
