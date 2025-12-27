import { Globe, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface BibleNavProps {
    version: string;
    book: string;
    chapter: number;
    onVersionClick: () => void;
    onBookClick: () => void;
    onChapterClick: () => void;
}

export function BibleNav({ version, book, chapter, onVersionClick, onBookClick, onChapterClick }: BibleNavProps) {
    return (
        <nav className="flex items-center gap-1 p-1 rounded-full bg-background/80 backdrop-blur-xl border border-border w-fit max-w-[95vw] mx-auto sticky top-4 z-50 shadow-2xl overflow-x-auto no-scrollbar">
            {/* Version Pill */}
            <NavPill onClick={onVersionClick} className="pl-3 pr-4 border-r border-border rounded-l-full hover:bg-muted">
                <Globe className="w-4 h-4 text-primary mr-2" />
                <span className="text-sm font-medium text-foreground/80 uppercase tracking-wide">
                    {version}
                </span>
            </NavPill>

            {/* Book Pill */}
            <NavPill onClick={onBookClick} className="px-3 hover:bg-muted">
                <span className="text-sm font-medium text-foreground/90 capitalize">{book}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground ml-1.5" />
            </NavPill>

            {/* Chapter Pill */}
            <NavPill onClick={onChapterClick} className="pl-3 pr-4 rounded-r-full hover:bg-muted">
                <span className="text-sm font-medium text-foreground/90">{chapter}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground ml-1.5" />
            </NavPill>
        </nav>
    );
}

function NavPill({ children, onClick, className }: { children: React.ReactNode; onClick: () => void; className?: string }) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={cn(
                "flex items-center h-10 transition-colors focus:outline-none",
                className
            )}
        >
            {children}
        </motion.button>
    );
}
