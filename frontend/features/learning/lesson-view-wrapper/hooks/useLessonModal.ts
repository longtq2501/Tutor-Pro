// 📁 lesson-view-wrapper/hooks/useLessonModal.ts
import { useState } from 'react';

export function useLessonModal() {
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

  const open = (lessonId: number) => {
    setSelectedLessonId(lessonId);
  };

  const close = () => {
    setSelectedLessonId(null);
  };

  const isOpen = selectedLessonId !== null;

  return { selectedLessonId, isOpen, open, close };
}