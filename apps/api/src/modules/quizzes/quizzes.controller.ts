import { Request, Response } from 'express';
import * as QuizService from './quizzes.service';
import { ApiResponse } from '../../utils/api.utils';

export const list = async (req: Request, res: Response) => {
    const audience = req.query.audience as 'YOUTH' | 'ELDERS' | undefined;
    const quizzes = await QuizService.getQuizzes(audience);
    return ApiResponse.success(res, quizzes);
};

export const get = async (req: Request, res: Response) => {
    const { id } = req.params;
    const quiz = await QuizService.getQuiz(id);
    if (!quiz) return ApiResponse.error(res, 'Quiz not found', 404);
    return ApiResponse.success(res, quiz);
};

export const attempt = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { answers } = req.body; // { questionId: optionIndex }
    // @ts-ignore - User might be attached by middleware
    const userId = req.user?.id;

    const result = await QuizService.submitAttempt(userId, id, answers);
    return ApiResponse.success(res, result);
};

export const seed = async (req: Request, res: Response) => {
    await QuizService.seedQuizzes();
    return ApiResponse.success(res, null, 'Quizzes seeded');
}
