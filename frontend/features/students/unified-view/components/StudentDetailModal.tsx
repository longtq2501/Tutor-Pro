"use client";

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn, formatCurrency } from '@/lib/utils';
import type { Student } from '@/lib/types';
import {
    AlertCircle,
    Banknote,
    CalendarClock,
    Clock,
    Edit2,
    Mail,
    Phone,
    Plus,
    ShieldCheck,
    UserCircle,
} from 'lucide-react';
import { useState } from 'react';
import { OptimizedAvatar } from './OptimizedAvatar';
import { QuickAddParentModal } from './QuickAddParentModal';

interface StudentDetailModalProps {
    open: boolean;
    onClose: () => void;
    student: Student;
    onEdit: (student: Student) => void;
    onAddSession?: (student: Student) => void;
    onViewSchedule: (student: Student) => void;
}

function InfoRow({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
    return (
        <div className="flex items-center justify-between py-2.5 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className={cn("font-medium text-foreground text-right max-w-[60%]", className)}>{value}</span>
        </div>
    );
}

export function StudentDetailModal({
    open,
    onClose,
    student,
    onEdit,
    onAddSession,
    onViewSchedule
}: StudentDetailModalProps) {
    const [editParentModalOpen, setEditParentModalOpen] = useState(false);
    const [editingParent, setEditingParent] = useState<any>(null);
    const isInactive = !student.active;
    const hasDebt = (student.totalUnpaidTaught || 0) > 0;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[560px] w-[95vw] max-w-[95vw] sm:w-full p-0 bg-card rounded-2xl shadow-xl border border-border flex flex-col max-h-[90dvh] overflow-hidden">
                {/* Header */}
                <div className="flex items-start gap-4 p-5 border-b border-border flex-shrink-0">
                    <OptimizedAvatar name={student.name} isActive={student.active} className="w-14 h-14 text-xl flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <DialogTitle className="text-lg font-bold text-foreground">{student.name}</DialogTitle>
                            <span className={cn(
                                "text-[11px] px-2 py-0.5 rounded-full font-medium border",
                                isInactive
                                    ? "text-muted-foreground border-border bg-muted/40"
                                    : "text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30"
                            )}>
                                {isInactive ? "Đã nghỉ" : "Đang học"}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                            Học từ {student.startMonth || 'N/A'} &bull; {student.monthsLearned ?? 0} tháng
                        </p>
                        {student.notes && (
                            <p className="text-xs text-muted-foreground italic mt-1 line-clamp-2">{student.notes}</p>
                        )}
                    </div>
                    <button
                        onClick={() => onEdit(student)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors flex-shrink-0"
                        title="Chỉnh sửa"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    <div className="p-5 space-y-5">

                        {/* Financial summary */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-xl border border-border p-3.5">
                                <p className="text-xs text-muted-foreground mb-1">Học phí còn nợ</p>
                                <p className={cn("text-xl font-bold tabular-nums", hasDebt ? "text-destructive" : "text-muted-foreground")}>
                                    {formatCurrency(student.totalUnpaidTaught ?? 0)}
                                </p>
                            </div>
                            <div className="rounded-xl border border-border p-3.5">
                                <p className="text-xs text-muted-foreground mb-1">Tổng đã đóng</p>
                                <p className="text-xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                                    {formatCurrency(student.totalPaid ?? 0)}
                                </p>
                            </div>
                        </div>

                        {/* Academic info */}
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Thông tin học tập</p>
                            <div className="rounded-xl border border-border divide-y divide-border/60 px-3">
                                <InfoRow label="Học phí / giờ" value={formatCurrency(student.pricePerHour)} />
                                <InfoRow label="SĐT học sinh" value={student.phone || '—'} />
                                <InfoRow
                                    label="Lịch học cố định"
                                    value={student.schedule || 'Chưa có lịch'}
                                    className="text-primary"
                                />
                            </div>
                        </div>

                        {/* Account info */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tài khoản đăng nhập</p>
                                <button
                                    onClick={() => onEdit(student)}
                                    className="text-xs text-primary hover:underline font-medium"
                                >
                                    {student.accountEmail ? 'Đổi thông tin' : 'Cấp tài khoản'}
                                </button>
                            </div>
                            <div className="rounded-xl border border-border px-3">
                                <div className="flex items-center gap-2 py-2.5 text-sm">
                                    <Mail className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                    <span className={cn("font-mono break-all", !student.accountEmail && "text-muted-foreground italic")}>
                                        {student.accountEmail || 'Chưa thiết lập tài khoản'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Parent info */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phụ huynh liên kết</p>
                                {(student.parent || student.parentId) && (
                                    <button
                                        onClick={() => {
                                            setEditingParent(student.parent || { id: student.parentId, name: student.parentName, email: student.parentEmail, phone: student.parentPhone });
                                            setEditParentModalOpen(true);
                                        }}
                                        className="text-xs text-primary hover:underline font-medium"
                                    >
                                        Sửa
                                    </button>
                                )}
                            </div>
                            {(student.parent || student.parentName) ? (
                                <div className="rounded-xl border border-border divide-y divide-border/60 px-3">
                                    <InfoRow label="Họ tên" value={student.parent?.name || student.parentName || '—'} />
                                    <InfoRow label="Điện thoại" value={student.parent?.phone || student.parentPhone || '—'} />
                                    <InfoRow label="Email" value={
                                        <span className="truncate">{student.parent?.email || student.parentEmail || '—'}</span>
                                    } />
                                </div>
                            ) : (
                                <div className="rounded-xl border border-dashed border-border px-3 py-4 text-center">
                                    <p className="text-xs text-muted-foreground">Chưa liên kết phụ huynh</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer actions */}
                <div className="p-4 border-t border-border flex gap-2.5 flex-shrink-0">
                    <Button
                        variant="outline"
                        className="flex-1 h-10 font-medium"
                        onClick={onClose}
                    >
                        Đóng
                    </Button>
                    <Button
                        className="flex-1 h-10 gap-2 font-medium"
                        onClick={() => onViewSchedule(student)}
                    >
                        <CalendarClock className="w-4 h-4" />
                        Thêm lịch cố định
                    </Button>
                </div>
            </DialogContent>

            {editParentModalOpen && (
                <QuickAddParentModal
                    open={editParentModalOpen}
                    initialData={editingParent}
                    onClose={() => setEditParentModalOpen(false)}
                    onSuccess={() => setEditParentModalOpen(false)}
                />
            )}
        </Dialog>
    );
}
