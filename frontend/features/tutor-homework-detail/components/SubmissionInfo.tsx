// ============================================================================
// 📁 tutor-homework-detail/components/SubmissionInfo.tsx
// ============================================================================
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { Homework } from '@/lib/types';
import { AttachmentList } from './AttachmentList';

interface SubmissionInfoProps {
  homework: Homework;
}

export function SubmissionInfo({ homework }: SubmissionInfoProps) {
  if (homework.status !== 'SUBMITTED' && homework.status !== 'GRADED') {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">📤 Bài nộp của học sinh</h3>

      {homework.submittedAt && (
        <p className="text-sm text-muted-foreground">
          Nộp lúc: {format(new Date(homework.submittedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
        </p>
      )}

      {homework.submissionNotes && (
        <div>
          <p className="text-sm font-medium mb-1">Ghi chú:</p>
          <p className="text-sm text-muted-foreground">{homework.submissionNotes}</p>
        </div>
      )}

      <AttachmentList urls={homework.submissionUrls} title="📎 File đã nộp:" />
    </div>
  );
}