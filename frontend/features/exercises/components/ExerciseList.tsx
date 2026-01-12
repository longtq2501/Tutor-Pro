'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, FileText } from 'lucide-react';
import { ExerciseListItemResponse } from '@/features/exercise-import/types/exercise.types';
import { ExerciseFilterBar } from './ExerciseFilterBar';
import { ExerciseTable } from './ExerciseTable';
import { ExerciseMobileCard } from './ExerciseMobileCard';
import { AssignExerciseDialog } from './AssignExerciseDialog';
import { ExerciseListSkeleton } from './ExerciseListSkeleton';
import { useExerciseListLogic } from '../hooks/useExerciseListLogic';
import { ExercisePagination } from './ExercisePagination';

interface ExerciseListProps {
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
    onSelectExercise: (exercise: ExerciseListItemResponse, action: 'PLAY' | 'GRADE' | 'EDIT' | 'REVIEW') => void;
    onCreateNew?: () => void;
}

const EmptyState = () => (
    <div className="text-center py-12 space-y-3">
        <div className="flex justify-center">
            <div className="bg-muted p-4 rounded-full">
                <FileText className="h-8 w-8 text-muted-foreground/50" />
            </div>
        </div>
        <p className="text-muted-foreground">Chưa có bài tập nào.</p>
    </div>
);

/**
 * Main assessment library component.
 * Orchestrates filtering, pagination, and multi-role views.
 */
export const ExerciseList: React.FC<ExerciseListProps> = ({ role, onSelectExercise, onCreateNew }) => {
    const l = useExerciseListLogic(role);

    if (l.isExercisesLoading) return <ExerciseListSkeleton />;

    return (
        <Card className="animate-in fade-in slide-in-from-bottom-2 duration-400">
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                    Danh sách bài tập ({l.totalElements})
                </CardTitle>
                {(role !== 'STUDENT') && (
                    <Button onClick={onCreateNew} size="sm" className="h-8 shadow-sm">
                        <Plus className="mr-2 h-4 w-4" /> Tạo mới
                    </Button>
                )}
            </CardHeader>

            {role !== 'STUDENT' && (
                <ExerciseFilterBar
                    searchTerm={l.searchTerm} setSearchTerm={l.setSearchTerm}
                    selectedCategory={l.selectedCategory} setSelectedCategory={l.setSelectedCategory}
                    categories={l.categories}
                />
            )}

            <CardContent className="p-0 sm:p-4">
                {l.exercises.length === 0 ? <EmptyState /> : (
                    <>
                        <div className="hidden md:block">
                            <ExerciseTable exercises={l.exercises} role={role} onSelectExercise={onSelectExercise} handleOpenAssign={l.handleOpenAssign} handleDelete={l.handleDelete} />
                        </div>
                        <div className="md:hidden space-y-3 p-4">
                            {l.exercises.map(ex => <ExerciseMobileCard key={ex.id} ex={ex} role={role} onSelectExercise={onSelectExercise} handleOpenAssign={l.handleOpenAssign} handleDelete={l.handleDelete} />)}
                        </div>
                        <ExercisePagination page={l.page} totalPages={l.totalPages} setPage={l.setPage} isLoading={l.isExercisesLoading} />
                    </>
                )}
            </CardContent>

            <AssignExerciseDialog
                isOpen={l.isAssignDialogOpen} onOpenChange={l.setIsAssignDialogOpen}
                selectedExercise={l.selectedExercise} students={l.students} isStudentsLoading={l.isStudentsLoading}
                assignStudentId={l.assignStudentId} setAssignStudentId={l.setAssignStudentId}
                assignDeadline={l.assignDeadline} setAssignDeadline={l.setAssignDeadline}
                isAssigning={l.isAssigning} handleAssign={l.handleAssign}
            />
        </Card>
    );
};
