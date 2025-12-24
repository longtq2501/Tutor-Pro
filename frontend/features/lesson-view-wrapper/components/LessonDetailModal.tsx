// 📁 lesson-view-wrapper/components/LessonDetailModal.tsx
import { Dialog, DialogContent } from '@/components/ui/dialog';
import LessonDetailView from '../../lesson-detail-view';

interface LessonDetailModalProps {
  lessonId: number | null;
  open: boolean;
  onClose: () => void;
}

export function LessonDetailModal({ lessonId, open, onClose }: LessonDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        {lessonId && (
          <div className="p-6">
            <LessonDetailView lessonId={lessonId} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}