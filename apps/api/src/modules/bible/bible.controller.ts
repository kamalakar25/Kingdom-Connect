import { Request, Response } from 'express';
import * as BibleService from './bible.service';
import { ApiResponse } from '../../utils/api.utils';

export const getVersions = async (req: Request, res: Response) => {
    const versions = await BibleService.getVersions();
    return ApiResponse.success(res, versions);
};

export const getBooks = async (req: Request, res: Response) => {
    const { versionId } = req.params;
    const books = await BibleService.getBooks(versionId);
    return ApiResponse.success(res, books);
};

export const getChapters = async (req: Request, res: Response) => {
    const { bookId } = req.params;
    const chapters = await BibleService.getChapters(bookId);
    return ApiResponse.success(res, chapters);
};

export const getChapter = async (req: Request, res: Response) => {
    const { versionId, bookId, chapter } = req.params;
    const data = await BibleService.getChapterWithVerses(
        versionId,
        bookId,
        parseInt(chapter)
    );
    return ApiResponse.success(res, data);
}

export const runSeed = async (req: Request, res: Response) => {
    await BibleService.seedBibleData();
    return ApiResponse.success(res, null, 'Seeding initiated');
}
