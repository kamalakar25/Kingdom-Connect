import React, { ComponentProps } from "react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

interface AceternityButtonProps extends ComponentProps<typeof motion.button> {
    children: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
}

export const AceternityButton = ({ children, className, icon, ...props }: AceternityButtonProps) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50",
                className
            )}
            {...props}
        >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-foreground px-8 py-1 text-sm font-medium text-background backdrop-blur-3xl gap-2">
                {icon}
                {children}
            </span>
        </motion.button>
    );
};

export const GlowingButton = ({ children, className, ...props }: AceternityButtonProps) => {
    return (
        <motion.button
            className={cn(
                "relative px-8 py-3 rounded-full bg-blue-600 text-white font-semibold transition-all hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center gap-2 group",
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-20 blur-md transition-opacity" />
            {children}
        </motion.button>
    )
}
