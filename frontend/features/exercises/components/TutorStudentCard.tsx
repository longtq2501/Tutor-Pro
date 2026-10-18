import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, PencilLine, CheckCircle2, Bot, TrendingUp } from 'lucide-react';
import { TutorStudentSummaryResponse } from '@/features/exercise-import/types/exercise.types';
import { getScorePresentation } from '@/features/submission/constants/submissionStatus';
import { cn } from '@/lib/utils';

interface TutorStudentCardProps {
    student: TutorStudentSummaryResponse;
    onClick: (student: TutorStudentSummaryResponse) => void;
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

    return (
        <Card
            className="group hover:border-primary/50 transition-all hover:shadow-md cursor-pointer"
            onClick={() => onClick(student)}
        >
            <CardHeader className="p-4 flex flex-row items-center gap-3">
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {student.studentName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                        {student.studentName}
                    </CardTitle>
                    {/* FB-11: hide class badge when no grade data instead of showing "Lớp: —" */}
                    {student.grade && (
                        <p className="text-xs text-muted-foreground">{student.grade}</p>
                    )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                    {averageScore !== null && (
                        <Badge
                            variant="outline"
                            className="text-[10px] h-5 gap-1 border-sky-500/50 text-sky-700 bg-sky-50/70 dark:text-sky-300 dark:bg-sky-950/40"
                            title="Điểm trung bình (không tính bài tự thu / bài miễn)"
                        >
                            <TrendingUp className="h-3 w-3" />
                            {averageScore.toFixed(1)}
                        </Badge>
                    )}
                    {autoSubmittedCount > 0 && (
                        <Badge
                            variant="outline"
                            className="text-[10px] h-5 gap-1 border-red-500/60 text-red-700 bg-red-50/80 dark:text-red-300 dark:bg-red-950/50"
                            title="Số bài hệ thống tự thu khi hết hạn"
                        >
                            <Bot className="h-3 w-3" />
                            {autoSubmittedCount} Tự thu
                        </Badge>
                    )}
                    <Badge variant="outline" className="text-xs h-5">
                        {student.totalAssigned} Bài tập
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4 pt-0">
                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium text-muted-foreground px-0.5">
                        <span>Tỷ lệ đã làm</span>
                        <span className={cn(
                            scorePres.scoreClassName,
                            completionPercentage === 0 && 'text-muted-foreground'
                        )}>
                            {Math.round(completionPercentage)}%
                        </span>
                    </div>
                    {/* FB-05/FB-10: semantic track + indicator colour */}
                    <div className="relative h-2 w-full rounded-full bg-muted/40 overflow-hidden">
                        <div
                            className={cn('h-full rounded-full transition-all duration-700 ease-out', progressColor)}
                            style={{ width: `${Math.min(completionPercentage, 100)}%` }}
                        />
                    </div>
                </div>

                {/* FB-07: De-emphasize/dim zero count cells so active actionable counts stand out */}
                <div className={cn("grid gap-2", autoSubmittedCount > 0 ? "grid-cols-4" : "grid-cols-3")}>
                    <div className={cn(
                        "rounded-md p-2 flex flex-col items-center transition-opacity",
                        student.pendingCount > 0
                            ? "bg-orange-50 dark:bg-orange-950/20"
                            : "bg-muted/30 opacity-60"
                    )}>
                        <Clock className={cn("h-3.5 w-3.5 mb-1", student.pendingCount > 0 ? "text-orange-500" : "text-muted-foreground/60")} />
                        <span className={cn("text-xs font-bold leading-none", student.pendingCount > 0 ? "text-foreground" : "text-muted-foreground/60")}>
                            {student.pendingCount}
                        </span>
                        <span className="text-xs text-muted-foreground mt-0.5">Chờ làm</span>
                    </div>
                    <div className={cn(
                        "rounded-md p-2 flex flex-col items-center transition-opacity",
                        student.submittedCount > 0
                            ? "bg-blue-50 dark:bg-blue-950/20"
                            : "bg-muted/30 opacity-60"
                    )}>
                        <PencilLine className={cn("h-3.5 w-3.5 mb-1", student.submittedCount > 0 ? "text-blue-500" : "text-muted-foreground/60")} />
                        <span className={cn("text-xs font-bold leading-none", student.submittedCount > 0 ? "text-blue-700 dark:text-blue-400 font-extrabold" : "text-muted-foreground/60")}>
                            {student.submittedCount}
                        </span>
                        <span className="text-xs text-muted-foreground mt-0.5">Đã nộp</span>
                    </div>
                    {autoSubmittedCount > 0 && (
                        <div className="bg-red-50 dark:bg-red-950/20 rounded-md p-2 flex flex-col items-center">
                            <Bot className="h-3.5 w-3.5 text-red-500 mb-1" />
                            <span className="text-xs font-extrabold text-red-600 dark:text-red-400 leading-none">{autoSubmittedCount}</span>
                            <span className="text-xs text-muted-foreground mt-0.5">Tự thu</span>
                        </div>
                    )}
                    <div className={cn(
                        "rounded-md p-2 flex flex-col items-center transition-opacity",
                        gradedCount > 0
                            ? "bg-green-50 dark:bg-green-950/20"
                            : "bg-muted/30 opacity-60"
                    )}>
                        <CheckCircle2 className={cn("h-3.5 w-3.5 mb-1", gradedCount > 0 ? "text-green-500" : "text-muted-foreground/60")} />
                        <span className={cn("text-xs font-bold leading-none", gradedCount > 0 ? "text-foreground" : "text-muted-foreground/60")}>
                            {gradedCount}
                        </span>
                        <span className="text-xs text-muted-foreground mt-0.5">Đã chấm</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
