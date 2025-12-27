import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { BibleReader } from './components/bible/BibleReader';
import { QuizPage } from './components/quizzes/QuizPage';
import { ContentDashboard } from './components/content/ContentDashboard';
import { CommunicationDashboard } from './components/communication/CommunicationDashboard';
import { LandingPage } from './components/auth/LandingPage';
import { AuthForm } from './components/auth/AuthForm';
import { ResetPasswordPage } from './components/auth/ResetPasswordPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { ThemeProvider, useTheme } from './components/theme-provider';
import { AuthProvider, useAuth } from './context/auth-context';
import { Home, BookOpen, Radio, Tv, Gamepad2, Settings } from 'lucide-react';
import { cn } from './lib/utils';
import { Button } from './components/ui/button';
import { HomeView } from './components/home/HomeView';
import { BackButtonHandler } from './components/navigation/BackButtonHandler';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';

const queryClient = new QueryClient();
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "PLACEHOLDER";

function App() {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <BrowserRouter>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                            <BackButtonHandler />
                            <AppContent />
                        </ThemeProvider>
                    </AuthProvider>
                </QueryClientProvider>
            </BrowserRouter>
        </GoogleOAuthProvider>
    );
}

function AppContent() {
    const { user, isLoading: authLoading } = useAuth();
    const { setTheme } = useTheme();
    const { i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);

    // Initial Load Simulation
    useEffect(() => {
        // Just for smooth feeling, or wait for auth
        if (!authLoading) {
            setTimeout(() => setIsLoading(false), 500);
        }
    }, [authLoading]);

    // Global Settings Sync
    useEffect(() => {
        if (user) {
            if (user.settings?.theme) setTheme(user.settings.theme);
            if (user.locale && i18n.language !== user.locale) i18n.changeLanguage(user.locale);
        }
    }, [user, setTheme, i18n]);

    if (authLoading || isLoading) {
        return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading...</div>;
    }

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/landing" element={!user ? <LandingPageWrapper /> : <Navigate to="/" />} />
            <Route path="/auth" element={!user ? <AuthFormWrapper /> : <Navigate to="/" />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected App Routes */}
            <Route element={user ? <AppShell /> : <Navigate to="/landing" />}>
                <Route path="/" element={<HomeViewWrapper />} />
                <Route path="/bible" element={<BibleReader />} />
                <Route path="/quizzes" element={<QuizPage />} />
                <Route path="/content" element={<ContentDashboard />} />
                <Route path="/live" element={<CommunicationDashboard />} />
                <Route path="/settings" element={<SettingsPageWrapper />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

// Wrapper to inject navigation props or handle specific layout needs
const HomeViewWrapper = () => {
    const navigate = useNavigate();
    // HomeView expects a prop, but with Router we might just want it to link?
    // Let's adapt HomeView later or pass a navigator
    return <HomeView onNavigate={(view) => {
        // Map legacy View string to routes
        const routes: Record<string, string> = {
            'HOME': '/',
            'BIBLE': '/bible',
            'QUIZZES': '/quizzes',
            'CONTENT': '/content',
            'LIVE': '/live',
            'SETTINGS': '/settings'
        };
        navigate(routes[view] || '/');
    }} />;
};

const LandingPageWrapper = () => {
    const navigate = useNavigate();
    return <LandingPage onGetStarted={() => navigate('/auth')} />;
};

const AuthFormWrapper = () => {
    const navigate = useNavigate();
    return <AuthForm onSuccess={() => navigate('/')} onBack={() => navigate('/landing')} />;
};

const SettingsPageWrapper = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    return <SettingsPage onLogout={() => {
        logout();
        navigate('/landing');
    }} />;
};

function AppShell() {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    // Hide bottom nav on specific routes if needed (e.g. settings? user asked for proper navigations)
    // existing design hid it on settings.
    const showBottomNav = location.pathname !== '/settings';
    const currentPath = location.pathname;

    return (
        <div className="min-h-screen bg-background text-foreground font-sans pb-24 md:pb-10 relative animate-in fade-in duration-500 transition-colors pb-[env(safe-area-inset-bottom)]">
            {/* Header */}
            <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Kingdom Connect</h1>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("text-muted-foreground hover:text-foreground", currentPath === '/settings' && "bg-accent text-accent-foreground")}
                        onClick={() => navigate('/settings')}
                    >
                        <Settings className="h-5 w-5" />
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className={cn(
                "space-y-8 animate-in fade-in duration-500",
                currentPath === '/' ? "w-full p-0" : "max-w-5xl mx-auto p-4 md:p-6"
            )}>
                <Outlet />
            </main>

            {/* Bottom Nav */}
            {showBottomNav && (
                <nav className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
                    <div className="max-w-md mx-auto pointer-events-auto">
                        <div className="bg-card/90 backdrop-blur-lg border border-border rounded-2xl shadow-2xl p-2 flex justify-around items-center">
                            <NavBtn
                                icon={<Home className="h-5 w-5" />}
                                label={t('nav.home')}
                                active={currentPath === '/'}
                                onClick={() => navigate('/')}
                            />
                            <NavBtn
                                icon={<BookOpen className="h-5 w-5" />}
                                label={t('nav.bible')}
                                active={currentPath === '/bible'}
                                onClick={() => navigate('/bible')}
                            />
                            <div className="w-px h-8 bg-border mx-1 hidden md:block" />
                            <NavBtn
                                icon={<Radio className="h-5 w-5" />}
                                label={t('nav.live')}
                                active={currentPath === '/live'}
                                onClick={() => navigate('/live')}
                            />
                            <NavBtn
                                icon={<Tv className="h-5 w-5" />}
                                label={t('nav.media')}
                                active={currentPath === '/content'}
                                onClick={() => navigate('/content')}
                            />
                            <NavBtn
                                icon={<Gamepad2 className="h-5 w-5" />}
                                label={t('nav.quiz')}
                                active={currentPath === '/quizzes'}
                                onClick={() => navigate('/quizzes')}
                            />
                        </div>
                    </div>
                </nav>
            )}
        </div>
    );
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

export default App;
