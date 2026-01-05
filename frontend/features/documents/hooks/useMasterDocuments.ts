
// ============================================================================
// FILE: lib/hooks/useMasterData.ts
// ============================================================================
import { useQuery } from '@tanstack/react-query';
import { documentsApi } from '@/lib/services';
import { queryKeys } from '@/lib/hooks/useQueryKeys';
import type { Document } from '@/lib/types';

// Fetch globally once
const fetchDocuments = async (): Promise<Document[]> => {
    const response = await documentsApi.getAll();
    // Ensure we always return an array
    return Array.isArray(response) ? response : [];
};

export const useMasterDocuments = <T = Document[]>(
    select?: (data: Document[]) => T
) => {
    return useQuery({
        queryKey: queryKeys.documents.all,
        queryFn: fetchDocuments,
        staleTime: 5 * 60 * 1000, // 5 mins - Data rarely changes rapidly
        gcTime: 30 * 60 * 1000,   // 30 mins - Keep in cache longer
        select,                   // Data slicing capability
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
            // Show if it's an exercise AND (it's public OR assigned to this student)
            const isVisible = !doc.studentId || (studentId && doc.studentId === studentId);
            return isExercise && isVisible;
        });
    });
};
