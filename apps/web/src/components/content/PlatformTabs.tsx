import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface PlatformTabsProps {
    activeTab: 'AUDIO' | 'VIDEO';
    onChange: (tab: 'AUDIO' | 'VIDEO') => void;
}

export function PlatformTabs({ activeTab, onChange }: PlatformTabsProps) {
    return (
        <div className="flex justify-center mb-8">
            <div className="bg-muted/50 backdrop-blur-md p-1 rounded-full border border-border flex relative">
                <Tab
                    isActive={activeTab === 'AUDIO'}
                    label="Audio"
                    onClick={() => onChange('AUDIO')}
                />
                <Tab
                    isActive={activeTab === 'VIDEO'}
                    label="Video"
                    onClick={() => onChange('VIDEO')}
                />
            </div>
        </div>
    );
}

function Tab({ isActive, label, onClick }: { isActive: boolean; label: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "relative px-8 py-2 rounded-full text-sm font-medium transition-colors z-10",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
        >
            {isActive && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-background border border-border rounded-full shadow-sm"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
            <span className="relative z-10">{label}</span>
        </button>
    );
}
