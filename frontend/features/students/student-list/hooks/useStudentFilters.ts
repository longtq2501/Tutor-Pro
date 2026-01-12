// ============================================================================
// 📁 student-list/hooks/useStudentFilters.ts
// ============================================================================
import { useMemo, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { Student } from '@/lib/types';

export function useStudentFilters(students: Student[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial values from URL or defaults
  const filterStatus = (searchParams.get('status') as 'all' | 'active' | 'inactive') || 'all';
  const searchTerm = searchParams.get('search') || '';

  // Helper to update URL params
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const setFilterStatus = (status: 'all' | 'active' | 'inactive') => {
    router.push(`${pathname}?${createQueryString('status', status)}`, { scroll: false });
  };

  const setSearchTerm = (term: string) => {
    router.push(`${pathname}?${createQueryString('search', term)}`, { scroll: false });
  };

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