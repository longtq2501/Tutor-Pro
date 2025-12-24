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
}

export function LessonDetailModal({ lessonId, open, onClose }: LessonDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 gap-0 bg-white dark:bg-[#0A0A0A]">
        {/* Hidden title for accessibility */}
        <VisuallyHidden>
          <DialogTitle>Chi tiết bài giảng</DialogTitle>
        </VisuallyHidden>
        
        {lessonId && <LessonDetailView lessonId={lessonId} />}
      </DialogContent>
    </Dialog>
  );
}