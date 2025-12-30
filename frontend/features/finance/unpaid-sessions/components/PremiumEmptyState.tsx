'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PremiumEmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative flex flex-col items-center justify-center py-16 sm:py-24 px-4 overflow-hidden"
        >
            {/* Confetti effect (background) */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: -100, opacity: 1 }}
                        animate={{
                            y: 800,
                            opacity: 0,
                            x: (i % 2 === 0 ? 1 : -1) * (Math.random() * 300)
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "circOut"
                        }}
                        className={cn(
                            "absolute w-2 h-2 rounded-full",
                            i % 3 === 0 ? "bg-green-400" : i % 3 === 1 ? "bg-emerald-500" : "bg-teal-400"
                        )}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: "-5%"
                        }}
                    />
                ))}
            </div>

            {/* Animated Icon */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={cn(
                    "relative w-24 h-24 sm:w-32 sm:h-32 rounded-full",
                    "bg-gradient-to-br from-green-400 to-emerald-600",
                    "flex items-center justify-center mb-8",
                    "shadow-2xl shadow-green-500/40"
                )}
            >
                <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-white" />

                {/* Glow orbit */}
                <div className="absolute inset-0 rounded-full border-2 border-green-400/30 animate-ping opacity-20" />
            </motion.div>

            {/* Text Content */}
            <div className="relative text-center space-y-3 z-10">
                <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400"
                >
                    🎉 Xuất sắc!
                </motion.h3>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed"
                >
                    Tất cả các buổi học đã được thanh toán đầy đủ.
                    <br />
                    <span className="font-semibold text-foreground">Bạn đang làm việc tuyệt vời!</span>
                </motion.p>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="mt-10"
            >
                <button
                    className={cn(
                        "flex items-center gap-2 px-8 py-3.5 rounded-2xl",
                        "bg-foreground text-background font-bold tracking-tight",
                        "hover:scale-105 active:scale-95 transition-all shadow-xl",
                        "dark:bg-green-500 dark:text-white"
                    )}
                >
                    <Calendar className="w-5 h-5" />
                    Xem lịch dạy
                </button>
            </motion.div>
        </motion.div>
    );
}
