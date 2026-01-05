import api from '@/lib/services/axios-instance';
import { ApiResponse } from '@/lib/types';
import {
    CreateExerciseRequest,
    Exercise,
    ExerciseListItemResponse,
    ExerciseStatus,
    ImportExerciseRequest,
    ImportPreviewResponse,
    AssignExerciseRequest,
} from '../types/exercise.types';

export const exerciseService = {
    /**
     * Parse text content to preview exercise import
     */
    importPreview: async (content: string, classId?: string): Promise<ImportPreviewResponse> => {
        const request: ImportExerciseRequest = { content, classId };
        const response = await api.post<ApiResponse<ImportPreviewResponse>>('/exercises/import/text', request);
        return response.data.data;
    },

    /**
     * Create a new exercise
     */
    create: async (data: CreateExerciseRequest): Promise<Exercise> => {
        const response = await api.post<ApiResponse<Exercise>>('/exercises', data);
        return response.data.data;
    },

    /**
     * Update an existing exercise
     */
    update: async (id: string, data: CreateExerciseRequest): Promise<Exercise> => {
        const response = await api.put<ApiResponse<Exercise>>(`/exercises/${id}`, data);
        return response.data.data;
    },

    /**
     * Get exercise by ID
     */
    getById: async (id: string): Promise<Exercise> => {
        const response = await api.get<ApiResponse<Exercise>>(`/exercises/${id}`);
        return response.data.data;
    },

    /**
     * List exercises with optional filters
     */
    getAll: async (classId?: string, status?: ExerciseStatus): Promise<ExerciseListItemResponse[]> => {
        const params: { classId?: string; status?: string } = {};
        if (classId) params.classId = classId;
        if (status) params.status = status;

        const response = await api.get<ApiResponse<ExerciseListItemResponse[]>>('/exercises', { params });
        return response.data.data;
    },

    /**
     * Delete an exercise
     */
    delete: async (id: string): Promise<void> => {
        const response = await api.delete<ApiResponse<void>>(`/exercises/${id}`);
        return response.data.data;
    },

    /**
     * Assign exercise to a specific student
     */
    assign: async (exerciseId: string, data: AssignExerciseRequest): Promise<void> => {
        const response = await api.post<ApiResponse<void>>(`/exercises/${exerciseId}/assign`, data);
        return response.data.data;
    },

    /**
     * Get exercises assigned to the current student
     */
    getAssigned: async (): Promise<ExerciseListItemResponse[]> => {
        const response = await api.get<ApiResponse<ExerciseListItemResponse[]>>('/exercises/assigned');
        return response.data.data;
    },
};
