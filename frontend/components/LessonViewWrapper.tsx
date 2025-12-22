'use client';

import React, { useState } from 'react';
import LessonTimelineView from './LessonTimelineView';
import LessonDetailView from './LessonDetailView';
import { Dialog, DialogContent } from '@/components/ui/dialog';

/**
 * Wrapper component that manages both Timeline and Detail views
 * For inline navigation without separate routes
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

      {/* Detail View Modal */}
      <Dialog open={selectedLessonId !== null} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
          {selectedLessonId && (
            <div className="p-6">
              <LessonDetailView lessonId={selectedLessonId} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}