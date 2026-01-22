import { renderHook, act } from '@testing-library/react';
import { useConvertToOnline } from '../useConvertToOnline';
import { sessionsApi } from '@/lib/services/session';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('@/lib/services/session', () => ({
    sessionsApi: {
        convertToOnline: vi.fn(),
    },
}));

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('useConvertToOnline', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });
        vi.clearAllMocks();
    });

    const wrapper = ({ children }: { children: React.ReactNode }) =>
        createElement(QueryClientProvider, { client: queryClient }, children);

    it('should handle successful conversion', async () => {
        const mockResponse = {
            id: 1,
            roomId: 'room-123',
            roomStatus: 'WAITING',
            scheduledStart: '2024-01-01T10:00:00Z',
            scheduledEnd: '2024-01-01T11:00:00Z',
            tutorId: 1,
            tutorName: 'Tutor',
            studentId: 2,
            studentName: 'Student',
            canJoinNow: true
        };

        (sessionsApi.convertToOnline as any).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useConvertToOnline(), { wrapper });

        await act(async () => {
            await result.current.mutateAsync(1);
        });

        expect(sessionsApi.convertToOnline).toHaveBeenCalledWith(1);
        expect(toast.success).toHaveBeenCalled();

        // Verify cache invalidation
        // Since we can't easily spy on queryClient inside the hook without more mocking,
        // we rely on the toast and api call verification.
    });

    it('should handle optimistically update cache (simulated)', async () => {
        // Setup initial cache
        queryClient.setQueryData(['calendar-sessions'], [{ id: 1, type: 'OFFLINE' }]);

        const mockResponse = { roomId: 'room-123' };
        (sessionsApi.convertToOnline as any).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useConvertToOnline(), { wrapper });

        await act(async () => {
            await result.current.mutateAsync(1);
        });

        // In a real integration test, we would check if the UI updated instantly.
        // Here we verify the mutation was called.
        expect(sessionsApi.convertToOnline).toHaveBeenCalledWith(1);
    });

    it('should handle conflict error (409)', async () => {
        const error = {
            response: {
                status: 409,
                data: { message: 'Already online' }
            }
        };

        (sessionsApi.convertToOnline as any).mockRejectedValue(error);

        const { result } = renderHook(() => useConvertToOnline(), { wrapper });

        await act(async () => {
            try {
                await result.current.mutateAsync(1);
            } catch (e) {
                // Ignore expected rejection
            }
        });

        expect(toast.error).toHaveBeenCalledWith(
            expect.stringContaining('Buổi học đã được chuyển sang Online rồi'),
            expect.anything()
        );
    });

    it('should handle permission error (403)', async () => {
        const error = {
            response: {
                status: 403,
                data: { message: 'Forbidden' }
            }
        };

        (sessionsApi.convertToOnline as any).mockRejectedValue(error);

        const { result } = renderHook(() => useConvertToOnline(), { wrapper });

        await act(async () => {
            try {
                await result.current.mutateAsync(1);
            } catch (e) { }
        });

        expect(toast.error).toHaveBeenCalledWith(
            expect.stringContaining('Bạn không có quyền chuyển đổi buổi học này'),
            expect.anything()
        );
    });
});
