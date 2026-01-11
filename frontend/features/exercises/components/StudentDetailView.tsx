'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { exerciseService } from '@/features/exercise-import/services/exerciseService';
import { ExerciseListItemResponse, TutorStudentSummaryResponse } from '@/features/exercise-import/types/exercise.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Clock,
    FileText,
    CheckCircle2,
    AlertCircle,
    Loader2,
    BookOpen,
    Calendar,
    ChevronRight,
    Trophy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface StudentDetailViewProps {
    studentSummary: TutorStudentSummaryResponse;
    onBack: () => void;
    onViewExercise: (exercise: ExerciseListItemResponse, action: 'GRADE' | 'REVIEW') => void;
}

export const StudentDetailView: React.FC<StudentDetailViewProps> = ({
    studentSummary,
    onBack,
    onViewExercise
}) => {
    const { data: exercises = [], isLoading } = useQuery({
        queryKey: ['exercises', 'student', studentSummary.studentId],
        queryFn: () => exerciseService.getAssignedByStudentId(studentSummary.studentId),
    });

    // Grouping logic
    const pendingExercises = exercises.filter(ex => !ex.submissionStatus || ex.submissionStatus === 'PENDING');
    const inProgressExercises = exercises.filter(ex => ex.submissionStatus === 'DRAFT' || ex.submissionStatus === 'SUBMITTED');
    const gradedExercises = exercises.filter(ex => ex.submissionStatus === 'GRADED');

    const completionRate = studentSummary.totalAssigned > 0
        ? Math.round((studentSummary.gradedCount / studentSummary.totalAssigned) * 100)
        : 0;

    return (
        <div className="space-y-6 pb-20">
            {/* Header / Back Navigation */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={onBack} size="sm" className="h-8 group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Quay lại
                </Button>
            </div>

            {/* Student Profile Card */}
            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-card to-muted/30">
                <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Avatar & Basic Info */}
                        <div className="flex items-center gap-6 flex-1">
                            <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold shadow-inner border border-primary/20">
                                {studentSummary.studentName.charAt(0)}
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-3xl font-bold tracking-tight">{studentSummary.studentName}</h1>
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <Badge variant="secondary" className="font-medium">Lớp: {studentSummary.grade || 'N/A'}</Badge>
                                    <span className="text-sm flex items-center gap-1">
                                        <BookOpen className="h-3 w-3" /> {studentSummary.totalAssigned} Bài tập
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Summary */}
                        <div className="flex items-center gap-8 md:gap-12">
                            <div className="text-center space-y-1">
                                <div className="flex items-center gap-2 text-orange-500 justify-center">
                                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                                    <span className="text-2xl font-bold">{studentSummary.pendingCount}</span>
                                </div>
                                <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Chờ làm</p>
                            </div>
                            <div className="text-center space-y-1">
                                <div className="flex items-center gap-2 text-blue-500 justify-center">
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                    <span className="text-2xl font-bold">{studentSummary.submittedCount}</span>
                                </div>
                                <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Đang làm</p>
                            </div>
                            <div className="text-center space-y-1">
                                <div className="flex items-center gap-2 text-green-500 justify-center">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    <span className="text-2xl font-bold">{studentSummary.gradedCount}</span>
                                </div>
                                <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Đã nộp</p>
                            </div>
                        </div>

                        {/* Progress Circle */}
                        <div className="relative h-24 w-24 flex items-center justify-center">
                            <svg className="h-full w-full -rotate-90 transform">
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="38"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    fill="transparent"
                                    className="text-muted-foreground/10"
                                />
                                <motion.circle
                                    cx="48"
                                    cy="48"
                                    r="38"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    fill="transparent"
                                    strokeDasharray={2 * Math.PI * 38}
                                    initial={{ strokeDashoffset: 2 * Math.PI * 38 }}
                                    animate={{ strokeDashoffset: 2 * Math.PI * 38 * (1 - completionRate / 100) }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="text-primary"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-bold">{completionRate}%</span>
                                <span className="text-[8px] text-muted-foreground font-medium uppercase">Hoàn thành</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Sections */}
            <div className="grid gap-10">
                {/* 1. Chờ làm */}
                <Section
                    title="Chờ làm"
                    icon={<Clock className="h-5 w-5 text-orange-500" />}
                    count={pendingExercises.length}
                    isLoading={isLoading}
                >
                    {pendingExercises.map(ex => (
                        <ExerciseCompactCard
                            key={ex.id}
                            exercise={ex}
                            disabled
                            onClick={() => { }}
                        />
                    ))}
                </Section>

                {/* 2. Đang làm */}
                <Section
                    title="Đang làm"
                    icon={<FileText className="h-5 w-5 text-blue-500" />}
                    count={inProgressExercises.length}
                    isLoading={isLoading}
                >
                    {inProgressExercises.map(ex => (
                        <ExerciseCompactCard
                            key={ex.id}
                            exercise={ex}
                            label={ex.submissionStatus === 'SUBMITTED' ? 'Đã nộp' : 'Đang làm'}
                            onClick={() => onViewExercise(ex, 'GRADE')}
                        />
                    ))}
                </Section>

                {/* 3. Đã nộp */}
                <Section
                    title="Đã nộp"
                    icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
                    count={gradedExercises.length}
                    isLoading={isLoading}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {gradedExercises.map(ex => (
                            <ExerciseCompactCard
                                key={ex.id}
                                exercise={ex}
                                showScore
                                onClick={() => onViewExercise(ex, 'REVIEW')}
                            />
                        ))}
                    </div>
                </Section>
            </div>
        </div>
    );
};

const Section: React.FC<{
    title: string;
    icon: React.ReactNode;
    count: number;
    isLoading: boolean;
    children: React.ReactNode;
}> = ({ title, icon, count, isLoading, children }) => (
    <div className="space-y-4">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">{icon}</div>
            <div className="flex-1">
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="text-xs text-muted-foreground">{count} bài tập</p>
            </div>
        </div>

        {isLoading ? (
            <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/30" />
            </div>
        ) : count === 0 ? (
            <div className="py-12 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-muted-foreground/40 space-y-4">
                <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center grayscale opacity-50">
                    {icon}
                </div>
                <p className="text-sm font-medium italic">Không có bài tập nào {title.toLowerCase()}</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {children}
            </div>
        )}
    </div>
);

const ExerciseCompactCard: React.FC<{
    exercise: ExerciseListItemResponse;
    onClick: () => void;
    label?: string;
    showScore?: boolean;
    disabled?: boolean;
}> = ({ exercise, onClick, label, showScore, disabled }) => {
    const isOverdue = exercise.deadline && new Date(exercise.deadline) < new Date() && !exercise.submissionStatus;

    return (
        <motion.div
            whileHover={disabled ? {} : { y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={cn("group", !disabled && "cursor-pointer")}
            onClick={disabled ? undefined : onClick}
        >
            <Card className="h-full border-muted/50 hover:border-primary/30 transition-all hover:shadow-lg overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />

                <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors flex-1 line-clamp-2">
                            {exercise.title}
                        </h4>
                        <Badge variant="outline" className={cn(
                            "text-[10px] h-5 px-1.5 shrink-0",
                            exercise.submissionStatus === 'GRADED' ? "border-green-500 text-green-600 dark:text-green-400 dark:bg-green-950/30 bg-green-50/50" :
                                exercise.submissionStatus === 'SUBMITTED' ? "border-blue-500 text-blue-600 dark:text-blue-400 dark:bg-blue-950/30 bg-blue-50/50" :
                                    "border-orange-500 text-orange-600 dark:text-orange-400 dark:bg-orange-950/30 bg-orange-50/50"
                        )}>
                            {label || (exercise.submissionStatus === 'GRADED' ? 'Đã chấm' : 'Chờ làm')}
                        </Badge>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Hạn: {exercise.deadline ? format(new Date(exercise.deadline), 'dd/MM/yyyy') : 'N/A'}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {exercise.timeLimit} phút
                            </span>
                        </div>

                        {showScore && exercise.studentTotalScore !== undefined ? (
                            <div className="pt-2 flex items-center justify-between border-t border-muted/50">
                                <span className="text-[10px] font-semibold text-muted-foreground">Điểm số</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-sm font-bold text-green-600">{exercise.studentTotalScore}</span>
                                    <span className="text-[10px] text-muted-foreground">/{exercise.totalPoints}</span>
                                    <Trophy className="h-3 w-3 text-yellow-500 ml-1" />
                                </div>
                            </div>
                        ) : !disabled ? (
                            <div className="pt-2 flex items-center justify-between border-t border-muted/50 group-hover:border-primary/20 transition-colors">
                                <span className="text-[10px] text-muted-foreground italic">
                                    {isOverdue ? "Quá hạn nộp" : "Nhấn để xem"}
                                </span>
                                <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                        ) : (
                            <div className="pt-2 border-t border-muted/50">
                                <span className="text-[10px] text-muted-foreground italic">Chưa có bài làm</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};
