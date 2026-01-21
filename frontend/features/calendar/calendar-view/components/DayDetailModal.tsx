import { X, Plus, Calendar, Clock, Trash2, BookOpen, BookDashed, CheckSquare, Square, Loader2, DollarSign, Check, Info, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { toast } from 'sonner';
import { MONTHS } from '../constants';
import { formatCurrency } from '../utils';
import type { CalendarDay } from '../types';
import type { SessionRecord } from '@/lib/types/finance';
import { LESSON_STATUS_LABELS, isTerminalStatus } from '@/lib/types/lesson-status';
import { getStatusColors } from '../utils/statusColors';
import { useUI } from '@/contexts/UIContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Props {
  day: CalendarDay;
  onClose: () => void;
  onAddSession: (dateStr: string) => void;
  onDelete: (id: number) => void;
  onTogglePayment: (id: number, version?: number) => void;
  onToggleComplete: (id: number, version?: number) => void;
  onSessionClick?: (session: SessionRecord) => void;
  loadingSessions?: Set<number>;
}

export const DayDetailModal = ({
  day,
  onClose,
  onAddSession,
  onDelete,
  onTogglePayment,
  onToggleComplete,
  onSessionClick,
  loadingSessions = new Set()
}: Props) => {
  const [sessionToDelete, setSessionToDelete] = useState<number | null>(null);

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

  if (typeof document === 'undefined') return null;

  const totalRevenue = day.sessions.reduce((acc, s) => acc + s.totalAmount, 0);
  const completedSessions = day.sessions.filter(s => s.completed).length;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "20%", opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative bg-card rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-border/60"
      >
        {/* Header with Gradient */}
        <div className="relative p-6 sm:p-8 pb-12 sm:pb-16 bg-gradient-to-br from-violet-600 to-purple-800 transition-all duration-300">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

          <div className="relative flex items-center justify-between text-white">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex flex-col items-center justify-center shrink-0">
                <span className="text-lg sm:text-xl font-black leading-none">{day.date.getDate()}</span>
                <span className="text-[8px] sm:text-[10px] uppercase font-bold opacity-80">{MONTHS[day.date.getMonth()].slice(6)}</span>
              </div>
              <div className="min-w-0">
                <h3 className="text-white font-black uppercase tracking-widest text-[11px] sm:text-sm truncate">Lịch dạy trong ngày</h3>
                <p className="text-white/70 text-[10px] sm:text-xs font-bold mt-0.5 sm:mt-1 truncate">
                  {day.sessions.length} buổi • {formatCurrency(totalRevenue)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onAddSession(day.dateStr)}
                className="rounded-xl h-10 w-10 text-white hover:bg-white/10"
              >
                <Plus size={20} strokeWidth={3} />
              </Button>
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
        </div>

        {/* Content Area */}
        <div className="relative z-10 -mt-8 mx-4 sm:mx-6 bg-card rounded-[2rem] border border-border/60 shadow-xl flex flex-col max-h-[60vh]">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4 no-scrollbar">
            <AnimatePresence mode="popLayout">
              {day.sessions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Calendar className="text-muted-foreground/30" size={40} />
                  </div>
                  <p className="text-muted-foreground font-bold italic">Hôm nay chưa có lịch học nào.</p>
                  <Button
                    variant="link"
                    onClick={() => onAddSession(day.dateStr)}
                    className="text-primary mt-2 flex items-center gap-1 mx-auto"
                  >
                    <Plus size={14} /> Thêm lịch ngay
                  </Button>
                </motion.div>
              ) : (
                day.sessions.map((session, index) => {
                  const colors = getStatusColors(session.status);
                  const terminal = isTerminalStatus(session.status || 'SCHEDULED');

                  return (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => onSessionClick?.(session)}
                      className={cn(
                        "group relative overflow-hidden flex flex-col border rounded-[1.5rem] p-4 sm:p-5 transition-all duration-500",
                        "hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg",
                        "bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 dark:to-transparent",
                        colors.bg,
                        session.isOnline && "bg-blue-50/50 dark:bg-blue-900/30 ring-1 ring-blue-500/30",
                        "border-white/20 dark:border-white/10"
                      )}
                    >
                      {/* Dimension Highlights */}
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/5 to-transparent dark:via-white/5" />

                      {/* Status Strip */}
                      <div className={cn("absolute left-0 top-0 bottom-0 w-1.5 sm:w-2 rounded-l-[1.5rem] shadow-[2px_0_10px_rgba(0,0,0,0.1)]", colors.dot)} />

                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h4 className="font-black text-base sm:text-lg truncate tracking-tight">{session.studentName}</h4>
                            {session.isOnline && (
                              <>
                                <Globe
                                  size={14}
                                  className="text-blue-600 dark:text-blue-400 animate-pulse-subtle"
                                  aria-hidden="true"
                                />
                                <span className="sr-only">Buổi học trực tuyến</span>
                              </>
                            )}
                            <Badge className={cn("rounded-full px-2 sm:px-3 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest border-0", colors.bg, colors.text)}>
                              {LESSON_STATUS_LABELS[session.status as keyof typeof LESSON_STATUS_LABELS] || (session.completed ? 'Đã dạy' : 'Dự kiến')}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground font-bold flex-wrap">
                            <span className="flex items-center gap-1">
                              <BookOpen size={12} className="opacity-50" />
                              <span className="truncate max-w-[80px] sm:max-w-none">{session.subject || 'Thông thường'}</span>
                            </span>
                            <span className="w-0.5 h-0.5 rounded-full bg-border shrink-0" />
                            <span className="flex items-center gap-1">
                              <Clock size={12} className="opacity-50" />
                              {session.startTime} - {session.endTime}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className={cn("font-black text-lg sm:text-xl tracking-tighter", colors.text)}>
                            {formatCurrency(session.totalAmount)}
                          </p>
                          <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground opacity-70">
                            {session.hours}h × {formatCurrency(session.pricePerHour)}/h
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border/40 flex justify-between items-center mt-auto">
                        <TooltipProvider delayDuration={300}>
                          <div className="flex gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleComplete(session.id, session.version);
                                  }}
                                  disabled={loadingSessions.has(session.id) || terminal}
                                  className={cn(
                                    "h-8 sm:h-10 rounded-xl px-2 sm:px-4 font-black uppercase tracking-widest text-[9px] sm:text-[10px] transition-all duration-300",
                                    session.completed ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground',
                                  )}
                                >
                                  {loadingSessions.has(session.id) ? (
                                    <Loader2 size={12} className="animate-spin sm:mr-1.5" />
                                  ) : (
                                    session.completed ? <Check size={12} className="sm:mr-1.5" strokeWidth={3} /> : <BookDashed size={12} className="sm:mr-1.5 text-muted-foreground/50" />
                                  )}
                                  <span className="hidden sm:inline">{session.completed ? 'Đã dạy' : 'Dự kiến'}</span>
                                  <span className="sm:hidden">{session.completed ? 'Dạy' : 'Dự'}</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="rounded-xl font-bold">
                                {session.completed ? 'Hủy đánh dấu dạy' : 'Đánh dấu đã dạy xong'}
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onTogglePayment(session.id, session.version);
                                  }}
                                  disabled={!session.completed || loadingSessions.has(session.id) || terminal}
                                  className={cn(
                                    "h-8 sm:h-10 rounded-xl px-2 sm:px-4 font-black uppercase tracking-widest text-[9px] sm:text-[10px] transition-all duration-300",
                                    session.paid ? 'bg-emerald-500/10 text-emerald-600' : 'bg-orange-500/10 text-orange-600',
                                    !session.completed && "opacity-20 grayscale pointer-events-none"
                                  )}
                                >
                                  {loadingSessions.has(session.id) ? (
                                    <Loader2 size={12} className="animate-spin sm:mr-1.5" />
                                  ) : (
                                    session.paid ? <CheckSquare size={12} className="sm:mr-1.5" strokeWidth={3} /> : <Square size={12} className="sm:mr-1.5" />
                                  )}
                                  <span className="hidden sm:inline">{session.paid ? 'Đã thu' : 'Chưa thu'}</span>
                                  <span className="sm:hidden">{session.paid ? 'Thu' : 'Chưa'}</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="rounded-xl font-bold">
                                {session.paid ? 'Hủy xác nhận thanh toán' : 'Xác nhận đã nhận tiền'}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); setSessionToDelete(session.id); }}
                          className="h-10 w-10 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer padding */}
        <div className="h-10" />
      </motion.div>

      <ConfirmDialog
        open={sessionToDelete !== null}
        onOpenChange={(open) => !open && setSessionToDelete(null)}
        onConfirm={() => {
          if (sessionToDelete) {
            onDelete(sessionToDelete);
            setSessionToDelete(null);
          }
        }}
        title="Xác nhận xóa vĩnh viễn?"
        description="Buổi học này sẽ bị xóa hoàn toàn khỏi hệ thống và không thể khôi phục. Bạn có chắc chắn không?"
        confirmText="Xác nhận xóa"
        variant="destructive"
      />
    </div>,
    document.body
  );
};
