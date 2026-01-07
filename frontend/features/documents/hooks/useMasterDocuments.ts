
// ============================================================================
// FILE: lib/hooks/useMasterData.ts
// ============================================================================
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { documentsApi } from '@/lib/services';
import { queryKeys } from '@/lib/hooks/useQueryKeys';
import type { Document, DocumentCategory } from '@/lib/types';
import type { PageResponse } from '@/lib/types/common';

// --- NEW PAGINATED HOOKS ---

export const useDocuments = (
    page: number = 0,
    size: number = 10,
    category?: DocumentCategory
) => {
    return useQuery({
        queryKey: category
            ? [...queryKeys.documents.all, 'category', category, page, size]
            : [...queryKeys.documents.all, 'list', page, size],
        queryFn: () => category
            ? documentsApi.getByCategory(category, page, size)
            : documentsApi.getAll(page, size),
        placeholderData: (previousData, previousQuery) => {
            const prevKey = previousQuery?.queryKey;
            // Check if we are in the same context (List vs Category)
            if (category) {
                // If staying in same category: keep data
                if (prevKey?.[2] === 'category' && prevKey?.[3] === category) return previousData;
            } else {
                // If staying in 'list' mode: keep data
                if (prevKey?.[2] === 'list') return previousData;
            }
            return undefined;
        },
        staleTime: 60 * 1000,
    });
};

export const useCategories = () => {
    return useQuery({
        queryKey: [...queryKeys.documents.all, 'categories'],
        queryFn: documentsApi.getCategories,
        staleTime: 24 * 60 * 60 * 1000, // Cache for 24h
    });
};

// --- LEGACY SUPPORT (CAUTION: FEAVY FETCH) ---

// Fetch globally once (simulated "Master" list by fetching large page)
const fetchAllDocuments = async (): Promise<Document[]> => {
    // Fetch a large page to simulate "All"
    const response = await documentsApi.getAll(0, 1000);
    return response.content || [];
};

export const useMasterDocuments = <T = Document[]>(
    select?: (data: Document[]) => T
) => {
    return useQuery({
        queryKey: [...queryKeys.documents.all, 'master'],
        queryFn: fetchAllDocuments,
        staleTime: 5 * 60 * 1000,
        select,
        refetchOnWindowFocus: false,
    });
};

export const useMasterExercises = () => {
    return useMasterDocuments((documents) =>
        documents.filter(doc => doc.category === 'EXERCISES' || doc.category === 'EXAM')
    );
};

export const useExerciseSelector = (studentId?: number) => {
    return useMasterDocuments((documents) => {
        return documents.filter(doc => {
            const isExercise = doc.category === 'EXERCISES' || doc.category === 'EXAM';
            const isVisible = !doc.studentId || (studentId && doc.studentId === studentId);
            return isExercise && isVisible;
        });
    });
};
