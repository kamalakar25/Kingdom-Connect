import { useState } from 'react';
import { GlassCard } from '../ui/glass-card';
import { Radio, Youtube, Podcast } from 'lucide-react';
import { cn } from '../../lib/utils';

// Static Configuration
const STATIC_CHANNELS = [
    { id: 'UC_x5XG1OV2P6uZZ5FSM9Ttw', name: 'Main Sanctuary', type: 'YOUTUBE' },
    { id: 'mixlr_channel', name: 'Church Radio', type: 'MIXLR' }
];

export function LiveStreamTabs() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <section className="space-y-6 animate-in fade-in duration-700 delay-100">
            <header className="flex items-center gap-3">
                <div className="relative">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                </div>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">Live Service</h2>
            </header>

            <div className="flex gap-2 p-1 bg-muted/50 backdrop-blur-xl rounded-2xl border border-border w-fit">
                {STATIC_CHANNELS.map((tab, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveTab(idx)}
                        className={cn(
                            "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2",
                            activeTab === idx
                                ? "bg-red-500/20 text-red-500 dark:text-red-300 shadow-lg shadow-red-500/10 border border-red-500/20"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                    >
                        {tab.type === 'YOUTUBE' ? <Youtube className="w-4 h-4" /> : <Podcast className="w-4 h-4" />}
                        {tab.name}
                    </button>
                ))}
            </div>

            <GlassCard className="aspect-video bg-black/40 border-border p-0 overflow-hidden relative group">
                {/* Simulated Player UI */}
                <div className="absolute inset-0 flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-50">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                </div>

                <div className="relative z-10 text-center p-8 space-y-4">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto border border-white/20 backdrop-blur-md group-hover:scale-110 transition-transform duration-500 cursor-pointer shadow-2xl">
                        {STATIC_CHANNELS[activeTab].type === 'YOUTUBE' ? (
                            <Youtube className="w-8 h-8 text-white" />
                        ) : (
                            <Radio className="w-8 h-8 text-white" />
                        )}
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white mb-2">{STATIC_CHANNELS[activeTab].name}</p>
                        <p className="text-white/60">Stream is currently offline</p>
                    </div>
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs text-white/50">
                        Next Service: Sunday 10:00 AM
                    </div>
                </div>
            </GlassCard>
        </section>
    );
}
