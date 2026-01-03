// 📁 lesson-view-wrapper/hooks/useLessonModal.ts
import { useCallback, useState } from 'react';

export function useLessonModal() {
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

  const open = useCallback((lessonId: number) => {
    setSelectedLessonId(lessonId);
  }, []);

  const close = useCallback(() => {
    setSelectedLessonId(null);
  }, []);

  const isOpen = selectedLessonId !== null;

  return { selectedLessonId, isOpen, open, close };
}