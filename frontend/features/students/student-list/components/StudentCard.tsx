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
 * Displays a summary of student information and available actions.
 * Inactive students have all action buttons disabled except Edit.
 */
export function StudentCard({ student, onEdit, onDelete, onSchedule, onAddSession }: StudentCardProps) {
  const isInactive = !student.active;

  return (
    <div
      className={`
        group relative bg-card rounded-2xl border transition-all duration-300
        ${isInactive
          ? 'border-border/50 opacity-50 hover:opacity-70'
          : 'border-border hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-md'}
      `}
    >
      <div className="p-5 sm:p-6">
        <div className="flex justify-between items-start mb-5">
          <StudentCardHeader student={student} />
          <StudentEditActions onEdit={onEdit} onDelete={onDelete} isInactive={isInactive} />
        </div>

        <StudentCardDetails student={student} />

        <StudentCardActions
          active={student.active}
          onSchedule={onSchedule}
          onAddSession={onAddSession}
        />
      </div>
    </div>
  );
}
