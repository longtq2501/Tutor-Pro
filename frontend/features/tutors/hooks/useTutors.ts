import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tutorsApi, TutorRequest } from '../../../lib/services/tutor';
import { toast } from 'sonner';

export const useTutors = () => {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<string>('all'); // 'all', 'ACTIVE', 'EXPIRED'

    // Query Key
    const queryKey = ['tutors', page, pageSize, search, status];

    // Fetch Tutors
    const {
        data,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey,
        queryFn: () => tutorsApi.getAll(
            page,
            pageSize,
            search,
            status === 'all' ? '' : status
        ),
        placeholderData: (previousData) => previousData, // Keep previous data while fetching
    });

    // Create Mutation
    const createMutation = useMutation({
        mutationFn: (newTutor: TutorRequest) => tutorsApi.create(newTutor),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tutors'] });
            toast.success('Tutor created successfully');
        },
        onError: (err: any) => {
            toast.error('Failed to create tutor: ' + (err.response?.data?.message || err.message));
        },
    });

    // Update Mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: TutorRequest }) =>
            tutorsApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tutors'] });
            toast.success('Tutor updated successfully');
        },
        onError: (err: any) => {
            toast.error('Failed to update tutor: ' + (err.response?.data?.message || err.message));
        },
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: (id: number) => tutorsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tutors'] });
            toast.success('Tutor deleted successfully');
        },
        onError: (err: any) => {
            toast.error('Failed to delete tutor: ' + (err.response?.data?.message || err.message));
        },
    });

    return {
        tutors: data?.content || [],
        totalElements: data?.totalElements || 0,
        totalPages: data?.totalPages || 0,
        page,
        pageSize,
        search,
        status,
        isLoading,
        isError,
        error,
        setPage,
        setPageSize,
        setSearch,
        setStatus,
        refetch,
        createTutor: createMutation.mutate,
        updateTutor: updateMutation.mutate,
        deleteTutor: deleteMutation.mutate,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};
