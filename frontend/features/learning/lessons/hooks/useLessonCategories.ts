import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LessonCategoryDTO, LessonCategoryRequest } from '../types';
import { lessonCategoryApi } from '@/lib/services';
import { toast } from 'sonner';

export const useLessonCategories = () => {
    const queryClient = useQueryClient();

    const { data: categories = [], isLoading } = useQuery({
        queryKey: ['lesson-categories'],
        queryFn: lessonCategoryApi.getAll,
        staleTime: 24 * 60 * 60 * 1000, // Cache for 24 hours (categories rarely change)
    });

    const createCategory = async (request: LessonCategoryRequest) => {
        const toastId = toast.loading('Đang tạo danh mục...');
        try {
            const newCategory = await lessonCategoryApi.create(request);
            queryClient.setQueryData(['lesson-categories'], (old: LessonCategoryDTO[] | undefined) =>
                old ? [...old, newCategory] : [newCategory]
            );
            toast.success('Đã tạo danh mục', { id: toastId });
            return newCategory;
        } catch (error) {
            console.error('Error creating category:', error);
            toast.error('Lỗi khi tạo danh mục', { id: toastId });
            throw error;
        }
    };

    const updateCategory = async (id: number, request: LessonCategoryRequest) => {
        const toastId = toast.loading('Đang cập nhật danh mục...');
        try {
            const updatedCategory = await lessonCategoryApi.update(id, request);
            queryClient.setQueryData(['lesson-categories'], (old: LessonCategoryDTO[] | undefined) =>
                old ? old.map((c) => (c.id === id ? updatedCategory : c)) : [updatedCategory]
            );
            toast.success('Đã cập nhật danh mục', { id: toastId });
            return updatedCategory;
        } catch (error) {
            console.error('Error updating category:', error);
            toast.error('Lỗi khi cập nhật danh mục', { id: toastId });
            throw error;
        }
    };

    const deleteCategory = async (id: number) => {
        const toastId = toast.loading('Đang xóa danh mục...');
        try {
            await lessonCategoryApi.delete(id);
            queryClient.setQueryData(['lesson-categories'], (old: LessonCategoryDTO[] | undefined) =>
                old ? old.filter((c) => c.id !== id) : []
            );
            toast.success('Đã xóa danh mục', { id: toastId });
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('Lỗi khi xóa danh mục', { id: toastId });
            throw error;
        }
    };

    return {
        categories,
        isLoading,
        createCategory,
        updateCategory,
        deleteCategory,
    };
};
