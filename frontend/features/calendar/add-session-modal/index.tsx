// ============================================================================
// FILE: add-session-modal/index.tsx (MAIN)
// ============================================================================
'use client';

import { Clock } from 'lucide-react';
import type { AddSessionModalProps } from './types';
import { useSessionForm } from './hooks/useSessionForm';
import { ModalHeader } from './components/ModalHeader';
import { DateField, NumberField } from './components/FormField';
import { SummaryCard } from './components/SummaryCard';
import { ActionButtons } from './components/ActionButtons';

export default function AddSessionModal({ onClose, onSubmit, initialDate }: AddSessionModalProps) {
  const { sessions, setSessions, hoursPerSession, setHoursPerSession, sessionDate, setSessionDate, totalHours, month, validate } = useSessionForm(initialDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(sessions, hoursPerSession, sessionDate, month);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-200 dark:border-slate-800">
        <ModalHeader onClose={onClose} />

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
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

          <SummaryCard totalHours={totalHours} month={month} />
          <ActionButtons onClose={onClose} />
        </form>
      </div>
    </div>
  );
}