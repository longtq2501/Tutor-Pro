import api from '@/lib/services/axios-instance';
import { ApiResponse } from '@/lib/types';
import {
    CreateSubmissionRequest,
    ExtendDeadlineRequest,
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
    },

    /**
     * Reopen a system-collected or graded attempt so the student can work on it again (FB-04).
     */
    reopen: async (id: string): Promise<SubmissionResponse> => {
        const response = await api.post<ApiResponse<SubmissionResponse>>(`/submissions/${id}/reopen`);
        return response.data.data;
    },

    /**
     * Grant a single student an extended deadline for the exercise behind this attempt (FB-04).
     */
    extendDeadline: async (id: string, data: ExtendDeadlineRequest): Promise<SubmissionResponse> => {
        const response = await api.post<ApiResponse<SubmissionResponse>>(
            `/submissions/${id}/extend`,
            data
        );
        return response.data.data;
    },

    /**
     * Exempt an attempt from grading so it stops counting as pending work (FB-04).
     */
    exempt: async (id: string): Promise<SubmissionResponse> => {
        const response = await api.post<ApiResponse<SubmissionResponse>>(`/submissions/${id}/exempt`);
        return response.data.data;
    },

    /**
     * Reset a graded attempt so the tutor can grade it from scratch again (FB-04).
     */
    regrade: async (id: string): Promise<SubmissionResponse> => {
        const response = await api.post<ApiResponse<SubmissionResponse>>(`/submissions/${id}/regrade`);
        return response.data.data;
    }
};
