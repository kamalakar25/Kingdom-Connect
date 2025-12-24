import { Request, Response } from 'express';
import * as UserService from './users.service';
import { ApiResponse } from '../../utils/api.utils';

export const getProfile = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const user = await UserService.getProfile(userId);
    return ApiResponse.success(res, user);
};

export const updateProfile = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { displayName, locale, settings } = req.body;
    const user = await UserService.updateProfile(userId, { displayName, locale, settings });
    return ApiResponse.success(res, user, 'Profile updated successfully');
};

export const deleteAccount = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    await UserService.deleteAccount(userId);
    return ApiResponse.success(res, null, 'Account deleted successfully');
};
