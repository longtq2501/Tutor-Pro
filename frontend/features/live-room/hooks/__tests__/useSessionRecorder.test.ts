import { renderHook, act } from '@testing-library/react';
import { useSessionRecorder } from '../useSessionRecorder';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('useSessionRecorder', () => {
    let mockMediaRecorder: any;
    let mockStream: any;

    beforeEach(() => {
        // Mock MediaStream
        mockStream = {
            getVideoTracks: () => [{ enabled: true, getSettings: () => ({ width: 1280, height: 720 }) }],
            getAudioTracks: () => [],
            getTracks: () => [],
        };

        // Mock MediaRecorder
        mockMediaRecorder = {
            start: vi.fn().mockImplementation(() => { mockMediaRecorder.state = 'recording'; }),
            stop: vi.fn().mockImplementation(() => {
                mockMediaRecorder.state = 'inactive';
                if (mockMediaRecorder.onstop) {
                    mockMediaRecorder.onstop();
                }
            }),
            state: 'inactive',
            ondataavailable: null,
            onstop: null,
        };

        // Mock MediaRecorder using class to support 'new'
        class MockMediaRecorder {
            constructor() {
                return mockMediaRecorder;
            }
            static isTypeSupported = vi.fn().mockReturnValue(true);
        }
        global.MediaRecorder = MockMediaRecorder as any;

        // Mock URL.createObjectURL
        global.URL.createObjectURL = vi.fn().mockReturnValue('blob:test');
        global.URL.revokeObjectURL = vi.fn();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with balanced quality', () => {
        const { result } = renderHook(() => useSessionRecorder(mockStream));
        expect(result.current.quality).toBe('balanced');
        expect(result.current.isRecording).toBe(false);
    });

    it('should start recording', () => {
        const { result } = renderHook(() => useSessionRecorder(mockStream));

        act(() => {
            result.current.startRecording();
        });

        expect(result.current.isRecording).toBe(true);
        expect(mockMediaRecorder.start).toHaveBeenCalled();
    });

    it('should stop recording and set preview url', () => {
        const { result } = renderHook(() => useSessionRecorder(mockStream));

        act(() => {
            result.current.startRecording();
        });

        // Simulate data
        act(() => {
            if (mockMediaRecorder.ondataavailable) {
                mockMediaRecorder.ondataavailable({ data: { size: 100 } } as any);
            }
        });

        act(() => {
            result.current.stopRecording();
        });

        expect(result.current.isRecording).toBe(false);
        expect(mockMediaRecorder.stop).toHaveBeenCalled();
        expect(result.current.previewUrl).toBe('blob:test');
    });

    it('should discard recording', () => {
        const { result } = renderHook(() => useSessionRecorder(mockStream));

        act(() => {
            result.current.startRecording();
            if (mockMediaRecorder.ondataavailable) mockMediaRecorder.ondataavailable({ data: { size: 100 } } as any);
            result.current.stopRecording();
        });

        expect(result.current.previewUrl).toBe('blob:test');

        act(() => {
            result.current.discardRecording();
        });

        expect(result.current.previewUrl).toBeNull();
        expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:test');
    });
});
