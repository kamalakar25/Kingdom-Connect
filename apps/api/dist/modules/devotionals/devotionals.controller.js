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
exports.getOne = exports.create = exports.list = void 0;
const DevotionalService = __importStar(require("./devotionals.service"));
const api_utils_1 = require("../../utils/api.utils");
const list = async (req, res) => {
    const devotionals = await DevotionalService.getAllDevotionals();
    return api_utils_1.ApiResponse.success(res, devotionals);
};
exports.list = list;
const create = async (req, res) => {
    // Assuming user is attached to req by auth middleware
    const userId = req.user?.id;
    const devotional = await DevotionalService.createDevotional({ ...req.body, createdBy: userId });
    return api_utils_1.ApiResponse.success(res, devotional, 'Devotional created successfully', 201);
};
exports.create = create;
const getOne = async (req, res) => {
    const { id } = req.params;
    const devotional = await DevotionalService.getDevotionalById(id);
    if (!devotional) {
        return api_utils_1.ApiResponse.error(res, 'Devotional not found', 404);
    }
    return api_utils_1.ApiResponse.success(res, devotional);
};
exports.getOne = getOne;
