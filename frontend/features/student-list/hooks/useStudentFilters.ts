// ============================================================================
// 📁 student-list/hooks/useStudentFilters.ts
// ============================================================================
import { useState, useMemo } from 'react';
import type { Student } from '@/lib/types';

export function useStudentFilters(students: Student[]) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesFilter = 
        filterStatus === 'all' ? true :
        filterStatus === 'active' ? student.active :
        !student.active;
        
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [students, filterStatus, searchTerm]);

  const activeCount = students.filter(s => s.active).length;
  const inactiveCount = students.filter(s => !s.active).length;

  return {
    filterStatus,
    setFilterStatus,
    searchTerm,
    setSearchTerm,
    filteredStudents,
    activeCount,
    inactiveCount,
  };
}