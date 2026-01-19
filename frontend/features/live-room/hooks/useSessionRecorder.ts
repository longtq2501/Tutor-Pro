'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { getSupportedMimeType } from '@/lib/utils/browserCompat';

const MAX_DURATION = 2 * 60 * 60 * 1000;
const WARNING_1 = 105 * 60 * 1000;
const WARNING_2 = 115 * 60 * 1000;

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

const useRecordingTimer = (isRecording: boolean, onLimitReached: () => void) => {
    const [duration, setDuration] = useState(0);
    const [warning, setWarning] = useState<string | null>(null);
    const startTimeRef = useRef<number>(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (!isRecording) {
            setDuration(0);
            setWarning(null);
            return;
        }

        startTimeRef.current = Date.now();
        intervalRef.current = setInterval(() => {
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

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isRecording, onLimitReached]);

    return { duration, warning };
};

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

export const useSessionRecorder = (stream: MediaStream | null) => {
    const [isRecording, setIsRecording] = useState(false);
    const [quality, setQualityState] = useState<RecordingQuality>('balanced');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const startTimeRef = useRef<number>(0);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewMeta, setPreviewMeta] = useState<{ size: number; duration: number } | null>(null);

    const setQuality = useCallback((newQuality: RecordingQuality) => {
        if (isRecording) {
            console.warn('Cannot change quality during recording');
            return;
        }
        setQualityState(newQuality);
    }, [isRecording]);

    const discardRecording = useCallback(() => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
            setPreviewMeta(null);
        }
        chunksRef.current = [];
    }, [previewUrl]);

    const confirmDownload = useCallback(() => {
        if (!previewUrl || chunksRef.current.length === 0) return;

        try {
            const blob = new Blob(chunksRef.current, { type: getSupportedMimeType() });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tms-session-${new Date().toISOString()}.webm`;
            a.click();

            // Note: We don't revokeObjectURL here immediately for the download link itself 
            // because `triggerDownload` creates a new object URL. 
            // In the user's provided code, they do `URL.createObjectURL(blob)` again inside confirmDownload logic inside the snippet? 
            // Actually, the user snippet creates a new url: `const url = URL.createObjectURL(blob);`. 
            // And then revokes it: `URL.revokeObjectURL(url);`.
            // But `previewUrl` is ALREADY a blob URL. We can just use that? 
            // However, the user snippet creates a NEW blob url. That's fine, let's follow the verified snippet.
            // Wait, if I use `previewUrl` for download, I don't need to create a new one. 
            // But `previewUrl` is tied to the state. 
            // Let's stick strictly to the user's provided complete hook code to be safe.

            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 100);

            // Cleanup after download
            discardRecording();
        } catch (error) {
            console.error('Failed to download recording:', error);
        }
    }, [previewUrl, discardRecording]);

    const stopRecording = useCallback(() => {
        const recorder = mediaRecorderRef.current;
        if (!recorder || recorder.state === 'inactive') return;

        // Set up onstop handler before calling stop()
        recorder.onstop = () => {
            try {
                if (chunksRef.current.length === 0) {
                    console.warn('No recording data available');
                    return;
                }

                const blob = new Blob(chunksRef.current, { type: getSupportedMimeType() });
                const url = URL.createObjectURL(blob);
                const duration = Date.now() - startTimeRef.current;

                setPreviewUrl(url);
                setPreviewMeta({ size: blob.size, duration });
            } catch (error) {
                console.error('Failed to create recording preview:', error);
            }
        };

        recorder.stop();
        setIsRecording(false);
    }, []);

    const startRecording = useCallback(() => {
        const mimeType = getSupportedMimeType();
        if (!stream || !mimeType) return;

        discardRecording();
        chunksRef.current = [];
        startTimeRef.current = Date.now();

        const recorder = new MediaRecorder(stream, {
            mimeType,
            videoBitsPerSecond: BITRATES[quality]
        });

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunksRef.current.push(e.data);
            }
        };

        recorder.start(1000);
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
    }, [stream, quality, discardRecording]);

    useEffect(() => {
        return () => {
            discardRecording();
        };
    }, [discardRecording]);

    const { duration, warning } = useRecordingTimer(isRecording, stopRecording);
    useBeforeUnload(isRecording);

    const recommendedQuality: RecordingQuality = (() => {
        try {
            const videoTracks = stream?.getVideoTracks() || [];
            const audioTracks = stream?.getAudioTracks() || [];

            const activeVideoTrack = videoTracks.find(t => t.enabled);

            // Audio-only recording
            if (!activeVideoTrack && audioTracks.length > 0) {
                return 'low';
            }

            if (!activeVideoTrack) return 'low';

            const settings = activeVideoTrack.getSettings() || {};
            const width = settings.width ?? 0;
            const height = settings.height ?? 0;

            if (width >= 1280 || height >= 720) return 'high';
            if (width >= 640 || height >= 480) return 'balanced';
            return 'low';
        } catch (error) {
            console.warn('Failed to get video settings for recommendation', error);
            return 'balanced';
        }
    })();

    return {
        isRecording,
        duration,
        warning,
        quality,
        setQuality,
        recommendedQuality,
        startRecording,
        stopRecording,
        previewUrl,
        previewMeta,
        confirmDownload,
        discardRecording,
        isSupported: !!getSupportedMimeType(),
    };
};
