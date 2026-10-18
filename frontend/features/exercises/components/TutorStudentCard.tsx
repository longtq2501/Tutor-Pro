import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, PencilLine, CheckCircle2, Bot, TrendingUp } from 'lucide-react';
import { TutorStudentSummaryResponse } from '@/features/exercise-import/types/exercise.types';
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
                    <p className="text-[11px] text-muted-foreground">Lớp: {student.grade || '—'}</p>
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
                    <Badge variant="outline" className="text-[10px] h-5">
                        {student.totalAssigned} Bài tập
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4 pt-0">
                <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-medium text-muted-foreground px-0.5">
                        <span>Tỷ lệ đã làm</span>
                        <span>{Math.round(completionPercentage)}%</span>
                    </div>
                    <Progress value={completionPercentage} className="h-1.5" />
                </div>

                <div className={cn("grid gap-2", autoSubmittedCount > 0 ? "grid-cols-4" : "grid-cols-3")}>
                    <div className="bg-orange-50 dark:bg-orange-950/20 rounded-md p-2 flex flex-col items-center">
                        <Clock className="h-3 w-3 text-orange-500 mb-1" />
                        <span className="text-xs font-bold leading-none">{student.pendingCount}</span>
                        <span className="text-[9px] text-muted-foreground">Chờ làm</span>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-md p-2 flex flex-col items-center">
                        <PencilLine className="h-3 w-3 text-blue-500 mb-1" />
                        <span className="text-xs font-bold leading-none">{student.submittedCount}</span>
                        <span className="text-[9px] text-muted-foreground">Đã nộp</span>
                    </div>
                    {autoSubmittedCount > 0 && (
                        <div className="bg-red-50 dark:bg-red-950/20 rounded-md p-2 flex flex-col items-center">
                            <Bot className="h-3 w-3 text-red-500 mb-1" />
                            <span className="text-xs font-bold leading-none">{autoSubmittedCount}</span>
                            <span className="text-[9px] text-muted-foreground">Tự thu</span>
                        </div>
                    )}
                    <div className="bg-green-50 dark:bg-green-950/20 rounded-md p-2 flex flex-col items-center">
                        <CheckCircle2 className="h-3 w-3 text-green-500 mb-1" />
                        <span className="text-xs font-bold leading-none">{gradedCount}</span>
                        <span className="text-[9px] text-muted-foreground">Đã chấm</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
