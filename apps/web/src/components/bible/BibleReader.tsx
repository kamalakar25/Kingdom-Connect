import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useBibleVersions, useBibleBooks, useBibleChapters, useBibleChapter } from '../../hooks/useBible';
import { VerseCard } from './VerseCard';
import { BibleNav } from './BibleNav';
import { cn } from '../../lib/utils';

export function BibleReader() {
    const { t } = useTranslation();
    const [selectedVersion, setSelectedVersion] = useState<string>('en-kjv');
    const [selectedBook, setSelectedBook] = useState<string>('genesis');
    const [selectedChapter, setSelectedChapter] = useState<number>(1);

    // UI State for dropdowns (simplified for now as toggles)
    const [isOpen, setIsOpen] = useState<'NONE' | 'VERSION' | 'BOOK' | 'CHAPTER'>('NONE');

    const { data: versions } = useBibleVersions();
    const { data: books } = useBibleBooks(selectedVersion);
    const { data: chapters } = useBibleChapters(selectedBook);

    // Fetch Chapter Data
    const { data: chapterData, isLoading: isLoadingText } = useBibleChapter(
        selectedVersion,
        selectedBook,
        selectedChapter
    );

    // Auto-select defaults
    useEffect(() => {
        if (versions?.length && !selectedVersion) setSelectedVersion(versions[0].id);
    }, [versions]);

    // Helpers to get display names
    const versionDisplay = versions?.find((v: any) => v.id === selectedVersion)?.name.split(' ')[0] || 'KJV';

    // Safety check for book display
    const bookDisplay = books?.find((b: any) => b.id === selectedBook)?.name || selectedBook || 'Genesis';

    return (
        <div className="min-h-screen pb-32 relative">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[130px] rounded-full" />
            </div>

            {/* Navigation Header */}
            <div className="sticky top-4 z-50 mb-8 px-1">
                <BibleNav
                    version={versionDisplay}
                    book={bookDisplay}
                    chapter={selectedChapter}
                    onVersionClick={() => setIsOpen(isOpen === 'VERSION' ? 'NONE' : 'VERSION')}
                    onBookClick={() => setIsOpen(isOpen === 'BOOK' ? 'NONE' : 'BOOK')}
                    onChapterClick={() => setIsOpen(isOpen === 'CHAPTER' ? 'NONE' : 'CHAPTER')}
                />

                {/* Selection Overlay */}
                {isOpen !== 'NONE' && (
                    <div className="absolute top-16 left-0 right-0 mx-4 p-4 bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl animate-in slide-in-from-top-2 z-50 max-h-[60vh] overflow-y-auto">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {isOpen === 'VERSION' && versions?.map((v: any, idx: number) => (
                                <button
                                    key={`${v.id}-${idx}`}
                                    onClick={() => { setSelectedVersion(v.id); setIsOpen('NONE'); }}
                                    className={cn("p-2 rounded text-sm text-left hover:bg-muted transition-colors", selectedVersion === v.id ? "text-primary bg-muted font-bold" : "text-muted-foreground")}
                                >
                                    {v.name}
                                </button>
                            ))}
                            {isOpen === 'BOOK' && books?.map((b: any, idx: number) => (
                                <button
                                    key={`${b.id}-${idx}`}
                                    onClick={() => { setSelectedBook(b.id); setSelectedChapter(1); setIsOpen('NONE'); }}
                                    className={cn("p-2 rounded text-sm text-left hover:bg-muted transition-colors truncate", selectedBook === b.id ? "text-primary bg-muted font-bold" : "text-muted-foreground")}
                                >
                                    {b.name}
                                </button>
                            ))}
                            {isOpen === 'CHAPTER' && chapters?.map((c: any, idx: number) => (
                                <button
                                    key={`ch-${c.chapterNumber}-${idx}`}
                                    onClick={() => { setSelectedChapter(c.chapterNumber); setIsOpen('NONE'); }}
                                    className={cn("p-3 rounded text-sm hover:bg-muted transition-colors", selectedChapter === c.chapterNumber ? "text-primary bg-muted font-bold" : "text-muted-foreground")}
                                >
                                    {c.chapterNumber}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Bible Content */}
            <div className="max-w-2xl mx-auto px-4 space-y-4">
                {isLoadingText ? (
                    // Loading Skeleton
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse border border-border" />
                    ))
                ) : (
                    // Verses List
                    chapterData?.verses?.map((v: any, i: number) => (
                        <VerseCard
                            key={`${v.id}-${i}`} // Composite key to ensure uniqueness and prevent duplicates
                            verseNumber={v.verseNumber}
                            text={v.text}
                        />
                    ))
                )}

                {/* Empty State / Error */}
                {!isLoadingText && !chapterData?.verses && (
                    <div className="text-center py-20 text-muted-foreground">
                        <p>{t('bible.selectPrompt')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
