import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../ui/glass-card';
import { Button } from '../ui/button';
import { CheckCircle, XCircle, ChevronLeft, Award } from 'lucide-react';
import { cn } from '../../lib/utils';
import { MOCK_QUIZZES } from './QuizList';

// Expanded Mock Data for Specific Quiz Content
const MOCK_QUIZ_DETAILS: Record<string, any> = {
    'q1': {
        id: 'q1',
        title: 'Genesis: The Beginning',
        questions: [
            { id: '1', question: 'In the beginning, God created...', options: ['The heavens and the earth', 'The light and the dark', 'Adam and Eve', 'The garden of Eden'], correct: 0, ref: 'Genesis 1:1' },
            { id: '2', question: 'How many days did creation take?', options: ['3', '6', '7', '40'], correct: 1, ref: 'Genesis 1:31' },
            { id: '3', question: 'Who was the first man?', options: ['Cain', 'Abel', 'Adam', 'Noah'], correct: 2, ref: 'Genesis 2:19' }
        ]
    },
    'q2': {
        id: 'q2',
        title: 'Jesus\' Miracles',
        questions: [
            { id: '1', question: 'What was Jesus\' first miracle?', options: ['Walking on water', 'Turning water into wine', 'Healing the blind', 'Feeding the 5000'], correct: 1, ref: 'John 2:1-11' }
        ]
    }
    // Add others if needed
};

interface Props {
    quizId: string;
    onBack: () => void;
}

export function QuizTaker({ quizId, onBack }: Props) {
    const { t } = useTranslation();
    const [quiz, setQuiz] = useState<any>(null);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        // Simulate fetch
        const data = MOCK_QUIZ_DETAILS[quizId] || {
            id: quizId,
            title: MOCK_QUIZZES.find(q => q.id === quizId)?.title || 'Unknown Quiz',
            questions: [
                { id: '1', question: 'Sample Question 1?', options: ['Option A', 'Option B', 'Option C', 'Option D'], correct: 0, ref: 'Book 1:1' },
                { id: '2', question: 'Sample Question 2?', options: ['True', 'False'], correct: 0, ref: 'Book 2:2' }
            ]
        };
        setQuiz(data);
    }, [quizId]);

    if (!quiz) return <div className="text-muted-foreground">{t('quiz.loading')}</div>;

    const handleSubmit = () => {
        setIsSubmitted(true);
    };

    const calculateScore = () => {
        let score = 0;
        quiz.questions.forEach((q: any) => {
            if (answers[q.id] === q.correct) score++;
        });
        return score;
    };

    if (isSubmitted) {
        const score = calculateScore();
        const total = quiz.questions.length;
        const percentage = (score / total) * 100;

        return (
            <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-8">
                <GlassCard className="text-center py-10 border-primary/20 bg-primary/5">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
                        <Award className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">{t('quiz.score', { score, total })}</h2>
                    <p className="text-muted-foreground mb-6">{percentage === 100 ? t('quiz.perfect') : t('quiz.effort')}</p>
                    <Button onClick={onBack} variant="outline" className="border-border hover:bg-muted text-foreground">
                        {t('quiz.tryAgain')}
                    </Button>
                </GlassCard>

                <div className="space-y-4">
                    {quiz.questions.map((q: any, idx: number) => {
                        const isCorrect = answers[q.id] === q.correct;
                        return (
                            <GlassCard key={q.id} className={cn("p-6 border-l-4", isCorrect ? "border-l-green-500" : "border-l-red-500")}>
                                <h3 className="font-medium text-foreground text-lg mb-3">
                                    <span className="opacity-50 mr-2">{idx + 1}.</span> {q.question}
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className={cn("flex items-center gap-2", isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
                                        {isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                        <span>{t('quiz.yourAnswer', { answer: q.options[answers[q.id]] })}</span>
                                    </div>
                                    {!isCorrect && (
                                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                            <CheckCircle className="w-4 h-4" />
                                            <span>{t('quiz.correctAnswer', { answer: q.options[q.correct] })}</span>
                                        </div>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-2 font-serif italic">{t('quiz.ref', { ref: q.ref })}</p>
                                </div>
                            </GlassCard>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <header className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" onClick={onBack} className="text-muted-foreground hover:text-foreground rounded-full hover:bg-muted">
                    <ChevronLeft className="w-6 h-6" />
                </Button>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground">{quiz.title}</h2>
                    <p className="text-muted-foreground text-sm">{t('quiz.progress', { answered: Object.keys(answers).length, total: quiz.questions.length })}</p>
                </div>
            </header>

            <div className="space-y-6">
                {quiz.questions.map((q: any, idx: number) => (
                    <GlassCard key={q.id} className="p-6">
                        <h3 className="font-medium text-foreground text-lg mb-4">
                            <span className="opacity-50 mr-2">{idx + 1}.</span> {q.question}
                        </h3>
                        <div className="grid gap-2">
                            {q.options.map((opt: string, optIdx: number) => (
                                <label
                                    key={optIdx}
                                    className={cn(
                                        "flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200",
                                        answers[q.id] === optIdx
                                            ? "border-primary/50 bg-primary/10 text-foreground shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                                            : "border-border hover:border-primary/20 hover:bg-muted text-muted-foreground"
                                    )}
                                >
                                    <input
                                        type="radio"
                                        name={q.id}
                                        className="mr-3 w-4 h-4 accent-primary"
                                        checked={answers[q.id] === optIdx}
                                        onChange={() => setAnswers({ ...answers, [q.id]: optIdx })}
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </GlassCard>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-border sticky bottom-0 bg-background/80 backdrop-blur-xl p-4 -mx-4 md:mx-0 rounded-t-2xl z-20">
                <Button
                    onClick={handleSubmit}
                    disabled={Object.keys(answers).length < quiz.questions.length}
                    className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {t('quiz.submit')}
                </Button>
            </div>
        </div>
    );
}
