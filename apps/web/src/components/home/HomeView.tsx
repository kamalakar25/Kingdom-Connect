import { DailyVerseCard } from './DailyVerseCard';
import { GlassCard } from '../ui/glass-card';
import { Calendar, Users, BookOpen } from 'lucide-react';

interface HomeViewProps {
    onNavigate: (view: string) => void;
}

import { useTranslation } from 'react-i18next';

export function HomeView({ onNavigate }: HomeViewProps) {
    const { t } = useTranslation();
    return (
        <div className="min-h-[110vh] w-full bg-background text-foreground relative overflow-x-hidden pb-32">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Radial Gradient Background - Theme aware */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--muted))_0%,hsl(var(--background))_100%)] dark:bg-[radial-gradient(circle_at_50%_0%,#1e293b_0%,#020617_100%)]" />

                {/* "God Rays" / Light Leak from top left or top enter */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
            </div>

            <div className="relative z-10 max-w-md mx-auto px-4 pt-6 space-y-8">
                {/* Spacer - Increased to account for global header being sticky/overlap prevention if needed, but App.tsx handles layout well. Just a small top spacer. */}
                <div className="h-2" />

                {/* Spacer */}
                <div className="h-4" />

                {/* Daily Verse Section */}
                <DailyVerseCard onDevotionalClick={() => onNavigate('CONTENT')} />

                {/* Spacer */}
                <div className="h-4" />

                {/* This Week Section */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold tracking-widest uppercase text-muted-foreground pl-1">
                        {t('home.thisWeek')}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <ServiceCard
                            icon={<Calendar className="w-6 h-6 text-primary/80" />}
                            title={t('home.sundayService')}
                            time="10:00 AM"
                            onClick={() => onNavigate('LIVE')}
                        />
                        <ServiceCard
                            icon={<Users className="w-6 h-6 text-blue-500 dark:text-blue-400" />}
                            title={t('home.youthGroup')}
                            time="Wed 6:30 PM"
                            onClick={() => onNavigate('CONTENT')}
                        />
                        <ServiceCard
                            icon={<BookOpen className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />}
                            title={t('home.bibleStudy')}
                            time="Thu 7:00 PM"
                            onClick={() => onNavigate('BIBLE')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ServiceCard({ icon, title, time, onClick }: { icon: React.ReactNode, title: string, time: string, onClick?: () => void }) {
    return (
        <GlassCard
            className="flex flex-col p-3 h-28 justify-between hover:bg-muted/50 transition-colors cursor-pointer group border-border bg-card/60 dark:bg-card/20"
            onClick={onClick}
        >
            <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div>
                <p className="text-sm font-bold leading-tight text-foreground mb-1 md:text-xs">{title}</p>
                <p className="text-xs text-muted-foreground md:text-[10px]">{time}</p>
            </div>
        </GlassCard>
    )
}
