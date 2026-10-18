// Note: Created SubmissionStatus in exercise.types earlier, but maybe should have been separate. 
// I'll define submission types here.

export enum SubmissionStatusEnum {
    PENDING = 'PENDING',
    DRAFT = 'DRAFT',
    SUBMITTED = 'SUBMITTED',
    AUTO_SUBMITTED = 'AUTO_SUBMITTED',
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
    /** True when the system collected the attempt after the deadline instead of the student. */
    autoSubmitted?: boolean;
    /** True when every question was left blank. Used to collapse the grading page (FB-03). */
    hasAnswers?: boolean;
    /** True when the tutor exempted the attempt from grading (FB-04). */
    exempted?: boolean;
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
    /** True when the system collected the attempt after the deadline instead of the student. */
    autoSubmitted?: boolean;
    /** True when every question was left blank. */
    hasAnswers?: boolean;
    /** True when the tutor exempted the attempt from grading. */
    exempted?: boolean;
}

/** Payload for granting one student a new deadline (FB-04). */
export interface ExtendDeadlineRequest {
    /** ISO-8601 local date-time string, e.g. `2026-10-31T23:59`. */
    deadline: string;
}
