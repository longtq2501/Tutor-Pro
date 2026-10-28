import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, PencilLine, CheckCircle2, Bot, TrendingUp } from 'lucide-react';
import { TutorStudentSummaryResponse } from '@/features/exercise-import/types/exercise.types';
import { getScorePresentation } from '@/features/submission/constants/submissionStatus';
import { cn } from '@/lib/utils';

interface TutorStudentCardProps {
    student: TutorStudentSummaryResponse;
    onClick: (student: TutorStudentSummaryResponse) => void;
}

export function getStudentGradeBadge(grade?: string | null) {
    if (!grade) return null;
    const normalized = grade.trim().toLowerCase();
    if (normalized === 'trung_tam' || normalized === 'trung tam') {
        return {
            label: 'Trung tâm',
            className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25',
        };
    }
    if (normalized === 'day_rieng' || normalized === 'day rieng') {
        return {
            label: 'Dạy riêng',
            className: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/25',
        };
    }
    const clean = grade.replace(/_/g, ' ');
    return {
        label: clean.charAt(0).toUpperCase() + clean.slice(1),
        className: 'bg-muted/60 text-muted-foreground border-border/60',
    };
}

export const TutorStudentCard: React.FC<TutorStudentCardProps> = ({ student, onClick }) => {
    // FB-02: system-collected attempts must not inflate progress, so the completion
    // ratio is computed over attempts that genuinely count towards the student's work.
    const gradedCount = student.gradedCount ?? 0;
    const autoSubmittedCount = student.autoSubmittedCount ?? 0;
    const exemptedCount = student.exemptedCount ?? 0;

    const countedAssigned = Math.max(0, student.totalAssigned - autoSubmittedCount - exemptedCount);
    const completionPercentage = countedAssigned > 0
        ? (gradedCount / countedAssigned) * 100
        : 0;

    // FB-02: averageScore is null when nothing gradable exists — show a dash instead of 0%.
    const averageScore = typeof student.averageScore === 'number' ? student.averageScore : null;

    // FB-05/FB-10: semantic progress bar colour tied to average score.
    const scorePres = getScorePresentation(averageScore, { autoSubmitted: false });
    const progressColor = completionPercentage >= 80 ? 'bg-emerald-500 dark:bg-emerald-400'
        : completionPercentage >= 50 ? 'bg-amber-500 dark:bg-amber-400'
        : 'bg-red-500 dark:bg-red-400';

    const badgeInfo = getStudentGradeBadge(student.grade);

    return (
        <Card
            className={cn(
                "group transition-all duration-200 cursor-pointer overflow-hidden",
                "bg-card border border-border/80 dark:border-border/60",
                "shadow-xs hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5"
            )}
            onClick={() => onClick(student)}
        >
            <CardHeader className="p-3 sm:p-3.5 pb-2 flex flex-row items-center gap-2.5">
                <div className="h-8 w-8 flex-shrink-0 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-bold text-sm border border-primary/25 shadow-xs group-hover:scale-105 group-hover:border-primary/40 transition-all">
                    {student.studentName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-sm font-bold truncate text-foreground group-hover:text-primary transition-colors">
                            {student.studentName}
                        </CardTitle>
                        {badgeInfo && (
                            <span className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border transition-colors",
                                badgeInfo.className
                            )}>
                                {badgeInfo.label}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                    {averageScore !== null && (
                        <Badge
                            variant="outline"
                            className="text-[11px] h-5 px-1.5 gap-1 font-semibold border-sky-500/50 text-sky-700 bg-sky-50/80 dark:text-sky-300 dark:bg-sky-950/50"
                            title="Điểm trung bình (không tính bài tự thu / bài miễn)"
                        >
                            <TrendingUp className="h-3 w-3 text-sky-600 dark:text-sky-400" />
                            {averageScore.toFixed(1)}
                        </Badge>
                    )}
                    {autoSubmittedCount > 0 && (
                        <Badge
                            variant="outline"
                            className="text-[11px] h-5 px-1.5 gap-1 font-semibold border-red-500/60 text-red-700 bg-red-50/90 dark:text-red-300 dark:bg-red-950/60"
                            title="Số bài hệ thống tự thu khi hết hạn"
                        >
                            <Bot className="h-3 w-3 text-red-600 dark:text-red-400" />
                            {autoSubmittedCount} Tự thu
                        </Badge>
                    )}
                    <Badge variant="outline" className="text-[11px] h-5 px-2 font-semibold border-border/80 bg-muted/40 text-foreground/80 dark:text-foreground/90">
                        {student.totalAssigned} Bài tập
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-3.5 pt-0 space-y-2.5">
                <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold px-0.5">
                        <span className="text-muted-foreground">Tỷ lệ đã làm</span>
                        <span className={cn(
                            scorePres.scoreClassName,
                            'font-bold',
                            completionPercentage === 0 && 'text-muted-foreground'
                        )}>
                            {Math.round(completionPercentage)}%
                        </span>
                    </div>
                    {/* FB-05/FB-10: semantic track + indicator colour */}
                    <div className="relative h-1.5 w-full rounded-full bg-slate-100 dark:bg-muted/60 border border-border/60 overflow-hidden">
                        <div
                            className={cn('h-full rounded-full transition-all duration-700 ease-out', progressColor)}
                            style={{ width: `${Math.min(completionPercentage, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Status counts grid: compact chips */}
                <div className={cn("grid gap-1.5", autoSubmittedCount > 0 ? "grid-cols-4" : "grid-cols-3")}>
                    <div className={cn(
                        "rounded-lg py-1.5 px-2 flex items-center justify-center gap-1.5 border transition-colors",
                        student.pendingCount > 0
                            ? "bg-amber-50/80 dark:bg-amber-950/30 border-amber-200/70 dark:border-amber-800/40 text-amber-900 dark:text-amber-200"
                            : "bg-muted/40 dark:bg-muted/20 border-border/60 text-muted-foreground"
                    )}>
                        <Clock className={cn("h-3.5 w-3.5 shrink-0", student.pendingCount > 0 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground")} />
                        <span className={cn("text-xs leading-none", student.pendingCount > 0 ? "font-extrabold text-foreground" : "font-bold text-muted-foreground")}>
                            {student.pendingCount}
                        </span>
                        <span className={cn("text-[11px] font-medium leading-none", student.pendingCount > 0 ? "text-amber-800/90 dark:text-amber-300/90" : "text-muted-foreground")}>
                            Chờ
                        </span>
                    </div>
                    <div className={cn(
                        "rounded-lg py-1.5 px-2 flex items-center justify-center gap-1.5 border transition-colors",
                        student.submittedCount > 0
                            ? "bg-blue-50/80 dark:bg-blue-950/30 border-blue-200/70 dark:border-blue-800/40 text-blue-900 dark:text-blue-200"
                            : "bg-muted/40 dark:bg-muted/20 border-border/60 text-muted-foreground"
                    )}>
                        <PencilLine className={cn("h-3.5 w-3.5 shrink-0", student.submittedCount > 0 ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground")} />
                        <span className={cn("text-xs leading-none", student.submittedCount > 0 ? "font-extrabold text-blue-700 dark:text-blue-300" : "font-bold text-muted-foreground")}>
                            {student.submittedCount}
                        </span>
                        <span className={cn("text-[11px] font-medium leading-none", student.submittedCount > 0 ? "text-blue-800/90 dark:text-blue-300/90" : "text-muted-foreground")}>
                            Nộp
                        </span>
                    </div>
                    {autoSubmittedCount > 0 && (
                        <div className="rounded-lg py-1.5 px-2 flex items-center justify-center gap-1.5 border bg-red-50/80 dark:bg-red-950/30 border-red-200/70 dark:border-red-800/40 text-red-900 dark:text-red-200 transition-colors">
                            <Bot className="h-3.5 w-3.5 shrink-0 text-red-600 dark:text-red-400" />
                            <span className="text-xs font-extrabold text-red-700 dark:text-red-300 leading-none">{autoSubmittedCount}</span>
                            <span className="text-[11px] font-medium leading-none text-red-800/90 dark:text-red-300/90">Thu</span>
                        </div>
                    )}
                    <div className={cn(
                        "rounded-lg py-1.5 px-2 flex items-center justify-center gap-1.5 border transition-colors",
                        gradedCount > 0
                            ? "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200/70 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200"
                            : "bg-muted/40 dark:bg-muted/20 border-border/60 text-muted-foreground"
                    )}>
                        <CheckCircle2 className={cn("h-3.5 w-3.5 shrink-0", gradedCount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")} />
                        <span className={cn("text-xs leading-none", gradedCount > 0 ? "font-extrabold text-foreground" : "font-bold text-muted-foreground")}>
                            {gradedCount}
                        </span>
                        <span className={cn("text-[11px] font-medium leading-none", gradedCount > 0 ? "text-emerald-800/90 dark:text-emerald-300/90" : "text-muted-foreground")}>
                            Chấm
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
