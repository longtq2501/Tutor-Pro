'use client';

import { useUpdateAdminLesson } from '../hooks/useAdminLessons';
import { LessonForm } from './LessonForm';
import type { LessonDTO, LessonFormData, LessonLibraryDTO } from '../types';

interface EditLessonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson: LessonDTO | LessonLibraryDTO;
  onSubmit?: (data: LessonFormData) => void;
  isLoading?: boolean;
}

export function EditLessonDialog({
  open,
  onOpenChange,
  lesson,
  onSubmit,
  isLoading,
}: EditLessonDialogProps) {
  const updateMutation = useUpdateAdminLesson();

  const handleDefaultSubmit = (data: LessonFormData) => {
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
          categoryId: data.categoryId,
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
      lesson={lesson as LessonDTO} // Cast compatible type for form
      onSubmit={onSubmit || handleDefaultSubmit}
      isLoading={isLoading || updateMutation.isPending}
    />
  );
}