'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ExerciseListItemResponse, ExerciseStatus } from '@/features/exercise-import/types/exercise.types';
import { format } from 'date-fns';
import { FileText, Play, Trash2, UserPlus, Clock } from 'lucide-react';
import { formatExerciseTitle } from '@/lib/utils';

/**
 * Desktop table view for displaying exercises.
 */
interface ExerciseTableProps {
    exercises: ExerciseListItemResponse[];
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
    onSelectExercise: (exercise: ExerciseListItemResponse, action: 'PLAY' | 'GRADE' | 'EDIT' | 'REVIEW') => void;
    handleOpenAssign: (ex: ExerciseListItemResponse, e: React.MouseEvent) => void;
    handleDelete: (id: string, e: React.MouseEvent) => void;
}

export const ExerciseTable: React.FC<ExerciseTableProps> = ({
    exercises,
    role,
    onSelectExercise,
    handleOpenAssign,
    handleDelete
}) => {
    const isStudent = role === 'STUDENT';

    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                    <TableHead className="py-2 px-4">Tiêu đề</TableHead>
                    <TableHead className="py-2 px-4">Trạng thái</TableHead>
                    <TableHead className="py-2 px-4">Thời gian</TableHead>
                    <TableHead className="py-2 px-4">Điểm</TableHead>
                    <TableHead className="py-2 px-4">Ngày tạo</TableHead>
                    <TableHead className="py-2 px-4 text-right">Hành động</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {exercises.map((ex: ExerciseListItemResponse) => (
                    <TableRow
                        key={ex.id}
                        className="cursor-pointer group hover:bg-muted/50 transition-colors"
                        onClick={() => {
                            if (isStudent) onSelectExercise(ex, 'PLAY');
                            else onSelectExercise(ex, 'GRADE');
                        }}
                    >
                        <TableCell className="py-2 px-4 font-medium max-w-[350px]">
                            <div className="whitespace-pre-wrap leading-tight text-sm group-hover:text-primary transition-colors">
                                {formatExerciseTitle(ex.title)}
                            </div>
                        </TableCell>
                        <TableCell className="py-1 px-4">
                            <Badge
                                variant={
                                    ex.submissionStatus === 'OVERDUE' ? 'destructive' :
                                        ex.status === ExerciseStatus.PUBLISHED ? 'default' : 'secondary'
                                }
                                className="px-2 py-0 h-5 text-[10px]"
                            >
                                {ex.submissionStatus === 'OVERDUE' ? 'OVERDUE' : ex.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="py-1 px-4 text-xs">{ex.timeLimit ? `${ex.timeLimit}p` : '∞'}</TableCell>
                        <TableCell className="py-1 px-4 text-xs font-bold">{ex.totalPoints}</TableCell>
                        <TableCell className="py-1 px-4 text-xs text-muted-foreground">
                            {ex.createdAt ? format(new Date(ex.createdAt), 'dd/MM/yyyy') : '-'}
                        </TableCell>
                        <TableCell className="py-1 px-4 text-right">
                            <div className="flex justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                {isStudent ? (
                                    <div className="flex gap-2">
                                        {ex.submissionId && (ex.submissionStatus === 'SUBMITTED' || ex.submissionStatus === 'GRADED') ? (
                                            <Button size="sm" variant="outline" className="h-8" onClick={(e) => { e.stopPropagation(); onSelectExercise({ ...ex, id: ex.submissionId! }, 'REVIEW'); }}>
                                                <FileText className="mr-2 h-4 w-4" /> Xem kết quả
                                            </Button>
                                        ) : null}
                                        <Button size="sm" className="h-8 shadow-sm" onClick={(e) => { e.stopPropagation(); onSelectExercise(ex, 'PLAY'); }}>
                                            <Play className="mr-2 h-4 w-4" /> {ex.submissionId ? 'Làm tiếp' : 'Làm bài'}
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleOpenAssign(ex, e)} title="Giao bài">
                                            <UserPlus className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onSelectExercise(ex, 'GRADE'); }}>
                                            <FileText className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={(e) => handleDelete(ex.id, e)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </>
                                )}
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
