import { memo } from 'react';
import type { StudentGroup as StudentGroupType } from '../utils/groupSessions';
import { PremiumStudentDebtCard } from './PremiumStudentDebtCard';

interface StudentGroupProps {
  group: StudentGroupType;
  isSelected: boolean;
  selectedSessions: number[];
  onToggleStudent: () => void;
  onToggleSession: (sessionId: number) => void;
  onDeleteSession: (sessionId: number) => void;
}

export const StudentGroup = memo(({
  group,
  isSelected,
  selectedSessions,
  onToggleStudent,
  onToggleSession,
}: StudentGroupProps) => {
  return (
    <PremiumStudentDebtCard
      group={group}
      isSelected={isSelected}
      selectedSessions={selectedSessions}
      onToggleStudent={onToggleStudent}
      onToggleSession={onToggleSession}
    />
  );
});
