"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const api_utils_1 = require("../utils/api.utils");
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    if (err.message === 'Not allowed by CORS') {
        return api_utils_1.ApiResponse.error(res, 'CORS Error', 403);
    }
    return api_utils_1.ApiResponse.error(res, err.message || 'Internal Server Error', 500);
};
exports.errorHandler = errorHandler;
