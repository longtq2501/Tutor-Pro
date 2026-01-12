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

function LoadingGrid() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
            {[...Array(6)].map((_, i) => <StudentCardSkeleton key={i} />)}
        </div>
    );
}

function EmptyState() {
    return <div className="text-center py-10 text-muted-foreground">Không tìm thấy học sinh nào.</div>;
}

export function OptimizedStudentGrid(props: OptimizedStudentGridProps) {
    const [visibleCount, setVisibleCount] = useState(6);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => { setVisibleCount(6); }, [props.students, props.students.length]);

    useEffect(() => {
        const currentRef = loadMoreRef.current;
        const total = props.students.length;
        const obs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && visibleCount < total) {
                setVisibleCount(prev => Math.min(prev + 6, total));
            }
        }, { rootMargin: '200px' });

        if (currentRef) obs.observe(currentRef);
        return () => obs.disconnect();
    }, [visibleCount, props.students.length]);

    if (props.isLoading) return <LoadingGrid />;
    if (props.students.length === 0) return <EmptyState />;

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
                {props.students.slice(0, visibleCount).map((student) => (
                    <UnifiedStudentCard
                        key={student.id}
                        student={student}
                        onViewSchedule={props.onViewSchedule}
                        onAddSession={props.onAddSession}
                        onEdit={props.onEdit}
                        onViewDetails={props.onViewDetails}
                    />
                ))}
            </div>
            {visibleCount < props.students.length && (
                <div ref={loadMoreRef} className="h-20 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                </div>
            )}
        </>
    );
}
