import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlatformTabs } from './PlatformTabs';
import { SermonCard } from './SermonCard';
import { VideoPlayerModal } from './VideoPlayerModal';

// Mock Data with specific YouTube IDs (Placeholders used where specific IDs unknown, but structure is ready)
const MOCK_SERMONS = [
    // VIDEO - @CDStephenOfficial (Using generic sermon/worship IDs for demo)
    {
        id: 'v1',
        title: 'What is Gospel of the cross?',
        speaker: 'CD Stephen',
        date: 'Nov 11, 2020',
        thumbnail: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&auto=format&fit=crop',
        duration: '05:51',
        languages: ['Telugu'],
        type: 'VIDEO' as const,
        channel: '@CDStephenOfficial',
        videoId: 'yGpGIhBIQYI' // Placeholder ID
    },
    {
        id: 'v2',
        title: 'క్రీస్తు ఆత్మ మీలో ఉన్నదా?',
        speaker: 'CD Stephen',
        date: 'May 14, 2023',
        thumbnail: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=800&auto=format&fit=crop',
        duration: '1:27:35',
        languages: ['Telugu'],
        type: 'VIDEO' as const,
        channel: '@CDStephenOfficial',
        videoId: 'ZPn1oZbluLY' // Placeholder ID
    },
    {
        id: 'v3',
        title: 'దేవునితో సమాధానం కలిగియున్నావా?',
        speaker: 'CD Stephen',
        date: 'Apr 06, 2023',
        thumbnail: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800&auto=format&fit=crop',
        duration: '1:15:37',
        languages: ['Telugu'],
        type: 'VIDEO' as const,
        channel: '@CDStephenOfficial',
        videoId: 'nmmkNHGHjbc' // Placeholder ID
    },
    // AUDIO - @therestoration1 (Using video IDs played as "Audio")
    {
        id: 'a1',
        title: 'Naavikudu - The Helmsman Ft Princy (Official Video)',
        speaker: 'The Restoration',
        date: 'Aug 10, 2023',
        thumbnail: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&auto=format&fit=crop',
        duration: '7:40',
        languages: ['Telugu'],
        type: 'AUDIO' as const,
        channel: '@therestoration1',
        videoId: '_eqcH2fl6ww' // Placeholder ID
    },
    {
        id: 'a2',
        title: 'En Priyan - Prasad Gopi ft Amarnath',
        speaker: 'The Restoration',
        date: 'Jan 28, 2023',
        thumbnail: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=800&auto=format&fit=crop',
        duration: '7:11',
        languages: ['Malayalam'],
        type: 'AUDIO' as const,
        channel: '@therestoration1',
        videoId: 'PqilazrgbcQ' // Placeholder ID
    }
];

export function SermonList() {
    const { t } = useTranslation(); // Use hook
    const [activeTab, setActiveTab] = useState<'AUDIO' | 'VIDEO'>('VIDEO');
    const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

    const filteredSermons = MOCK_SERMONS.filter(s => s.type === activeTab);

    return (
        <div>
            <PlatformTabs activeTab={activeTab} onChange={setActiveTab} />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSermons.map((sermon) => (
                    <SermonCard
                        key={sermon.id}
                        title={sermon.title}
                        speaker={sermon.speaker}
                        date={sermon.date}
                        thumbnail={sermon.thumbnail}
                        duration={sermon.duration}
                        languages={sermon.languages}
                        type={sermon.type}
                        onClick={() => setPlayingVideoId(sermon.videoId)}
                    />
                ))}
            </div>

            {filteredSermons.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    <p>{t('content.sermons.empty')}</p>
                </div>
            )}

            {/* Video Player Modal */}
            {playingVideoId && (
                <VideoPlayerModal
                    videoId={playingVideoId}
                    onClose={() => setPlayingVideoId(null)}
                />
            )}
        </div>
    );
}
