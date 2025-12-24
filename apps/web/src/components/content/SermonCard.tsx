import { GlassCard } from '../ui/glass-card';
import { Play, Mic } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SermonCardProps {
    title: string;
    speaker: string;
    date: string;
    thumbnail: string;
    duration: string;
    languages: string[];
    type: 'AUDIO' | 'VIDEO';
    onClick?: () => void;
}

export function SermonCard({ title, speaker, date, thumbnail, duration, languages, type, onClick }: SermonCardProps) {
    return (
        <GlassCard
            className="group overflow-hidden hover:bg-muted/50 transition-colors cursor-pointer p-0 gap-0 border-border bg-card/60 dark:bg-card/20"
            onClick={onClick}
        >
            {/* Thumbnail Section */}
            <div className="relative aspect-video w-full overflow-hidden">
                <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        {type === 'VIDEO' ? <Play className="w-5 h-5 text-white fill-white" /> : <Mic className="w-5 h-5 text-white" />}
                    </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] font-medium text-white/90">
                    {duration}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-3">
                <div>
                    <h3 className="text-base font-bold text-foreground leading-tight line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        {speaker} • <span className="text-muted-foreground/60">{date}</span>
                    </p>
                </div>

                {/* Tags */}
                <div className="flex gap-2">
                    {languages.map(lang => (
                        <span
                            key={lang}
                            className={cn(
                                "text-[10px] px-2 py-0.5 rounded-full border border-border",
                                lang.toLowerCase() === 'english' ? "bg-blue-500/10 text-blue-500 dark:text-blue-200" :
                                    lang.toLowerCase() === 'telugu' ? "bg-orange-500/10 text-orange-500 dark:text-orange-200" :
                                        "bg-muted text-muted-foreground"
                            )}
                        >
                            {lang}
                        </span>
                    ))}
                </div>
            </div>
        </GlassCard>
    );
}
