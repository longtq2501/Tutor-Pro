'use client';

import { useMediaStream } from './useMediaStream';
import { useSessionRecorder } from './useSessionRecorder';

/**
 * Aggregator hook for Live Room media management.
 * Combines stream access and session recording controls.
 */
export const useLiveRoomMedia = () => {
    const media = useMediaStream();
    const recorder = useSessionRecorder(media.stream);

    return {
        ...media,
        ...recorder
    };
};
