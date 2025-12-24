// ============================================================================
// 📁 unpaid-sessions/hooks/useSessionSelection.ts
// ============================================================================
import { useState, useMemo } from 'react';
import type { SessionRecord } from '@/lib/types';
import type { StudentGroup } from '../utils/groupSessions';

export function useSessionSelection(records: SessionRecord[], groupedRecords: StudentGroup[]) {
  const [selectedSessions, setSelectedSessions] = useState<number[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const toggleSession = (sessionId: number) => {
    setSelectedSessions(prev =>
      prev.includes(sessionId)
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const toggleStudent = (studentId: number, group: StudentGroup) => {
    const allSessionIds = group.sessions.map(s => s.id);
    const allSelected = allSessionIds.every(id => selectedSessions.includes(id));

    if (allSelected) {
      setSelectedSessions(prev => prev.filter(id => !allSessionIds.includes(id)));
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
    } else {
      setSelectedSessions(prev => [...prev, ...allSessionIds.filter(id => !prev.includes(id))]);
      setSelectedStudents(prev => prev.includes(studentId) ? prev : [...prev, studentId]);
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedSessions([]);
      setSelectedStudents([]);
    } else {
      setSelectedSessions(records.map(r => r.id));
      setSelectedStudents(groupedRecords.map(g => g.studentId));
    }
    setSelectAll(!selectAll);
  };

  const clearSelection = () => {
    setSelectedSessions([]);
    setSelectedStudents([]);
    setSelectAll(false);
  };

  const selectedTotal = useMemo(() => {
    return selectedSessions.reduce((acc, sessionId) => {
      const session = records.find(r => r.id === sessionId);
      if (session) {
        acc.totalSessions += session.sessions;
        acc.totalHours += session.hours;
        acc.totalAmount += session.totalAmount;
      }
      return acc;
    }, { totalSessions: 0, totalHours: 0, totalAmount: 0 });
  }, [selectedSessions, records]);

  return {
    selectedSessions,
    selectedStudents,
    selectAll,
    selectedTotal,
    toggleSession,
    toggleStudent,
    toggleSelectAll,
    clearSelection,
  };
}