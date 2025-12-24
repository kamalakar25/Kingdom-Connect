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
exports.seedBibleData = exports.getChapterWithVerses = exports.getChapters = exports.getBooks = exports.getVersions = void 0;
const BibleApiService = __importStar(require("./bible-api.service"));
const getVersions = async () => {
    return BibleApiService.getVersions();
};
exports.getVersions = getVersions;
const getBooks = async (versionId) => {
    // Books are static for now, but could be version-dependent if API supported it
    return BibleApiService.getBookList();
};
exports.getBooks = getBooks;
const getChapters = async (bookId) => {
    // API doesn't list chapters, so we assume a standard number or just return a range.
    // However, to keep it simple for the frontend which expects a list:
    // We will return a range of 150 (max psalms) or 50 (genesis) based on book.
    // Optimally, we should have a `BOOKS` constant with chapter counts.
    // For MVP, let's just return a generic list or map standard chapter counts.
    // Quick map for chapter counts (MVP coverage)
    const chapterCounts = {
        'genesis': 50, 'exodus': 40, 'leviticus': 27, 'numbers': 36, 'deuteronomy': 34,
        'joshua': 24, 'judges': 21, 'ruth': 4, '1samuel': 31, '2samuel': 24,
        '1kings': 22, '2kings': 25, '1chronicles': 29, '2chronicles': 36, 'ezra': 10,
        'nehemiah': 13, 'esther': 10, 'job': 42, 'psalms': 150, 'proverbs': 31,
        'ecclesiastes': 12, 'songofsolomon': 8, 'isaiah': 66, 'jeremiah': 52,
        'lamentations': 5, 'ezekiel': 48, 'daniel': 12, 'hosea': 14, 'joel': 3,
        'amos': 9, 'obadiah': 1, 'jonah': 4, 'micah': 7, 'nahum': 3,
        'habakkuk': 3, 'zephaniah': 3, 'haggai': 2, 'zechariah': 14, 'malachi': 4,
        'matthew': 28, 'mark': 16, 'luke': 24, 'john': 21, 'acts': 28,
        'romans': 16, '1corinthians': 16, '2corinthians': 13, 'galatians': 6,
        'ephesians': 6, 'philippians': 4, 'colossians': 4, '1thessalonians': 5,
        '2thessalonians': 3, '1timothy': 6, '2timothy': 4, 'titus': 3,
        'philemon': 1, 'hebrews': 13, 'james': 5, '1peter': 5, '2peter': 3,
        '1john': 5, '2john': 1, '3john': 1, 'jude': 1, 'revelation': 22
    };
    const count = chapterCounts[bookId.toLowerCase()] || 50;
    return Array.from({ length: count }, (_, i) => ({ chapterNumber: i + 1 }));
};
exports.getChapters = getChapters;
const getChapterWithVerses = async (versionId, bookId, chapterNumber) => {
    const data = await BibleApiService.getChapterText(versionId, bookId.toLowerCase(), chapterNumber);
    // Transform to match previous structure slightly
    return {
        ...data,
        verses: data.verses.map(v => ({
            id: `${versionId}-${bookId}-${chapterNumber}-${v.verse}`, // Synthetic ID
            verseNumber: v.verse,
            text: v.text
        }))
    };
};
exports.getChapterWithVerses = getChapterWithVerses;
// Deprecated but kept for compatibility if needed (empty)
const seedBibleData = async () => { };
exports.seedBibleData = seedBibleData;
