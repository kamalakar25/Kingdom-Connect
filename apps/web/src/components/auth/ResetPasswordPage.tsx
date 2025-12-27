
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { passwordSchema } from '../../lib/schemas';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Loader2, Eye, EyeOff, Check, X, ArrowLeft } from "lucide-react";
import { apiClient } from '../../utils/api';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    // --- Dynamic Zod Schemas ---
    const passwordSchemaVal = passwordSchema(t);

    const schema = z.object({
        password: passwordSchemaVal,
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        message: t('auth.errors.passwordMatch'),
        path: ["confirmPassword"],
    });

    type FormValues = z.infer<typeof schema>;

    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: 'onChange'
    });

    const password = watch('password');

    const onSubmit = async (data: FormValues) => {
        if (!token) {
            setError('Invalid or missing token');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await apiClient('/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({ token, newPassword: data.password })
            });

            if (res.success) {
                setSuccess(true);
                setTimeout(() => navigate('/auth'), 3000);
            } else {
                setError(res.message || 'Failed to reset password');
            }
        } catch (_err) {
            setError('Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-destructive">Invalid Link</CardTitle>
                        <CardDescription>The password reset link is invalid or has expired.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => navigate('/auth')} className="w-full">Back to Login</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background/90 bg-[url('https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=1200&auto=format&fit=crop')] bg-cover bg-center bg-blend-overlay">
            <Card className="w-full max-w-md border-border bg-card/90 backdrop-blur-2xl shadow-2xl animate-in zoom-in-95 duration-500">
                <CardHeader>
                    <div className="flex items-center mb-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/auth')} className="-ml-2 text-muted-foreground hover:text-foreground hover:bg-muted">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </div>
                    <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                    <CardDescription>Enter your new password below.</CardDescription>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <div className="text-center space-y-4 py-8">
                            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-green-500">Password Reset Successful!</h3>
                            <p className="text-muted-foreground">Redirecting to login...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <InputField
                                    id="password"
                                    label="New Password"
                                    type="password"
                                    showToggle
                                    register={register('password')}
                                    error={errors.password}
                                />
                                <PasswordStrength password={password} t={t} />
                            </div>
                            <InputField
                                id="confirm"
                                label="Confirm Password"
                                type="password"
                                showToggle
                                register={register('confirmPassword')}
                                error={errors.confirmPassword}
                            />

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="p-3 text-sm text-destructive bg-destructive/10 rounded-md flex items-center gap-2"
                                    >
                                        <X className="w-4 h-4" />
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <Button className="w-full" type="submit" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Reset Password"}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// Reuse helper components (simplified for this file or imports if exported)
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
