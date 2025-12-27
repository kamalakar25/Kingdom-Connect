import { Router } from 'express';
import * as QuizController from './quizzes.controller';
// import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';

const router = Router();

router.get('/', QuizController.list);
router.get('/:id', QuizController.get);
// Attempt can be public or protected, let's keep it open but auth-aware in controller
router.post('/:id/attempt', QuizController.attempt);
router.post('/seed', QuizController.seed);

export default router;
