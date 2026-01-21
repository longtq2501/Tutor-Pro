import { onlineSessionApi } from '@/lib/services/onlineSession';
import { useInfiniteQuery } from '@tanstack/react-query';

/**
 * Hook for fetching and paginating upcoming online sessions for the current user.
 * Uses cursor-based pagination (Window) from the backend.
 * 
 * @param {number} size - Number of sessions to fetch per page
 * @returns {object} Infinite query object
 */
export function useUpcomingSessions(size: number = 5) {
    return useInfiniteQuery({
        queryKey: ['live-sessions', 'upcoming'],
        queryFn: ({ pageParam }) => onlineSessionApi.getMySessions(pageParam, size),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => {
            if (lastPage.last) return undefined;
            return lastPage.position?.value;
        },
        staleTime: 30000, // 30 seconds
        gcTime: 5 * 60 * 1000, // 5 minutes
        refetchInterval: 30000, // Auto-refetch every 30 seconds
    });
}
