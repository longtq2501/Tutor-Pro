"use client";

import React from 'react';
import { MicOff, CameraOff, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const CameraMutedView = ({ userName }: { userName?: string }) => (
    <motion.div
        className="absolute inset-0 bg-neutral-900/90 flex flex-col items-center justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <div className="p-6 bg-white/5 rounded-full border border-white/10 shadow-inner">
            <User className="h-16 w-16 text-white/20" />
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
            <CameraOff className="h-4 w-4 text-red-500" />
            <span className="text-white/80 text-xs font-medium">Camera đã tắt</span>
        </div>
        {userName && <span className="text-white/40 text-sm font-light mt-2">{userName}</span>}
    </motion.div>
);

const MicStatusBadge = ({ isMuted }: { isMuted: boolean }) => (
    <AnimatePresence>
        {isMuted && (
            <motion.div
                className="p-2 bg-red-500/90 backdrop-blur-sm rounded-lg shadow-lg"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
            >
                <MicOff className="h-4 w-4 text-white" />
            </motion.div>
        )}
    </AnimatePresence>
);

interface MediaStatusOverlayProps {
    isMicMuted: boolean;
    isCameraMuted: boolean;
    userName?: string;
    className?: string;
}

/**
 * Overlay component for video stream to indicate mic and camera status.
 */
export const MediaStatusOverlay: React.FC<MediaStatusOverlayProps> = ({ isMicMuted, isCameraMuted, userName, className }) => (
    <div className={cn("absolute inset-0 pointer-events-none z-10", className)}>
        <AnimatePresence>{isCameraMuted && <CameraMutedView userName={userName} />}</AnimatePresence>
        <div className="absolute top-4 right-4 flex flex-col gap-2">
            <MicStatusBadge isMuted={isMicMuted} />
        </div>
    </div>
);
