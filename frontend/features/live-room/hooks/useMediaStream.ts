"use client";

import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Media extraction error types.
 */
export type MediaErrorType =
    | 'NotAllowedError'
    | 'NotFoundError'
    | 'NotReadableError'
    | 'OverconstrainedError'
    | 'TypeError'
    | 'UnknownError';

/**
 * Result of the useMediaStream hook.
 */
export interface UseMediaStreamResult {
    stream: MediaStream | null;
    error: MediaErrorType | null;
    isLoading: boolean;
    isMicMuted: boolean;
    isCameraMuted: boolean;
    retry: (newConstraints?: MediaStreamConstraints) => void;
    toggleMic: () => void;
    toggleCamera: () => void;
    devices: MediaDeviceInfo[];
    switchDevice: (deviceId: string, kind: 'audio' | 'video') => void;
}

/**
 * Hook to manage media stream access (camera/microphone).
 * Features reliable cleanup via useRef, permission checks, and mute/unmute controls.
 */
export const useMediaStream = (
    initialConstraints: MediaStreamConstraints = { video: true, audio: true }
): UseMediaStreamResult => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<MediaErrorType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [retryCount, setRetryCount] = useState<number>(0);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [constraints, setConstraints] = useState(initialConstraints);
    const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
    const [isCameraMuted, setIsCameraMuted] = useState<boolean>(false);
    const streamRef = useRef<MediaStream | null>(null);
    const muteStateRef = useRef({ audio: false, video: false });

    // Keep ref in sync for initial stream creation
    useEffect(() => {
        muteStateRef.current = { audio: isMicMuted, video: isCameraMuted };
    }, [isMicMuted, isCameraMuted]);

    const stopStream = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, []);

    const toggleMic = useCallback(() => {
        setIsMicMuted(prev => {
            const newMutedState = !prev;
            if (streamRef.current) {
                streamRef.current.getAudioTracks().forEach(track => {
                    track.enabled = !newMutedState;
                });
            }
            return newMutedState;
        });
    }, []);

    const toggleCamera = useCallback(() => {
        setIsCameraMuted(prev => {
            const newMutedState = !prev;
            if (streamRef.current) {
                streamRef.current.getVideoTracks().forEach(track => {
                    track.enabled = !newMutedState;
                });
            }
            return newMutedState;
        });
    }, []);

    const getDevices = useCallback(async () => {
        try {
            const deviceList = await navigator.mediaDevices.enumerateDevices();
            setDevices(deviceList);
        } catch (err) {
            console.error('Error enumerating devices:', err);
        }
    }, []);

    const getMedia = useCallback(async () => {
        if (!navigator.mediaDevices?.getUserMedia) {
            setError('TypeError');
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            stopStream();
            const newStream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = newStream;

            // Sync current mute states to new stream tracks using Ref to avoid getMedia dependency
            newStream.getAudioTracks().forEach(track => track.enabled = !muteStateRef.current.audio);
            newStream.getVideoTracks().forEach(track => track.enabled = !muteStateRef.current.video);

            setStream(newStream);
            setError(null);
            await getDevices();
        } catch (err: any) {
            // Silence console error for common/expected hardware missing scenarios 
            // the error is still propagated to the UI via state.
            if (err.name !== 'NotFoundError' && err.name !== 'DevicesNotFoundError') {
                console.error('Media access error:', err);
            }
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') setError('NotAllowedError');
            else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') setError('NotFoundError');
            else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') setError('NotReadableError');
            else if (err.name === 'OverconstrainedError') setError('OverconstrainedError');
            else if (err.name === 'TypeError') setError('TypeError');
            else setError('UnknownError');
            setStream(null);
        } finally {
            setIsLoading(false);
        }
    }, [constraints, stopStream, getDevices]); // Removed isMicMuted, isCameraMuted

    useEffect(() => {
        getMedia();
        return () => stopStream();
    }, [getMedia, stopStream, retryCount]);

    const retry = useCallback((newConstraints?: MediaStreamConstraints) => {
        if (newConstraints) {
            setConstraints(newConstraints);
        }
        stopStream(); // Ensure old stream is stopped before retry
        setRetryCount(prev => prev + 1);
    }, [stopStream]);

    const switchDevice = useCallback((deviceId: string, kind: 'audio' | 'video') => {
        setConstraints(prev => ({
            ...prev,
            [kind]: typeof prev[kind] === 'boolean'
                ? { deviceId: { exact: deviceId } }
                : { ...(prev[kind] as object), deviceId: { exact: deviceId } }
        }));
    }, []);

    return { stream, error, isLoading, isMicMuted, isCameraMuted, retry, toggleMic, toggleCamera, devices, switchDevice };
};
