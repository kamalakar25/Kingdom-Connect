import { Router } from 'express';
import * as DailyVerseController from './daily-verse.controller';

const router = Router();

router.get('/today', DailyVerseController.getToday);
router.post('/', DailyVerseController.create); // Protect in real app

export default router;
