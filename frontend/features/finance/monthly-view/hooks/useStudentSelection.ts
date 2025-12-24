// 📁 monthly-view/hooks/useStudentSelection.ts
import { useState, useMemo } from 'react';
import type { GroupedRecord } from '../types';

export function useStudentSelection(groupedRecords: GroupedRecord[]) {
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const toggle = (studentId: number) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };

  const toggleAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(groupedRecords.map(g => g.studentId));
    }
    setSelectAll(!selectAll);
  };

  const clear = () => {
    setSelectedStudents([]);
    setSelectAll(false);
  };

  return { selectedStudents, selectAll, toggle, toggleAll, clear };
}