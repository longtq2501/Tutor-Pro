'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { LiveRoomDisplay } from './components/LiveRoomDisplay';
import { RoomStateProvider } from './context/RoomStateContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { onlineSessionApi } from '@/lib/services/onlineSession';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { UIProvider } from '@/contexts/UIContext';
import { studentsApi } from '@/lib/services/student';
import { Video, CalendarDays, Loader2 } from 'lucide-react'; // Add Loader2

export const LiveRoomFeature = () => {
    const searchParams = useSearchParams();
    const roomId = searchParams.get('roomId');
    const { user } = useAuth();

    // State
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const join = async () => {
            if (!roomId || !user) return;

            setIsLoading(true);
            setError(null);

            try {
                const response = await onlineSessionApi.joinRoom(roomId);
                setToken(response.token);
            } catch (err: unknown) {
                console.error("Failed to join room:", err);
                const errorMessage = (err as any)?.response?.data?.message || "Không thể tham gia phòng học.";
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        if (roomId) {
            join();
        }
    }, [roomId, user]);

    const router = useRouter();

    const handleCreateTestRoom = async () => {
        try {
            setIsLoading(true);

            // Try to fetch first student instead of hardcoded ID
            const studentsPage = await studentsApi.getAll(0, 1);
            const studentId = studentsPage.content[0]?.id;

            if (!studentId) {
                throw new Error("No students found");
            }

            // Add 1 minute buffer to avoid "must be in the future" validation error
            const start = new Date(Date.now() + 60 * 1000);
            const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour

            const session = await onlineSessionApi.createSession({
                studentId,
                scheduledStart: start.toISOString(),
                scheduledEnd: end.toISOString()
            });

            const roomId = session.roomId;
            router.push(`/dashboard?view=live-room&roomId=${roomId}`);
        } catch (error) {
            console.error("Failed to create test room:", error);
            setError("Không thể tạo phòng test. Hệ thống cần ít nhất 1 học sinh trong cơ sở dữ liệu để khởi tạo.");
            setIsLoading(false);
        }
    };

    const [activeSession, setActiveSession] = useState<any | null>(null);

    useEffect(() => {
        if (!roomId && user) {
            onlineSessionApi.getCurrentSession()
                .then(session => setActiveSession(session))
                .catch(err => console.error("Failed to fetch active session", err));
        }
    }, [roomId, user]);

    if (!roomId) {
        return (
            <div className="flex flex-col items-center justify-center p-6 h-full max-w-2xl mx-auto text-center">
                <div className="mb-8 p-4 bg-primary/10 rounded-full">
                    <Video className="h-12 w-12 text-primary" />
                </div>

                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Sảnh chờ Lớp học trực tuyến
                </h2>

                <p className="text-muted-foreground mb-8 text-lg max-w-md">
                    {user?.role === 'STUDENT'
                        ? "Vui lòng chờ giáo viên bắt đầu buổi dạy hoặc tham gia lớp học đang diễn ra bên dưới."
                        : "Sẵn sàng bắt đầu buổi dạy mới? Bạn có thể mở phòng nhanh từ đây hoặc chọn từ lịch dạy."}
                </p>

                {activeSession ? (
                    <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-sm mb-8 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <span className="bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Đang diễn ra
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {new Date(activeSession.scheduledStart).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold mb-2">Lớp học: {activeSession.studentName}</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            Giáo viên: {activeSession.tutorName}
                        </p>

                        <Button
                            className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
                            onClick={() => router.push(`/dashboard?view=live-room&roomId=${activeSession.roomId}`)}
                        >
                            Vào lớp ngay
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 w-full max-w-sm">
                        {user?.role !== 'STUDENT' && (
                            <Button
                                onClick={handleCreateTestRoom}
                                size="lg"
                                className="h-16 text-lg gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                            >
                                <Video className="h-6 w-6" />
                                Bắt đầu dạy ngay
                            </Button>
                        )}

                        <Button
                            onClick={() => router.push(`/dashboard?view=calendar`)}
                            variant="outline"
                            size="lg"
                            className="h-14 gap-3 border-primary/20 hover:bg-primary/5"
                        >
                            <CalendarDays className="h-5 w-5" />
                            Xem lịch dạy & buổi học
                        </Button>
                    </div>
                )}

                <div className="mt-12 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        Hệ thống sẵn sàng
                    </span>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span>Hỗ trợ WebRTC & Audio-only</span>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Đang kết nối vào phòng học...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <Alert variant="destructive">
                    <AlertTitle>Lỗi</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button
                    className="mt-4"
                    onClick={() => {
                        setIsLoading(true);
                        window.location.reload();
                    }}
                >
                    Thử lại
                </Button>
            </div>
        );
    }

    if (!token || !user) {
        return null;
    }

    return (
        <WebSocketProvider roomId={roomId} token={token}>
            <RoomStateProvider>
                <LiveRoomDisplay roomId={roomId} currentUserId={user.id} />
            </RoomStateProvider>
        </WebSocketProvider>
    );
};

export default LiveRoomFeature;
