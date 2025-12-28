// 📁 lesson-view-wrapper/components/LessonDetailModal.tsx
import {
  Dialog,
  DialogContent,
  DialogTitle
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import LessonDetailView from '../../lesson-detail-view';

interface LessonDetailModalProps {
  lessonId: number | null;
  open: boolean;
  onClose: () => void;
  isPreview?: boolean;
}

export function LessonDetailModal({ lessonId, open, onClose, isPreview = false }: LessonDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-none w-full h-full lg:max-w-[95vw] lg:h-[95vh] p-0 gap-0 bg-white dark:bg-[#0A0A0A] rounded-none lg:rounded-lg flex flex-col overflow-hidden [&>button]:text-foreground [&>button]:hover:bg-accent [&>button]:z-[200]">
        {/* Hidden title for accessibility */}
        <VisuallyHidden>
          <DialogTitle>Chi tiết bài giảng</DialogTitle>
        </VisuallyHidden>

        {/* Scrollable content wrapper */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-[10px]">
          {lessonId && <LessonDetailView lessonId={lessonId} onClose={onClose} isPreview={isPreview} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}