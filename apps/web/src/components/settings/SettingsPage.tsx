import { useState, useEffect } from 'react';
import { useTheme } from '../theme-provider';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { GlassCard } from '../ui/glass-card';
import { Switch } from '../ui/switch';
import {
    User, Moon, Sun, Bell, Globe, Shield, HelpCircle,
    LogOut, ChevronRight, Laptop, Smartphone, Mail,
    Calendar, Tv
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/auth-context';
import { apiClient } from '../../utils/api';
import { useTranslation } from 'react-i18next';

export function SettingsPage({ onLogout }: { onLogout: () => void }) {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();
    const { user, updateProfile, logout } = useAuth();
    const [activeSection, setActiveSection] = useState<'account' | 'appearance' | 'notifications' | 'content' | 'about'>('account');
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(user?.displayName || '');
    const [isLoading, setIsLoading] = useState(false);

    // Initialize notifications from user settings or defaults
    const [notifications, setNotifications] = useState(user?.settings?.notifications || {
        push: true,
        email: false,
        sermons: true,
        events: true
    });

    // Update local state if user settings change (e.g. from another device/session refresh)
    useEffect(() => {
        if (user?.settings?.notifications) {
            setNotifications(user.settings.notifications);
        }
    }, [user?.settings]);

    const handleUpdateProfile = async () => {
        setIsLoading(true);
        try {
            await updateProfile({ displayName: newName });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNotificationChange = async (key: string, checked: boolean) => {
        const newNotifications = { ...notifications, [key]: checked };
        setNotifications(newNotifications); // Optimistic update

        if (key === 'push' && checked) {
            // Request permission and subscribe
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                try {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                        // Fetch VAPID key
                        const keyRes = await apiClient('/notifications/vapid-key');
                        if (!keyRes.success || !keyRes.publicKey) {
                            throw new Error('Failed to get VAPID key');
                        }

                        const registration = await navigator.serviceWorker.ready;
                        const subscription = await registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: keyRes.publicKey
                        });

                        // Send subscription to backend
                        await apiClient('/notifications/subscribe', {
                            method: 'POST',
                            body: JSON.stringify(subscription)
                        });
                        console.log(t('settings.notifications.subscribed'));
                    }
                } catch (error) {
                    console.error('Failed to subscribe to push notifications', error);
                }
            }
        }

        try {
            await updateProfile({
                settings: {
                    ...user?.settings,
                    notifications: newNotifications
                }
            });
        } catch (error) {
            console.error("Failed to update notification settings", error);
            setNotifications(notifications); // Revert on error
        }
    };

    const handleThemeChange = async (t: 'light' | 'dark' | 'system') => {
        setTheme(t);
        try {
            await updateProfile({
                settings: {
                    ...user?.settings,
                    theme: t
                }
            });
        } catch (error) {
            console.error("Failed to save theme preference", error);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm(t('settings.account.deleteAccount.confirm'))) {
            try {
                const res = await apiClient('/users/me', { method: 'DELETE' });
                if (res.success) {
                    logout();
                    onLogout(); // Ensure parent knows we logged out
                } else {
                    alert(t('settings.account.deleteAccount.error') + res.message);
                }
            } catch (error) {
                console.error("Failed to delete account", error);
                alert(t('settings.account.deleteAccount.genericError'));
            }
        }
    };

    const SectionButton = ({ id, icon: Icon, label }: { id: typeof activeSection, icon: any, label: string }) => (
        <button
            onClick={() => setActiveSection(id)}
            className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                activeSection === id
                    ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
        >
            <Icon className="w-4 h-4" />
            {label}
            <ChevronRight className={cn("ml-auto w-4 h-4 transition-transform", activeSection === id ? "rotate-90 opacity-100" : "opacity-0")} />
        </button>
    );

    if (!user) return null;

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row gap-8">

                {/* Sidebar */}
                <div className="w-full md:w-64 space-y-6 shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold mb-2 text-foreground">{t('settings.title')}</h2>
                        <p className="text-muted-foreground text-sm">{t('settings.subtitle')}</p>
                    </div>

                    <div className="space-y-1">
                        <SectionButton id="account" icon={User} label={t('settings.menu.account')} />
                        <SectionButton id="appearance" icon={Moon} label={t('settings.menu.appearance')} />
                        <SectionButton id="notifications" icon={Bell} label={t('settings.menu.notifications')} />
                        <SectionButton id="content" icon={Globe} label={t('settings.menu.content')} />
                        <SectionButton id="about" icon={HelpCircle} label={t('settings.menu.about')} />
                    </div>

                    <div className="pt-6 border-t border-border">
                        <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={onLogout}>
                            <LogOut className="w-4 h-4 mr-2" />
                            {t('logout')}
                        </Button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                    <GlassCard className="p-6 md:p-8 min-h-[500px]">
                        <AnimatePresence mode="wait">
                            {activeSection === 'account' && (
                                <motion.div
                                    key="account"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="relative group cursor-pointer">
                                            <img src={user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop"} alt={user.displayName} className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/10" />
                                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-xs text-white">{t('settings.account.changeAvatar')}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">{user.displayName || 'User'}</h3>
                                            <p className="text-muted-foreground">{user.email}</p>
                                            <span className="inline-block mt-2 px-2 py-0.5 bg-primary/20 text-primary text-[10px] rounded uppercase font-bold tracking-wider">{user.role} {t('settings.account.plan')}</span>
                                        </div>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>{t('settings.account.fullName')}</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    value={newName}
                                                    onChange={(e) => {
                                                        setNewName(e.target.value);
                                                        setIsEditing(true);
                                                    }}
                                                    placeholder={t('settings.account.namePlaceholder')}
                                                />
                                                {isEditing && (
                                                    <Button onClick={handleUpdateProfile} disabled={isLoading} size="sm">
                                                        {isLoading ? t('settings.account.saving') : t('settings.account.save')}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t('settings.account.email')}</Label>
                                            <Input defaultValue={user.email} disabled className="opacity-70" />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-border">
                                        <h4 className="font-semibold mb-4 text-red-500 flex items-center gap-2">
                                            <Shield className="w-4 h-4" /> {t('settings.account.deleteAccount.title')}
                                        </h4>
                                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                                            <div className="text-sm">
                                                <p className="font-medium text-red-200">{t('settings.account.deleteAccount.label')}</p>
                                                <p className="text-red-200/60">{t('settings.account.deleteAccount.description')}</p>
                                            </div>
                                            <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>{t('settings.account.deleteAccount.button')}</Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeSection === 'appearance' && (
                                <motion.div
                                    key="appearance"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <h3 className="text-lg font-bold mb-1">{t('settings.appearance.title')}</h3>
                                        <p className="text-muted-foreground text-sm mb-6">{t('settings.appearance.description')}</p>

                                        <div className="grid grid-cols-3 gap-4">
                                            {[
                                                { id: 'light', label: t('settings.appearance.light') },
                                                { id: 'dark', label: t('settings.appearance.dark') },
                                                { id: 'system', label: t('settings.appearance.system') }
                                            ].map((themeOption) => (
                                                <button
                                                    key={themeOption.id}
                                                    onClick={() => handleThemeChange(themeOption.id as any)}
                                                    className={cn(
                                                        "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all",
                                                        theme === themeOption.id
                                                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                                            : "border-transparent bg-secondary/50 hover:bg-secondary"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-full aspect-video rounded-lg flex items-center justify-center bg-gradient-to-br",
                                                        themeOption.id === 'light' ? "from-gray-100 to-white text-slate-800" :
                                                            themeOption.id === 'dark' ? "from-slate-900 to-black text-white" :
                                                                "from-slate-800 to-slate-200 text-slate-400"
                                                    )}>
                                                        {themeOption.id === 'light' ? <Sun className="w-6 h-6" /> :
                                                            themeOption.id === 'dark' ? <Moon className="w-6 h-6" /> :
                                                                <Laptop className="w-6 h-6" />}
                                                    </div>
                                                    <span className="capitalize font-medium">{themeOption.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeSection === 'notifications' && (
                                <motion.div
                                    key="notifications"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <h3 className="text-lg font-bold mb-4">{t('settings.notifications.title')}</h3>
                                        <div className="space-y-4">
                                            {[
                                                { id: 'push', label: t('settings.notifications.push'), icon: Smartphone },
                                                { id: 'email', label: t('settings.notifications.email'), icon: Mail },
                                                { id: 'sermons', label: t('settings.notifications.sermons'), icon: Tv },
                                                { id: 'events', label: t('settings.notifications.events'), icon: Calendar }
                                            ].map((item) => (
                                                <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/20">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                                                            <item.icon className="w-4 h-4" />
                                                        </div>
                                                        <span className="font-medium">{item.label}</span>
                                                    </div>
                                                    <Switch
                                                        checked={notifications[item.id as keyof typeof notifications]}
                                                        onCheckedChange={(checked) => handleNotificationChange(item.id, checked)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            {activeSection === 'content' && (
                                <motion.div
                                    key="content"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <h3 className="text-lg font-bold mb-4">{t('settings.content.title')}</h3>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>{t('settings.content.languageLabel')}</Label>
                                                <select
                                                    className="w-full p-2 rounded-md border bg-background"
                                                    value={user.locale}
                                                    onChange={async (e) => {
                                                        const newLocale = e.target.value;
                                                        try {
                                                            await updateProfile({ locale: newLocale });
                                                            // Global sync in App.tsx will handle the actual language change
                                                        } catch (error) {
                                                            console.error("Failed to update language", error);
                                                        }
                                                    }}
                                                >
                                                    <option value="en">English</option>
                                                    <option value="hi">Hindi (हिंदी)</option>
                                                    <option value="te">Telugu (తెలుగు)</option>
                                                </select>
                                                <p className="text-sm text-muted-foreground">{t('settings.content.languageDescription')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeSection === 'about' && (
                                <motion.div
                                    key="about"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <h3 className="text-lg font-bold mb-4">{t('settings.about.title')}</h3>
                                        <div className="p-4 rounded-xl bg-secondary/20 space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                                    <HelpCircle className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold">Kingdom Connect</h4>
                                                    <p className="text-sm text-muted-foreground">{t('settings.about.version')} 1.0.0</p>
                                                </div>
                                            </div>
                                            <div className="space-y-2 pt-4 border-t border-border">
                                                <Button variant="outline" className="w-full justify-start">
                                                    <Mail className="w-4 h-4 mr-2" /> {t('settings.about.contact')}
                                                </Button>
                                                <Button variant="outline" className="w-full justify-start">
                                                    <Globe className="w-4 h-4 mr-2" /> {t('settings.about.website')}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
