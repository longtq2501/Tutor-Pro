import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Student } from '@/lib/types';
import { cn, formatCurrency } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    Calendar,
    CalendarClock,
    ChevronDown,
    Edit2,
    Eye,
    Mail,
    Phone,
    Plus,
    UserCircle,
    Banknote
} from 'lucide-react';
import { memo, useState } from 'react';
import { OptimizedAvatar } from './OptimizedAvatar';

interface UnifiedStudentCardProps {
    student: Student;
    onViewSchedule: (student: Student) => void;
    onAddSession?: (student: Student) => void;
    onEdit?: (student: Student) => void;
    onViewDetails?: (student: Student) => void;
}

export const UnifiedStudentCard = memo(function UnifiedStudentCard({
    student,
    onViewSchedule,
    onEdit,
    onViewDetails
}: UnifiedStudentCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const isInactive = !student.active;

    return (
        // Do NOT use initial/animate for opacity here — causes flicker on filter change.
        // Use layout only for smooth reflow when items reorder.
        <div
            className={cn(
                "group relative overflow-hidden rounded-2xl border transition-all duration-200",
                isInactive
                    ? "bg-card border-border/50 opacity-50 hover:opacity-75"
                    : "bg-card border-border hover:border-primary/40 hover:shadow-md"
            )}
        >
            {/* Active indicator — thin top bar, only for active */}
            {!isInactive && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary/60" />
            )}

            {/* Card Header */}
            <div className="p-4 sm:p-5 space-y-4">
                {/* Student Info Row */}
                <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        <OptimizedAvatar
                            name={student.name}
                            isActive={student.active}
                            avatarUrl={student.avatarUrl}
                        />
                    </div>

                    {/* Name & Status */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                            <h3 className="font-semibold text-base leading-tight text-foreground">
                                {student.name}
                            </h3>
                        </div>

                        {/* Badges row */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            {/* Status badge */}
                            <Badge
                                variant="outline"
                                className={cn(
                                    "text-[10px] px-1.5 py-0 h-5 font-medium border",
                                    isInactive
                                        ? "text-muted-foreground border-border bg-muted/50"
                                        : "text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30"
                                )}
                            >
                                {isInactive ? "Đã nghỉ" : "Đang học"}
                            </Badge>

                            {/* Source badge */}
                            <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 h-5 font-medium border text-muted-foreground border-border bg-transparent"
                            >
                                {student.nguon === 'day_rieng' ? 'Dạy riêng' : 'Trung tâm'}
                            </Badge>
                        </div>

                        {/* Action icon buttons */}
                        <div className="flex items-center gap-1 mt-2">
                            {onEdit && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onEdit(student); }}
                                    className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                    title="Chỉnh sửa thông tin"
                                >
                                    <Edit2 className="w-3.5 h-3.5" />
                                </button>
                            )}
                            {onViewDetails && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onViewDetails(student); }}
                                    className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                                    title="Xem chi tiết hồ sơ"
                                >
                                    <Eye className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Parent Info (Collapsible) */}
                        {student.parent && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <UserCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="truncate">{student.parent.name}</span>
                                <ChevronDown className={cn(
                                    "w-3.5 h-3.5 transition-transform flex-shrink-0",
                                    isExpanded && "rotate-180"
                                )} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Parent Details (Expandable) */}
                <AnimatePresence>
                    {isExpanded && student.parent && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-3 border-t border-border/50 space-y-1.5 text-sm">
                                {student.parent.email && (
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                                        <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span className="truncate">{student.parent.email}</span>
                                    </div>
                                )}
                                {student.parent.phone && (
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                                        <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span>{student.parent.phone}</span>
                                    </div>
                                )}
                                {student.parent.notes && (
                                    <p className="text-muted-foreground text-xs italic">{student.parent.notes}</p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Schedule & Rate */}
                <div className="space-y-1.5 pt-3 border-t border-border/50">
                    {/* Hourly Rate */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Banknote className="w-3.5 h-3.5 shrink-0" />
                        <span className="font-medium text-foreground">
                            {Intl.NumberFormat('vi-VN').format(student.pricePerHour || 0)}
                        </span>
                        <span className="text-xs">/ giờ</span>
                    </div>

                    {/* Schedule */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate text-xs">{student.schedule}</span>
                    </div>
                </div>

                {/* Debt — only show if debt > 0, minimal styling */}
                {student.totalUnpaidTaught > 0 && (
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <div className="flex items-center gap-1.5 text-xs text-destructive">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Đang nợ</span>
                        </div>
                        <span className="text-sm font-bold text-destructive tabular-nums">
                            {Intl.NumberFormat('vi-VN').format(student.totalUnpaidTaught || 0)}đ
                        </span>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5 text-xs h-8 font-medium"
                    disabled={isInactive}
                    onClick={() => onViewSchedule(student)}
                >
                    <CalendarClock className="w-3.5 h-3.5" />
                    Thêm lịch cố định
                </Button>
            </div>
        </div>
    );
});