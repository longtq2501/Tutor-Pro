// ============================================================================
// 📁 tutor-homework-detail/components/GradedDisplay.tsx
// ============================================================================
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { Homework } from '@/lib/types';
import { GradingForm } from './GradingForm';

interface GradedDisplayProps {
  homework: Homework;
  gradingMode: boolean;
  score: number;
  feedback: string;
  grading: boolean;
  onScoreChange: (score: number) => void;
  onFeedbackChange: (feedback: string) => void;
  onStartEdit: () => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export function GradedDisplay({
  homework,
  gradingMode,
  score,
  feedback,
  grading,
  onScoreChange,
  onFeedbackChange,
  onStartEdit,
  onCancel,
  onSubmit,
}: GradedDisplayProps) {
  return (
    <div className="space-y-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-green-900 dark:text-green-100">📊 Đã chấm điểm</h3>
        <Button variant="outline" size="sm" onClick={onStartEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Sửa điểm
        </Button>
      </div>

      {!gradingMode ? (
        <>
          <div className="flex items-center gap-2">
            <span className="text-sm text-green-700 dark:text-green-300">Điểm số:</span>
            <span className="text-3xl font-bold text-green-600">{homework.score}/100</span>
          </div>

          {homework.feedback && (
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">💬 Nhận xét:</p>
              <p className="text-sm text-green-600 dark:text-green-400">{homework.feedback}</p>
            </div>
          )}

          {homework.gradedAt && (
            <p className="text-xs text-green-600 dark:text-green-400">
              Chấm lúc: {format(new Date(homework.gradedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
            </p>
          )}
        </>
      ) : (
        <GradingForm
          score={score}
          feedback={feedback}
          grading={grading}
          onScoreChange={onScoreChange}
          onFeedbackChange={onFeedbackChange}
          onCancel={onCancel}
          onSubmit={onSubmit}
          submitLabel="Cập nhật điểm"
        />
      )}
    </div>
  );
}