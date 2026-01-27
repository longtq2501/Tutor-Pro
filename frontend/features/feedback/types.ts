/**
 * Represents the lifecycle status of a session feedback record.
 */
export enum FeedbackStatus {
    DRAFT = 'DRAFT',
    SUBMITTED = 'SUBMITTED'
}

/**
 * Payload for creating or updating a session feedback record.
 */
export interface SessionFeedbackRequest {
    sessionRecordId: number;
    studentId: number;
    lessonContent: string;
    attitudeRating: string;
    attitudeComment: string;
    absorptionRating: string;
    absorptionComment: string;
    knowledgeGaps: string;
    solutions: string;
    status: FeedbackStatus;
}

export interface SessionFeedbackResponse {
    id: number;
    sessionRecordId: number;
    studentId: number;
    studentName: string;
    sessionDate: string; // ISO Date

    lessonContent: string;

    attitudeRating: string;
    attitudeComment: string;

    absorptionRating: string;
    absorptionComment: string;

    knowledgeGaps: string;
    solutions: string;

    status: FeedbackStatus;
    createdAt: string;
    updatedAt: string;
}

/**
 * Parameters for the AI Comment Generation API.
 */
export interface GenerateCommentRequest {
    category: 'ATTITUDE' | 'ABSORPTION' | 'GAPS' | 'SOLUTIONS';
    ratingLevel: string;
    keywords: string[];
    studentName?: string;
    subject?: string;
    language?: string;
    tone?: string;
    length?: string;
    forceRefresh?: boolean;
}

export interface GenerateCommentResponse {
    generatedComment: string;
    usedScenarioIds: number[];
}
