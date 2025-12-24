import * as BibleApiService from './bible-api.service';

import { BIBLE_BOOKS, TELUGU_BOOK_NAMES, HINDI_BOOK_NAMES } from './bible.constants';

export const getVersions = async () => {
    return BibleApiService.getVersions();
};

export const getBooks = async (versionId: string) => {
    // Return localized book names based on version language
    const books = BIBLE_BOOKS.map(book => {
        let name = book.name;
        if (versionId.includes('irvtel') || versionId.includes('tel')) {
            name = TELUGU_BOOK_NAMES[book.id] || book.name;
        } else if (versionId.includes('irvhin') || versionId.includes('hin')) {
            name = HINDI_BOOK_NAMES[book.id] || book.name;
        }
        return { ...book, name };
    });
    return books;
};

export const getChapters = async (bookId: string) => {
    // API doesn't list chapters, so we assume a standard number or just return a range.
    // However, to keep it simple for the frontend which expects a list:
    // We will return a range of 150 (max psalms) or 50 (genesis) based on book.
    // Optimally, we should have a `BOOKS` constant with chapter counts.
    // For MVP, let's just return a generic list or map standard chapter counts.

    // Quick map for chapter counts (MVP coverage)
    const chapterCounts: Record<string, number> = {
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

export const getChapterWithVerses = async (versionId: string, bookId: string, chapterNumber: number) => {
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
}

// Deprecated but kept for compatibility if needed (empty)
export const seedBibleData = async () => { };
