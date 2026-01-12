import { Student } from '@/lib/types';
import { StudentCard } from './StudentCard';
import { EmptyState } from './EmptyState';

interface StudentGridProps {
    students: Student[];
    onEdit: (student: Student) => void;
    onDelete: (id: number) => void;
    onSchedule: (student: Student) => void;
    onAddSession: (id: number) => void;
}

/**
 * Grid component for displaying filtered student cards.
 */
export function StudentGrid({ students, onEdit, onDelete, onSchedule, onAddSession }: StudentGridProps) {
    if (students.length === 0) return <EmptyState />;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
                <StudentCard
                    key={student.id}
                    student={student}
                    onEdit={() => onEdit(student)}
                    onDelete={() => onDelete(student.id)}
                    onSchedule={() => onSchedule(student)}
                    onAddSession={() => onAddSession(student.id)}
                />
            ))}
        </div>
    );
}
