import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/api.utils';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);

    if (err.message === 'Not allowed by CORS') {
        return ApiResponse.error(res, 'CORS Error', 403);
    }

    return ApiResponse.error(res, err.message || 'Internal Server Error', 500);
};
