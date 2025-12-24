"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = exports.subscribeToPush = exports.listEvents = exports.listAnnouncements = void 0;
const AnnouncementService = __importStar(require("./announcements.service"));
const EventService = __importStar(require("./events.service"));
const api_utils_1 = require("../../utils/api.utils");
const listAnnouncements = async (req, res) => {
    const list = await AnnouncementService.getAnnouncements();
    return api_utils_1.ApiResponse.success(res, list);
};
exports.listAnnouncements = listAnnouncements;
const listEvents = async (req, res) => {
    const list = await EventService.getEvents();
    return api_utils_1.ApiResponse.success(res, list);
};
exports.listEvents = listEvents;
const PushService = __importStar(require("./push.service"));
const subscribeToPush = async (req, res) => {
    const userId = req.user?.id;
    const subscription = req.body;
    await PushService.saveSubscription(userId, subscription);
    return api_utils_1.ApiResponse.success(res, null, 'Subscribed to push notifications', 201);
};
exports.subscribeToPush = subscribeToPush;
const seed = async (req, res) => {
    await AnnouncementService.seedAnnouncements();
    await EventService.seedEvents();
    return api_utils_1.ApiResponse.success(res, null, 'Communication data seeded');
};
exports.seed = seed;
