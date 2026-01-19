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
            <div className="flex h-screen w-full bg-background overflow-hidden">
                <div className="flex-1 relative flex flex-col min-w-0">
                    <header className="h-14 border-b flex items-center px-4 justify-between bg-card">
                        <div className="flex items-center gap-2">
                            <h2 className="font-semibold truncate">Phòng học: {roomId}</h2>
                            {media.isRecording && <span className="flex items-center gap-1 text-xs text-red-500 font-medium animate-pulse">● ĐANG GHI HÌNH</span>}
                        </div>
                        <span className="text-xs text-muted-foreground">{state.isConnected ? '● Đã kết nối' : '○ Đang kết nối...'}</span>
                    </header>

                    <main className="flex-1 relative overflow-hidden bg-slate-50 flex">
                        <div className="flex-1 relative p-4 flex flex-col">
                            <Whiteboard roomId={roomId} sendMessage={sendMessage} />
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
                        <div className="w-64 p-4 flex flex-col gap-4 bg-slate-100 border-l">
                            <VideoPlayer stream={media.stream} className="aspect-video w-full" />
                            {media.warning && <div className="p-3 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-lg">{media.warning}</div>}
                        </div>
                    </main>
                </div>
                <aside className="w-80 border-l flex flex-col shrink-0">
                    <ChatPanel roomId={roomId} currentUserId={currentUserId} />
                </aside>
            </div>
        </RoomErrorBoundary>
    );
};
