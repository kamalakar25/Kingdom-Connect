"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLiveConfig = void 0;
const api_utils_1 = require("../../utils/api.utils");
const getLiveConfig = (req, res) => {
    // In a real app, this could come from DB settings
    const config = {
        youtube: [
            { id: 'UC_Main_Channel_ID', name: 'Main Service', type: 'CHANNEL' },
            { id: 'UC_Youth_Channel_ID', name: 'Youth Service', type: 'CHANNEL' },
            { id: 'UC_Kids_Channel_ID', name: 'Kids Service', type: 'CHANNEL' }
        ],
        mixlr: {
            id: 'church-radio', // Example username
            name: 'Church Radio'
        },
        isLive: false // Manual override flag
    };
    return api_utils_1.ApiResponse.success(res, config);
};
exports.getLiveConfig = getLiveConfig;
