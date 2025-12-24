import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { ArrowLeft, Loader2, Check, X, Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from '@react-oauth/google';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/auth-context';

// --- Types ---

type LoginFormValues = {
    email: string;
    password: string;
};

type RegisterFormValues = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

// --- Main Component ---

interface AuthFormProps {
    onSuccess: (token: string, user: any) => void;
    onBack: () => void;
}

export function AuthForm({ onSuccess, onBack }: AuthFormProps) {
    const { t } = useTranslation();
    const [isLogin, setIsLogin] = useState(true);
    const { login, register, googleLogin } = useAuth();
    const [loading, setLoading] = useState(false);
    const [globalError, setGlobalError] = useState('');

    // --- Dynamic Zod Schemas ---
    const passwordSchema = z.string()
        .min(8, t('auth.errors.minChars'))
        .regex(/[A-Z]/, t('auth.errors.uppercase'))
        .regex(/[a-z]/, t('auth.errors.lowercase'))
        .regex(/[0-9]/, t('auth.errors.number'))
        .regex(/[^A-Za-z0-9]/, t('auth.errors.special'));

    const loginSchema = z.object({
        email: z.string().email(t('auth.errors.invalidEmail')),
        password: z.string().min(1, t('auth.errors.passwordRequired')),
    });

    const registerSchema = z.object({
        name: z.string().min(2, t('auth.errors.nameMin')),
        email: z.string().email(t('auth.errors.invalidEmail')),
        password: passwordSchema,
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        message: t('auth.errors.passwordMatch'),
        path: ["confirmPassword"],
    });

    // --- Forms ---
    const loginForm = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange'
    });

    const registerForm = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        mode: 'onChange'
    });

    // Real-time password value
    const registerPassword = registerForm.watch('password');

    // --- Submit Handlers ---
    const onLoginSubmit = async (data: LoginFormValues) => {
        setLoading(true);
        setGlobalError('');
        try {
            await login(data.email, data.password);
            const token = localStorage.getItem('token');
            if (token) onSuccess(token, null);
        } catch (err: any) {
            setGlobalError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const onRegisterSubmit = async (data: RegisterFormValues) => {
        setLoading(true);
        setGlobalError('');
        try {
            await register(data.email, data.password, data.name);
            const token = localStorage.getItem('token');
            if (token) onSuccess(token, null);
        } catch (err: any) {
            setGlobalError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background/90 bg-[url('https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=1200&auto=format&fit=crop')] bg-cover bg-center bg-blend-overlay">
            <Card className="w-full max-w-md border-border bg-card/90 backdrop-blur-2xl shadow-2xl animate-in zoom-in-95 duration-500">
                <CardHeader>
                    <div className="flex items-center mb-4">
                        <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2 text-muted-foreground hover:text-foreground hover:bg-muted">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </div>
                    <CardTitle className="text-3xl font-bold text-foreground tracking-tight">
                        {isLogin ? t('auth.welcome') : t('auth.join')}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        {isLogin ? t('auth.loginDesc') : t('auth.registerDesc')}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <AnimatePresence mode="wait">
                        {isLogin ? (
                            <motion.form
                                key="login"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                                className="space-y-4"
                            >
                                <InputField
                                    id="login-email"
                                    label={t('auth.email')}
                                    type="email"
                                    placeholder="name@example.com"
                                    register={loginForm.register('email')}
                                    error={loginForm.formState.errors.email}
                                />
                                <InputField
                                    id="login-password"
                                    label={t('auth.password')}
                                    type="password"
                                    showToggle
                                    register={loginForm.register('password')}
                                    error={loginForm.formState.errors.password}
                                />
                                <Button className="w-full h-11" type="submit" disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t('auth.signIn')}
                                </Button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="register"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                                className="space-y-4"
                            >
                                <InputField
                                    id="name"
                                    label={t('auth.fullName')}
                                    type="text"
                                    placeholder="John Doe"
                                    register={registerForm.register('name')}
                                    error={registerForm.formState.errors.name}
                                />
                                <InputField
                                    id="email"
                                    label={t('auth.email')}
                                    type="email"
                                    placeholder="name@example.com"
                                    register={registerForm.register('email')}
                                    error={registerForm.formState.errors.email}
                                />
                                <div>
                                    <InputField
                                        id="password"
                                        label={t('auth.password')}
                                        type="password"
                                        showToggle
                                        register={registerForm.register('password')}
                                        error={registerForm.formState.errors.password}
                                    />
                                    <PasswordStrength password={registerPassword} t={t} />
                                </div>
                                <InputField
                                    id="confirm"
                                    label={t('auth.confirmPassword')}
                                    type="password"
                                    register={registerForm.register('confirmPassword')}
                                    error={registerForm.formState.errors.confirmPassword}
                                />
                                <Button className="w-full h-11 mt-4" type="submit" disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t('auth.createAccount')}
                                </Button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {globalError && (
                        <div className="mt-4 p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 animate-in slide-in-from-bottom-2">
                            <X className="w-4 h-4 shrink-0" /> {globalError}
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">{t('auth.orContinue')}</span>
                        </div>
                    </div>

                    <div className="w-full flex justify-center">
                        <GoogleLogin
                            onSuccess={async (credentialResponse: any) => {
                                try {
                                    await googleLogin(credentialResponse.credential);
                                    const token = localStorage.getItem('token');
                                    if (token) onSuccess(token, null);
                                } catch (e) { console.error(e) }
                            }}
                            onError={() => console.log('Login Failed')}
                            theme="filled_black"
                            shape="pill"
                            width="100%"
                        />
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">
                            {isLogin ? t('auth.noAccount') + " " : t('auth.hasAccount') + " "}
                        </span>
                        <button
                            type="button"
                            className="text-primary hover:underline font-semibold transition-colors"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setGlobalError('');
                                loginForm.reset();
                                registerForm.reset();
                            }}
                        >
                            {isLogin ? t('auth.signUp') : t('auth.signIn')}
                        </button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

// --- Helper Components ---

const PasswordStrength = ({ password, t }: { password?: string, t: any }) => {
    if (!password) return null;

    const checks = [
        { label: t('auth.errors.minChars'), pass: password.length >= 8 },
        { label: t('auth.errors.uppercase'), pass: /[A-Z]/.test(password) },
        { label: t('auth.errors.lowercase'), pass: /[a-z]/.test(password) },
        { label: t('auth.errors.number'), pass: /[0-9]/.test(password) },
        { label: t('auth.errors.special'), pass: /[^A-Za-z0-9]/.test(password) },
    ];

    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {checks.map((c, i) => (
                <span key={i} className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors duration-300",
                    c.pass ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-white/5 text-white/40 border border-white/5"
                )}>
                    {c.pass ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-white/20" />}
                    {c.label}
                </span>
            ))}
        </div>
    );
};

const InputField = ({
    label, id, type, register, error, placeholder, showToggle
}: { label: string, id: string, type: string, register: any, error?: any, placeholder?: string, showToggle?: boolean }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                <Input
                    id={id}
                    type={showToggle ? (showPassword ? 'text' : 'password') : type}
                    placeholder={placeholder}
                    className={cn(
                        "bg-input/50 border-input text-foreground placeholder:text-muted-foreground focus:border-primary transition-all",
                        error && "border-destructive focus:border-destructive"
                    )}
                    {...register}
                />

                {showToggle && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                )}

                {!error && !showToggle && register.value && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                )}
            </div>
            {error && <span className="text-xs text-destructive flex items-center gap-1 animate-in slide-in-from-left-2"><X className="w-3 h-3" /> {error.message}</span>}
        </div>
    )
};
