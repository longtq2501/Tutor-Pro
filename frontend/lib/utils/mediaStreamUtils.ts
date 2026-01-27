/**
 * Combines multiple MediaStreams into a single stream.
 */
export const combineMediaStreams = (streams: MediaStream[]): MediaStream => {
    const combinedStream = new MediaStream();
    streams.forEach(stream => {
        stream.getTracks().forEach(track => {
            combinedStream.addTrack(track);
        });
    });
    return combinedStream;
};

/**
 * Prompts user to share their screen/window/tab for recording.
 * This is what you want for full live room recording!
 * 
 * @returns MediaStream of screen capture, or null if user cancels
 */
export const getScreenCaptureStream = async (): Promise<MediaStream | null> => {
    try {
        console.log('[Screen Capture] Requesting screen share...');

        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                // Request high quality for screen recording
                width: { ideal: 1920 },
                height: { ideal: 1080 },
                frameRate: { ideal: 30 }
            },
            audio: {
                // ✅ Capture system audio (tab audio)
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false
            }
        });

        console.log('[Screen Capture] Screen share granted:', {
            videoTracks: stream.getVideoTracks().length,
            audioTracks: stream.getAudioTracks().length,
            videoSettings: stream.getVideoTracks()[0]?.getSettings()
        });

        return stream;
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'NotAllowedError') {
                console.warn('[Screen Capture] User cancelled screen share');
            } else {
                console.error('[Screen Capture] Failed to get screen capture:', error);
            }
        }
        return null;
    }
};

/**
 * Gets canvas stream (legacy - for whiteboard-only recording).
 * You probably don't need this anymore if using screen capture!
 */
export const getCanvasStream = (fps: number = 30): MediaStream | null => {
    // Try multiple selectors
    const selectors = [
        'canvas', // Generic
        'canvas[data-whiteboard]', // If you have data attribute
        '.whiteboard canvas', // If wrapped in container
        '#whiteboard-canvas' // If has ID
    ];

    let canvas: HTMLCanvasElement | null = null;

    for (const selector of selectors) {
        canvas = document.querySelector<HTMLCanvasElement>(selector);
        if (canvas) {
            console.log('[Canvas Stream] Found canvas using selector:', selector);
            break;
        }
    }

    if (!canvas) {
        console.error('[Canvas Stream] Canvas element not found. Tried selectors:', selectors);
        return null;
    }

    if (canvas.width === 0 || canvas.height === 0) {
        console.error('[Canvas Stream] Canvas has zero dimensions');
        return null;
    }

    try {
        const stream = canvas.captureStream(fps);
        const videoTracks = stream.getVideoTracks();

        if (videoTracks.length === 0) {
            console.error('[Canvas Stream] No video tracks');
            return null;
        }

        console.log('[Canvas Stream] Created:', {
            canvasSize: `${canvas.width}x${canvas.height}`,
            tracks: videoTracks.length
        });

        return stream;
    } catch (error) {
        console.error('[Canvas Stream] Failed to capture:', error);
        return null;
    }
};

/**
 * Creates recording stream with SCREEN CAPTURE (full live room).
 * This captures everything: video grid, chat, whiteboard, UI.
 * 
 * @param userMediaStream - User's microphone stream (for voiceover)
 * @param useScreenCapture - If true, prompt user to share screen (RECOMMENDED)
 */
export const createRecordingStream = async (
    userMediaStream: MediaStream | null,
    useScreenCapture: boolean = true
): Promise<MediaStream | null> => {
    const streams: MediaStream[] = [];

    // Priority 1: Screen Capture (FULL LIVE ROOM RECORDING)
    if (useScreenCapture) {
        const screenStream = await getScreenCaptureStream();
        if (screenStream) {
            streams.push(screenStream);
            console.log('[Recording Stream] Added screen capture stream');

            // ✅ If screen capture has system audio, we're done
            // Otherwise, add user microphone below
        } else {
            console.warn('[Recording Stream] Screen capture cancelled/failed, falling back to canvas');
        }
    }

    // Priority 2: Canvas (if no screen capture)
    if (streams.length === 0) {
        const canvasStream = getCanvasStream(30);
        if (canvasStream) {
            streams.push(canvasStream);
            console.log('[Recording Stream] Added canvas stream (fallback)');
        } else {
            console.warn('[Recording Stream] Canvas not available, using webcam');
        }
    }

    // Priority 3: Webcam (last resort)
    if (streams.length === 0 && userMediaStream) {
        const videoTracks = userMediaStream.getVideoTracks();
        if (videoTracks.length > 0) {
            streams.push(new MediaStream(videoTracks));
            console.log('[Recording Stream] Added webcam video (last resort)');
        }
    }

    // Always add user microphone (for voiceover/commentary)
    if (userMediaStream) {
        const audioTracks = userMediaStream.getAudioTracks();
        if (audioTracks.length > 0) {
            // ✅ Only add mic if we don't already have system audio from screen capture
            const hasSystemAudio = streams.some(s => s.getAudioTracks().length > 0);
            if (!hasSystemAudio) {
                streams.push(new MediaStream(audioTracks));
                console.log('[Recording Stream] Added microphone audio');
            } else {
                console.log('[Recording Stream] Skipping mic (using system audio from screen capture)');
            }
        }
    }

    if (streams.length === 0) {
        console.error('[Recording Stream] No streams available for recording');
        return null;
    }

    const combinedStream = combineMediaStreams(streams);
    console.log('[Recording Stream] Final stream:', {
        totalTracks: combinedStream.getTracks().length,
        videoTracks: combinedStream.getVideoTracks().length,
        audioTracks: combinedStream.getAudioTracks().length
    });

    return combinedStream;
};
