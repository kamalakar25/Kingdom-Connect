import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

interface LandingPageProps {
    onGetStarted: () => void;
}

import { useTranslation } from "react-i18next";

export function LandingPage({ onGetStarted }: LandingPageProps) {
    const { t } = useTranslation();
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
            {/* Background Image / Gradient */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/50 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop"
                    alt="Church Background"
                    className="w-full h-full object-cover opacity-40 animate-in fade-in duration-1000 dark:opacity-20"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-lg space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-200">
                <div className="space-y-4">
                    <span className="text-4xl">✝️</span>
                    <h1 className="text-5xl font-extrabold tracking-tight text-foreground mb-2">
                        Faith<span className="text-primary">Connect</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        {t('landing.tagline')}
                    </p>
                </div>

                <div className="grid gap-4 w-full">
                    <Button
                        size="lg"
                        onClick={onGetStarted}
                        className="w-full text-lg h-14"
                    >
                        {t('landing.getStarted')} <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <p className="text-xs text-muted-foreground">
                        {t('landing.joinCommunity')}
                    </p>
                </div>
            </div>

            {/* Features Footer */}
            <div className="absolute bottom-10 left-0 right-0 z-10 flex justify-center gap-8 text-muted-foreground text-sm animate-in fade-in duration-1000 delay-500">
                <div className="flex items-center gap-2">
                    <span>📖</span> {t('nav.bible')}
                </div>
                <div className="flex items-center gap-2">
                    <span>🎬</span> {t('nav.media')}
                </div>
                <div className="flex items-center gap-2">
                    <span>🔴</span> {t('nav.live')}
                </div>
            </div>
        </div>
    );
}
