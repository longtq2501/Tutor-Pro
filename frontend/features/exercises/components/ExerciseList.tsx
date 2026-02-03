'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText } from 'lucide-react';
import { ExerciseListItemResponse } from '@/features/exercise-import/types/exercise.types';
import { ExerciseFilterBar } from './ExerciseFilterBar';
import { ExerciseTable } from './ExerciseTable';
import { ExerciseMobileCard } from './ExerciseMobileCard';
import { ActionTooltip } from './ActionTooltip';
import { AssignExerciseDialog } from './AssignExerciseDialog';
import { ExerciseListSkeleton } from './ExerciseListSkeleton';
import { useExerciseListLogic } from '../hooks/useExerciseListLogic';
import { ExercisePagination } from './ExercisePagination';
import { StudentExerciseCard } from './StudentExerciseCard';
import { Loader2 } from 'lucide-react';

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

    if (l.isExercisesLoading) return <div className="h-[calc(100vh-14rem)]"><ExerciseListSkeleton /></div>;

    return (
        <Card className="animate-in fade-in slide-in-from-bottom-2 duration-400 flex flex-col h-[calc(100vh-14rem)] overflow-hidden border-none shadow-xl bg-gradient-to-br from-card to-muted/20">
            <CardHeader className="py-4 px-6 flex flex-row items-center justify-between border-b shrink-0 bg-background/50 backdrop-blur-sm z-10">
                <CardTitle className="text-xl font-black flex items-center gap-2 tracking-tight">
                    <FileText className="h-5 w-5 text-primary" />
                    Danh sách bài tập
                    <Badge variant="secondary" className="ml-2 font-black text-xs h-6">{l.totalElements}</Badge>
                </CardTitle>
                {(role !== 'STUDENT') && (
                    <ActionTooltip label="Tạo bài tập mới bằng AI hoặc Thủ công" side="left">
                        <Button onClick={onCreateNew} size="sm" className="h-9 shadow-lg rounded-xl font-bold px-4">
                            <Plus className="mr-2 h-4 w-4" /> Tạo bài tập mới
                        </Button>
                    </ActionTooltip>
                )}
            </CardHeader>

            <div className="flex flex-col flex-1 min-h-0">
                {role !== 'STUDENT' && (
                    <div className="shrink-0 bg-background/30 backdrop-blur-xs">
                        <ExerciseFilterBar
                            searchTerm={l.searchTerm} setSearchTerm={l.setSearchTerm}
                            selectedCategory={l.selectedCategory} setSelectedCategory={l.setSelectedCategory}
                            categories={l.categories}
                        />
                    </div>
                )}

                <CardContent className="p-0 flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                    {l.exercises.length === 0 ? <EmptyState /> : (
                        role === 'STUDENT' ? (
                            <div className="p-6 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {l.exercises.map(ex => (
                                        <StudentExerciseCard
                                            key={ex.id}
                                            exercise={ex}
                                            onClick={() => {
                                                const action = (ex.submissionStatus === 'SUBMITTED' || ex.submissionStatus === 'GRADED') ? 'REVIEW' : 'PLAY';
                                                onSelectExercise(ex, action);
                                            }}
                                        />
                                    ))}
                                </div>
                                {l.hasNextPage && (
                                    <div className="flex justify-center pb-8">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="h-12 px-8 rounded-2xl font-black border-2 hover:bg-primary hover:text-primary-foreground transition-all shadow-lg active:scale-95"
                                            onClick={() => l.fetchNextPage()}
                                            disabled={l.isFetchingNextPage}
                                        >
                                            {l.isFetchingNextPage ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Đang tải...
                                                </>
                                            ) : 'Tải thêm bài tập'}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="hidden md:block">
                                    <ExerciseTable exercises={l.exercises} role={role} onSelectExercise={onSelectExercise} handleOpenAssign={l.handleOpenAssign} handleDelete={l.handleDelete} />
                                </div>
                                <div className="md:hidden space-y-3 p-4">
                                    {l.exercises.map(ex => <ExerciseMobileCard key={ex.id} ex={ex} role={role} onSelectExercise={onSelectExercise} handleOpenAssign={l.handleOpenAssign} handleDelete={l.handleDelete} />)}
                                </div>
                            </>
                        )
                    )}
                </CardContent>

                {role !== 'STUDENT' && (
                    <div className="shrink-0 p-4 border-t bg-background/50 backdrop-blur-sm">
                        <ExercisePagination page={l.page} totalPages={l.totalPages} setPage={l.setPage} isLoading={l.isExercisesLoading} />
                    </div>
                )}
            </div>

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
