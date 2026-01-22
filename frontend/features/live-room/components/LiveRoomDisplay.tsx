'use client';

import React, { useEffect } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { useRoomState } from '../context/RoomStateContext';
import { RoomErrorBoundary } from './RoomErrorBoundary';
import { useLiveRoomMedia } from '../hooks/useLiveRoomMedia';
import { RecordingPreviewDialog } from './RecordingPreviewDialog';
import { RoomMainContent } from './RoomMainContent';
import { useRoomStatus } from '../hooks/useRoomStatus';
import { InactivityWarning } from './InactivityWarning';
import { RoomHeader } from './RoomHeader';
import { MobileNavigation, RoomTab } from './MobileNavigation';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useIsMobile } from '../hooks/useIsMobile';
import { ErrorRecoveryDialog } from './ErrorRecoveryDialog';
import { useRouter, useSearchParams } from 'next/navigation';
import { useHeartbeat } from '../hooks/useHeartbeat';
import { onlineSessionApi } from '@/lib/services/onlineSession';

interface LiveRoomDisplayProps {
    roomId: string;
    currentUserId: number;
}

/**
 * Main display component for the Live Room feature.
 * Features a responsive layout that switches between side-by-side (desktop)
 * and tab-based (mobile) views.
 */
export const LiveRoomDisplay: React.FC<LiveRoomDisplayProps> = ({ roomId, currentUserId }) => {
    const { isConnected, sendMessage } = useWebSocket();
    const { state, actions } = useRoomState();
    const retryCountRef = React.useRef(0);
    const MAX_RETRIES = 3;

    // Media error to user-friendly message
    const getMediaErrorMessage = React.useCallback((error: Error | DOMException | null): string | null => {
        if (!error) return null;
        const errorName = error.name || 'UnknownError';
        const messages: Record<string, string> = {
            NotAllowedError: 'Bạn đã từ chối quyền truy cập camera/microphone. Vui lòng cấp quyền trong cài đặt trình duyệt để tiếp tục.',
            NotFoundError: 'Không tìm thấy camera hoặc microphone. Vui lòng kiểm tra kết nối thiết bị.',
            NotReadableError: 'Camera hoặc microphone đang được sử dụng bởi một ứng dụng khác.',
            OverconstrainedError: 'Thiết bị của bạn không hỗ trợ cấu hình video yêu cầu.',
            TypeError: 'Trình duyệt không hỗ trợ các tính năng media cần thiết.',
            UnknownError: 'Đã xảy ra lỗi không xác định khi truy cập thiết bị media.'
        };
        return messages[errorName] || 'Lỗi truy cập camera/microphone.';
    }, []);

    const media = useLiveRoomMedia();
    const { warning: statusWarning, secondsRemaining } = useRoomStatus(roomId);
    const isMobile = useIsMobile();
    const router = useRouter();
    const searchParams = useSearchParams();
    const autoRecordRef = React.useRef(false);

    // Read recording preference from URL param
    const shouldAutoRecord = searchParams?.get('record') === 'true';

    // Tab persistence logic - Safe for SSR
    const [activeTab, setActiveTab] = React.useState<RoomTab>(() => {
        if (typeof window !== 'undefined') {
            const stored = sessionStorage.getItem(`room-${roomId}-active-tab`);
            if (stored === 'board' || stored === 'video' || stored === 'chat') {
                return stored;
            }
        }
        return 'board'; // Always return 'board' during SSR to prevent mismatch
    });

    // Set mobile default tab after hydration if no preference is stored
    React.useEffect(() => {
        if (isMobile && typeof window !== 'undefined') {
            const stored = sessionStorage.getItem(`room-${roomId}-active-tab`);
            if (!stored) {
                setActiveTab('video');
            }
        }
    }, [isMobile, roomId]);

    const handleTabChange = React.useCallback((tab: RoomTab) => {
        setActiveTab(tab);
        sessionStorage.setItem(`room-${roomId}-active-tab`, tab);

        // Accessibility announcement
        const tabNames = { board: 'Bảng', video: 'Video', chat: 'Chat' };
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = `Đã chuyển sang tab ${tabNames[tab]}`;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }, [roomId]);

    // Keyboard shortcuts for tab switching (Alt + 1/2/3) - Desktop only
    React.useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (!isMobile && e.altKey) {
                if (e.key === '1') handleTabChange('board');
                if (e.key === '2') handleTabChange('video');
                if (e.key === '3') handleTabChange('chat');
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleTabChange, isMobile]);

    const handleRetry = React.useCallback(() => {
        if (retryCountRef.current >= MAX_RETRIES) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('[ErrorRecovery] Max retries reached');
            }
            actions.setError(`Đã thử kết nối lại ${MAX_RETRIES} lần nhưng vẫn thất bại. Vui lòng kiểm tra lại đường truyền mạng.`);
            return;
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log(`[ErrorRecovery] Initiating full retry #${retryCountRef.current + 1}`);
        }
        retryCountRef.current++;

        actions.setConnectionState('INITIALIZING');
        actions.setError(null);
        media.retry({ video: true, audio: true });
    }, [actions, media]);

    const handleAudioOnly = React.useCallback(() => {
        if (process.env.NODE_ENV !== 'production') {
            console.log('[ErrorRecovery] Initiating audio-only fallback');
        }
        actions.setConnectionState('INITIALIZING');
        actions.setError(null);
        media.retry({ video: false, audio: true });
    }, [actions, media]);

    // Start heartbeat
    useHeartbeat(roomId);

    // Fetch initial participant state
    React.useEffect(() => {
        const syncInitialParticipants = async () => {
            try {
                const stats = await onlineSessionApi.getRoomStats(roomId);
                const participants = [];
                if (stats.tutorName && (stats.tutorPresent || stats.tutorJoinedAt)) {
                    participants.push({
                        id: 'tutor', // We might need real IDs here but name/role suffices for timer
                        name: stats.tutorName,
                        role: 'TUTOR' as const,
                        joinedAt: stats.tutorJoinedAt ? new Date(stats.tutorJoinedAt) : new Date(),
                        isMicMuted: false,
                        isCameraMuted: false
                    });
                }
                if (stats.studentName && (stats.studentPresent || stats.studentJoinedAt)) {
                    participants.push({
                        id: 'student',
                        name: stats.studentName,
                        role: 'STUDENT' as const,
                        joinedAt: stats.studentJoinedAt ? new Date(stats.studentJoinedAt) : new Date(),
                        isMicMuted: false,
                        isCameraMuted: false
                    });
                }
                // Clear and set
                actions.resetRoom();
                actions.setRoomId(roomId);
                participants.forEach(p => actions.addParticipant(p));
            } catch (err) {
                console.error("Failed to sync initial participants:", err);
            }
        };

        if (isConnected) {
            syncInitialParticipants();
        }
    }, [roomId, isConnected, actions]);

    // Reset retry count on successful connection
    // AND Automate connection state transition for now (since we lack signaling)
    React.useEffect(() => {
        if (state.isConnected) {
            retryCountRef.current = 0;
            return;
        }

        // If WebSocket is connected, we manually bridge to 'CONNECTED' 
        // because we don't have actual SDP signaling yet.
        // This unblocks the UI from "Connecting..." state.
        if (isConnected) {
            actions.setConnectionState('CONNECTED');
            actions.setIsConnected(true);
        }
    }, [state.isConnected, isConnected, actions]);

    // Auto-start recording if requested via URL param
    useEffect(() => {
        if (shouldAutoRecord && state.isConnected && !media.isRecording && !autoRecordRef.current) {
            autoRecordRef.current = true;
            media.startRecording();
            if (process.env.NODE_ENV !== 'production') {
                console.log('[LiveRoomDisplay] Auto-starting recording from URL param');
            }
        }
    }, [shouldAutoRecord, state.isConnected, media.isRecording, media]);

    const handleExit = React.useCallback(() => {
        router.push('/dashboard');
    }, [router]);

    return (
        <RoomErrorBoundary>
            <div className="flex h-screen w-full bg-background overflow-hidden text-foreground selection:bg-primary/20">
                <div className="flex-1 relative flex flex-col min-w-0 h-full">
                    <InactivityWarning warning={statusWarning} secondsRemaining={secondsRemaining} />

                    <RoomHeader
                        roomId={roomId}
                        isConnected={state.isConnected}
                        isRecording={media.isRecording}
                    />

                    <RoomMainContent
                        roomId={roomId}
                        currentUserId={currentUserId}
                        activeTab={activeTab}
                        media={media}
                        sendMessage={sendMessage}
                        onTabChange={handleTabChange}
                    />

                    <MobileNavigation activeTab={activeTab} onTabChange={handleTabChange} />
                </div>
            </div>

            <RecordingPreviewDialog
                isOpen={!!media.previewUrl}
                videoUrl={media.previewUrl}
                fileSize={media.previewMeta?.size}
                duration={media.previewMeta?.duration}
                onDownload={media.confirmDownload}
                onDiscard={media.discardRecording}
            />

            <ErrorRecoveryDialog
                isOpen={state.connectionState === 'FAILED' || !!media.error}
                error={state.error || getMediaErrorMessage(media.error as Error | DOMException | null)}
                onRetry={handleRetry}
                onAudioOnly={handleAudioOnly}
                onExit={handleExit}
            />
        </RoomErrorBoundary>
    );
};
