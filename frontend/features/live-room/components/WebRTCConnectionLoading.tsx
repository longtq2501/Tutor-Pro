"use client";

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Video, ShieldCheck, Globe, Zap, AlertCircle } from 'lucide-react';

interface ComponentProps {
    progress: number;
    statusMessage: string;
    error?: string | null;
}

const ConnectionIcon = ({ progress, error }: { progress: number; error?: string | null }) => {
    const getIcon = () => {
        if (error) return <AlertCircle className="h-8 w-8 text-red-500" />;
        if (progress < 25) return <ShieldCheck className="h-8 w-8 text-blue-400" />;
        if (progress < 50) return <Globe className="h-8 w-8 text-purple-400" />;
        if (progress < 80) return <Zap className="h-8 w-8 text-yellow-400" />;
        return <Video className="h-8 w-8 text-green-400" />;
    };

    return (
        <div className="relative mb-8">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <div className="relative p-5 bg-white/5 rounded-2xl border border-white/10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={error ? 'error' : progress}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {getIcon()}
                    </motion.div>
                </AnimatePresence>
            </div>
            {!error && (
                <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Loader2 className="h-4 w-4 text-primary" />
                </motion.div>
            )}
        </div>
    );
};

const ConnectionProgress = ({ progress }: { progress: number }) => (
    <div className="w-full space-y-4">
        <div className="flex justify-between text-xs font-medium px-1">
            <span className="text-primary">{progress}%</span>
            <span className="text-white/40">Hoàn thành</span>
        </div>
        <Progress value={progress} className="h-2 bg-white/5 border border-white/10" />
        <div className="mt-8 flex gap-2 justify-center overflow-hidden px-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                    key={i}
                    className={`h-1 w-8 rounded-full ${progress >= i * 20 ? 'bg-primary' : 'bg-white/10'}`}
                    animate={progress >= i * 20 ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                />
            ))}
        </div>
    </div>
);

/**
 * Visual component to show the connection progress to a live room.
 */
export const WebRTCConnectionLoading: React.FC<ComponentProps> = ({
    progress,
    statusMessage,
    error
}) => (
    <motion.div
        className="flex flex-col items-center justify-center p-8 w-full max-w-lg mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
    >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-10 w-full flex flex-col items-center text-center">
            <ConnectionIcon progress={progress} error={error} />
            <h2 className="text-2xl font-bold text-white mb-2">
                {error ? 'Lỗi kết nối' : 'Đang thiết lập phòng học'}
            </h2>
            <p className="text-white/60 text-sm mb-8 max-w-[280px]">
                {error || statusMessage}
            </p>
            <ConnectionProgress progress={progress} />
        </div>
    </motion.div>
);
