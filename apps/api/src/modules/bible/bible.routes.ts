import { Router } from 'express';
import * as BibleController from './bible.controller';

const router = Router();

router.get('/versions', BibleController.getVersions);
router.get('/versions/:versionId/books', BibleController.getBooks);
router.get('/books/:bookId/chapters', BibleController.getChapters);
router.get('/versions/:versionId/books/:bookId/chapters/:chapter', BibleController.getChapter);

// Admin only (unprotected for dev simplicity)
router.post('/seed', BibleController.runSeed);

export default router;
