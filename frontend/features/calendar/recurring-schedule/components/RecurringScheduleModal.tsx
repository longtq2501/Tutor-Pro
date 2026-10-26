import { Repeat, AlertCircle, BookOpen, FileText, Loader2 } from 'lucide-react';
import type { RecurringSchedule } from '@/lib/types';
import { useRecurringScheduleForm } from '../hooks/useRecurringScheduleForm';
import { DaySelector } from './DaySelector';
import { MonthRangePicker } from './MonthRangePicker';
import { TimeRangePicker } from './TimeRangePicker';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface RecurringScheduleModalProps {
  studentId: number;
  studentName: string;
  existingSchedule?: RecurringSchedule | null;
  isLoadingData?: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RecurringScheduleModal({
  studentId,
  studentName,
  existingSchedule,
  isLoadingData = false,
  onClose,
  onSuccess,
}: RecurringScheduleModalProps) {
  const { formData, loading, error, toggleDay, updateTime, updateField, submit } =
    useRecurringScheduleForm(studentId, existingSchedule, onSuccess);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-w-[95vw] sm:w-full p-0 bg-card rounded-2xl shadow-xl border border-border flex flex-col max-h-[90dvh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3.5 p-5 border-b border-border flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
            <Repeat className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-base font-semibold text-foreground">
              {existingSchedule ? 'Sửa Lịch Cố Định' : 'Tạo Lịch Cố Định'}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              Học sinh: <span className="font-medium text-foreground">{studentName}</span>
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 overflow-y-auto min-h-0 relative">
          {isLoadingData && (
            <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                <p className="text-xs text-muted-foreground">Đang tải lịch...</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg flex items-center gap-2.5 text-sm text-destructive">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <DaySelector selectedDays={formData.daysOfWeek} onToggle={toggleDay} />

            <div className="space-y-1.5">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                Môn học
              </Label>
              <Input
                type="text"
                value={formData.subject || ''}
                onChange={e => updateField('subject', e.target.value)}
                className="h-10 rounded-lg"
                placeholder="Ví dụ: Toán, Tiếng Anh..."
              />
            </div>

            <TimeRangePicker
              startTime={formData.startTime}
              endTime={formData.endTime}
              hoursPerSession={formData.hoursPerSession}
              onChange={updateTime}
            />

            <MonthRangePicker
              startMonth={formData.startMonth}
              endMonth={formData.endMonth}
              onChange={updateField}
            />

            <div className="space-y-1.5">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-primary" />
                Ghi chú
              </Label>
              <Textarea
                value={formData.notes}
                onChange={e => updateField('notes', e.target.value)}
                rows={2}
                className="resize-none rounded-lg"
                placeholder="Ghi chú thêm về lịch..."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex gap-2.5 flex-shrink-0">
          <Button
            variant="outline"
            className="flex-1 h-10 font-medium"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            onClick={submit}
            disabled={loading}
            className="flex-1 h-10 font-medium"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {existingSchedule ? 'Cập Nhật' : 'Lưu Lịch'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}