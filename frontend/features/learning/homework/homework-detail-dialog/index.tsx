// 📁 homework-detail-dialog/index.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { homeworkApi } from '@/lib/services';
import { toast } from 'sonner';
import type { Homework } from '@/lib/types';
import { useHomeworkSubmission } from './hooks/useHomeworkSubmission';
import { getStatusBadge } from './utils';
import { HomeworkInfo } from './components/HomeworkInfo';
import { HomeworkContent } from './components/HomeworkContent';
import { SubmissionForm } from './components/SubmissionForm';
import { GradingResult } from './components/GradingResult';
import { SubmittedInfo } from './components/SubmittedInfo';

interface HomeworkDetailDialogProps {
  homework: Homework;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function HomeworkDetailDialog({
  homework, open, onClose, onUpdate
}: HomeworkDetailDialogProps) {
  const [notes, setNotes] = useState('');
  const { uploadedFiles, uploading, submitting, uploadFiles, removeFile, submit, reset } = useHomeworkSubmission();

  const handleUpload = async (files: FileList) => {
    try {
      await uploadFiles(files);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleSubmit = async () => {
    const success = await submit(homework.id, notes);
    if (success) {
      setNotes('');
      reset();
      onUpdate();
      onClose();
    }
  };

  const handleMarkInProgress = async () => {
    try {
      await homeworkApi.student.updateStatus(homework.id, 'IN_PROGRESS');
      toast.success('Đã đánh dấu đang làm!');
      onUpdate();
    } catch (error: any) {
      toast.error(`Không thể cập nhật: ${error.response?.data?.message || error.message}`);
    }
  };

  const canSubmit = homework.status === 'ASSIGNED' || homework.status === 'IN_PROGRESS';
  const isGraded = homework.status === 'GRADED';
  const isSubmitted = homework.status === 'SUBMITTED';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{homework.title}</DialogTitle>
              <DialogDescription className="mt-2">
                {getStatusBadge(homework.status)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <HomeworkInfo homework={homework} />
          <HomeworkContent homework={homework} />

          {canSubmit && (
            <SubmissionForm
              notes={notes}
              files={uploadedFiles}
              uploading={uploading}
              submitting={submitting}
              showMarkInProgress={homework.status === 'ASSIGNED'}
              onNotesChange={setNotes}
              onUpload={handleUpload}
              onRemoveFile={removeFile}
              onMarkInProgress={handleMarkInProgress}
              onSubmit={handleSubmit}
            />
          )}

          {isGraded && <GradingResult homework={homework} />}
          {isSubmitted && <SubmittedInfo homework={homework} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}