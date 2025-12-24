"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getProfile = async (userId) => {
    return database_1.default.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            displayName: true,
            locale: true,
            role: true,
            createdAt: true,
        },
    });
};
exports.getProfile = getProfile;
const updateProfile = async (userId, data) => {
    return database_1.default.user.update({
        where: { id: userId },
        data,
        select: {
            id: true,
            email: true,
            displayName: true,
            locale: true,
            role: true,
        },
    });
};
exports.updateProfile = updateProfile;
