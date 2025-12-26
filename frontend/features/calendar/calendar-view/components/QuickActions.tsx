'use client';

import type { SessionRecord } from '@/lib/types/finance';
import type { LessonStatus } from '@/lib/types/lesson-status';
import {
    Check,
    DollarSign,
    X,
    Copy,
    Ellipsis,
    Pencil
} from 'lucide-react';
import { useState } from 'react';
import { sessionsApi } from '@/lib/services';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuArrow,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
    session: SessionRecord;
    onUpdate?: (updated: SessionRecord) => void;
    onEdit?: () => void;
}

export function QuickActions({ session, onUpdate, onEdit }: QuickActionsProps) {
    const [loading, setLoading] = useState(false);

    const handleStatusUpdate = async (newStatus: LessonStatus) => {
        if (session.version === undefined || session.version === null) return;

        setLoading(true);
        try {
            const updated = await sessionsApi.updateStatus(session.id, newStatus, session.version);
            onUpdate?.(updated);
            toast.success('Đã cập nhật trạng thái');
        } catch (error) {
            console.error('Failed to update status:', error);
            toast.error(error instanceof Error ? error.message : 'Lỗi khi cập nhật trạng thái');
        } finally {
            setLoading(false);
        }
    };

    const handleDuplicate = async () => {
        setLoading(true);
        try {
            const duplicated = await sessionsApi.duplicate(session.id);
            onUpdate?.(duplicated);
            toast.success('Đã nhân bản buổi học');
        } catch (error) {
            console.error('Failed to duplicate:', error);
            toast.error('Lỗi khi nhân bản buổi học');
        } finally {
            setLoading(false);
        }
    };

    const currentStatus = session.status || 'SCHEDULED';

    return (
        <div className="absolute top-1 right-1 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-sm border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800"
                        disabled={loading}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Ellipsis size={16} strokeWidth={2.5} className="text-slate-600 dark:text-slate-400" />
                        <span className="sr-only">Mở menu thao tác</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    side="bottom"
                    align="end"
                    className="w-48"
                    sideOffset={2}
                >
                    <DropdownMenuArrow />
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.();
                        }}
                        className="gap-2 cursor-pointer"
                    >
                        <Pencil size={14} className="text-slate-500" />
                        <span>Chỉnh sửa</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Mark as Taught */}
                    {(currentStatus === 'SCHEDULED' || currentStatus === 'CONFIRMED') && (
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation();
                                handleStatusUpdate('COMPLETED');
                            }}
                            className="gap-2 cursor-pointer text-green-600 dark:text-green-400"
                        >
                            <Check size={14} />
                            <span>Đánh dấu đã dạy</span>
                        </DropdownMenuItem>
                    )}

                    {/* Confirm Payment */}
                    {(currentStatus === 'COMPLETED' || currentStatus === 'PENDING_PAYMENT') && (
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation();
                                handleStatusUpdate('PAID');
                            }}
                            className="gap-2 cursor-pointer text-emerald-600 dark:text-emerald-400"
                        >
                            <DollarSign size={14} />
                            <span>Xác nhận thanh toán</span>
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicate();
                        }}
                        className="gap-2 cursor-pointer transition-colors"
                    >
                        <Copy size={14} className="text-blue-500" />
                        <span>Nhân bản buổi học</span>
                    </DropdownMenuItem>

                    {currentStatus !== 'PAID' && currentStatus !== 'CANCELLED_BY_TUTOR' && currentStatus !== 'CANCELLED_BY_STUDENT' && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm('Bạn có chắc muốn hủy buổi học này?')) {
                                        handleStatusUpdate('CANCELLED_BY_TUTOR');
                                    }
                                }}
                                className="gap-2 cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/10 focus:text-red-700"
                            >
                                <X size={14} />
                                <span>Hủy buổi học</span>
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
