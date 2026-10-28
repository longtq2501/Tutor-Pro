'use client';

import React from 'react';
import { useTutorStudentSummaries } from '../hooks/useExercises';
import { TutorStudentSummaryResponse } from '@/features/exercise-import/types/exercise.types';
import { PageResponse } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TutorStudentGridSkeleton } from './TutorStudentGridSkeleton';
import { TutorStudentGridEmptyState } from './TutorStudentGridEmptyState';
import { TutorStudentCard } from './TutorStudentCard';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';

interface TutorStudentGridProps {
    onSelectStudent: (student: TutorStudentSummaryResponse) => void;
}

export const TutorStudentGrid: React.FC<TutorStudentGridProps> = ({ onSelectStudent }) => {
    const [page, setPage] = React.useState(0);
    // Page size 8 creates clean 4 rows x 2 columns
    const { data: summariesData, isLoading } = useTutorStudentSummaries(page, 8);

    const summaries: TutorStudentSummaryResponse[] = (summariesData as PageResponse<TutorStudentSummaryResponse>)?.content || [];
    const totalPages = (summariesData as PageResponse<TutorStudentSummaryResponse>)?.totalPages || 1;
    const totalElements = (summariesData as PageResponse<TutorStudentSummaryResponse>)?.totalElements;

    if (isLoading) return <TutorStudentGridSkeleton />;
    if (summaries.length === 0) return <TutorStudentGridEmptyState />;

    return (
        <div className="space-y-4">
            {/* Section Header with Title & Context */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1 border-b border-border/40">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-xs">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                                Tiến độ làm bài học sinh
                            </h3>
                            <Badge variant="secondary" className="font-bold text-xs h-5 px-2">
                                {totalElements ?? summaries.length}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Theo dõi tình hình nộp bài, chấm điểm và đánh giá kết quả theo từng học sinh
                        </p>
                    </div>
                </div>
            </div>

            {/* 2 equal columns grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in duration-300">
                {summaries.map((student) => (
                    <TutorStudentCard
                        key={student.studentId}
                        student={student}
                        onClick={onSelectStudent}
                    />
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 px-1 border-t border-border/50">
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 order-2 sm:order-1">
                        <Users className="h-3.5 w-3.5 text-primary" />
                        <span>Hiển thị {summaries.length} {typeof totalElements === 'number' ? `/ ${totalElements}` : ''} học sinh</span>
                    </p>

                    <div className="flex items-center gap-1.5 bg-muted/40 dark:bg-muted/20 p-1 rounded-xl border border-border/80 shadow-xs order-1 sm:order-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2.5 rounded-lg text-xs font-bold gap-1 text-foreground hover:bg-background"
                            disabled={page === 0}
                            onClick={() => {
                                setPage(p => p - 1);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Trước</span>
                        </Button>

                        <div className="flex items-center px-2 py-1">
                            <span className="text-xs font-bold text-foreground">
                                Trang {page + 1}
                            </span>
                            <span className="text-xs font-medium text-muted-foreground ml-1">
                                / {totalPages}
                            </span>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2.5 rounded-lg text-xs font-bold gap-1 text-foreground hover:bg-background"
                            disabled={page >= totalPages - 1}
                            onClick={() => {
                                setPage(p => p + 1);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        >
                            <span className="hidden sm:inline">Sau</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
