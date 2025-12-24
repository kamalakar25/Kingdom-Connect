import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QuizList } from './QuizList';
import { QuizTaker } from './QuizTaker';

export function QuizPage() {
    const { t } = useTranslation();
    const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

    return (
        <section className="space-y-6">
            {!selectedQuizId ? (
                <>
                    <header className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-foreground">{t('quiz.title')}</h2>
                    </header>
                    <QuizList onSelect={setSelectedQuizId} />
                </>
            ) : (
                <QuizTaker quizId={selectedQuizId} onBack={() => setSelectedQuizId(null)} />
            )}
        </section>
    );
}
