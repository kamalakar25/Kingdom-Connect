import React, { ComponentProps } from "react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

interface GlassCardProps extends ComponentProps<typeof motion.div> {
    children: React.ReactNode;
    className?: string;
    gradient?: boolean;
}

export const GlassCard = ({ children, className, gradient = false, ...props }: GlassCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={cn(
                "relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-xl shadow-2xl",
                gradient && "border-gold/30 shadow-gold/10",
                className
            )}
            {...props}
        >
            {/* Subtle noise texture or gradient overlay could go here */}
            {gradient && (
                <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-tr from-gold/5 via-transparent to-transparent opacity-50" />
            )}

            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};
