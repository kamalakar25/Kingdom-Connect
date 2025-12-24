"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const api_utils_1 = require("../utils/api.utils");
const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return api_utils_1.ApiResponse.error(res, 'Validation failed', 400, error.issues);
        }
        return api_utils_1.ApiResponse.error(res, 'Internal Server Error', 500);
    }
};
exports.validate = validate;
