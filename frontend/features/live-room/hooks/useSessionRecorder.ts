'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { getSupportedMimeType } from '@/lib/utils/browserCompat';

const MAX_DURATION = 2 * 60 * 60 * 1000; // 2 hours in ms
const WARNING_1 = 105 * 60 * 1000; // 1h 45m
const WARNING_2 = 115 * 60 * 1000; // 1h 55m

/**
 * Recording quality presets with bitrates and estimated file sizes.
 * 
 * - LOW (256 kbps): ~112 MB/hour. Best for whiteboard-only (no camera).
 * - BALANCED (1 Mbps): ~439 MB/hour. Default for mixed whiteboard/camera.
 * - HIGH (2.5 Mbps): ~1.1 GB/hour. Best for high-motion camera content.
 */
export type RecordingQuality = 'low' | 'balanced' | 'high';

const BITRATES: Record<RecordingQuality, number> = {
    low: 256000,
    balanced: 1000000,
    high: 2500000,
};

export const FILE_SIZE_MB_PER_HOUR: Record<RecordingQuality, number> = {
    low: 112,
    balanced: 439,
    high: 1098,
};

/**
 * Helper to trigger file download for a list of blobs.
 */
const triggerDownload = (chunks: Blob[]) => {
    if (chunks.length === 0) return null;
    const blob = new Blob(chunks, { type: getSupportedMimeType() });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tms-session-${new Date().toISOString()}.webm`;
    a.click();
    return url;
};

/**
 * Hook to manage recording duration and limits.
 */
const useRecordingTimer = (isRecording: boolean, onLimitReached: () => void) => {
    const [duration, setDuration] = useState(0);
    const [warning, setWarning] = useState<string | null>(null);
    const startTimeRef = useRef<number>(0);

    useEffect(() => {
        if (!isRecording) {
            setDuration(0); setWarning(null);
            return;
        }
        startTimeRef.current = Date.now();
        const interval = setInterval(() => {
            const currentDuration = Date.now() - startTimeRef.current;
            setDuration(currentDuration);
            if (currentDuration >= MAX_DURATION) {
                onLimitReached();
            } else if (currentDuration >= WARNING_2) {
                setWarning('Ghi hình sẽ tự động dừng sau 5 phút để bảo vệ dữ liệu.');
            } else if (currentDuration >= WARNING_1) {
                setWarning('Ghi hình đã kéo dài 1h 45m. Giới hạn là 2 giờ.');
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [isRecording, onLimitReached]);

    return { duration, warning };
};

/**
 * Hook to prevent accidental tab closure during recording.
 */
const useBeforeUnload = (isRecording: boolean) => {
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isRecording) {
                e.preventDefault();
                e.returnValue = 'Ghi hình đang diễn ra. Bạn có chắc muốn rời đi?';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isRecording]);
};

/**
 * Main hook for session recording with RAM optimization.
 */
export const useSessionRecorder = (stream: MediaStream | null) => {
    const [isRecording, setIsRecording] = useState(false);
    const [quality, setQualityState] = useState<RecordingQuality>('balanced');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const downloadUrlRef = useRef<string | null>(null);

    const setQuality = useCallback((newQuality: RecordingQuality) => {
        if (isRecording) {
            console.warn('Cannot change quality during recording');
            return;
        }
        setQualityState(newQuality);
    }, [isRecording]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current?.state !== 'inactive') {
            mediaRecorderRef.current?.stop();
        }
        setIsRecording(false);
        const url = triggerDownload(chunksRef.current);
        if (url) {
            downloadUrlRef.current = url;
            setTimeout(() => {
                URL.revokeObjectURL(url);
                if (downloadUrlRef.current === url) downloadUrlRef.current = null;
            }, 100);
        }
        chunksRef.current = [];
    }, []);

    const startRecording = useCallback(() => {
        const mimeType = getSupportedMimeType();
        if (!stream || !mimeType) return;
        chunksRef.current = [];
        const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: BITRATES[quality] });
        recorder.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
        recorder.start(1000);
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
    }, [stream, quality]);

    useEffect(() => {
        return () => { if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current); };
    }, []);

    const { duration, warning } = useRecordingTimer(isRecording, stopRecording);
    useBeforeUnload(isRecording);

    // Smarter recommendation based on track resolution and status
    const recommendedQuality: RecordingQuality = (() => {
        try {
            const videoTracks = stream?.getVideoTracks() || [];
            const activeTrack = videoTracks.find(t => t.enabled);
            if (!activeTrack) return 'low';

            const settings = activeTrack.getSettings() || {};
            const width = settings.width ?? 0;
            const height = settings.height ?? 0;

            if (width >= 1280 || height >= 720) return 'high';
            if (width >= 640 || height >= 480) return 'balanced';
            return 'low';
        } catch (error) {
            console.warn('Failed to get video settings for recommendation', error);
            return 'balanced'; // Safe default
        }
    })();

    return {
        isRecording, duration, warning, quality, setQuality,
        recommendedQuality,
        startRecording, stopRecording, isSupported: !!getSupportedMimeType()
    };
};
