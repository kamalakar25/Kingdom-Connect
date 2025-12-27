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

export const uploadAvatar = async (req: Request, res: Response) => {
    if (!req.file) {
        return ApiResponse.error(res, 'No file uploaded', 400);
    }

    const userId = (req as any).user.id;
    // Construct public URL. Assumes server is running on localhost/backend URL.
    // In production, this would be the CDN or public S3 URL.
    // For local dev, we use the static path.
    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const user = await UserService.updateProfile(userId, { avatarUrl } as any);
    return ApiResponse.success(res, { user, avatarUrl }, 'Avatar uploaded successfully');
};

export const deleteAccount = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { password } = req.body; // Expect password for confirmation
    try {
        await UserService.deleteAccount(userId, password);
        return ApiResponse.success(res, null, 'Account deleted successfully');
    } catch (error: any) {
        return ApiResponse.error(res, error.message || 'Failed to delete account', 400);
    }
};
