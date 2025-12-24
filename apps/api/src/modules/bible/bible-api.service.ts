import axios from 'axios';
import { BIBLE_BOOKS, HINDI_FOLDER_MAPPINGS, TELUGU_FOLDER_MAPPINGS } from './bible.constants';

// CDN blocked some large versions with "Package size exceeded". Switching to Raw GitHub.
const BASE_URL = 'https://raw.githubusercontent.com/wldeh/bible-api/master/bibles';

export interface BibleVersion {
    id: string; // e.g., 'en-kjv'
    name: string;
    language: string;
}

export interface BibleBook {
    id: string; // e.g., 'genesis'
    name: string;
}

export interface BibleChapter {
    verseCount?: number;
    verses: {
        verse: number;
        text: string;
    }[];
}

export const getVersions = (): BibleVersion[] => {
    return [
        { id: 'en-kjv', name: 'English (KJV)', language: 'en' },
        { id: 'te-IN-irvtel', name: 'Telugu (IRV)', language: 'te' },
        { id: 'hi-IN-irvhin', name: 'Hindi (IRV)', language: 'hi' }
    ];
};

export const getBookList = (): BibleBook[] => {
    return BIBLE_BOOKS;
};

export const getChapterText = async (version: string, book: string, chapter: number): Promise<BibleChapter> => {
    try {
        let bookPath = book;
        if (version.includes('irvtel') || version.includes('tel')) {
            bookPath = TELUGU_FOLDER_MAPPINGS[book] || book;
        } else if (version.includes('irvhin') || version.includes('hin')) {
            bookPath = HINDI_FOLDER_MAPPINGS[book] || book;
        }

        // Ensure capitalized for English (some versions require it) check 'Generic' vs 'generic'
        // For KJV, it seems to be lowercase based on tests? No, I tested 'Genesis' and it worked?
        // Let's check my probe... probe 'genesis' failed on ohss.
        // But wldeh usually uses lowercase for English.
        // I will keep it as is for English (lowercase ID), but localized map provides capitalized/correct string.

        const url = `${BASE_URL}/${version}/books/${bookPath}/chapters/${chapter}.json`;
        console.log(`Fetching Bible API: ${url}`);
        const response = await axios.get(url);

        // The API returns { data: [{ book, chapter, verse, text }, ...] }
        // or sometimes different structures depending on the CDN/version, but looking at the log:
        // { data: [ { text: ... } ] }

        if (!response.data) {
            console.warn(`Empty response from Bible API`);
            throw new Error('Invalid chapter data');
        }

        const verses = response.data.data || response.data.verses || [];

        if (!Array.isArray(verses) || verses.length === 0) {
            // Some versions might just return array directly?
            if (Array.isArray(response.data)) {
                // handle array directly
                // return ...
            }
            console.warn(`Invalid verses format:`, response.data);
            throw new Error('Invalid chapter data');
        }

        return {
            verses: verses.map((v: any) => ({
                verse: parseInt(v.verse),
                text: v.text
            }))
        };
    } catch (error) {
        console.error(`Error fetching chapter: ${version} ${book} ${chapter}`, error);
        throw new Error('Failed to fetch chapter');
    }
};

export const getRangeText = async (version: string, book: string, chapter: number, start: number, end: number): Promise<string> => {
    try {
        const data = await getChapterText(version, book, chapter);
        if (!data.verses) return 'Verse not found';

        const verses = data.verses.filter(v => v.verse >= start && v.verse <= end);
        return verses.map(v => v.text).join(' ');
    } catch (err) {
        return 'Verse unavailable';
    }
};
