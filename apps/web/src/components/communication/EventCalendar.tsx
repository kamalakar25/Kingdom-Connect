import { GlassCard } from '../ui/glass-card';
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';

const MOCK_EVENTS = [
    { id: 1, title: 'Men\'s Breakfast', date: new Date('2025-12-27T08:00:00'), location: 'Fellowship Hall' },
    { id: 2, title: 'Watch Night Service', date: new Date('2025-12-31T22:00:00'), location: 'Main Sanctuary' },
    { id: 3, title: 'Annual General Meeting', date: new Date('2026-01-10T14:00:00'), location: 'Conference Room' }
];

export function EventCalendar() {
    return (
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" /> Upcoming Events
            </h3>
            <div className="space-y-3">
                {MOCK_EVENTS.map((event) => {
                    const date = event.date;
                    return (
                        <GlassCard key={event.id} className="flex gap-4 p-4 group hover:bg-muted/50 transition-all border-border bg-card/60 dark:bg-card/20">
                            <div className="text-center bg-muted/50 rounded-xl px-4 py-3 shrink-0 border border-border group-hover:border-primary/30 transition-colors">
                                <div className="text-[10px] text-primary font-bold uppercase tracking-wider">{date.toLocaleString('default', { month: 'short' })}</div>
                                <div className="text-2xl font-bold text-foreground">{date.getDate()}</div>
                            </div>
                            <div className="flex flex-col justify-center">
                                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{event.title}</h4>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>
                                </div>
                            </div>
                        </GlassCard>
                    );
                })}
            </div>
        </section>
    );
}
