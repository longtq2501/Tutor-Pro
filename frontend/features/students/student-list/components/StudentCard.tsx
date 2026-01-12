// ============================================================================
// 📁 student-list/components/StudentCard.tsx
// ============================================================================
import type { Student } from '@/lib/types';
import { StudentCardHeader } from './StudentCardHeader';
import { StudentCardDetails } from './StudentCardDetails';
import { StudentCardActions } from './StudentCardActions';
import { StudentEditActions } from './StudentEditActions';

interface StudentCardProps {
  student: Student;
  onEdit: () => void;
  onDelete: () => void;
  onSchedule: () => void;
  onAddSession: () => void;
}

/**
 * StudentCard Component
 * Displays a summary of student Information and available actions.
 * Adheres to 50-line SOP by delegating to sub-components.
 */
export function StudentCard({ student, onEdit, onDelete, onSchedule, onAddSession }: StudentCardProps) {
  return (
    <div
      className={`
        group relative bg-card rounded-3xl p-5 sm:p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
        ${student.active
          ? 'border-border hover:border-primary'
          : 'border-border bg-muted/30 opacity-80 hover:opacity-100'}
      `}
    >
      <div className="flex justify-between items-start mb-6">
        <StudentCardHeader student={student} />
        <StudentEditActions onEdit={onEdit} onDelete={onDelete} />
      </div>

      <StudentCardDetails student={student} />

      <StudentCardActions
        active={student.active}
        onSchedule={onSchedule}
        onAddSession={onAddSession}
      />
    </div>
  );
}
