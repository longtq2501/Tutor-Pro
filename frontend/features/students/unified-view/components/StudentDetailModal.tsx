import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type { Student } from '@/lib/types';
import { cn, formatCurrency } from '@/lib/utils';
import {
    AlertCircle,
    Calendar,
    CalendarClock,
    Clock,
    DollarSign,
    Edit2,
    ExternalLink,
    Mail, Phone,
    Plus,
    ShieldCheck,
    UserCircle
} from 'lucide-react';
import React from 'react';
import { OptimizedAvatar } from './OptimizedAvatar';

interface StudentDetailModalProps {
    open: boolean;
    onClose: () => void;
    student: Student;
    onEdit: (student: Student) => void;
    onAddSession: (student: Student) => void;
    onViewSchedule: (student: Student) => void;
}

export function StudentDetailModal({
    open,
    onClose,
    student,
    onEdit,
    onAddSession,
    onViewSchedule
}: StudentDetailModalProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] w-[95vw] max-w-[95vw] sm:w-full max-h-[90vh] p-0 overflow-hidden bg-card rounded-[32px] shadow-2xl border-none animate-in fade-in zoom-in-95 duration-300">
                {/* Header with Background Pattern */}
                <div className="relative p-8 pb-12 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background z-0" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

                    <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                        <OptimizedAvatar name={student.name} isActive={student.active} className="w-24 h-24 text-4xl" />

                        <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-center sm:justify-start gap-3">
                                <DialogTitle className="text-3xl font-bold tracking-tight">
                                    {student.name}
                                </DialogTitle>
                                <Badge
                                    variant={student.active ? "default" : "secondary"}
                                    className={cn(
                                        "text-xs px-2.5 py-0.5 rounded-full border shadow-sm",
                                        student.active
                                            ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                                            : "bg-gray-100 dark:bg-gray-500/15 text-gray-600 dark:text-gray-400 border-gray-500/20"
                                    )}
                                >
                                    {student.active ? "Đang học" : "Đã nghỉ"}
                                </Badge>
                            </div>

                            <p className="text-muted-foreground font-medium flex items-center justify-center sm:justify-start gap-2 italic">
                                "{student.notes || 'Không có ghi chú'}"
                            </p>

                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2">
                                <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                                    <Clock className="w-4 h-4" />
                                    <span>Học từ {student.startMonth || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400">
                                    <CalendarClock className="w-4 h-4" />
                                    <span>{student.monthsLearned} tháng theo học</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Sections */}
                <div className="px-8 pb-8 space-y-8 max-h-[calc(85vh-200px)] overflow-y-auto scrollbar-thin">
                    {/* Financial Summary (Primary visibility) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-red-50/50 dark:bg-red-950/20 border-2 border-red-100 dark:border-red-900/30 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
                            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 mb-2">
                                <AlertCircle className="w-5 h-5" />
                                <span className="font-bold text-sm uppercase tracking-wider">Học phí còn nợ</span>
                            </div>
                            <div className="text-3xl font-black text-red-600 dark:text-red-400">
                                {formatCurrency(student.totalUnpaid)}
                            </div>
                        </div>

                        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border-2 border-emerald-100 dark:border-emerald-900/30 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
                            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 mb-2">
                                <DollarSign className="w-5 h-5" />
                                <span className="font-bold text-sm uppercase tracking-wider">Tổng đã đóng</span>
                            </div>
                            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(student.totalPaid)}
                            </div>
                        </div>
                    </div>

                    {/* Account Information (New Section) */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Tài khoản & Bảo mật</h4>
                        </div>
                        <div className="bg-muted/30 rounded-2xl p-5 border border-border/50">
                            <div className="flex flex-col gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground font-bold">EMAIL ĐĂNG NHẬP</Label>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Mail className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="font-mono text-base font-medium break-all">
                                            {student.accountEmail || 'Chưa thiết lập tài khoản'}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-fit h-10 rounded-xl gap-2 font-bold border-2 hover:bg-primary/5 border-primary/20 transition-all active:scale-95"
                                    onClick={() => onEdit(student)}
                                >
                                    <Edit2 className="w-4 h-4" />
                                    {student.accountEmail ? 'Đổi mật khẩu / Email' : 'Cấp tài khoản'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Academic Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {/* Student Details */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-500" />
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Thông tin học tập</h4>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">SĐT cá nhân:</span>
                                    <span className="font-bold flex items-center gap-2 text-foreground">
                                        <Phone className="w-3.5 h-3.5" />
                                        {student.phone || 'N/A'}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Học phí / giờ:</span>
                                    <span className="font-bold text-foreground text-lg">
                                        {formatCurrency(student.pricePerHour)}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex flex-col gap-1.5 text-sm">
                                    <span className="text-muted-foreground">Lịch học cố định:</span>
                                    <span className="font-bold p-3 bg-muted/40 rounded-xl border border-border text-primary leading-relaxed">
                                        {student.schedule}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Parent Details */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <UserCircle className="w-5 h-5 text-purple-500" />
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Phụ huynh liên kết</h4>
                            </div>
                            {student.parent ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Họ và tên:</span>
                                        <span className="font-bold text-foreground uppercase tracking-wide">
                                            {student.parent.name}
                                        </span>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Số điện thoại:</span>
                                        <span className="font-bold text-foreground">
                                            {student.parent.phone || 'N/A'}
                                        </span>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Email:</span>
                                        <span className="font-bold text-foreground truncate max-w-[150px]">
                                            {student.parent.email || 'N/A'}
                                        </span>
                                    </div>
                                    <Separator />
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="w-full h-9 rounded-lg gap-1.5 font-bold text-xs"
                                        onClick={() => window.open(`/parents/${student.parentId}`, '_blank')}
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        Xem chi tiết phụ huynh
                                    </Button>
                                </div>
                            ) : (
                                <div className="p-8 text-center bg-muted/20 border border-dashed rounded-2xl">
                                    <p className="text-sm text-muted-foreground italic">Chưa liên kết phụ huynh</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t bg-muted/10 flex flex-wrap gap-4">
                    <Button
                        variant="outline"
                        className="flex-1 min-w-[140px] h-12 rounded-2xl gap-2 font-bold border-2 hover:bg-slate-50 dark:hover:bg-muted"
                        onClick={() => onViewSchedule(student)}
                    >
                        <CalendarClock className="w-5 h-5" />
                        Quản lý lịch
                    </Button>
                    <Button
                        className="flex-1 min-w-[140px] h-12 rounded-2xl gap-2 font-bold shadow-lg shadow-primary/20"
                        onClick={() => onAddSession(student)}
                        disabled={!student.active}
                    >
                        <Plus className="w-5 h-5" />
                        Thêm buổi học
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

const Label = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <span className={cn("block uppercase tracking-widest text-[10px] sm:text-xs", className)}>
        {children}
    </span>
);
