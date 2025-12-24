"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveSubscription = void 0;
const database_1 = __importDefault(require("../../config/database"));
const saveSubscription = async (userId, subscription) => {
    return database_1.default.pushSubscription.create({
        data: {
            userId,
            endpoint: subscription.endpoint,
            keys: subscription.keys,
        },
    });
};
exports.saveSubscription = saveSubscription;
