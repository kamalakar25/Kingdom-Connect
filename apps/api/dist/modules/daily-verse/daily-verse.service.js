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
exports.scheduleDailyVerse = exports.getDailyVerse = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const BibleApiService = __importStar(require("../bible/bible-api.service"));
const getDailyVerse = async (date, language) => {
    // Map language to version
    const versionMap = {
        'en': 'en-kjv',
        'te': 'te-IN-irvtel',
        'hi': 'hi-IN-irvhin'
    };
    const version = versionMap[language] || 'en-kjv';
    // Simple daily verse rotation - let's pick Psalm 23:1 for MVP demonstration
    // ideally we hash the date to pick a book/chapter/verse
    const book = 'psalms';
    const chapter = 23;
    const verseNum = 1;
    try {
        const text = await BibleApiService.getRangeText(version, book, chapter, verseNum, verseNum);
        return {
            text,
            reference: language === 'te' ? 'కీర్తనలు 23:1' : (language === 'hi' ? 'भजन संहिता 23:1' : 'Psalm 23:1'),
            version: version.toUpperCase() // simplified display name
        };
    }
    catch (e) {
        console.error('Failed to fetch daily verse', e);
        // Fallback
        return {
            text: language === 'te' ? 'యెహోవా నా కాపరి...' : 'The Lord is my shepherd...',
            reference: 'Psalm 23:1',
            version: 'Fallback'
        };
    }
};
exports.getDailyVerse = getDailyVerse;
const scheduleDailyVerse = async (data) => {
    return prisma.dailyVerse.create({ data });
};
exports.scheduleDailyVerse = scheduleDailyVerse;
