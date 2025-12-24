// 📁 lesson-timeline-view/hooks/useLessonFilter.ts
import { useState, useEffect, useMemo } from 'react';
import type { Lesson } from '@/lib/types';

export function useLessonFilter(lessons: Lesson[]) {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  const availableYears = useMemo(() => {
    return Array.from(new Set(lessons.map(l => 
      new Date(l.lessonDate).getFullYear()
    ))).sort((a, b) => b - a);
  }, [lessons]);

  const filteredLessons = useMemo(() => {
    let filtered = [...lessons];

    if (selectedYear !== 'all') {
      filtered = filtered.filter(lesson => 
        new Date(lesson.lessonDate).getFullYear().toString() === selectedYear
      );
    }

    if (selectedMonth !== 'all') {
      filtered = filtered.filter(lesson => 
        (new Date(lesson.lessonDate).getMonth() + 1).toString() === selectedMonth
      );
    }

    return filtered;
  }, [lessons, selectedYear, selectedMonth]);

  const clearFilters = () => {
    setSelectedYear('all');
    setSelectedMonth('all');
  };

  const hasActiveFilters = selectedYear !== 'all' || selectedMonth !== 'all';

  return {
    selectedYear,
    selectedMonth,
    availableYears,
    filteredLessons,
    setSelectedYear,
    setSelectedMonth,
    clearFilters,
    hasActiveFilters,
  };
}