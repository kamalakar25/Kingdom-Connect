import { AnnouncementBoard } from './AnnouncementBoard';
import { EventCalendar } from './EventCalendar';
import { LiveStreamTabs } from './LiveStreamTabs';

export function CommunicationDashboard() {
    return (
        <div className="space-y-12 animate-fade-in">
            {/* Live Section at Top */}
            <LiveStreamTabs />

            <div className="bg-muted/50 p-4 rounded-lg flex items-center justify-between border border-border">
                <div className="flex items-center gap-3">
                    <span className="text-xl">🔔</span>
                    <div>
                        <h4 className="text-sm font-semibold text-foreground">Notifications</h4>
                        <p className="text-xs text-muted-foreground">Stay updated with latest announcements.</p>
                    </div>
                </div>
                <button className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 rounded transition">
                    Enable Push
                </button>
            </div>

            <hr className="border-border" />

            <AnnouncementBoard />
            <EventCalendar />
        </div>
    );
}
