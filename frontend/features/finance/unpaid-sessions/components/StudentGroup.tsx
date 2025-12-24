// ============================================================================
// 📁 unpaid-sessions/components/StudentGroup.tsx
// ============================================================================
import type { StudentGroup as StudentGroupType } from '../utils/groupSessions';
import { formatCurrency, getMonthName } from '../utils/formatters';
import { SessionCard } from './SessionCard';

interface StudentGroupProps {
  group: StudentGroupType;
  isSelected: boolean;
  selectedSessions: number[];
  onToggleStudent: () => void;
  onToggleSession: (sessionId: number) => void;
  onDeleteSession: (sessionId: number) => void;
}

export function StudentGroup({
  group,
  isSelected,
  selectedSessions,
  onToggleStudent,
  onToggleSession,
  onDeleteSession,
}: StudentGroupProps) {
  return (
    <div
      className={`border rounded-xl p-5 transition-all ${
        isSelected
          ? 'border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/10'
          : 'border-border bg-card'
      }`}
    >
      {/* Student Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3 flex-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleStudent}
            className="h-5 w-5 text-orange-600 rounded focus:ring-orange-500"
          />
          <div>
            <h3 className="text-lg font-bold text-card-foreground mb-1">
              {group.studentName}
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full font-medium">
                {group.totalSessions} buổi × 2h = {group.totalHours}h
              </span>
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full font-medium">
                {Array.from(group.months).map(m => getMonthName(m)).join(', ')}
              </span>
              <span className="font-semibold text-foreground">
                Tổng: {formatCurrency(group.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="bg-muted/30 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {group.sessions
            .sort((a, b) => a.sessionDate.localeCompare(b.sessionDate))
            .map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                selected={selectedSessions.includes(session.id)}
                onToggle={() => onToggleSession(session.id)}
                onDelete={() => onDeleteSession(session.id)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}