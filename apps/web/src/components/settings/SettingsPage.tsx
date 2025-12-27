import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { nameSchema, passwordSchema } from '../../lib/schemas';
import { useTheme } from '../theme-provider';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { GlassCard } from '../ui/glass-card';
import { Switch } from '../ui/switch';
import {
    User, Moon, Sun, Bell, Globe, Shield, HelpCircle,
    LogOut, ChevronRight, Laptop, Smartphone, Mail,
    Calendar, Tv, Upload, Lock, KeyRound
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ImageCropper } from '../ui/image-cropper';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
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
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [cropperOpen, setCropperOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Security State
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');

    // --- Validation Schemas ---
    const profileSchema = z.object({
        name: nameSchema(t)
    });

    const resetPasswordSchema = z.object({
        oldPassword: z.string().min(1, t('settings.errors.currentPasswordRequired')),
        newPassword: passwordSchema(t),
        confirmPassword: z.string()
    }).refine(data => data.newPassword === data.confirmPassword, {
        message: t('auth.errors.passwordMatch'),
        path: ["confirmPassword"]
    });

    type ProfileFormValues = z.infer<typeof profileSchema>;
    type ChangePasswordFormValues = z.infer<typeof resetPasswordSchema>;

    const profileForm = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: { name: user?.displayName || '' }
    });

    const passwordForm = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        mode: 'onChange'
    });

    const handleUpdateProfile = async (data: ProfileFormValues) => {
        setIsLoading(true);
        try {
            await updateProfile({ displayName: data.name });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async (data: ChangePasswordFormValues) => {
        try {
            const res = await apiClient('/auth/change-password', {
                method: 'POST',
                body: JSON.stringify({
                    oldPassword: data.oldPassword,
                    newPassword: data.newPassword
                })
            });

            if (res.success) {
                alert(t('settings.passwordChanged'));
                setChangePasswordOpen(false);
                passwordForm.reset();
            } else {
                alert(res.message || t('settings.passwordChangeFailed'));
            }
        } catch (error) {
            console.error(error);
            alert(t('settings.passwordChangeFailed'));
        }
    };

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


    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setSelectedImage(reader.result as string);
            setCropperOpen(true);
        };
        reader.readAsDataURL(file);

        // Reset input so same file can be selected again if needed
        event.target.value = '';
    };

    const handleCropComplete = async (croppedBlob: Blob) => {
        const formData = new FormData();
        formData.append('avatar', croppedBlob, 'avatar.jpg');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/v1/users/avatar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                // Update local user context with the new avatar URL
                await updateProfile({ avatarUrl: data.data.avatarUrl });
            } else {
                console.error("Upload failed", data.message);
                alert(t('settings.account.avatar.uploadFailed') + data.message);
            }
        } catch (error) {
            console.error("Error uploading avatar", error);
            alert(t('settings.account.avatar.error'));
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
        try {
            const res = await apiClient('/users/me', {
                method: 'DELETE',
                body: JSON.stringify({ password: deletePassword })
            });

            if (res.success) {
                logout();
                onLogout();
            } else {
                alert(t('settings.deleteFailed') + ": " + res.message);
            }
        } catch (error) {
            console.error("Failed to delete account", error);
            alert(t('settings.deleteFailed'));
        }
    };

    const SectionButton = ({ id, icon: Icon, label }: { id: typeof activeSection, icon: any, label: string }) => (
        <button
            onClick={() => setActiveSection(id)}
            className={cn(
                "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-sm font-medium group relative overflow-hidden",
                activeSection === id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
        >
            {activeSection === id && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-primary z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
            <Icon className={cn("w-4 h-4 relative z-10 transition-colors", activeSection === id ? "text-primary-foreground" : "")} />
            <span className={cn("relative z-10 transition-colors", activeSection === id ? "text-primary-foreground" : "")}>{label}</span>
            <ChevronRight className={cn("ml-auto w-4 h-4 transition-transform relative z-10", activeSection === id ? "translate-x-1 opacity-100 text-primary-foreground" : "opacity-0 group-hover:opacity-50")} />
        </button>
    );

    if (!user) return null;

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 md:pb-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">

                {/* Mobile: Header & Dropdown Selector */}
                <div className="md:hidden space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-foreground">{t('settings.title')}</h2>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={onLogout}>
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Section Dropdown */}
                    <div className="relative">
                        <select
                            value={activeSection}
                            onChange={(e) => setActiveSection(e.target.value as any)}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background/80 backdrop-blur-xl text-foreground font-medium shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                        >
                            <option value="account">{t('settings.menu.account')}</option>
                            <option value="appearance">{t('settings.menu.appearance')}</option>
                            <option value="notifications">{t('settings.menu.notifications')}</option>
                            <option value="content">{t('settings.menu.content')}</option>
                            <option value="about">{t('settings.menu.about')}</option>
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground rotate-90 pointer-events-none" />
                    </div>
                </div>

                {/* Desktop: Sidebar */}
                <div className="hidden md:block w-64 space-y-8 shrink-0 sticky top-24 h-fit">
                    <div>
                        <h2 className="text-3xl font-bold mb-2 text-foreground tracking-tight">{t('settings.title')}</h2>
                        <p className="text-muted-foreground text-sm">{t('settings.subtitle')}</p>
                    </div>

                    <div className="space-y-2">
                        <SectionButton id="account" icon={User} label={t('settings.menu.account')} />
                        <SectionButton id="appearance" icon={Moon} label={t('settings.menu.appearance')} />
                        <SectionButton id="notifications" icon={Bell} label={t('settings.menu.notifications')} />
                        <SectionButton id="content" icon={Globe} label={t('settings.menu.content')} />
                        <SectionButton id="about" icon={HelpCircle} label={t('settings.menu.about')} />
                    </div>

                    <div className="pt-6 border-t border-border">
                        <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10 group" onClick={onLogout}>
                            <LogOut className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            {t('logout')}
                        </Button>
                    </div>
                </div>

                {/* Content Area */}
                {/* Content Area */}
                <div className="flex-1 min-w-0">
                    <GlassCard className="p-5 md:p-8 min-h-[500px] border-border/50 shadow-xl bg-card/40 backdrop-blur-md">
                        <AnimatePresence mode="wait">
                            {activeSection === 'account' && (
                                <motion.div
                                    key="account"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                        <div className="relative group cursor-pointer shrink-0" onClick={handleAvatarClick}>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileSelect}
                                            />
                                            <img src={user.avatarUrl} alt={user.displayName} className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/10 transition-all group-hover:ring-primary/30" />
                                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Upload className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <ImageCropper
                                            open={cropperOpen}
                                            onOpenChange={setCropperOpen}
                                            imageSrc={selectedImage}
                                            onCropComplete={handleCropComplete}
                                        />
                                        <div className="text-center sm:text-left min-w-0 flex-1">
                                            <h3 className="text-xl font-bold truncate">{user.displayName || t('common.userFallback')}</h3>
                                            <p className="text-muted-foreground text-sm truncate">{user.email}</p>
                                            <span className="inline-block mt-2 px-2 py-0.5 bg-primary/20 text-primary text-[10px] rounded uppercase font-bold tracking-wider">{user.role}</span>
                                        </div>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>{t('settings.account.fullName')}</Label>
                                            <div className="flex gap-2 items-start">
                                                <div className="relative flex-1">
                                                    <Input
                                                        {...profileForm.register('name')}
                                                        disabled={!isEditing}
                                                        placeholder={t('settings.account.namePlaceholder')}
                                                        className={cn(isEditing ? "" : "border-transparent shadow-none disabled:opacity-100 disabled:cursor-text")}
                                                    />
                                                    {profileForm.formState.errors.name && (
                                                        <span className="text-destructive text-xs absolute -bottom-5 left-1">{profileForm.formState.errors.name.message}</span>
                                                    )}
                                                </div>
                                                {!isEditing ? (
                                                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>Edit</Button>
                                                ) : (
                                                    <Button onClick={profileForm.handleSubmit(handleUpdateProfile)} disabled={isLoading} size="sm">
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

                                    <div className="pt-6 border-t border-border space-y-6">
                                        {/* Security */}
                                        <div>
                                            <h4 className="font-semibold mb-4 flex items-center gap-2">
                                                <Lock className="w-4 h-4" /> {t('settings.security')}
                                            </h4>
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg bg-secondary/20 border border-border">
                                                <div className="text-sm min-w-0 flex-1">
                                                    <p className="font-medium">{t('settings.password')}</p>
                                                    <p className="text-muted-foreground text-xs">{t('settings.passwordDesc')}</p>
                                                </div>
                                                <Button variant="outline" size="sm" className="w-full sm:w-auto shrink-0" onClick={() => setChangePasswordOpen(true)}>
                                                    <KeyRound className="w-4 h-4 mr-2" />
                                                    {t('settings.changePassword')}
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Delete Account */}
                                        <div>
                                            <h4 className="font-semibold mb-4 text-red-600 dark:text-red-500 flex items-center gap-2">
                                                <Shield className="w-4 h-4" /> {t('settings.account.deleteAccount.title')}
                                            </h4>
                                            <div className="flex flex-col gap-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                                                <div className="text-sm">
                                                    <p className="font-medium text-red-900 dark:text-red-200">{t('settings.account.deleteAccount.label')}</p>
                                                    <p className="text-red-700/80 dark:text-red-200/60 text-xs mt-1">{t('settings.account.deleteAccount.description')}</p>
                                                </div>
                                                <Button variant="destructive" size="sm" className="w-full sm:w-auto" onClick={() => setDeleteConfirmOpen(true)}>{t('settings.account.deleteAccount.button')}</Button>
                                            </div>
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
                                                    <option value="en">{t('settings.content.languages.en')}</option>
                                                    <option value="hi">{t('settings.content.languages.hi')}</option>
                                                    <option value="te">{t('settings.content.languages.te')}</option>
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

            {/* Change Password Dialog */}
            <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('settings.changePassword')}</DialogTitle>
                        <DialogDescription>{t('settings.changePasswordInfo')}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="space-y-4">
                        <div className="space-y-2">
                            <Label>{t('settings.currentPassword')}</Label>
                            <Input
                                type="password"
                                {...passwordForm.register('oldPassword')}
                            />
                            {passwordForm.formState.errors.oldPassword && <p className="text-xs text-destructive">{passwordForm.formState.errors.oldPassword.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>{t('settings.newPassword')}</Label>
                            <Input
                                type="password"
                                {...passwordForm.register('newPassword')}
                            />
                            {passwordForm.formState.errors.newPassword && <p className="text-xs text-destructive">{passwordForm.formState.errors.newPassword.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>{t('settings.confirmNewPassword')}</Label>
                            <Input
                                type="password"
                                {...passwordForm.register('confirmPassword')}
                            />
                            {passwordForm.formState.errors.confirmPassword && <p className="text-xs text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setChangePasswordOpen(false)}>{t('common.cancel')}</Button>
                            <Button type="submit">{t('settings.updatePassword')}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Account Confirmation Dialog */}
            <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-destructive">{t('settings.deleteAccount')}</DialogTitle>
                        <DialogDescription>
                            {t('settings.deleteAccountWarning')}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            {t('settings.enterPasswordToConfirm')}
                        </p>
                        <Input
                            type="password"
                            placeholder={t('common.passwordPlaceholder')}
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)}>{t('common.cancel')}</Button>
                        <Button
                            variant="destructive"
                            disabled={!deletePassword}
                            onClick={handleDeleteAccount}
                        >
                            {t('settings.confirmDelete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
