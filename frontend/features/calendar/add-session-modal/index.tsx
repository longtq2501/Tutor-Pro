'use client';

import { Clock, Plus, X, Calendar, Users, BookOpen, Sparkles, Zap } from 'lucide-react';
import type { AddSessionModalProps } from './types';
import { useSessionForm } from './hooks/useSessionForm';
import { DateField, NumberField, StudentField } from './components/FormField';
import { SummaryCard } from './components/SummaryCard';
import { ActionButtons } from './components/ActionButtons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUI } from '@/contexts/UIContext';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

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

  const { openDialog, closeDialog } = useUI();

  useEffect(() => {
    openDialog();
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      closeDialog();
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(studentId, sessions, hoursPerSession, sessionDate, month, subject, startTime, endTime);
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-card rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-border/60"
      >
        {/* Header with Gradient */}
        <div className="relative p-6 sm:p-8 pb-12 sm:pb-16 bg-gradient-to-br from-blue-600 to-indigo-700">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

          <div className="relative flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                <Plus size={24} strokeWidth={3} />
              </div>
              <div>
                <h3 className="text-white font-black uppercase tracking-widest text-sm">Thêm buổi dạy mới</h3>
                <p className="text-white/70 text-xs font-bold mt-1 flex items-center gap-1">
                  Khởi tạo buổi học nhanh chóng
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full text-white hover:bg-white/10 h-10 w-10"
            >
              <X size={24} />
            </Button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="relative z-10 -mt-8 mx-4 sm:mx-6 bg-card rounded-[2rem] border border-border/60 shadow-xl overflow-hidden p-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">

          {/* Student & Date Section */}
          <div className="space-y-4">
            <StudentField students={students} value={studentId} onChange={setStudentId} />
            <DateField value={sessionDate} onChange={setSessionDate} />
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <NumberField label="Số buổi" value={sessions} onChange={setSessions} min={1} step={1} icon={<Zap size={14} className="text-orange-500" />} />
            <NumberField
              label="Giờ / buổi"
              value={hoursPerSession}
              onChange={setHoursPerSession}
              min={0.1}
              step={0.1}
              icon={<Clock size={14} className="text-blue-500" />}
            />
          </div>

          {/* Details Section */}
          <div className="p-5 rounded-[1.5rem] bg-muted/30 border border-border/40 space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Môn học</Label>
              <Input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="VD: Toán 10, Lý 11..."
                className="h-12 px-5 rounded-xl border-border/60 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Giờ bắt đầu</Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="h-12 px-5 rounded-xl border-border/60 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Giờ kết thúc</Label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="h-12 px-5 rounded-xl border-border/60 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium italic flex items-center gap-1">
              <Sparkles size={10} className="text-blue-400" />
              Tự động tính số giờ dựa trên khung giờ đã chọn.
            </p>
          </div>

          {/* Summary Section */}
          <SummaryCard totalHours={totalHours} month={month} />

          {/* Actions */}
          <div className="pt-2">
            <ActionButtons onClose={onClose} />
          </div>
        </form>

        {/* Bottom padding for the overlapping effect */}
        <div className="h-6" />
      </motion.div>
    </div>,
    document.body
  );
}
