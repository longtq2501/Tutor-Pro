export enum FeedbackStatus {
    DRAFT = 'DRAFT',
    SUBMITTED = 'SUBMITTED'
}

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

export interface GenerateCommentRequest {
    category: 'ATTITUDE' | 'ABSORPTION' | 'GAPS' | 'SOLUTIONS';
    ratingLevel: string;
    keywords: string[];
    studentName?: string;
}

export interface GenerateCommentResponse {
    generatedComment: string;
    usedScenarioIds: number[];
}
