import { onlineSessionApi } from '@/lib/services/onlineSession';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook for fetching the current active or next upcoming online session for the user.
 * 
 * @returns {object} Query object
 */
export function useCurrentSession() {
    return useQuery({
        queryKey: ['live-sessions', 'current'],
        queryFn: () => onlineSessionApi.getCurrentSession(),
        staleTime: 30000, // 30 seconds
        refetchInterval: 60000, // Refresh every minute to update countdowns/status
    });
}
