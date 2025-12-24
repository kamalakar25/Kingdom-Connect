import { useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import hook
import { SermonList } from './SermonList';
import { SundaySchoolView } from './SundaySchoolView';
import { MediaGallery } from './MediaGallery';

type Tab = 'SERMONS' | 'SUNDAY_SCHOOL' | 'MEDIA';

export function ContentDashboard() {
    const { t } = useTranslation(); // Use hook
    const [activeTab, setActiveTab] = useState<Tab>('SERMONS');

    return (
        <section className="space-y-6">
            <header className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">{t('content.hub')}</h2>
            </header>

            {/* Tabs */}
            <div className="border-b border-border flex gap-6">
                <button
                    onClick={() => setActiveTab('SERMONS')}
                    className={`pb-3 text-sm font-medium border-b-2 transition ${activeTab === 'SERMONS' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    {t('content.tabs.sermons')}
                </button>
                <button
                    onClick={() => setActiveTab('SUNDAY_SCHOOL')}
                    className={`pb-3 text-sm font-medium border-b-2 transition ${activeTab === 'SUNDAY_SCHOOL' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    {t('content.tabs.sundaySchool')}
                </button>
                <button
                    onClick={() => setActiveTab('MEDIA')}
                    className={`pb-3 text-sm font-medium border-b-2 transition ${activeTab === 'MEDIA' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    {t('content.tabs.media')}
                </button>
            </div>

            {/* Content Area */}
            <div className="animate-fade-in">
                {activeTab === 'SERMONS' && <SermonList />}
                {activeTab === 'SUNDAY_SCHOOL' && <SundaySchoolView />}
                {activeTab === 'MEDIA' && <MediaGallery />}
            </div>
        </section>
    );
}
