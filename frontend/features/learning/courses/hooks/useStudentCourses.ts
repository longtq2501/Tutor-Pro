import { useQuery } from '@tanstack/react-query';
import { courseStudentApi } from '@/lib/services';

export const useMyCourses = () => {
    return useQuery({
        queryKey: ['my-courses'],
        queryFn: courseStudentApi.getMyCourses,
    });
};

export const useStudentCourseDetail = (id: number | null) => {
    return useQuery({
        queryKey: ['student-course-detail', id],
        queryFn: () => (id ? courseStudentApi.getCourseDetail(id) : null),
        enabled: !!id,
    });
};
