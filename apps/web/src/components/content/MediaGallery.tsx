import { GlassCard } from '../ui/glass-card';
import { Download } from 'lucide-react';

const MOCK_MEDIA = [
    { id: 1, title: 'Worship Night 2025', url: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800&auto=format&fit=crop' },
    { id: 2, title: 'Christmas Service', url: 'https://images.unsplash.com/photo-1512353087810-25dfcd100962?w=800&auto=format&fit=crop' },
    { id: 3, title: 'Youth Camp Day 1', url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop' },
    { id: 4, title: 'Community Outreach', url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&auto=format&fit=crop' },
    { id: 5, title: 'Baptism Service', url: 'https://images.unsplash.com/photo-1507692049790-de58293a4697?w=800&auto=format&fit=crop' },
    { id: 6, title: 'Sunday School', url: 'https://images.unsplash.com/photo-1502759683299-cdcd6974244f?w=800&auto=format&fit=crop' }
];

export function MediaGallery() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {MOCK_MEDIA.map((item) => (
                <GlassCard key={item.id} className="group relative aspect-square p-0 overflow-hidden cursor-zoom-in">
                    <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white truncate pr-2">{item.title}</span>
                            <button className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-colors">
                                <Download className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </GlassCard>
            ))}
        </div>
    );
}
