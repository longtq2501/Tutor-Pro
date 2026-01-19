'use client';

import React from 'react';
import { Whiteboard } from './Whiteboard';
import { ChatPanel } from './ChatPanel';
import { useWebSocket } from '../context/WebSocketContext';
import { useRoomState } from '../context/RoomStateContext';
import { RoomErrorBoundary } from './RoomErrorBoundary';
import { useLiveRoomMedia } from '../hooks/useLiveRoomMedia';
import { VideoPlayer } from './VideoPlayer';
import { MediaControls } from './MediaControls';
import { ModeToggle } from '@/components/ModeToggle';
import { RecordingPreviewDialog } from './RecordingPreviewDialog';

interface LiveRoomDisplayProps {
    roomId: string;
    currentUserId: number;
}

export const LiveRoomDisplay: React.FC<LiveRoomDisplayProps> = ({ roomId, currentUserId }) => {
    const { sendMessage } = useWebSocket();
    const { state } = useRoomState();
    const media = useLiveRoomMedia();

    return (
        <RoomErrorBoundary>
            <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
                <div className="flex-1 relative flex flex-col min-w-0">
                    <header className="h-14 border-b border-border flex items-center px-4 justify-between bg-card">
                        <div className="flex items-center gap-2">
                            <h2 className="font-semibold truncate">Phòng học: {roomId}</h2>
                            {media.isRecording && <span className="flex items-center gap-1 text-xs text-red-500 font-medium animate-pulse">● ĐANG GHI HÌNH</span>}
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-muted-foreground">{state.isConnected ? '● Đã kết nối' : '○ Đang kết nối...'}</span>
                            <ModeToggle />
                        </div>
                    </header>

                    <main className="flex-1 relative overflow-hidden bg-muted/30 flex">
                        <div className="flex-1 relative p-4 flex flex-col">
                            <Whiteboard roomId={roomId} sendMessage={sendMessage} className="shadow-sm border border-border rounded-lg bg-white" />
                            <MediaControls
                                {...media}
                                onToggleMic={media.toggleMic}
                                onToggleCamera={media.toggleCamera}
                                onToggleRecording={media.isRecording ? media.stopRecording : media.startRecording}
                                onQualityChange={media.setQuality}
                                isRecordingSupported={media.isSupported}
                                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                            />
                        </div>
                        <div className="w-64 p-4 flex flex-col gap-4 bg-card border-l border-border">
                            <VideoPlayer stream={media.stream} className="aspect-video w-full rounded-md border border-border bg-muted" />
                            {media.warning && <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs rounded-lg">{media.warning}</div>}
                        </div>
                    </main>
                </div>
                <aside className="w-80 border-l border-border flex flex-col shrink-0 bg-background">
                    <ChatPanel roomId={roomId} currentUserId={currentUserId} />
                </aside>
            </div>

            <RecordingPreviewDialog
                isOpen={!!media.previewUrl}
                videoUrl={media.previewUrl}
                fileSize={media.previewMeta?.size}
                duration={media.previewMeta?.duration}
                onDownload={media.confirmDownload}
                onDiscard={media.discardRecording}
            />
        </RoomErrorBoundary>
    );
};
