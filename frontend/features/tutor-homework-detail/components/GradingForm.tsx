// ============================================================================
// 📁 tutor-homework-detail/components/GradingForm.tsx
// ============================================================================
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2 } from 'lucide-react';

interface GradingFormProps {
  score: number;
  feedback: string;
  grading: boolean;
  onScoreChange: (score: number) => void;
  onFeedbackChange: (feedback: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel?: string;
}

export function GradingForm({
  score,
  feedback,
  grading,
  onScoreChange,
  onFeedbackChange,
  onCancel,
  onSubmit,
  submitLabel = 'Lưu điểm',
}: GradingFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="score">Điểm (0-100)</Label>
        <Input
          id="score"
          type="number"
          min="0"
          max="100"
          value={score}
          onChange={(e) => onScoreChange(Number(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="feedback">Nhận xét</Label>
        <Textarea
          id="feedback"
          value={feedback}
          onChange={(e) => onFeedbackChange(e.target.value)}
          placeholder="Nhập nhận xét cho học sinh..."
          rows={4}
        />
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button onClick={onSubmit} disabled={grading} className="flex-1">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          {grading ? 'Đang lưu...' : submitLabel}
        </Button>
      </div>
    </div>
  );
}