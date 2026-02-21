export type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type AssignmentStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface CourseLessonDTO {
    id: number;
    lessonId: number;
    title: string;
    summary?: string;
    lessonOrder: number;
    isRequired: boolean;
}

export interface CourseDTO {
    id: number;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    difficultyLevel: DifficultyLevel;
    estimatedHours?: number;
    isPublished: boolean;
    tutorName: string;
    lessonCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface CourseDetailDTO extends Omit<CourseDTO, 'lessonCount'> {
    lessons: CourseLessonDTO[];
}

export interface CourseRequest {
    title: string;
    description?: string;
    thumbnailUrl?: string;
    difficultyLevel?: DifficultyLevel;
    estimatedHours?: number;
    isPublished?: boolean;
    lessonIds?: number[];
}

export interface CourseAssignmentDTO {
    id: number;
    courseId: number;
    courseTitle: string;
    studentId: number;
    studentName: string;
    assignedDate: string;
    deadline?: string;
    status: AssignmentStatus;
    progressPercentage: number;
    completedAt?: string;
}

export interface AssignCourseRequest {
    studentIds: number[];
    deadline?: string;
}
export interface StudentCourseLessonDTO extends CourseLessonDTO {
    isCompleted: boolean;
    completedAt?: string;
    videoProgress?: number;
    canUnlockNext?: boolean;
}

export interface StudentCourseDetailDTO extends Omit<CourseDTO, 'lessonCount' | 'isPublished' | 'createdAt' | 'updatedAt'> {
    status: AssignmentStatus;
    progressPercentage: number;
    assignedDate: string;
    deadline?: string;
    completedAt?: string;
    lessons: StudentCourseLessonDTO[];
}
