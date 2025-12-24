// ============================================================================
// 📁 tutor-homework-detail/components/GradingSection.tsx
// ============================================================================
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { GradingForm } from './GradingForm';

interface GradingSectionProps {
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

export function GradingSection({
  gradingMode,
  score,
  feedback,
  grading,
  onScoreChange,
  onFeedbackChange,
  onStartEdit,
  onCancel,
  onSubmit,
}: GradingSectionProps) {
  return (
    <div className="space-y-4 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">📊 Chấm điểm</h3>
        {!gradingMode && (
          <Button onClick={onStartEdit} size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Chấm điểm
          </Button>
        )}
      </div>

      {gradingMode && (
        <GradingForm
          score={score}
          feedback={feedback}
          grading={grading}
          onScoreChange={onScoreChange}
          onFeedbackChange={onFeedbackChange}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
}