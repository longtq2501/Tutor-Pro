import { renderHook, act } from '@testing-library/react';
import { useSessionRecorder } from '../useSessionRecorder';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock MediaRecorder
class MockMediaRecorder {
    state = 'inactive';
    ondataavailable: ((e: any) => void) | null = null;
    onstop: (() => void) | null = null;
    options: any;

    constructor(stream: any, options: any) {
        this.options = options;
    }

    start(interval?: number) {
        this.state = 'recording';
        // Simulate a data chunk
        setTimeout(() => {
            if (this.ondataavailable) {
                this.ondataavailable({ data: { size: 100 } });
            }
        }, 10);
    }

    stop() {
        this.state = 'inactive';
        if (this.onstop) this.onstop();
    }

    static isTypeSupported = vi.fn(() => true);
}

vi.stubGlobal('MediaRecorder', MockMediaRecorder);

// Stub URL methods
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

describe('useSessionRecorder', () => {
    let mockStream: any;

    beforeEach(() => {
        mockStream = {
            getTracks: () => [],
            getVideoTracks: () => []
        };
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should initialize correctly', () => {
        const { result } = renderHook(() => useSessionRecorder(mockStream));
        expect(result.current.isRecording).toBe(false);
        expect(result.current.duration).toBe(0);
    });

    it('should start recording', () => {
        const { result } = renderHook(() => useSessionRecorder(mockStream));
        act(() => {
            result.current.startRecording();
        });
        expect(result.current.isRecording).toBe(true);
    });

    it('should stop and reset duration, and cleanup URLs', () => {
        const { result } = renderHook(() => useSessionRecorder(mockStream));
        act(() => {
            result.current.startRecording();
            vi.advanceTimersByTime(5000);
            result.current.stopRecording();
        });

        expect(result.current.isRecording).toBe(false);
        expect(result.current.duration).toBe(0);

        // Advance for setTimeout
        act(() => {
            vi.advanceTimersByTime(150);
        });
        expect(global.URL.revokeObjectURL).toHaveBeenCalled();
        (global.URL.revokeObjectURL as any).mockClear();
    });

    it('should show warnings and auto-stop at limits', () => {
        const { result } = renderHook(() => useSessionRecorder(mockStream));
        act(() => {
            result.current.startRecording();
        });

        // 1h 45m warning
        act(() => {
            vi.advanceTimersByTime(105 * 60 * 1000);
        });
        expect(result.current.warning).toContain('1h 45m');

        // 1h 55m warning
        act(() => {
            vi.advanceTimersByTime(10 * 60 * 1000);
        });
        expect(result.current.warning).toContain('5 phút');

        // 2h auto-stop
        act(() => {
            vi.advanceTimersByTime(5 * 60 * 1000);
        });
        expect(result.current.isRecording).toBe(false);
    });

    it('should apply correct bitrates and block changes during recording', () => {
        let capturedOptions: any;
        const OriginalMediaRecorder = global.MediaRecorder;

        // Spy version of MediaRecorder to capture options
        global.MediaRecorder = class extends OriginalMediaRecorder {
            constructor(stream: any, options: any) {
                super(stream, options);
                capturedOptions = options;
            }
        } as any;

        const { result } = renderHook(() => useSessionRecorder(mockStream));

        // 1. Test Low Quality Bitrate
        act(() => {
            result.current.setQuality('low');
        });
        act(() => {
            result.current.startRecording();
        });
        expect(capturedOptions.videoBitsPerSecond).toBe(256000);

        // 2. Test blocking quality change while recording
        act(() => {
            result.current.setQuality('high');
        });
        expect(result.current.quality).toBe('low'); // Should NOT change

        act(() => {
            result.current.stopRecording();
        });

        // 3. Test High Quality Bitrate (after stopping)
        act(() => {
            result.current.setQuality('high');
        });
        act(() => {
            result.current.startRecording();
        });
        expect(capturedOptions.videoBitsPerSecond).toBe(2500000);

        global.MediaRecorder = OriginalMediaRecorder;
    });

    it('should provide intelligent quality recommendations', () => {
        // Test Low recommendation (no video)
        const { result: lowResult } = renderHook(() => useSessionRecorder(mockStream));
        expect(lowResult.current.recommendedQuality).toBe('low');

        // Test Balanced/High recommendation (with video)
        const videoStream = {
            getVideoTracks: () => [{
                enabled: true,
                getSettings: () => ({ width: 1280, height: 720 })
            }],
            getTracks: () => []
        } as any;

        const { result: highResult } = renderHook(() => useSessionRecorder(videoStream));
        expect(highResult.current.recommendedQuality).toBe('high');
    });
});
