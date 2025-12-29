// ============================================================================
// FILE: add-session-modal/index.tsx (MAIN)
// ============================================================================
'use client';

import { Clock } from 'lucide-react';
import type { AddSessionModalProps } from './types';
import { useSessionForm } from './hooks/useSessionForm';
import { ModalHeader } from './components/ModalHeader';
import { DateField, NumberField, StudentField } from './components/FormField';
import { SummaryCard } from './components/SummaryCard';
import { ActionButtons } from './components/ActionButtons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUI } from '@/contexts/UIContext';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

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

  // Manage UI state (Sidebar visibility)
  const { openDialog, closeDialog } = useUI();
  useEffect(() => {
    openDialog();
    return () => closeDialog();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(studentId, sessions, hoursPerSession, sessionDate, month, subject, startTime, endTime);
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-150" onClick={onClose} />

      <div className="relative bg-card rounded-xl shadow-lg max-w-md w-full animate-in fade-in zoom-in-95 duration-150 overflow-hidden border border-border">
        <ModalHeader onClose={onClose} />

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <StudentField students={students} value={studentId} onChange={setStudentId} />

          <DateField value={sessionDate} onChange={setSessionDate} />

          <div className="grid grid-cols-2 gap-4">
            <NumberField label="Số buổi" value={sessions} onChange={setSessions} min={1} step={1} />
            <NumberField
              label="Giờ / buổi"
              value={hoursPerSession}
              onChange={setHoursPerSession}
              min={0.5}
              step={0.5}
              icon={<Clock size={14} />}
            />
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border border-border space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-primary uppercase">Môn học</Label>
              <Input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Toán 10, Lý 11..."
                className="bg-background"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-primary uppercase">Giờ bắt đầu</Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-primary uppercase">Giờ kết thúc</Label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-background"
                />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground italic">* Tự động tính số giờ dựa trên khung giờ đã chọn.</p>
          </div>

          <SummaryCard totalHours={totalHours} month={month} />
          <ActionButtons onClose={onClose} />
        </form>
      </div>
    </div>,
    document.body
  );
}