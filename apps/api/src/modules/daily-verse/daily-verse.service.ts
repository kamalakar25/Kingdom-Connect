import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import * as BibleApiService from '../bible/bible-api.service';

import { POPULAR_VERSES } from './daily-verse.constants';
import { BIBLE_BOOKS, TELUGU_BOOK_NAMES, HINDI_BOOK_NAMES } from '../bible/bible.constants';

export const getDailyVerse = async (date: Date, language: string) => {
    // Map language to version
    const versionMap: Record<string, string> = {
        'en': 'en-kjv',
        'te': 'te-IN-irvtel',
        'hi': 'hi-IN-irvhin'
    };
    const version = versionMap[language] || 'en-kjv';

    // Pick a verse based on the date (consistent for the whole day)
    // We use the start of the day to ensure it doesn't shift if time changes slightly
    const startOfDay = new Date(date).setHours(0, 0, 0, 0);
    const dayIndex = Math.floor(startOfDay / (1000 * 60 * 60 * 24));

    // Check if we have a specific override in DB (optional future feature), 
    // for now just use the popular list rotation
    const verseIndex = dayIndex % POPULAR_VERSES.length;
    const selection = POPULAR_VERSES[verseIndex];

    const { book, chapter, verse: verseNum } = selection;

    const bookDetails = BIBLE_BOOKS.find(b => b.id === book);
    let bookName = bookDetails?.name || book;

    // Manual localization for book name in definition (DailyVerseCard expects 'reference' string)
    // Ideally BibleService.getBooks handles lists, but here we construct a single string.
    if (language === 'te' && TELUGU_BOOK_NAMES[book]) {
        bookName = TELUGU_BOOK_NAMES[book];
    } else if (language === 'hi' && HINDI_BOOK_NAMES[book]) {
        bookName = HINDI_BOOK_NAMES[book];
    }

    try {
        const text = await BibleApiService.getRangeText(version, book, chapter, verseNum, verseNum);

        return {
            text,
            reference: `${bookName} ${chapter}:${verseNum}`,
            version: version.toUpperCase()
        };
    } catch (e) {
        console.error('Failed to fetch daily verse', e);
        // Fallback
        return {
            text: language === 'te' ? 'యెహోవా నా కాపరి...' : 'The Lord is my shepherd...',
            reference: 'Psalm 23:1',
            version: 'Fallback'
        };
    }
};

export const scheduleDailyVerse = async (data: any) => {
    return prisma.dailyVerse.create({ data });
}
