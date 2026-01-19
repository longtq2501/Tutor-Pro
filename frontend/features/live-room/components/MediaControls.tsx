"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Mic,
    MicOff,
    Video as VideoIcon,
    VideoOff,
    Settings,
    MoreVertical,
    Circle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { RecordingQuality } from '../hooks/useSessionRecorder';
import { FILE_SIZE_MB_PER_HOUR } from '../hooks/useSessionRecorder';

interface ControlButtonProps {
    active: boolean;
    onClick?: () => void;
    onIcon: React.ReactNode;
    offIcon: React.ReactNode;
    variant?: "destructive" | "secondary";
    className?: string;
}

const ControlButton = ({ active, onClick, onIcon, offIcon, variant = "secondary", className }: ControlButtonProps) => (
    <Button
        variant={active ? variant : "secondary"}
        size="icon"
        onClick={onClick}
        className={cn(
            "h-12 w-12 rounded-xl transition-all active:scale-95",
            !active && "bg-white/10 hover:bg-white/20 text-white",
            className
        )}
    >
        {active ? offIcon : onIcon}
    </Button>
);

interface MediaControlsProps {
    isMicMuted: boolean;
    isCameraMuted: boolean;
    isRecording: boolean;
    isRecordingSupported: boolean;
    quality: RecordingQuality;
    recommendedQuality: RecordingQuality;
    onToggleMic: () => void;
    onToggleCamera: () => void;
    onToggleRecording: () => void;
    onQualityChange: (quality: RecordingQuality) => void;
    onOpenSettings?: () => void;
    className?: string;
}

/**
 * Floating media control bar for live room.
 */
export const MediaControls: React.FC<MediaControlsProps> = ({
    isMicMuted,
    isCameraMuted,
    isRecording,
    isRecordingSupported,
    quality,
    recommendedQuality,
    onToggleMic,
    onToggleCamera,
    onToggleRecording,
    onQualityChange,
    onOpenSettings,
    className
}) => (
    <motion.div
        className={cn("flex items-center gap-3 p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl", className)}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
    >
        <ControlButton active={isMicMuted} onClick={onToggleMic} onIcon={<Mic className="h-5 w-5" />} offIcon={<MicOff className="h-5 w-5" />} variant="destructive" />
        <ControlButton active={isCameraMuted} onClick={onToggleCamera} onIcon={<VideoIcon className="h-5 w-5" />} offIcon={<VideoOff className="h-5 w-5" />} variant="destructive" />

        {isRecordingSupported && (
            <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                    {!isRecording ? (
                        <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/5">
                            {(['low', 'balanced', 'high'] as const).map(q => (
                                <button
                                    key={q}
                                    onClick={() => onQualityChange(q)}
                                    className={cn(
                                        "px-2.5 py-1 text-[10px] uppercase font-bold rounded-md transition-all",
                                        quality === q
                                            ? "bg-white/10 text-white shadow-sm"
                                            : "text-white/30 hover:text-white/60"
                                    )}
                                >
                                    {q === 'low' && 'Low'}
                                    {q === 'balanced' && 'Balanced'}
                                    {q === 'high' && 'High'}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-lg text-[10px] text-red-500 font-bold uppercase">
                            Quality: {quality}
                        </div>
                    )}
                    <ControlButton
                        active={isRecording}
                        onClick={onToggleRecording}
                        onIcon={<Circle className="h-5 w-5 fill-red-500 text-red-500" />}
                        offIcon={<Circle className="h-5 w-5 fill-red-500 text-white animate-pulse" />}
                        variant="destructive"
                        className={cn(isRecording && "bg-red-500 hover:bg-red-600")}
                    />
                </div>
                <span className="text-[10px] text-white/40 mt-1 font-medium flex items-center gap-1">
                    {quality === recommendedQuality && <span className="text-yellow-500/80">⭐</span>}
                    ~{FILE_SIZE_MB_PER_HOUR[quality]} MB/giờ
                    {quality === recommendedQuality && <span className="opacity-60">(Recommended)</span>}
                </span>
            </div>
        )}

        <div className="w-px h-8 bg-white/10 mx-1" />
        <Button variant="ghost" size="icon" onClick={onOpenSettings} className="h-12 w-12 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <MoreVertical className="h-5 w-5" />
        </Button>
    </motion.div>
);
