'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Trophy, Play, FileText, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn, formatExerciseTitle } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ExerciseListItemResponse } from '@/features/exercise-import/types/exercise.types';

interface StudentExerciseCardProps {
    exercise: ExerciseListItemResponse;
    onClick: () => void;
}

/**
 * Premium grid-based card for student exercise assignments.
 * Features glassmorphism, high-contrast status indicators, and hover animations.
 * 
 * @param exercise - The exercise data to display
 * @param onClick - Handler for card interaction
 */
export const StudentExerciseCard: React.FC<StudentExerciseCardProps> = ({
    exercise,
    onClick,
}) => {
    const isOverdue = exercise.deadline && new Date(exercise.deadline) < new Date() && !exercise.submissionStatus;
    const isGraded = exercise.submissionStatus === 'GRADED';
    const isSubmitted = exercise.submissionStatus === 'SUBMITTED';

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="w-full cursor-pointer h-full"
            onClick={onClick}
        >
            <Card className="h-full border-none shadow-lg bg-gradient-to-br from-card/80 to-muted/30 backdrop-blur-md overflow-hidden flex flex-col group relative">
                {/* Visual Accent */}
                <div className={cn(
                    "absolute top-0 left-0 w-full h-1.5",
                    isGraded ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" :
                        isSubmitted ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]" :
                            isOverdue ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]" :
                                "bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.4)]"
                )} />

                <CardContent className="p-5 flex flex-col h-full gap-4">
                    {/* Header: Icon and Status */}
                    <div className="flex justify-between items-start">
                        <div className={cn(
                            "p-2.5 rounded-2xl transition-colors shrink-0",
                            isGraded ? "bg-green-500/10 text-green-600" :
                                isSubmitted ? "bg-blue-500/10 text-blue-600" :
                                    "bg-primary/10 text-primary"
                        )}>
                            {isGraded ? <Trophy className="h-5 w-5" /> :
                                isSubmitted ? <CheckCircle2 className="h-5 w-5" /> :
                                    <Play className="h-5 w-5 fill-current" />
                            }
                        </div>
                        <Badge variant="outline" className={cn(
                            "text-[10px] font-black tracking-tight uppercase px-2 py-0.5 border-2 rounded-lg",
                            isOverdue ? "border-red-500/50 text-red-600 bg-red-50/50" :
                                isGraded ? "border-green-500/50 text-green-600 bg-green-50/50" :
                                    isSubmitted ? "border-blue-500/50 text-blue-600 bg-blue-50/50" :
                                        "border-primary/50 text-primary bg-primary/5"
                        )}>
                            {isOverdue ? 'Quá hạn' :
                                isGraded ? 'Đã có điểm' :
                                    isSubmitted ? 'Đã nộp bài' : 'Chưa làm'}
                        </Badge>
                    </div>

                    {/* Body: Title */}
                    <div className="flex-1">
                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2 md:line-clamp-3">
                            {formatExerciseTitle(exercise.title)}
                        </h3>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-muted/50">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
                                <Clock className="h-3 w-3" /> Duration
                            </span>
                            <span className="text-sm font-black text-foreground/80">
                                {exercise.timeLimit ? `${exercise.timeLimit}'` : '∞'}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 border-l pl-3 border-muted/50 text-right">
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1 justify-end">
                                <Trophy className="h-3 w-3" /> Points
                            </span>
                            <div className="flex items-center justify-end gap-1.5">
                                {isGraded ? (
                                    <span className="text-base font-black text-green-600">
                                        {exercise.studentTotalScore}
                                    </span>
                                ) : null}
                                <span className={cn(
                                    "text-sm font-black",
                                    isGraded ? "text-muted-foreground opacity-50 text-xs" : "text-foreground/80"
                                )}>
                                    {isGraded ? '/' : ''}{exercise.totalPoints}đ
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Footer: Date and CTA */}
                    <div className="flex items-center justify-between mt-auto pt-2">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] text-muted-foreground font-bold uppercase opacity-60">Hạn nộp</span>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground/70">
                                <Calendar className="h-3.5 w-3.5" />
                                {exercise.deadline ? format(new Date(exercise.deadline), 'dd/MM/yyyy') : 'N/A'}
                            </div>
                        </div>

                        <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground shadow-lg group-hover:scale-110 transition-transform">
                            {isGraded || isSubmitted ? <FileText className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};
