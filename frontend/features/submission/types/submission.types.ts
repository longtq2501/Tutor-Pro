// Note: Created SubmissionStatus in exercise.types earlier, but maybe should have been separate. 
// I'll define submission types here.

export enum SubmissionStatusEnum {
    DRAFT = 'DRAFT',
    SUBMITTED = 'SUBMITTED',
    GRADED = 'GRADED'
}

export interface AnswerRequest {
    questionId: string;
    selectedOption?: string;
    essayText?: string;
}

export interface CreateSubmissionRequest {
    exerciseId: string;
    answers: AnswerRequest[];
}

export interface EssayGradeRequest {
    questionId: string;
    points?: number;
    feedback?: string;
}

export interface GradeSubmissionRequest {
    essayGrades: EssayGradeRequest[];
    teacherComment?: string;
}

export interface StudentAnswerResponse {
    id: string;
    questionId: string;
    selectedOption?: string;
    essayText?: string;
    isCorrect?: boolean;
    points?: number;
    feedback?: string;
}

export interface SubmissionResponse {
    id: string;
    exerciseId: string;
    studentId: string;
    studentName?: string;
    status: SubmissionStatusEnum;
    mcqScore?: number;
    essayScore?: number;
    totalScore?: number;
    submittedAt?: string;
    gradedAt?: string;
    teacherComment?: string;
    answers: StudentAnswerResponse[];
}

export interface SubmissionListItemResponse {
    id: string;
    studentId: string;
    studentName?: string;
    status: SubmissionStatusEnum;
    mcqScore?: number;
    essayScore?: number;
    totalScore?: number;
    submittedAt?: string;
    gradedAt?: string;
}
