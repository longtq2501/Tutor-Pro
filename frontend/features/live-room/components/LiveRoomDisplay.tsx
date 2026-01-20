'use client';

import React from 'react';
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
import { useRouter } from 'next/navigation';

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
    const { sendMessage } = useWebSocket();
    const { state, actions } = useRoomState();
    const retryCountRef = React.useRef(0);
    const MAX_RETRIES = 3;

    // Media error to user-friendly message
    const getMediaErrorMessage = React.useCallback((error: any): string | null => {
        if (!error) return null;
        const messages: Record<string, string> = {
            NotAllowedError: 'Bạn đã từ chối quyền truy cập camera/microphone. Vui lòng cấp quyền trong cài đặt trình duyệt để tiếp tục.',
            NotFoundError: 'Không tìm thấy camera hoặc microphone. Vui lòng kiểm tra kết nối thiết bị.',
            NotReadableError: 'Camera hoặc microphone đang được sử dụng bởi một ứng dụng khác.',
            OverconstrainedError: 'Thiết bị của bạn không hỗ trợ cấu hình video yêu cầu.',
            TypeError: 'Trình duyệt không hỗ trợ các tính năng media cần thiết.',
            UnknownError: 'Đã xảy ra lỗi không xác định khi truy cập thiết bị media.'
        };
        return messages[error] || 'Lỗi truy cập camera/microphone.';
    }, []);

    const media = useLiveRoomMedia();
    const { warning: statusWarning, secondsRemaining } = useRoomStatus(roomId);
    const isMobile = useIsMobile();
    const router = useRouter();

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

    // Reset retry count on successful connection
    React.useEffect(() => {
        if (state.isConnected) {
            retryCountRef.current = 0;
        }
    }, [state.isConnected]);

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
                error={state.error || getMediaErrorMessage(media.error)}
                onRetry={handleRetry}
                onAudioOnly={handleAudioOnly}
                onExit={handleExit}
            />
        </RoomErrorBoundary>
    );
};
