"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedQuizzes = exports.submitAttempt = exports.getQuiz = exports.getQuizzes = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getQuizzes = async (audience) => {
    return prisma.quiz.findMany({
        where: {
            isActive: true,
            ...(audience ? { audience } : {}),
        },
        include: {
            _count: {
                select: { questions: true }
            }
        }
    });
};
exports.getQuizzes = getQuizzes;
const getQuiz = async (id) => {
    return prisma.quiz.findUnique({
        where: { id },
        include: {
            questions: {
                select: {
                    id: true,
                    question: true,
                    options: true,
                    // Exclude correctOption for client security
                    verseRef: true
                }
            }
        }
    });
};
exports.getQuiz = getQuiz;
const submitAttempt = async (userId, quizId, answers) => {
    // Fetch full quiz with correct answers
    const quiz = await prisma.quiz.findUnique({
        where: { id: quizId },
        include: { questions: true }
    });
    if (!quiz)
        throw new Error('Quiz not found');
    let score = 0;
    const feedback = quiz.questions.map((q) => {
        const submitted = answers[q.id];
        const isCorrect = submitted === q.correctOption;
        if (isCorrect)
            score++;
        return {
            questionId: q.id,
            isCorrect,
            correctOption: q.correctOption,
            userOption: submitted,
            verseRef: q.verseRef
        };
    });
    // Save attempt if user is authenticated (userId provided)
    // For now, allow anonymous attempts without saving to DB if userId is null, 
    // or just return the score.
    if (userId) {
        await prisma.quizAttempt.create({
            data: {
                quizId,
                userId,
                score,
                total: quiz.questions.length
            }
        });
    }
    return {
        score,
        total: quiz.questions.length,
        feedback
    };
};
exports.submitAttempt = submitAttempt;
// Seed function
const seedQuizzes = async () => {
    const existing = await prisma.quiz.count();
    if (existing > 0)
        return;
    // Create a Youth Quiz
    const quiz = await prisma.quiz.create({
        data: {
            title: 'Genesis Chapter 1 Challenge',
            audience: 'YOUTH',
            language: 'en',
            questions: {
                create: [
                    {
                        question: 'What did God create on the first day?',
                        options: ['Sun and Moon', 'Light', 'Animals', 'Man'],
                        correctOption: 1, // Index 1 -> Light
                        verseRef: 'Genesis 1:3-5'
                    },
                    {
                        question: 'Who hovered over the face of the waters?',
                        options: ['Moses', 'The Spirit of God', 'Angels', 'No one'],
                        correctOption: 1,
                        verseRef: 'Genesis 1:2'
                    }
                ]
            }
        }
    });
    console.log('Seeded Quiz:', quiz.title);
};
exports.seedQuizzes = seedQuizzes;
