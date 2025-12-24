// ============================================================================
// 📁 tutor-homework-detail/components/HomeworkDescription.tsx
// ============================================================================
interface HomeworkDescriptionProps {
  description?: string;
  tutorNotes?: string;
}

export function HomeworkDescription({ description, tutorNotes }: HomeworkDescriptionProps) {
  return (
    <>
      <div>
        <h3 className="font-semibold mb-2">📝 Nội dung bài tập</h3>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {description || 'Không có mô tả'}
        </p>
      </div>

      {tutorNotes && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">💡 Ghi chú</h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">{tutorNotes}</p>
        </div>
      )}
    </>
  );
}