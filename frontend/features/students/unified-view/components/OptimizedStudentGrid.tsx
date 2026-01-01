import { Student } from '@/lib/types';
import { useEffect, useRef, useState } from 'react';
import { StudentCardSkeleton } from './StudentCardSkeleton';
import { UnifiedStudentCard } from './UnifiedStudentCard';

interface OptimizedStudentGridProps {
    students: Student[];
    isLoading?: boolean;
    onViewSchedule: (student: Student) => void;
    onAddSession: (student: Student) => void;
    onEdit?: (student: Student) => void;
    onViewDetails?: (student: Student) => void;
}

export function OptimizedStudentGrid({
    students,
    isLoading,
    onViewSchedule,
    onAddSession,
    onEdit,
    onViewDetails
}: OptimizedStudentGridProps) {
    const [visibleCount, setVisibleCount] = useState(6); // Show 6 initially
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Reset separate visible count when students list changes (e.g. search/filter)
        setVisibleCount(6);
    }, [students.length, students]); // Correct dependency for reset

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && visibleCount < students.length) {
                    setVisibleCount(prev => Math.min(prev + 6, students.length)); // Load 6 more
                }
            },
            { rootMargin: '200px' }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [visibleCount, students.length]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {[...Array(6)].map((_, i) => (
                    <StudentCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (students.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                Không tìm thấy học sinh nào.
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {students.slice(0, visibleCount).map((student) => (
                    <UnifiedStudentCard
                        key={student.id}
                        student={student}
                        onViewSchedule={onViewSchedule}
                        onAddSession={onAddSession}
                        onEdit={onEdit}
                        onViewDetails={onViewDetails}
                    />
                ))}
            </div>

            {/* Load More Trigger */}
            {visibleCount < students.length && (
                <div ref={loadMoreRef} className="h-20 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
            )}
        </>
    );
}
