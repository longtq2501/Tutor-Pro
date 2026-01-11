'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTutorStudentSummaries } from '../hooks/useExercises';
import { Skeleton } from '@/components/ui/skeleton';
import { User, CheckCircle2, Clock, PencilLine } from 'lucide-react';
import { TutorStudentSummaryResponse } from '@/features/exercise-import/types/exercise.types';

interface TutorStudentGridProps {
    onSelectStudent: (student: TutorStudentSummaryResponse) => void;
}

export const TutorStudentGrid: React.FC<TutorStudentGridProps> = ({ onSelectStudent }) => {
    const { data: summaries = [], isLoading } = useTutorStudentSummaries();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden">
                        <CardHeader className="p-4 space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-20" />
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <Skeleton className="h-2 w-full" />
                            <div className="flex justify-between">
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-8 w-16" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (summaries.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Chưa có học sinh nào được giao bài</h3>
                <p className="text-sm text-muted-foreground mt-1">Hãy giao bài tập từ thư viện để theo dõi tiến độ.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-500">
            {summaries.map((student) => {
                const completionPercentage = student.totalAssigned > 0
                    ? (student.gradedCount / student.totalAssigned) * 100
                    : 0;

                return (
                    <Card
                        key={student.studentId}
                        className="group hover:border-primary/50 transition-all hover:shadow-md cursor-pointer"
                        onClick={() => onSelectStudent(student)}
                    >
                        <CardHeader className="p-4 flex flex-row items-center gap-3">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {student.studentName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <CardTitle className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                                    {student.studentName}
                                </CardTitle>
                                <p className="text-[11px] text-muted-foreground">Lớp: {student.grade || 'N/A'}</p>
                            </div>
                            <Badge variant="outline" className="text-[10px] h-5">
                                {student.totalAssigned} Bài tập
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4 pt-0">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-[10px] font-medium text-muted-foreground px-0.5">
                                    <span>Tiến độ hoàn thành</span>
                                    <span>{Math.round(completionPercentage)}%</span>
                                </div>
                                <Progress value={completionPercentage} className="h-1.5" />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-orange-50 dark:bg-orange-950/20 rounded-md p-2 flex flex-col items-center">
                                    <Clock className="h-3 w-3 text-orange-500 mb-1" />
                                    <span className="text-xs font-bold leading-none">{student.pendingCount}</span>
                                    <span className="text-[9px] text-muted-foreground">Pending</span>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-md p-2 flex flex-col items-center">
                                    <PencilLine className="h-3 w-3 text-blue-500 mb-1" />
                                    <span className="text-xs font-bold leading-none">{student.submittedCount}</span>
                                    <span className="text-[9px] text-muted-foreground">Submitted</span>
                                </div>
                                <div className="bg-green-50 dark:bg-green-950/20 rounded-md p-2 flex flex-col items-center">
                                    <CheckCircle2 className="h-3 w-3 text-green-500 mb-1" />
                                    <span className="text-xs font-bold leading-none">{student.gradedCount}</span>
                                    <span className="text-[9px] text-muted-foreground">Graded</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};
