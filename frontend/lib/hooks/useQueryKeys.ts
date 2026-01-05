
// ============================================================================
// FILE: lib/hooks/useQueryKeys.ts
// ============================================================================

export const queryKeys = {
    documents: {
        all: ['documents'] as const,
        byCategory: (category: string) => [...queryKeys.documents.all, 'category', category] as const,
        byId: (id: number) => [...queryKeys.documents.all, 'detail', id] as const,
    },
    homeworks: {
        all: ['homeworks'] as const,
        byStudent: (studentId: number) => [...queryKeys.homeworks.all, 'student', studentId] as const,
        detail: (id: number) => [...queryKeys.homeworks.all, 'detail', id] as const,
    },
    students: {
        all: ['students'] as const,
        detail: (id: number) => [...queryKeys.students.all, 'detail', id] as const,
    },
    exercises: {
        all: ['exercises'] as const,
        assigned: () => [...queryKeys.exercises.all, 'assigned'] as const,
        byId: (id: string) => [...queryKeys.exercises.all, 'detail', id] as const,
    },
};
