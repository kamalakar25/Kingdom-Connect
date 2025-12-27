import { useTranslation } from 'react-i18next';
import { useDailyVerse } from '../../hooks/useDailyVerse';
import { GlassCard } from '../ui/glass-card';
import { Play } from 'lucide-react';
import { GlowingButton } from '../ui/aceternity-button';

interface DailyVerseCardProps {
    onDevotionalClick?: () => void;
}

export function DailyVerseCard({ onDevotionalClick }: DailyVerseCardProps) {
    const { i18n } = useTranslation();
    const { data: verse, isLoading, error } = useDailyVerse(i18n.language);

    if (isLoading) return <div className="w-full h-80 rounded-2xl bg-white/5 animate-pulse" />;
    if (error || !verse) return <div className="text-red-400 text-center">Failed to load verse</div>;

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-8 relative z-10">
            {/* Main Glass Card */}
            <GlassCard gradient className="w-full min-h-[400px] flex flex-col justify-center items-center p-8 text-center relative group border-border bg-card/60 dark:bg-card/20">
                {/* Cross Icon */}
                {/* <div className="mb-6 opacity-80">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground/80">
                        <path d="M12 4V20M8 8H16" />
                    </svg>
                </div> */}

                {/* Text Content */}
                <div className="space-y-6 relative z-10">
                    <p className="text-xs tracking-[0.2em] font-medium text-muted-foreground uppercase">
                        Daily Verse:
                    </p>
                    <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-4">&quot;{verse.text}&quot;</p>
                    <p className="text-sm font-medium tracking-widest text-primary uppercase pt-2">
                        {verse.reference}
                    </p>
                </div>

                {/* Decorative Floral Element (SVG) - Bottom Right */}
                <div className="absolute bottom-0 right-0 w-40 h-40 opacity-40 pointer-events-none text-primary/50">
                    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
                        <path d="M50 100C50 100 60 70 80 60C100 50 100 20 100 20" strokeLinecap="round" />
                        <path d="M50 100C50 100 80 90 90 70" strokeLinecap="round" />
                        <path d="M50 100C50 100 30 80 40 60C50 40 80 40 90 30" strokeLinecap="round" />
                        {/* Add more whimsical curves here for a flower effect */}
                        <circle cx="90" cy="25" r="2" fill="currentColor" />
                        <circle cx="85" cy="40" r="1.5" fill="currentColor" />
                    </svg>
                </div>
            </GlassCard>

            {/* Devotional Button */}
            <GlowingButton onClick={onDevotionalClick} className="w-full md:w-auto min-w-[240px] justify-center text-lg shadow-[0_0_40px_rgba(59,130,246,0.3)]">
                <Play className="w-5 h-5 fill-current" />
                3-min Devotional
            </GlowingButton>
        </div>
    );
}
