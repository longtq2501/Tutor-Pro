'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface HeroVideoProps {
    src?: string;
    poster?: string;
}

export function HeroVideo({ src, poster }: HeroVideoProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(true);
    const [reducedMotion, setReducedMotion] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const checkMotion = (matches: boolean) => {
            setReducedMotion(matches);
            if (matches) {
                setIsPlaying(false);
                if (videoRef.current) {
                    videoRef.current.pause();
                }
            }
        };

        checkMotion(mediaQuery.matches);

        const listener = (e: MediaQueryListEvent) => checkMotion(e.matches);
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', listener);
            return () => mediaQuery.removeEventListener('change', listener);
        } else {
            mediaQuery.addListener(listener);
            return () => mediaQuery.removeListener(listener);
        }
    }, []);

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play()
                .then(() => setIsPlaying(true))
                .catch(() => setIsPlaying(false));
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    const hasVideo = Boolean(src && src.trim().length > 0);

    return (
        <div className="lp-hero-video-frame">
            {hasVideo ? (
                <>
                    <video
                        ref={videoRef}
                        src={src}
                        poster={poster}
                        autoPlay={!reducedMotion}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="lp-hero-video-element"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    />
                    <button
                        type="button"
                        onClick={togglePlay}
                        className="lp-video-toggle-btn"
                        aria-label={isPlaying ? 'Tạm dừng video' : 'Phát video'}
                    >
                        {isPlaying ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )}
                    </button>
                </>
            ) : (
                <div className="lp-video-placeholder" aria-hidden="true">
                    {/* App window titlebar */}
                    <div className="lp-vp-titlebar">
                        <span className="lp-vp-dot lp-vp-dot-1" />
                        <span className="lp-vp-dot lp-vp-dot-2" />
                        <span className="lp-vp-dot lp-vp-dot-3" />
                        <span className="lp-vp-title">Tutor Pro App Preview</span>
                    </div>

                    {/* App workspace skeleton mockup */}
                    <div className="lp-vp-body">
                        {/* Sidebar skeleton */}
                        <div className="lp-vp-sidebar">
                            <div className="lp-vp-bar w-70" />
                            <div className="lp-vp-bar w-85" />
                            <div className="lp-vp-bar w-60" />
                            <div className="lp-vp-bar w-75" />
                            <div className="lp-vp-bar w-50" />
                        </div>

                        {/* Main area skeleton */}
                        <div className="lp-vp-main">
                            <div className="lp-vp-header-bar">
                                <div className="lp-vp-pill" />
                                <div className="lp-vp-pill" style={{ width: '80px' }} />
                            </div>
                            <div className="lp-vp-cards">
                                <div className="lp-vp-card" />
                                <div className="lp-vp-card" />
                                <div className="lp-vp-card" />
                            </div>
                            <div className="lp-vp-panel">
                                <div className="lp-vp-badge">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ opacity: 0.85 }}>
                                        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                                    </svg>
                                    <span>Video giới thiệu sẽ đặt ở đây</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
