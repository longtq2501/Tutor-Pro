'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

/**
 * Shared pagination controls for exercise-related lists.
 */
interface ExercisePaginationProps {
    page: number;
    totalPages: number;
    setPage: (page: number | ((p: number) => number)) => void;
    isLoading: boolean;
}

export const ExercisePagination: React.FC<ExercisePaginationProps> = ({
    page,
    totalPages,
    setPage,
    isLoading
}) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between p-4 border-t">
            <div className="text-xs text-muted-foreground">
                Trang {page + 1} / {totalPages}
            </div>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0 || isLoading}
                >
                    Trước
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1 || isLoading}
                >
                    Sau
                </Button>
            </div>
        </div>
    );
};
