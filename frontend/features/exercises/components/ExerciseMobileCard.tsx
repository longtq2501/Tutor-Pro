'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExerciseListItemResponse, ExerciseStatus } from '@/features/exercise-import/types/exercise.types';
import { format } from 'date-fns';
import { FileText, Play, Trash2, UserPlus, Clock } from 'lucide-react';
import { formatExerciseTitle } from '@/lib/utils';

/**
 * Mobile-optimized card for individual exercises.
 */
interface ExerciseMobileCardProps {
    ex: ExerciseListItemResponse;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
    onSelectExercise: (exercise: ExerciseListItemResponse, action: 'PLAY' | 'GRADE' | 'EDIT' | 'REVIEW') => void;
    handleOpenAssign: (ex: ExerciseListItemResponse, e: React.MouseEvent) => void;
    handleDelete: (id: string, e: React.MouseEvent) => void;
}

export const ExerciseMobileCard: React.FC<ExerciseMobileCardProps> = ({
    ex,
    role,
    onSelectExercise,
    handleOpenAssign,
    handleDelete
}) => {
    const isStudent = role === 'STUDENT';

    return (
        <Card className="overflow-hidden border shadow-sm hover:border-primary/50 transition-all active:scale-[0.98]" onClick={() => {
            if (isStudent) onSelectExercise(ex, 'PLAY');
            else onSelectExercise(ex, 'GRADE');
        }}>
            <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm leading-tight text-foreground whitespace-pre-wrap pr-2">
                        {formatExerciseTitle(ex.title)}
                    </h3>
                    <Badge
                        variant={
                            ex.submissionStatus === 'OVERDUE' ? 'destructive' :
                                ex.status === ExerciseStatus.PUBLISHED ? 'default' : 'secondary'
                        }
                        className="text-[10px] px-1.5 py-0 h-4 shrink-0"
                    >
                        {ex.submissionStatus === 'OVERDUE' ? 'OVERDUE' : ex.status}
                    </Badge>
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-[11px] text-muted-foreground border-y py-2 border-dashed">
                    <div className="flex items-center">
                        <span className="w-16">Thời gian:</span>
                        <span className="font-medium text-foreground">{ex.timeLimit ? `${ex.timeLimit}p` : '∞'}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="w-16">Điểm:</span>
                        <span className="font-bold text-foreground">{ex.totalPoints}</span>
                    </div>
                    <div className="flex items-center col-span-2">
                        <span className="w-16">Ngày tạo:</span>
                        <span className="text-foreground">{ex.createdAt ? format(new Date(ex.createdAt), 'dd/MM/yyyy') : '-'}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                    {isStudent ? (
                        <>
                            {ex.submissionId && (ex.submissionStatus === 'SUBMITTED' || ex.submissionStatus === 'GRADED') && (
                                <Button variant="outline" size="sm" className="w-full text-xs h-8" onClick={(e) => { e.stopPropagation(); onSelectExercise({ ...ex, id: ex.submissionId! }, 'REVIEW'); }}>
                                    <FileText className="mr-1.5 h-3.5 w-3.5" /> Xem kết quả
                                </Button>
                            )}
                            <Button size="sm" className="w-full text-xs h-8 shadow-sm" onClick={(e) => { e.stopPropagation(); onSelectExercise(ex, 'PLAY'); }}>
                                <Play className="mr-1.5 h-3.5 w-3.5" /> {ex.submissionId ? 'Làm tiếp' : 'Làm bài'}
                            </Button>
                        </>
                    ) : (
                        <div className="flex gap-2 w-full">
                            <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={(e) => handleOpenAssign(ex, e)}>
                                <UserPlus className="mr-1.5 h-3.5 w-3.5" /> Giao
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={(e) => { e.stopPropagation(); onSelectExercise(ex, 'GRADE'); }}>
                                <FileText className="mr-1.5 h-3.5 w-3.5" /> Chấm
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500 h-8 w-8 p-0" onClick={(e) => handleDelete(ex.id, e)}>
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};
