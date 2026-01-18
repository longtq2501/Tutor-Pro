"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Mic,
    MicOff,
    Video as VideoIcon,
    VideoOff,
    Settings,
    MoreVertical
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ControlButtonProps {
    active: boolean;
    onClick?: () => void;
    onIcon: React.ReactNode;
    offIcon: React.ReactNode;
    variant?: "destructive" | "secondary";
}

const ControlButton = ({ active, onClick, onIcon, offIcon, variant = "secondary" }: ControlButtonProps) => (
    <Button
        variant={active ? variant : "secondary"}
        size="icon"
        onClick={onClick}
        className={cn(
            "h-12 w-12 rounded-xl transition-all active:scale-95",
            !active && "bg-white/10 hover:bg-white/20 text-white"
        )}
    >
        {active ? offIcon : onIcon}
    </Button>
);

interface MediaControlsProps {
    isMicMuted: boolean;
    isCameraMuted: boolean;
    onToggleMic: () => void;
    onToggleCamera: () => void;
    onOpenSettings?: () => void;
    className?: string;
}

/**
 * Floating media control bar for live room.
 */
export const MediaControls: React.FC<MediaControlsProps> = ({
    isMicMuted,
    isCameraMuted,
    onToggleMic,
    onToggleCamera,
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
        <div className="w-px h-8 bg-white/10 mx-1" />
        <Button variant="ghost" size="icon" onClick={onOpenSettings} className="h-12 w-12 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <MoreVertical className="h-5 w-5" />
        </Button>
    </motion.div>
);
