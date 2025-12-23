'use client';

import React, { useState } from 'react';
import LessonTimelineView from './LessonTimelineView';
import LessonDetailView from './LessonDetailView';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

/**
 * Wrapper component that manages both Timeline and Detail views
 * For inline navigation without separate routes
 * 
 * ✅ FIXED: Added DialogTitle to prevent accessibility warning
 * ✅ FIXED: Full-screen modal for better side-by-side layout
 */
export default function LessonViewWrapper() {
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

  const handleLessonSelect = (lessonId: number) => {
    setSelectedLessonId(lessonId);
  };

  const handleClose = () => {
    setSelectedLessonId(null);
  };

  return (
    <>
      {/* Timeline View */}
      <LessonTimelineView onLessonSelect={handleLessonSelect} />

      {/* Detail View Modal - Full Screen */}
      <Dialog open={selectedLessonId !== null} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent 
          className="max-w-[95vw] w-[95vw] h-[95vh] p-0 gap-0"
          aria-describedby="lesson-detail-description"
        >
          {/* ✅ REQUIRED: DialogTitle for accessibility - Hidden but present */}
          <VisuallyHidden>
            <DialogTitle>Chi tiết bài giảng</DialogTitle>
          </VisuallyHidden>
          
          {/* ✅ Description for screen readers */}
          <VisuallyHidden id="lesson-detail-description">
            Xem chi tiết nội dung bài giảng, video, hình ảnh và tài liệu
          </VisuallyHidden>

          {selectedLessonId && (
            <div className="h-full overflow-hidden">
              <LessonDetailView lessonId={selectedLessonId} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}