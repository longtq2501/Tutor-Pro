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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(studentId, sessions, hoursPerSession, sessionDate, month, subject, startTime, endTime);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-200 dark:border-slate-800">
        <ModalHeader onClose={onClose} />

        <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[85vh] overflow-y-auto">
          <StudentField students={students} value={studentId} onChange={setStudentId} />

          <DateField value={sessionDate} onChange={setSessionDate} />

          <div className="grid grid-cols-2 gap-5">
            <NumberField label="Số buổi" value={sessions} onChange={setSessions} min={1} step={1} />
            <NumberField
              label="Giờ / buổi"
              value={hoursPerSession}
              onChange={setHoursPerSession}
              min={0.5}
              step={0.5}
              icon={<Clock size={14} className="text-foreground" />}
            />
          </div>

          <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-4">
            <div>
              <label className="text-xs font-bold text-primary mb-1.5 block">Môn học</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Toán 10, Lý 11..."
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-primary mb-1.5 block">Giờ bắt đầu</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-primary mb-1.5 block">Giờ kết thúc</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground italic">* Tự động tính số giờ dựa trên khung giờ đã chọn.</p>
          </div>

          <SummaryCard totalHours={totalHours} month={month} />
          <ActionButtons onClose={onClose} />
        </form>
      </div>
    </div>
  );
}