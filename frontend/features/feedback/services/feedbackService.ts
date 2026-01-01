import {
    GenerateCommentRequest,
    GenerateCommentResponse,
    SessionFeedbackRequest,
    SessionFeedbackResponse
} from '@/features/feedback/types';
import axios from '@/lib/services/axios-instance';

const BASE_URL = '/feedbacks';

export const feedbackService = {
    createFeedback: async (data: SessionFeedbackRequest): Promise<number> => {
        const response = await axios.post<number>(BASE_URL, data);
        return response.data;
    },

    updateFeedback: async (id: number, data: SessionFeedbackRequest): Promise<number> => {
        const response = await axios.put<number>(`${BASE_URL}/${id}`, data);
        return response.data;
    },

    getFeedbackById: async (id: number): Promise<SessionFeedbackResponse> => {
        const response = await axios.get<SessionFeedbackResponse>(`${BASE_URL}/${id}`);
        return response.data;
    },

    getFeedbackBySession: async (sessionId: number, studentId: number): Promise<SessionFeedbackResponse | null> => {
        try {
            const response = await axios.get<SessionFeedbackResponse>(`${BASE_URL}/session/${sessionId}/student/${studentId}`);
            return response.data;
        } catch (error) {
            // Return null if not found (404)
            return null;
        }
    },

    // --- Smart Generator ---
    
    generateComment: async (req: GenerateCommentRequest): Promise<GenerateCommentResponse> => {
        const response = await axios.post<GenerateCommentResponse>(`${BASE_URL}/generate`, req);
        return response.data;
    },

    getKeywords: async (category: string, ratingLevel: string): Promise<string[]> => {
        const response = await axios.get<string[]>(`${BASE_URL}/keywords`, {
            params: { category, ratingLevel }
        });
        return response.data;
    },
    
    getClipboardContent: async (id: number): Promise<string> => {
        const response = await axios.get<string>(`${BASE_URL}/${id}/clipboard`);
        return response.data;
    },
    
    exportStudentFeedback: async (studentId: number) => {
        const response = await axios.get(`${BASE_URL}/export/student/${studentId}`, {
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Feedback_History_${studentId}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
};
