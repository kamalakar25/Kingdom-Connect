import { Request, Response } from 'express';
import { ApiResponse } from '../../utils/api.utils';

export const getLiveConfig = (req: Request, res: Response) => {
    // In a real app, this could come from DB settings
    const config = {
        youtube: [
            { id: 'UC_Main_Channel_ID', name: 'Main Service', type: 'CHANNEL' },
            { id: 'UC_Youth_Channel_ID', name: 'Youth Service', type: 'CHANNEL' },
            { id: 'UC_Kids_Channel_ID', name: 'Kids Service', type: 'CHANNEL' }
        ],
        isLive: false // Manual override flag
    };
    return ApiResponse.success(res, config);
};
