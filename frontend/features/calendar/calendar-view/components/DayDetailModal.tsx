// ============================================================================
// FILE: calendar-view/components/DayDetailModal.tsx
// ============================================================================
import { XCircle, Plus, Calendar, Clock, Trash2, BookOpen, BookDashed, CheckSquare, Square } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { toast } from 'sonner';
import { MONTHS } from '../constants';
import { formatCurrency } from '../utils';
import type { CalendarDay } from '../types';
import type { SessionRecord } from '@/lib/types/finance';

interface Props {
  day: CalendarDay;
  onClose: () => void;
  onAddSession: (dateStr: string) => void;
  onDelete: (id: number) => void;
  onTogglePayment: (id: number) => void;
  onToggleComplete: (id: number) => void;
  onSessionClick?: (session: SessionRecord) => void;
}

export const DayDetailModal = ({ day, onClose, onAddSession, onDelete, onTogglePayment, onToggleComplete, onSessionClick }: Props) => {
  const [sessionToDelete, setSessionToDelete] = useState<number | null>(null);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative bg-card rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200 border border-border">
        <div className="p-5 border-b border-border flex justify-between items-center bg-slate-50/50 dark:bg-muted/50 rounded-t-2xl">
          <div>
            <h3 className="text-xl font-bold text-card-foreground">{day.date.getDate()} {MONTHS[day.date.getMonth()]}</h3>
            <p className="text-sm text-muted-foreground">{day.sessions.length} buổi học</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onAddSession(day.dateStr)} className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
              <Plus size={20} />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
              <XCircle size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {day.sessions.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Calendar className="mx-auto mb-2 opacity-50" size={40} />
              <p>Chưa có lịch học nào.</p>
            </div>
          ) : (
            day.sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => onSessionClick?.(session)}
                className={`group cursor-pointer flex flex-col border rounded-xl p-4 transition-all ${session.completed ? 'bg-card border-border hover:shadow-md hover:border-primary/30' : 'bg-slate-50 dark:bg-muted/30 border-dashed border-slate-300 dark:border-slate-700'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-card-foreground text-base md:text-lg flex flex-wrap items-center gap-2">
                      {session.studentName}
                      {session.subject && <span className="text-muted-foreground font-normal">• {session.subject}</span>}
                      {!session.completed && <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">Dự kiến</span>}
                    </h4>
                    <div className="text-sm text-muted-foreground flex flex-col gap-1 mt-1">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span className="font-medium text-foreground">
                          {session.startTime && session.endTime
                            ? `${session.startTime} - ${session.endTime}`
                            : `${session.hours}h`}
                        </span>
                        <span className="text-[11px] opacity-70">({formatCurrency(session.pricePerHour)}/h)</span>
                      </div>
                    </div>
                  </div>
                  <div className={`font-bold text-base md:text-lg ${session.completed ? 'text-primary' : 'text-muted-foreground'}`}>
                    {formatCurrency(session.totalAmount)}
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex justify-between items-center mt-auto gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleComplete(session.id); }}
                      className={`cursor-pointer text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${session.completed ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                    >
                      {session.completed ? <BookOpen size={14} /> : <BookDashed size={14} />}
                      <span className="hidden sm:inline">{session.completed ? 'Đã Dạy' : 'Chưa Dạy'}</span>
                      <span className="sm:hidden">{session.completed ? 'Dạy' : 'Dự kiến'}</span>
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); onTogglePayment(session.id); }}
                      disabled={!session.completed}
                      className={`cursor-pointer text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${!session.completed ? 'opacity-50 cursor-not-allowed bg-muted text-muted-foreground' : session.paid ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50'}`}
                    >
                      {session.paid ? <CheckSquare size={14} /> : <Square size={14} />}
                      <span className="hidden sm:inline">{session.paid ? 'Đã Thanh Toán' : 'Chưa Thanh Toán'}</span>
                      <span className="sm:hidden">{session.paid ? 'Đã TT' : 'TT'}</span>
                    </button>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); setSessionToDelete(session.id); }}
                    className="cursor-pointer text-muted-foreground hover:text-destructive p-2.5 rounded-full hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
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
      </div>
    </div>
  );
};