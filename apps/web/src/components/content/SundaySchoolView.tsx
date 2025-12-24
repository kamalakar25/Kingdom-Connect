import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../ui/glass-card';
import { Download, FileText, Video } from 'lucide-react';
import { cn } from '../../lib/utils';

export function SundaySchoolView() {
    const { t } = useTranslation();
    const [selectedClass, setSelectedClass] = useState(1);

    const CLASSES = [
        { id: 1, name: t('content.sundaySchool.classes.beginner'), age: t('content.sundaySchool.age', { range: '3-5' }) },
        { id: 2, name: t('content.sundaySchool.classes.primary'), age: t('content.sundaySchool.age', { range: '6-9' }) },
        { id: 3, name: t('content.sundaySchool.classes.junior'), age: t('content.sundaySchool.age', { range: '10-12' }) }
    ];

    const MOCK_RESOURCES = [
        { id: 1, title: 'Creation Story Coloring Page', type: 'PDF', date: 'Dec 20, 2025', classId: 1 },
        { id: 2, title: 'Noah\'s Ark Video Lesson', type: 'VIDEO', date: 'Dec 13, 2025', classId: 1 },
        { id: 3, title: 'Bible Hero Cards: David', type: 'PDF', date: 'Dec 06, 2025', classId: 2 },
        { id: 4, title: 'Ten Commandments Worksheet', type: 'PDF', date: 'Dec 20, 2025', classId: 3 },
        { id: 5, title: 'Jesus Feeds the 5000', type: 'VIDEO', date: 'Dec 13, 2025', classId: 2 }
    ];

    const resources = MOCK_RESOURCES.filter(r => r.classId === selectedClass);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Class Selection */}
            <div className="flex justify-center gap-2 overflow-x-auto py-2">
                <div className="bg-muted/50 backdrop-blur-xl p-1.5 rounded-2xl border border-border flex gap-1">
                    {CLASSES.map(cls => (
                        <button
                            key={cls.id}
                            onClick={() => setSelectedClass(cls.id)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                                selectedClass === cls.id
                                    ? "bg-primary/20 text-primary shadow-lg shadow-primary/10 border border-primary/20"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                        >
                            <span className="block">{cls.name}</span>
                            <span className="text-[10px] opacity-60 font-normal">{cls.age}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Resources Grid */}
            <div className="grid gap-3">
                {resources.map((res) => (
                    <GlassCard key={res.id} className="flex items-center gap-4 p-4 group hover:bg-muted/50 transition-colors cursor-pointer border-border bg-card/60 dark:bg-card/20 text-foreground">
                        <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center border border-border shadow-inner",
                            res.type === 'PDF' ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
                        )}>
                            {res.type === 'PDF' ? <FileText className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">{res.title}</h4>
                            <p className="text-xs text-muted-foreground">{res.date} • {t('content.sundaySchool.lesson', { type: res.type })}</p>
                        </div>

                        <button className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                            <Download className="w-4 h-4" />
                        </button>
                    </GlassCard>
                ))}

                {resources.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>{t('content.sundaySchool.empty')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
