export enum QuestionType {
    MCQ = 'MCQ',
    ESSAY = 'ESSAY',
}

export enum ExerciseStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED',
}

export interface Option {
    id?: string;
    questionId?: string;
    label: string; // A, B, C, D
    optionText: string;
    isCorrect?: boolean;
}

export interface Question {
    id?: string;
    exerciseId?: string;
    type: QuestionType;
    questionText: string;
    imageUrl?: string;
    points: number;
    orderIndex: number;
    rubric?: string;
    options?: Option[];
    correctAnswer?: string; // For frontend convenience in forms
}

export interface Exercise {
    id: string;
    title: string;
    description?: string;
    timeLimit?: number; // minutes
    totalPoints: number;
    deadline?: string; // ISO date string
    status: ExerciseStatus;
    classId?: string;
    createdBy: string;
    createdAt: string;
    updatedAt?: string;
    questions?: Question[];
}

// Request DTOs
export interface ImportExerciseRequest {
    content: string;
    classId?: string;
}

export interface CreateExerciseRequest {
    title: string;
    description?: string;
    timeLimit?: number;
    totalPoints: number;
    deadline?: string;
    classId?: string;
    status?: ExerciseStatus;
    questions: QuestionRequest[];
}

export interface QuestionRequest {
    type: QuestionType;
    questionText: string;
    imageUrl?: string;
    points: number;
    orderIndex: number;
    options?: OptionRequest[];
    correctAnswer?: string;
    rubric?: string;
}

export interface OptionRequest {
    label: string;
    optionText: string;
}

export interface AssignExerciseRequest {
    studentId: string;
    deadline?: string;
}

// Response DTOs
export interface OptionPreview {
    label: string;
    optionText: string;
    isCorrect?: boolean;
}

export interface QuestionPreview {
    type: QuestionType;
    questionText: string;
    imageUrl?: string;
    points: number;
    orderIndex: number;
    rubric?: string;
    options?: OptionPreview[];
    correctAnswer?: string;
}

export interface ExerciseMetadata {
    title?: string;
    description?: string;
    timeLimit?: number;
    totalPoints?: number;
    classId?: string;
}

export interface ImportPreviewResponse {
    metadata: ExerciseMetadata;
    questions: QuestionPreview[];
    validationErrors: string[];
    isValid: boolean;
}

export interface ExerciseListItemResponse {
    id: string;
    title: string;
    description?: string;
    totalPoints: number;
    timeLimit?: number; // Added timeLimit
    deadline?: string;
    status: ExerciseStatus;
    questionCount: number;
    submissionCount: number;
    createdAt: string;

    // Student specific submission info
    submissionId?: string;
    submissionStatus?: string;
    studentTotalScore?: number;
    /** True when the system collected the attempt after the deadline (FB-01). */
    autoSubmitted?: boolean;
    /** True when the tutor exempted the attempt from grading (FB-04). */
    exempted?: boolean;
}

export interface TutorStudentSummaryResponse {
    studentId: string;
    studentName: string;
    grade: string;
    pendingCount: number;
    submittedCount: number;
    gradedCount: number;
    /** Attempts collected by the system after the deadline — kept out of `gradedCount` (FB-01/FB-02). */
    autoSubmittedCount?: number;
    /** Attempts the tutor exempted from grading (FB-04). */
    exemptedCount?: number;
    totalAssigned: number;
    /** Completed attempts that were actually done by the student (FB-02). */
    completedCount?: number;
    /** Mean score over attempts that count towards progress; `null` when there is nothing to average (FB-02). */
    averageScore?: number | null;
    recentExercises?: ExerciseStatusSummary[];
}

export interface ExerciseStatusSummary {
    exerciseId: string;
    title: string;
    status: string;
    score?: number;
    /** True when the system collected this attempt after the deadline (FB-01). */
    autoSubmitted?: boolean;
}

