"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDevotionalById = exports.createDevotional = exports.getAllDevotionals = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getAllDevotionals = async () => {
    return database_1.default.devotional.findMany({
        orderBy: { createdAt: 'desc' },
        include: { creator: { select: { displayName: true } } }
    });
};
exports.getAllDevotionals = getAllDevotionals;
const createDevotional = async (data) => {
    return database_1.default.devotional.create({
        data,
    });
};
exports.createDevotional = createDevotional;
const getDevotionalById = async (id) => {
    return database_1.default.devotional.findUnique({
        where: { id },
    });
};
exports.getDevotionalById = getDevotionalById;
