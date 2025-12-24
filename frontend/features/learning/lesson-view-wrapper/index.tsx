// 📁 lesson-view-wrapper/index.tsx
'use client';

import LessonTimelineView from '../lesson-timeline-view';
import { useLessonModal } from './hooks/useLessonModal';
import { LessonDetailModal } from './components/LessonDetailModal';

/**
 * Wrapper component that manages both Timeline and Detail views
 * For inline navigation without separate routes
 */
export default function LessonViewWrapper() {
  const { selectedLessonId, isOpen, open, close } = useLessonModal();

  return (
    <>
      <LessonTimelineView onLessonSelect={open} />
      
      {selectedLessonId && (
        <LessonDetailModal 
          lessonId={selectedLessonId} 
          open={isOpen} 
          onClose={close} 
        />
      )}
    </>
  );
}