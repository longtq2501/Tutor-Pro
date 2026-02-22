import { Document as DocumentType } from './document';
import { Student } from './student';


export interface OverviewStats {
    totalTutors: number;
    activeTutors: number;
    inactiveTutors: number;
    suspendedTutors: number;
    totalStudents: number;
    activeStudents: number;
    totalRevenueThisMonth: string;
    totalRevenueAllTime: string;
    totalRevenue: number;
    totalSessions: number;
    proAccounts: number;
    freeAccounts: number;
    pendingIssues: number;
}

export interface MonthlyRevenue {
    month: string;
    totalRevenue: number;
}

export interface ActivityLog {
    id: number;
    type: string;
    actorName: string;
    actorRole: string;
    description: string;
    createdAt: string;
}

export interface AdminStudent extends Student {
    tutorId: number;
    tutorName: string;
    totalDebt: number;
}

export interface AdminDocument extends DocumentType {
    tutorId: number;
    tutorName: string;
}

export interface AdminDocumentStats {
    totalDocuments: number;
    totalDownloads: number;
    totalStorageMB: number;
}
