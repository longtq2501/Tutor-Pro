'use client';

import { Clock, Plus, Calendar, BookOpen, User, Hash, Loader2 } from 'lucide-react';
import type { AddSessionModalProps } from './types';
import { useSessionForm } from './hooks/useSessionForm';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from 'react';

export default function AddSessionModal({ onClose, onSubmit, initialDate, students, initialStudentId }: AddSessionModalProps) {
  const {
    studentId, setStudentId,
    sessions, setSessions,
    hoursPerSession, setHoursPerSession,
    sessionDate, setSessionDate,
    subject, setSubject,
    startTime, setStartTime,
    endTime, setEndTime,
    totalHours, month, validate
  } = useSessionForm(initialDate, initialStudentId);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      await onSubmit(studentId, sessions, hoursPerSession, sessionDate, month, subject, startTime, endTime);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-w-[95vw] sm:w-full p-0 bg-card rounded-2xl shadow-xl border border-border flex flex-col max-h-[90dvh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3.5 p-5 border-b border-border flex-shrink-0 bg-card">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-base font-semibold text-foreground">
              Thêm Buổi Học
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              Ghi nhận buổi dạy mới vào lịch giảng dạy
            </p>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 p-5 overflow-y-auto min-h-0">
          <form id="calendar-add-session-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Student selection */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-primary" />
                Học sinh <span className="text-destructive">*</span>
              </Label>
              <Select value={studentId ? studentId.toString() : ''} onValueChange={(v) => setStudentId(Number(v))}>
                <SelectTrigger className="h-10 rounded-lg">
                  <SelectValue placeholder="-- Chọn học sinh --" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date and Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  Ngày học <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="h-10 rounded-lg"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  Môn học
                </Label>
                <Input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ví dụ: Toán 10, Tiếng Anh..."
                  className="h-10 rounded-lg"
                />
              </div>
            </div>

            {/* Time Frame */}
            <div className="bg-muted/30 p-3.5 rounded-xl border border-border space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" />
                  Khung giờ học
                </Label>
                {hoursPerSession > 0 && (
                  <div className="px-2.5 py-0.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-medium text-primary flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{hoursPerSession} giờ</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground font-medium px-0.5">Bắt đầu</div>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="h-10 rounded-lg bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground font-medium px-0.5">Kết thúc</div>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="h-10 rounded-lg bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Sessions count & Duration */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-primary" />
                  Số buổi
                </Label>
                <Input
                  type="number"
                  value={sessions}
                  onChange={(e) => setSessions(parseFloat(e.target.value) || 1)}
                  min={1}
                  step={1}
                  className="h-10 rounded-lg text-center font-medium"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  Giờ / buổi
                </Label>
                <Input
                  type="number"
                  value={hoursPerSession}
                  onChange={(e) => setHoursPerSession(parseFloat(e.target.value) || 0.5)}
                  min={0.1}
                  step={0.1}
                  className="h-10 rounded-lg text-center font-medium"
                  required
                />
              </div>
            </div>

            {/* Summary Banner */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border text-sm">
              <span className="text-muted-foreground">Tổng thời lượng ({month || '--/--'}):</span>
              <span className="font-bold text-foreground">{totalHours.toFixed(1)} giờ</span>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex gap-2.5 flex-shrink-0 bg-card">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-10 font-medium"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            form="calendar-add-session-form"
            className="flex-1 h-10 font-medium"
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Thêm buổi học
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
