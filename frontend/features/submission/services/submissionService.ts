import api from '@/lib/services/axios-instance';
import { ApiResponse } from '@/lib/types';
import {
    CreateSubmissionRequest,
    GradeSubmissionRequest,
    SubmissionListItemResponse,
    SubmissionResponse
} from '../types/submission.types';

export const submissionService = {
    /**
     * Save draft submission
     */
    saveDraft: async (data: CreateSubmissionRequest): Promise<SubmissionResponse> => {
        const response = await api.post<ApiResponse<SubmissionResponse>>('/submissions/draft', data);
        return response.data.data;
    },

    /**
     * Submit exercise
     */
    submit: async (data: CreateSubmissionRequest): Promise<SubmissionResponse> => {
        const response = await api.post<ApiResponse<SubmissionResponse>>('/submissions', data);
        return response.data.data;
    },

    /**
     * Get submission by ID
     */
    getById: async (id: string): Promise<SubmissionResponse> => {
        const response = await api.get<ApiResponse<SubmissionResponse>>(`/submissions/${id}`);
        return response.data.data;
    },

    /**
     * Get submission by exercise and student
     */
    getByExerciseAndStudent: async (exerciseId: string, studentId: string): Promise<SubmissionResponse> => {
        const response = await api.get<ApiResponse<SubmissionResponse>>(
            `/submissions/exercise/${exerciseId}/student/${studentId}`
        );
        return response.data.data;
    },

    /**
     * List submissions by exercise
     */
    listByExercise: async (exerciseId: string): Promise<SubmissionListItemResponse[]> => {
        const response = await api.get<ApiResponse<SubmissionListItemResponse[]>>(
            `/submissions/exercise/${exerciseId}`
        );
        return response.data.data;
    },

    /**
    * Grade submission
    */
    gradeSubmission: async (id: string, data: GradeSubmissionRequest): Promise<SubmissionResponse> => {
        const response = await api.put<ApiResponse<SubmissionResponse>>(
            `/submissions/${id}/grade`,
            data
        );
        return response.data.data;
    }
};
