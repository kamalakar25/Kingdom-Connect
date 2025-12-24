import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface VerseCardProps {
    verseNumber: number;
    text: string;
    isHighlighted?: boolean;
    onClick?: () => void;
}

export function VerseCard({ verseNumber, text, isHighlighted, onClick }: VerseCardProps) {
    return (
        <motion.div
            className={cn(
                "relative pl-8 py-3 transition-colors duration-200 hover:bg-muted rounded-lg cursor-pointer group",
                isHighlighted ? "bg-muted" : ""
            )}
            onClick={onClick}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
        >
            <span className="absolute left-0 top-4 text-xs font-bold text-muted-foreground/70 font-sans select-none group-hover:text-primary transition-colors">
                {verseNumber}
            </span>
            <p className={cn(
                "text-xl leading-relaxed text-foreground/90 font-serif tracking-wide",
                isHighlighted ? "text-foreground" : ""
            )}>
                {text}
            </p>
        </motion.div>
    );
}
