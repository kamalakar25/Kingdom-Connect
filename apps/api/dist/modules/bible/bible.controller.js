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
exports.runSeed = exports.getChapter = exports.getChapters = exports.getBooks = exports.getVersions = void 0;
const BibleService = __importStar(require("./bible.service"));
const api_utils_1 = require("../../utils/api.utils");
const getVersions = async (req, res) => {
    const versions = await BibleService.getVersions();
    return api_utils_1.ApiResponse.success(res, versions);
};
exports.getVersions = getVersions;
const getBooks = async (req, res) => {
    const { versionId } = req.params;
    const books = await BibleService.getBooks(versionId);
    return api_utils_1.ApiResponse.success(res, books);
};
exports.getBooks = getBooks;
const getChapters = async (req, res) => {
    const { bookId } = req.params;
    const chapters = await BibleService.getChapters(bookId);
    return api_utils_1.ApiResponse.success(res, chapters);
};
exports.getChapters = getChapters;
const getChapter = async (req, res) => {
    const { versionId, bookId, chapter } = req.params;
    const data = await BibleService.getChapterWithVerses(versionId, bookId, parseInt(chapter));
    return api_utils_1.ApiResponse.success(res, data);
};
exports.getChapter = getChapter;
const runSeed = async (req, res) => {
    await BibleService.seedBibleData();
    return api_utils_1.ApiResponse.success(res, null, 'Seeding initiated');
};
exports.runSeed = runSeed;
