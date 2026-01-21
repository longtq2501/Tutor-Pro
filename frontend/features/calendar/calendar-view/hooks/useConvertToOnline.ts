import { sessionsApi } from '@/lib/services/session';
import type { OnlineSessionResponse } from '@/lib/types/onlineSession';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface ApiError {
    response?: {
        status: number;
        data?: {
            message?: string;
        };
    };
}

/**
 * Hook for converting a session record to an online session.
 * Handles the API call, loading states, and query invalidation.
 */
export function useConvertToOnline() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (sessionId: number) => sessionsApi.convertToOnline(sessionId),
        onSuccess: async (data: OnlineSessionResponse) => {
            toast.success('Đã chuyển đổi sang buổi học Online thành công!', {
                action: {
                    label: 'Vào phòng ngay',
                    onClick: () => {
                        window.location.href = `/live-teaching/${data.roomId}`;
                    }
                },
                duration: 8000
            });

            // Invalidate queries to sync UI
            await queryClient.invalidateQueries({ queryKey: ['calendar-sessions'] });
            await queryClient.invalidateQueries({ queryKey: ['live-sessions'] });
            await queryClient.invalidateQueries({ queryKey: ['online-sessions'] });

            // Fix: Race Condition in session invalidation
            // Poll for the new session to ensure it is indexed and visible in the lobby
            const maxAttempts = 5;
            for (let i = 0; i < maxAttempts; i++) {
                await new Promise(r => setTimeout(r, 500));
                const current = queryClient.getQueryData<OnlineSessionResponse | null>(['live-sessions', 'current']);

                if (current?.roomId === data.roomId) {
                    break;
                }

                // Force a refetch if not found in cache yet
                await queryClient.refetchQueries({ queryKey: ['live-sessions', 'current'] });
            }
        },
        onError: (error: ApiError) => {
            const status = error.response?.status;
            const backendMessage = error.response?.data?.message;

            let userMessage = 'Không thể chuyển đổi sang Online';
            let description = '';

            switch (status) {
                case 403:
                    userMessage = 'Bạn không có quyền chuyển đổi buổi học này';
                    description = 'Chỉ giáo viên được phép chuyển đổi sang Online';
                    break;
                case 409:
                    userMessage = 'Buổi học đã được chuyển sang Online rồi';
                    description = 'Vui lòng kiểm tra lại trong tab "Dạy Online"';
                    break;
                case 400:
                    userMessage = backendMessage || 'Không thể chuyển đổi buổi học này';
                    description = 'Chỉ có thể chuyển buổi học ở trạng thái chưa bắt đầu';
                    break;
                default:
                    userMessage = backendMessage || userMessage;
            }

            toast.error(userMessage, { description });
            console.error('Conversion failed:', error);
        }
    });
}
