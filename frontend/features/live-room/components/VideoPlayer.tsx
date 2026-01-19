"use client";

import React, { useEffect, useRef } from 'react';

interface VideoPlayerProps {
    stream: MediaStream | null;
    muted?: boolean;
    className?: string;
}

/**
 * Component to display a MediaStream in a video element.
 * Handles autoPlay, playsInline and safe cleanup.
 */
export const VideoPlayer: React.FC<VideoPlayerProps> = ({
    stream,
    muted = false,
    className = ''
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={muted}
                className="w-full h-full object-cover bg-slate-900 rounded-xl"
            />
            {!stream && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-white/40 text-sm">
                    Đang chờ tín hiệu video...
                </div>
            )}
        </div>
    );
};
