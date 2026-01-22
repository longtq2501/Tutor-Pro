/**
 * TypeScript types for the Online Session feature.
 * Must match the backend DTOs in com.tutor_management.backend.modules.onlinesession.dto.
 */

export interface OnlineSessionResponse {
    id: number;
    roomId: string;
    roomStatus: 'WAITING' | 'ACTIVE' | 'ENDED';
    scheduledStart: string;
    scheduledEnd: string;
    actualStart?: string;
    actualEnd?: string;
    tutorId: number;
    tutorName: string;
    studentId: number;
    studentName: string;
    canJoinNow: boolean;
}

export interface JoinRoomResponse {
    token: string;
    session: OnlineSessionResponse;
    turnServers: Array<Record<string, unknown>>;
}

export interface RoomStatsResponse {
    roomId: string;
    roomStatus: string;
    tutorName: string;
    studentName: string;
    tutorPresent: boolean;
    studentPresent: boolean;
    participantCount: number;
    scheduledStart: string;
    scheduledEnd: string;
    actualStart?: string;
    actualEnd?: string;
    tutorJoinedAt?: string;
    studentJoinedAt?: string;
    durationMinutes: number;
    recordingEnabled: boolean;
    recordingDownloaded: boolean;
    recordingDurationMinutes: number;
    recordingFileSizeMb: string;
}

export interface GlobalStatsResponse {
    totalSessions: number;
    activeSessions: number;
    waitingSessions: number;
    endedSessions: number;
    totalDurationMinutes: number;
    sessionsToday: number;
    averageSessionDuration: number;
}

export interface CreateOnlineSessionRequest {
    tutorId?: number;
    studentId: number;
    scheduledStart: string;
    scheduledEnd: string;
}

export type SessionStatusType =
    | 'PARTICIPANT_JOINED'
    | 'PARTICIPANT_LEFT'
    | 'INACTIVITY_WARNING'
    | 'ROOM_AUTO_ENDED';

export interface SessionStatusResponse {
    roomId: string;
    type: SessionStatusType;
    userId?: number;
    role?: string;
    remainingSeconds?: number;
    message: string;
}

export interface UpdateRecordingMetadataRequest {
    durationMinutes: number;
    fileSizeMb: number;
}
