'use client';

import { useUpdateAdminLesson } from '../hooks/useAdminLessons';
import { LessonForm } from './LessonForm';
import type { LessonDTO, LessonFormData } from '../types';

interface EditLessonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson: LessonDTO;
}

export function EditLessonDialog({
  open,
  onOpenChange,
  lesson,
}: EditLessonDialogProps) {
  const updateMutation = useUpdateAdminLesson();

  const handleSubmit = (data: LessonFormData) => {
    updateMutation.mutate(
      {
        id: lesson.id,
        data: {
          tutorName: data.tutorName,
          title: data.title,
          summary: data.summary,
          content: data.content,
          lessonDate: data.lessonDate!,
          videoUrl: data.videoUrl,
          thumbnailUrl: data.thumbnailUrl,
          images: data.images || [],
          resources: data.resources || [],
          isPublished: data.isPublished || false,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <LessonForm
      open={open}
      onOpenChange={onOpenChange}
      mode="edit"
      lesson={lesson}
      onSubmit={handleSubmit}
      isLoading={updateMutation.isPending}
    />
  );
}