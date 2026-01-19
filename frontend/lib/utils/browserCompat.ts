/**
 * Checks if the MediaRecorder API is supported in the current browser.
 * @returns {boolean} True if supported, false otherwise.
 */
export const isMediaRecorderSupported = (): boolean => {
    return typeof window !== 'undefined' && !!window.MediaRecorder;
};

/**
 * Gets the most compatible MIME type for video recording supported by the browser.
 * Prefers vp9/vp8 over h264 for better compression/RAM usage if available.
 * @returns {string} Supported MIME type or empty string if none found.
 */
export const getSupportedMimeType = (): string => {
    if (!isMediaRecorderSupported()) return '';

    const types = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4'
    ];

    for (const type of types) {
        if (MediaRecorder.isTypeSupported(type)) {
            return type;
        }
    }

    return '';
};
