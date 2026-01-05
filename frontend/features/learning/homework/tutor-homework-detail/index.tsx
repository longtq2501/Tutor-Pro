// ============================================================================
// 📁 tutor-homework-detail/index.tsx
// ============================================================================
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { Homework } from '@/lib/types';
import { useGrading } from './hooks/useGrading';
import { getStatusBadge } from './utils/statusHelpers';
import { HomeworkInfo } from './components/HomeworkInfo';
import { HomeworkDescription } from './components/HomeworkDescription';
import { AttachmentList } from './components/AttachmentList';
import { SubmissionInfo } from './components/SubmissionInfo';
import { GradingSection } from './components/GradingSection';
import { GradedDisplay } from './components/GradedDisplay';

interface TutorHomeworkDetailDialogProps {
  homework: Homework;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
  onDelete: (id: number) => void;
}

export default function TutorHomeworkDetailDialog({
  homework,
  open,
  onClose,
  onUpdate,
  onDelete,
}: TutorHomeworkDetailDialogProps) {
  const { hasAnyRole } = useAuth();
  const isAdmin = hasAnyRole(['ADMIN']);

  const {
    gradingMode,
    score,
    setScore,
    feedback,
    setFeedback,
    grading,
    handleGrade,
    startEdit,
    setGradingMode,
  } = useGrading(homework, isAdmin, onUpdate);

  const canGrade = homework.status === 'SUBMITTED';
  const isGraded = homework.status === 'GRADED';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{homework.title}</DialogTitle>
              <div className="mt-2 text-sm text-muted-foreground">
                {getStatusBadge(homework.status)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => onDelete(homework.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <HomeworkInfo homework={homework} />
          <Separator />
          <HomeworkDescription description={homework.description} tutorNotes={homework.tutorNotes} />
          <AttachmentList urls={homework.attachmentUrls} title="📎 Tài liệu đính kèm" />
          <Separator />
          <SubmissionInfo homework={homework} />

          {canGrade && (
            <GradingSection
              gradingMode={gradingMode}
              score={score}
              feedback={feedback}
              grading={grading}
              onScoreChange={setScore}
              onFeedbackChange={setFeedback}
              onStartEdit={() => setGradingMode(true)}
              onCancel={() => setGradingMode(false)}
              onSubmit={handleGrade}
            />
          )}

          {isGraded && (
            <GradedDisplay
              homework={homework}
              gradingMode={gradingMode}
              score={score}
              feedback={feedback}
              grading={grading}
              onScoreChange={setScore}
              onFeedbackChange={setFeedback}
              onStartEdit={startEdit}
              onCancel={() => setGradingMode(false)}
              onSubmit={handleGrade}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}