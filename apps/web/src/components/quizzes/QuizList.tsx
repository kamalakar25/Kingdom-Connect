import { GlassCard } from '../ui/glass-card';
import { Trophy, HelpCircle, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

// Mock Data
export const MOCK_QUIZZES = [
    // ... existing items ...
    {
        id: 'q1',
        title: 'Genesis: The Beginning',
        audience: 'General',
        questionCount: 10,
        description: 'Test your knowledge on the creation, the fall, and the patriarchs.',
        difficulty: 'Medium'
    },
    {
        id: 'q2',
        title: 'Jesus\' Miracles',
        audience: 'Kids',
        questionCount: 5,
        description: 'How well do you know the miracles Jesus performed?',
        difficulty: 'Easy'
    },
    {
        id: 'q3',
        title: 'Paul\'s Missionary Journeys',
        audience: 'Advanced',
        questionCount: 15,
        description: 'Deep dive into the travels and letters of Apostle Paul.',
        difficulty: 'Hard'
    },
    {
        id: 'q4',
        title: 'Book of Psalms',
        audience: 'General',
        questionCount: 8,
        description: 'Explore the poetry and songs of King David and others.',
        difficulty: 'Medium'
    }
];

interface Props {
    onSelect: (id: string) => void;
}

export function QuizList({ onSelect }: Props) {
    const { t } = useTranslation();

    return (
        <div className="grid gap-4 sm:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {MOCK_QUIZZES.map((quiz, idx) => (
                <GlassCard
                    key={quiz.id}
                    className="group hover:bg-muted/50 transition-all cursor-pointer border-border relative overflow-hidden bg-card/60 dark:bg-card/20"
                    onClick={() => onSelect(quiz.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Trophy className="w-24 h-24 rotate-12 text-primary" />
                    </div>

                    <div className="flex justify-between items-start mb-3 relative z-10">
                        <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full border border-border uppercase tracking-wider",
                            quiz.audience === 'Kids' ? "bg-green-500/20 text-green-500 dark:text-green-300" :
                                quiz.audience === 'Advanced' ? "bg-red-500/20 text-red-500 dark:text-red-300" :
                                    "bg-blue-500/20 text-blue-500 dark:text-blue-300"
                        )}>
                            {t(`quiz.audience.${quiz.audience.toLowerCase()}`)}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <HelpCircle className="w-3 h-3" />
                            <span>{t('quiz.questionsCount', { count: quiz.questionCount })}</span>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors relative z-10">{quiz.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2 relative z-10">{quiz.description}</p>

                    <div className="flex items-center text-xs text-primary font-medium gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                        {t('quiz.start')} <ArrowRight className="w-3 h-3" />
                    </div>
                </GlassCard>
            ))}
        </div>
    );
}
