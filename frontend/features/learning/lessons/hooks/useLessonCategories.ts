import { useState, useEffect, useCallback } from 'react';
import { LessonCategoryDTO, LessonCategoryRequest } from '../types';
import { lessonCategoryApi } from '@/lib/services';
import { toast } from 'sonner';

export const useLessonCategories = () => {
    const [categories, setCategories] = useState<LessonCategoryDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await lessonCategoryApi.getAll();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Không thể tải danh mục');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const createCategory = async (request: LessonCategoryRequest) => {
        const toastId = toast.loading('Đang tạo danh mục...');
        try {
            const newCategory = await lessonCategoryApi.create(request);
            setCategories((prev) => [...prev, newCategory]);
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
            setCategories((prev) => prev.map((c) => (c.id === id ? updatedCategory : c)));
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
            setCategories((prev) => prev.filter((c) => c.id !== id));
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
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
    };
};
