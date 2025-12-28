import axiosInstance from './axios-instance';
import { ApiResponse } from '../types/common';
import { CourseAssignmentDTO, StudentCourseDetailDTO } from '../../features/learning/courses/types';

export const courseStudentApi = {
    getMyCourses: async (): Promise<CourseAssignmentDTO[]> => {
        const response = await axiosInstance.get<ApiResponse<CourseAssignmentDTO[]>>('/student/courses');
        return response.data.data;
    },

    getCourseDetail: async (id: number): Promise<StudentCourseDetailDTO> => {
        const response = await axiosInstance.get<ApiResponse<StudentCourseDetailDTO>>(`/student/courses/${id}`);
        return response.data.data;
    },
};
