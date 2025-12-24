// 📁 homework-detail-dialog/components/SubmittedInfo.tsx
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { Homework } from '@/lib/types';

interface SubmittedInfoProps {
  homework: Homework;
}

export function SubmittedInfo({ homework }: SubmittedInfoProps) {
  return (
    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
      <p className="text-sm text-blue-700 dark:text-blue-300">
        ✅ Đã nộp bài lúc: {homework.submittedAt && format(new Date(homework.submittedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
      </p>
      {homework.submissionNotes && (
        <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
          Ghi chú: {homework.submissionNotes}
        </p>
      )}
    </div>
  );
}