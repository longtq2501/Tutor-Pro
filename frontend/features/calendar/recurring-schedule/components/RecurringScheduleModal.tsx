import { X, Save, Repeat, AlertCircle, Calendar, BookOpen, Clock, FileText } from 'lucide-react';
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
import { cn } from '@/lib/utils';

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
      <DialogContent className="sm:max-w-[550px] w-[95vw] max-w-[95vw] sm:w-full max-h-[90vh] p-0 overflow-hidden bg-card rounded-3xl shadow-2xl border-2 border-border/50 transition-all duration-300 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-br from-blue-500/10 via-primary/10 to-purple-500/10 rounded-t-3xl flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-primary flex items-center justify-center flex-shrink-0 shadow-lg text-white">
              <Repeat size={28} />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold tracking-tight">
                {existingSchedule ? 'Sửa Lịch Cố Định' : 'Tạo Lịch Cố Định'}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                <span className="text-muted-foreground/70">Học sinh:</span>
                <span className="font-semibold text-foreground bg-background/50 px-2 py-0.5 rounded-md">
                  {studentName}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent relative">
          {isLoadingData && (
            <div className="absolute inset-0 z-50 bg-background/60 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-300">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-sm font-medium text-muted-foreground">Đang tải lịch...</p>
              </div>
            </div>
          )}
          <div className={cn(
            "space-y-6 transition-all duration-300",
            isLoadingData ? "opacity-0 scale-95" : "animate-in slide-in-from-bottom-4 fade-in duration-300"
          )}>
            {error && (
              <div className="bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-800 p-4 rounded-xl flex items-center gap-3 text-sm text-rose-700 dark:text-rose-400">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            <DaySelector selectedDays={formData.daysOfWeek} onToggle={toggleDay} />

            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                Môn học
              </Label>
              <Input
                type="text"
                value={formData.subject || ''}
                onChange={e => updateField('subject', e.target.value)}
                className="h-12 rounded-xl border-2 border-muted-foreground/20 focus:border-primary/50 hover:border-primary/30 transition-all bg-muted/30"
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

            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-primary" />
                Ghi chú
              </Label>
              <Textarea
                value={formData.notes}
                onChange={e => updateField('notes', e.target.value)}
                rows={2}
                className="resize-none rounded-xl border-2 border-muted-foreground/20 focus:border-primary/50 hover:border-primary/30 transition-all bg-muted/30"
                placeholder="Ghi chú thêm về lịch..."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-6 border-t flex gap-3 bg-gradient-to-br from-muted/20 to-muted/40 rounded-b-3xl relative z-10">
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-xl hover:bg-muted/70 transition-all border-2 font-semibold"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            onClick={submit}
            disabled={loading}
            className="flex-[2] h-12 bg-gradient-to-r from-blue-500 to-primary hover:from-blue-600 hover:to-primary/90 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
            ) : (
              <Save size={18} />
            )}
            {existingSchedule ? 'Cập Nhật' : 'Lưu Thiết Lập'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}