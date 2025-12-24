import { GlassCard } from '../ui/glass-card';
import { Bell, Calendar } from 'lucide-react';

const MOCK_ANNOUNCEMENTS = [
    {
        id: 1,
        title: 'Christmas Eve Service',
        body: 'Join us for a special candlelight service this December 24th at 6:00 PM. Friends and family welcome!',
        date: 'Dec 24, 2025'
    },
    {
        id: 2,
        title: 'New Year Prayer Meet',
        body: 'Start the year with prayer and fasting. We will be gathering at the main hall.',
        date: 'Dec 31, 2025'
    },
    {
        id: 3,
        title: 'Youth Retreat Registration',
        body: 'Early bird registration covers t-shirt and meals. Sign up by next Sunday.',
        date: 'Jan 05, 2026'
    }
];

export function AnnouncementBoard() {
    return (
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" /> Announcements
            </h3>
            <div className="grid gap-4">
                {MOCK_ANNOUNCEMENTS.map((item) => (
                    <GlassCard key={item.id} className="p-5 border-l-4 border-l-primary relative overflow-hidden group bg-card/60 dark:bg-card/20 border-border">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Bell className="w-16 h-16 -rotate-12 text-primary" />
                        </div>
                        <div className="relative z-10">
                            <h4 className="font-bold text-foreground text-lg mb-2">{item.title}</h4>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-3">{item.body}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground/60 font-medium">
                                <Calendar className="w-3 h-3" />
                                <span>{item.date}</span>
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </section>
    );
}
