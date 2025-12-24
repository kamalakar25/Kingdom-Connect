import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BibleReader } from './components/bible/BibleReader';
import { QuizPage } from './components/quizzes/QuizPage';
import { ContentDashboard } from './components/content/ContentDashboard';
import { CommunicationDashboard } from './components/communication/CommunicationDashboard';
import { LandingPage } from './components/auth/LandingPage';
import { AuthForm } from './components/auth/AuthForm';
import { SettingsPage } from './components/settings/SettingsPage';
import { ThemeProvider } from './components/theme-provider';
import { AuthProvider } from './context/auth-context';
import { Home, BookOpen, Radio, Tv, Gamepad2, Settings } from 'lucide-react';
import { cn } from './lib/utils';
import { Button } from './components/ui/button';
import { HomeView } from './components/home/HomeView';

import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient();
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "PLACEHOLDER";

type View = 'HOME' | 'BIBLE' | 'QUIZZES' | 'CONTENT' | 'LIVE' | 'SETTINGS';
type AuthState = 'LANDING' | 'AUTH' | 'APP';

function App() {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <AuthProvider>
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                    <AppContent />
                </ThemeProvider>
            </AuthProvider>
        </GoogleOAuthProvider>
    );
}

import { useTheme } from './components/theme-provider';
import { useAuth } from './context/auth-context';
import { useTranslation } from 'react-i18next';

// ... (imports remain)

function AppContent() {
    const { user } = useAuth(); // Get user from context
    const { setTheme } = useTheme();
    const { i18n, t } = useTranslation();

    const [authState, setAuthState] = useState<AuthState>('LANDING');
    const [currentView, setCurrentView] = useState<View>('HOME');
    const [isLoading, setIsLoading] = useState(true);

    // Initial Load - Check for Token
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuthState('APP');
        }
        // Simulate a small delay for smooth transition/loading feeling
        setTimeout(() => setIsLoading(false), 500);
    }, []);

    // Global Settings Sync: Listen to user profile changes
    useEffect(() => {
        if (user) {
            // Sync Theme
            if (user.settings?.theme) {
                setTheme(user.settings.theme);
            }
            // Sync Locale
            if (user.locale && i18n.language !== user.locale) {
                i18n.changeLanguage(user.locale);
            }
        }
    }, [user, setTheme, i18n]);

    const handleLoginSuccess = (token: string) => {
        localStorage.setItem('token', token);
        setAuthState('APP');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuthState('LANDING');
        setCurrentView('HOME'); // Reset view
    };

    if (isLoading) {
        return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading...</div>;
    }

    // AUTH FLOW RENDERING
    if (authState === 'LANDING') {
        return <LandingPage onGetStarted={() => setAuthState('AUTH')} />;
    }

    if (authState === 'AUTH') {
        return <AuthForm onSuccess={handleLoginSuccess} onBack={() => setAuthState('LANDING')} />;
    }

    // MAIN APP RENDERING
    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-background text-foreground font-sans pb-24 md:pb-10 relative animate-in fade-in duration-500 transition-colors">
                {/* Header - Always visible */}
                <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
                    <div className="max-w-5xl mx-auto px-4 h-16 flex justify-between items-center">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('HOME')}>
                            {/* <span className="text-2xl">✝️</span> */}
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Kingdom Connect</h1>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("text-muted-foreground hover:text-foreground", currentView === 'SETTINGS' && "bg-accent text-accent-foreground")}
                            onClick={() => setCurrentView('SETTINGS')}
                        >
                            <Settings className="h-5 w-5" />
                        </Button>
                    </div>
                </header>

                {/* Main Content */}
                <main className={cn(
                    "space-y-8 animate-in fade-in duration-500",
                    currentView === 'HOME' ? "w-full p-0" : "max-w-5xl mx-auto p-4 md:p-6"
                )}>
                    {currentView === 'HOME' && (
                        <HomeView
                            onNavigate={(v) => setCurrentView(v as View)}
                        />
                    )}

                    {currentView === 'BIBLE' && <BibleReader />}
                    {currentView === 'QUIZZES' && <QuizPage />}
                    {currentView === 'CONTENT' && <ContentDashboard />}
                    {currentView === 'LIVE' && <CommunicationDashboard />}

                    {currentView === 'SETTINGS' && (
                        <SettingsPage
                            onLogout={handleLogout}
                        />
                    )}
                </main>

                {/* Floating Bottom Navigation */}
                {currentView !== 'SETTINGS' && (
                    <nav className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
                        <div className="max-w-md mx-auto pointer-events-auto">
                            <div className="bg-card/90 backdrop-blur-lg border border-border rounded-2xl shadow-2xl p-2 flex justify-around items-center">
                                <NavBtn
                                    icon={<Home className="h-5 w-5" />}
                                    label={t('nav.home')}
                                    active={currentView === 'HOME'}
                                    onClick={() => setCurrentView('HOME')}
                                />
                                <NavBtn
                                    icon={<BookOpen className="h-5 w-5" />}
                                    label={t('nav.bible')}
                                    active={currentView === 'BIBLE'}
                                    onClick={() => setCurrentView('BIBLE')}
                                />
                                <div className="w-px h-8 bg-border mx-1 hidden md:block" />
                                <NavBtn
                                    icon={<Radio className="h-5 w-5" />}
                                    label={t('nav.live')}
                                    active={currentView === 'LIVE'}
                                    onClick={() => setCurrentView('LIVE')}
                                />
                                <NavBtn
                                    icon={<Tv className="h-5 w-5" />}
                                    label={t('nav.media')}
                                    active={currentView === 'CONTENT'}
                                    onClick={() => setCurrentView('CONTENT')}
                                />
                                <NavBtn
                                    icon={<Gamepad2 className="h-5 w-5" />}
                                    label={t('nav.quiz')}
                                    active={currentView === 'QUIZZES'}
                                    onClick={() => setCurrentView('QUIZZES')}
                                />
                            </div>
                        </div>
                    </nav>
                )}
            </div>
        </QueryClientProvider>
    )
}

function NavBtn({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200",
                active
                    ? "text-primary-foreground bg-primary shadow-lg shadow-primary/25 scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
        >
            <div className={cn("mb-1", active && "animate-pulse")}>
                {icon}
            </div>
            <span className="text-[10px] font-medium tracking-wide">{label}</span>
        </button>
    )
}

export default App
