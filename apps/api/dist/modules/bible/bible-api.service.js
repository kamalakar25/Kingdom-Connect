"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRangeText = exports.getChapterText = exports.getBookList = exports.getVersions = exports.BOOKS = void 0;
const axios_1 = __importDefault(require("axios"));
const BASE_URL = 'https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles';
// Static list of books since the API might not provide a simple list endpoint for every version
// and we want consistent ordering/naming.
exports.BOOKS = [
    { id: 'genesis', name: 'Genesis' },
    { id: 'exodus', name: 'Exodus' },
    { id: 'leviticus', name: 'Leviticus' },
    { id: 'numbers', name: 'Numbers' },
    { id: 'deuteronomy', name: 'Deuteronomy' },
    { id: 'joshua', name: 'Joshua' },
    { id: 'judges', name: 'Judges' },
    { id: 'ruth', name: 'Ruth' },
    { id: '1samuel', name: '1 Samuel' },
    { id: '2samuel', name: '2 Samuel' },
    { id: '1kings', name: '1 Kings' },
    { id: '2kings', name: '2 Kings' },
    { id: '1chronicles', name: '1 Chronicles' },
    { id: '2chronicles', name: '2 Chronicles' },
    { id: 'ezra', name: 'Ezra' },
    { id: 'nehemiah', name: 'Nehemiah' },
    { id: 'esther', name: 'Esther' },
    { id: 'job', name: 'Job' },
    { id: 'psalms', name: 'Psalms' },
    { id: 'proverbs', name: 'Proverbs' },
    { id: 'ecclesiastes', name: 'Ecclesiastes' },
    { id: 'songofsolomon', name: 'Song of Solomon' },
    { id: 'isaiah', name: 'Isaiah' },
    { id: 'jeremiah', name: 'Jeremiah' },
    { id: 'lamentations', name: 'Lamentations' },
    { id: 'ezekiel', name: 'Ezekiel' },
    { id: 'daniel', name: 'Daniel' },
    { id: 'hosea', name: 'Hosea' },
    { id: 'joel', name: 'Joel' },
    { id: 'amos', name: 'Amos' },
    { id: 'obadiah', name: 'Obadiah' },
    { id: 'jonah', name: 'Jonah' },
    { id: 'micah', name: 'Micah' },
    { id: 'nahum', name: 'Nahum' },
    { id: 'habakkuk', name: 'Habakkuk' },
    { id: 'zephaniah', name: 'Zephaniah' },
    { id: 'haggai', name: 'Haggai' },
    { id: 'zechariah', name: 'Zechariah' },
    { id: 'malachi', name: 'Malachi' },
    { id: 'matthew', name: 'Matthew' },
    { id: 'mark', name: 'Mark' },
    { id: 'luke', name: 'Luke' },
    { id: 'john', name: 'John' },
    { id: 'acts', name: 'Acts' },
    { id: 'romans', name: 'Romans' },
    { id: '1corinthians', name: '1 Corinthians' },
    { id: '2corinthians', name: '2 Corinthians' },
    { id: 'galatians', name: 'Galatians' },
    { id: 'ephesians', name: 'Ephesians' },
    { id: 'philippians', name: 'Philippians' },
    { id: 'colossians', name: 'Colossians' },
    { id: '1thessalonians', name: '1 Thessalonians' },
    { id: '2thessalonians', name: '2 Thessalonians' },
    { id: '1timothy', name: '1 Timothy' },
    { id: '2timothy', name: '2 Timothy' },
    { id: 'titus', name: 'Titus' },
    { id: 'philemon', name: 'Philemon' },
    { id: 'hebrews', name: 'Hebrews' },
    { id: 'james', name: 'James' },
    { id: '1peter', name: '1 Peter' },
    { id: '2peter', name: '2 Peter' },
    { id: '1john', name: '1 John' },
    { id: '2john', name: '2 John' },
    { id: '3john', name: '3 John' },
    { id: 'jude', name: 'Jude' },
    { id: 'revelation', name: 'Revelation' }
];
const getVersions = () => {
    return [
        { id: 'en-kjv', name: 'English (KJV)', language: 'en' },
        { id: 'te-IN-irvtel', name: 'Telugu (IRV)', language: 'te' },
        { id: 'hi-IN-irvhin', name: 'Hindi (IRV)', language: 'hi' }
    ];
};
exports.getVersions = getVersions;
const getBookList = () => {
    return exports.BOOKS;
};
exports.getBookList = getBookList;
const getChapterText = async (version, book, chapter) => {
    try {
        const url = `${BASE_URL}/${version}/books/${book}/chapters/${chapter}.json`;
        const response = await axios_1.default.get(url);
        return response.data;
    }
    catch (error) {
        console.error(`Error fetching chapter: ${version} ${book} ${chapter}`, error);
        throw new Error('Failed to fetch chapter');
    }
};
exports.getChapterText = getChapterText;
const getRangeText = async (version, book, chapter, start, end) => {
    const data = await (0, exports.getChapterText)(version, book, chapter);
    const verses = data.verses.filter(v => v.verse >= start && v.verse <= end);
    return verses.map(v => v.text).join(' ');
};
exports.getRangeText = getRangeText;
