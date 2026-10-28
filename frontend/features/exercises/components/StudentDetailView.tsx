'use client';

import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { exerciseService } from '@/features/exercise-import/services/exerciseService';
import { ExerciseListItemResponse, TutorStudentSummaryResponse } from '@/features/exercise-import/types/exercise.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    ArrowLeft,
    Clock,
    FileText,
    ClipboardCheck,
    FileWarning
} from 'lucide-react';
import { getScorePresentation } from '@/features/submission/constants/submissionStatus';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { PageResponse } from '@/lib/types';
import { ExerciseRowCard } from './ExerciseRowCard';
import { PerformanceSection } from './PerformanceSection';
import { toast } from 'sonner';
import { useConfirm } from '@/hooks/useConfirm';
import axios from 'axios';
import { getStudentGradeBadge } from './TutorStudentCard';

interface StudentDetailViewProps {
    studentSummary: TutorStudentSummaryResponse;
    onBack: () => void;
    onViewExercise: (exercise: ExerciseListItemResponse, action: 'GRADE' | 'REVIEW') => void;
}

/**
 * View showing detailed performance and exercises for a specific student.
 */
export const StudentDetailView: React.FC<StudentDetailViewProps> = ({
    studentSummary,
    onBack,
    onViewExercise
}) => {
    const queryClient = useQueryClient();
    const { confirm, ConfirmationDialog } = useConfirm();
    const [revokingExerciseId, setRevokingExerciseId] = React.useState<string | null>(null);

    const { data: exercisesData, isLoading } = useQuery({
        queryKey: ['exercises', 'student', studentSummary.studentId],
        queryFn: () => exerciseService.getAssignedByStudentId(studentSummary.studentId, 0, 100),
        refetchOnMount: 'always',
    });

    const exercises: ExerciseListItemResponse[] = (exercisesData as PageResponse<ExerciseListItemResponse>)?.content || [];
    const statusOf = (value?: string) => (value || '').toUpperCase();
    const deadlineOf = (value?: string) => {
        if (!value) return null;
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    };
    const sortByNearestDeadline = (a: ExerciseListItemResponse, b: ExerciseListItemResponse) => {
        const aDeadline = deadlineOf(a.deadline);
        const bDeadline = deadlineOf(b.deadline);

        if (aDeadline && bDeadline) {
            return aDeadline.getTime() - bDeadline.getTime();
        }
        if (aDeadline && !bDeadline) return -1;
        if (!aDeadline && bDeadline) return 1;
        return a.title.localeCompare(b.title, 'vi');
    };

    // FB-01/FB-02: attempts the system collected after the deadline form their own
    // partition. They must never be counted as "đã nộp" (the student did not submit)
    // nor silently mixed into "đã chấm" (which would inflate the completion rate).
    const isAutoCollected = (ex: ExerciseListItemResponse) =>
        ex.autoSubmitted === true || statusOf(ex.submissionStatus) === 'AUTO_SUBMITTED';

    // Categorization uses a strict partition so detail counts match summary cards.
    // AUTO_SUBMITTED is filtered out above, so only human-graded work reaches this bucket.
    const isGraded = (status: string) => status === 'GRADED';
    const isSubmittedBucket = (status: string) => ['DRAFT', 'SUBMITTED', 'STARTED'].includes(status);

    const autoCollected = exercises.filter(isAutoCollected);
    const countableExercises = exercises.filter(ex => !isAutoCollected(ex));

    const pending = countableExercises
        .filter(ex => {
            const status = statusOf(ex.submissionStatus);
            return !isGraded(status) && !isSubmittedBucket(status);
        })
        .sort(sortByNearestDeadline);
    const inProgress = countableExercises.filter(ex => isSubmittedBucket(statusOf(ex.submissionStatus)));
    const graded = countableExercises.filter(ex => isGraded(statusOf(ex.submissionStatus)));

    const handleRevokeAssignment = async (exercise: ExerciseListItemResponse) => {
        const confirmed = await confirm({
            title: 'Thu hồi bài kiểm tra?',
            description: `Bài "${exercise.title}" sẽ bị gỡ khỏi học sinh ${studentSummary.studentName}. Hành động này không thể hoàn tác.`,
            confirmText: 'Thu hồi',
            cancelText: 'Hủy',
            variant: 'destructive',
        });
        if (!confirmed) {
            return;
        }

        try {
            setRevokingExerciseId(exercise.id);
            await exerciseService.revokeAssignment(exercise.id, studentSummary.studentId);
            toast.success('Đã thu hồi bài kiểm tra');
            await queryClient.invalidateQueries({ queryKey: ['exercises', 'student', studentSummary.studentId] });
            await queryClient.invalidateQueries({ queryKey: ['exercises'] });
        } catch (error) {
            let message = 'Không thể thu hồi bài kiểm tra';
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || error.message || message;
            }
            toast.error(message);
        } finally {
            setRevokingExerciseId(null);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: 'easeOut' }} className="space-y-8 pb-24 w-full">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={onBack} size="sm" className="h-9 hover:bg-muted/80 group rounded-xl px-4">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold">Quay lại danh sách</span>
                </Button>
            </div>

            <StudentProfileHeader
                studentSummary={studentSummary}
                pendingCount={pending.length}
                inProgressCount={inProgress.length}
                gradedCount={graded.length}
                autoCollectedCount={autoCollected.length}
                totalAssigned={exercises.length}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-0 mt-8">
                <div className="lg:pr-8 lg:border-r lg:border-dashed lg:border-muted-foreground/20">
                    <PerformanceSection title="Chờ làm" icon={<Clock className="h-5 w-5 text-orange-500" />} count={pending.length} isLoading={isLoading}>
                        {pending.map(ex => (
                            <ExerciseRowCard
                                key={ex.id}
                                exercise={ex}
                                disabled
                                onClick={() => { }}
                                action={{
                                    label: revokingExerciseId === ex.id ? 'Đang thu hồi...' : 'Thu hồi',
                                    onClick: () => handleRevokeAssignment(ex),
                                    disabled: revokingExerciseId === ex.id,
                                    tooltip: 'Thu hồi bài kiểm tra đã giao (chỉ áp dụng khi học sinh chưa nộp)',
                                }}
                            />
                        ))}
                    </PerformanceSection>
                </div>

                <div className="lg:px-8 lg:border-r lg:border-dashed lg:border-muted-foreground/20">
                    <PerformanceSection title="Đã nộp / đang làm" icon={<FileText className="h-5 w-5 text-sky-500" />} count={inProgress.length} isLoading={isLoading}>
                        {inProgress.map(ex => (
                            <ExerciseRowCard key={ex.id} exercise={ex} label={ex.submissionStatus === 'SUBMITTED' ? 'Đã nộp bài' : 'Đang thực hiện'} onClick={() => onViewExercise(ex, 'GRADE')} />
                        ))}
                    </PerformanceSection>
                </div>

                <div className="lg:pl-8">
                    {/* FB-05: ClipboardCheck icon — graded work doesn't imply a prize/trophy */}
                    <PerformanceSection title="Đã nộp &amp; chấm điểm" icon={<ClipboardCheck className="h-5 w-5 text-green-500" />} count={graded.length} isLoading={isLoading}>
                        {graded.map(ex => <ExerciseRowCard key={ex.id} exercise={ex} showScore onClick={() => onViewExercise(ex, 'GRADE')} />)}
                    </PerformanceSection>
                </div>
            </div>

            {/* FB-01: auto-collected attempts get their own section so they can never be
                mistaken for work the student actually handed in. */}
            {autoCollected.length > 0 && (
                <div className="mt-8">
                    <PerformanceSection
                        title="Hệ thống tự thu (quá hạn)"
                        icon={<FileWarning className="h-5 w-5 text-red-500" />}
                        count={autoCollected.length}
                        isLoading={isLoading}
                    >
                        {autoCollected.map(ex => (
                            <ExerciseRowCard
                                key={ex.id}
                                exercise={ex}
                                label="Tự thu"
                                onClick={() => onViewExercise(ex, 'GRADE')}
                            />
                        ))}
                    </PerformanceSection>
                </div>
            )}

            <ConfirmationDialog />
        </motion.div>
    );
};

const StudentProfileHeader = ({
    studentSummary,
    pendingCount,
    inProgressCount,
    gradedCount,
    autoCollectedCount,
    totalAssigned,
}: {
    studentSummary: TutorStudentSummaryResponse;
    pendingCount: number;
    inProgressCount: number;
    gradedCount: number;
    autoCollectedCount: number;
    totalAssigned: number;
}) => {
    // FB-02: auto-collected attempts are excluded from the denominator so a student
    // who missed a deadline is not punished twice in the "Đã học" ring.
    const countedAssigned = Math.max(0, totalAssigned - autoCollectedCount);
    const completionRate = countedAssigned > 0
        ? Math.round((gradedCount / countedAssigned) * 100)
        : 0;

    return (
        <Card className="overflow-hidden border border-border/60 shadow-sm bg-gradient-to-r from-card via-card to-muted/10 relative">
            <CardContent className="p-5 md:p-6">
                <div className="flex flex-col lg:flex-row items-center gap-6 justify-between">
                    <div className="flex items-center gap-5 flex-1 w-full">
                        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-black shrink-0 border border-primary/20 shadow-sm">
                            {studentSummary.studentName.charAt(0)}
                        </div>
                        <div className="space-y-1.5 min-w-0">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground truncate">
                                {studentSummary.studentName}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2.5 text-muted-foreground font-medium text-xs">
                                {(() => {
                                    const badgeInfo = getStudentGradeBadge(studentSummary.grade);
                                    if (!badgeInfo) return null;
                                    return (
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                                            badgeInfo.className
                                        )}>
                                            {badgeInfo.label}
                                        </span>
                                    );
                                })()}
                                <span className="flex items-center gap-1.5 bg-muted/60 px-2.5 py-1 rounded-md text-xs font-medium">
                                    <FileText className="h-3.5 w-3.5 text-primary/70" /> {totalAssigned} Bài tập &amp; Tài liệu
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 md:gap-8 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide shrink-0">
                        <StatItem iconColor="bg-orange-500" value={pendingCount} label="Chờ làm" />
                        <StatItem iconColor="bg-sky-500" value={inProgressCount} label="Đang làm" />
                        {autoCollectedCount > 0 && (
                            <StatItem iconColor="bg-red-500" value={autoCollectedCount} label="Tự thu" />
                        )}
                        <StatItem iconColor="bg-green-500" value={gradedCount} label="Đã chấm" />
                        <ProgressRing percentage={completionRate} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const StatItem = ({ iconColor, value, label }: { iconColor: string; value: number; label: string }) => (
    <div className="text-center space-y-1 min-w-[60px]">
        <div className="flex items-center gap-1.5 justify-center">
            <div className={cn("h-2 w-2 rounded-full", iconColor)} />
            <span className={cn("text-2xl font-extrabold tabular-nums", value === 0 ? "text-muted-foreground" : "text-foreground")}>{value}</span>
        </div>
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
    </div>
);

const ProgressRing = ({ percentage }: { percentage: number }) => {
    // FB-10: semantic ring colour driven by completion rate
    const pres = getScorePresentation(percentage);
    const strokeColor = percentage >= 80 ? 'text-emerald-500'
        : percentage >= 50 ? 'text-amber-500'
        : 'text-red-500';
    const circumference = 2 * Math.PI * 30;
    return (
        <div className="relative h-16 w-16 flex items-center justify-center shrink-0">
            <svg className="h-full w-full -rotate-90 transform">
                <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-slate-200 dark:text-muted/60" />
                <motion.circle
                    cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="5" fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference * (1 - percentage / 100) }}
                    transition={{ duration: 1.2, ease: "circOut" }}
                    className={cn(strokeColor, 'drop-shadow-sm')}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={cn('text-xs font-extrabold leading-none', pres.scoreClassName)}>{percentage}%</span>
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-tighter mt-0.5">Đã làm</span>
            </div>
        </div>
    );
};
