// 📁 monthly-view/components/StudentCard.tsx
import React from 'react';
import {
  CheckCircle,
  AlertTriangle,
  Trash2,
  Check,
  Wallet,
  Clock,
  Calendar as CalendarIcon,
  TrendingUp,
  Receipt,
  Info
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import type { GroupedRecord } from '../types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StudentCardProps {
  group: GroupedRecord;
  isSelected: boolean;
  onToggleSelection: () => void;
  onTogglePayment: (sessionId: number) => void;
  onToggleAllPayments: () => void;
  onGenerateInvoice: () => void;
  onDeleteSession: (sessionId: number) => void;
}

const StudentCardComponent = ({
  group,
  isSelected,
  onToggleSelection,
  onTogglePayment,
  onToggleAllPayments,
  onGenerateInvoice,
  onDeleteSession,
}: StudentCardProps) => {
  // Statistics Calculations
  const sessionsCount = group.sessions.length;
  const taughtCount = group.sessions.filter(s => s.completed).length;
  const unpaidCount = group.sessions.filter(s => !s.paid).length;
  const paidCount = group.sessions.filter(s => s.paid).length;
  const unpaidAmount = group.sessions.filter(s => !s.paid).reduce((sum, s) => sum + s.totalAmount, 0);

  const teachingProgress = sessionsCount > 0 ? (taughtCount / sessionsCount) * 100 : 0;
  const paymentProgress = sessionsCount > 0 ? (paidCount / sessionsCount) * 100 : 0;

  return (
    <TooltipProvider>
      <div
        className={`group/card bg-card rounded-xl border transition-all duration-300 overflow-hidden ${isSelected
          ? 'border-primary ring-2 ring-primary/20 shadow-lg translate-y-[-2px]'
          : 'border-border hover:border-primary/40 hover:shadow-md shadow-sm'
          }`}
      >
        {/* Tầng 1: Identity */}
        <div className="p-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={onToggleSelection}
                className="w-5 h-5 text-primary rounded-md border-2 border-muted-foreground/30 focus:ring-primary transition-all cursor-pointer accent-primary"
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-card-foreground leading-tight truncate flex items-center gap-2" title={group.studentName}>
                {group.studentName}
                {group.allPaid && (
                  <CheckCircle size={16} className="text-emerald-500 fill-emerald-500/10" />
                )}
              </h3>
              {!group.allPaid && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800/30">
                    <AlertTriangle size={10} className="mr-1" />
                    Chưa thu hết
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onGenerateInvoice}
                  className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all active:scale-95"
                >
                  <Receipt size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Xuất hóa đơn tháng này</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onToggleAllPayments}
                  className={`p-2.5 rounded-xl transition-all active:scale-95 ${group.allPaid
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-muted text-muted-foreground hover:bg-orange-100 hover:text-orange-700 dark:hover:bg-orange-900/30 dark:hover:text-orange-400'
                    }`}
                >
                  {group.allPaid ? <CheckCircle size={20} /> : <Wallet size={20} />}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {group.allPaid ? "Đã thanh toán đủ" : "Đánh dấu tất cả đã thanh toán"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="px-5 pb-5 space-y-5">
          {/* Tầng 2: Summary (Formula Box) */}
          <div className="bg-muted/50 dark:bg-muted/20 rounded-xl p-3.5 border border-border/50 group/formula transition-colors hover:bg-muted/80 dark:hover:bg-muted/30">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2.5 font-medium text-muted-foreground">
                <div className="p-1.5 bg-background rounded-lg shadow-sm">
                  <Clock size={14} className="text-primary" />
                </div>
                <span>{group.totalSessions} buổi × {formatCurrency(group.pricePerHour)}/h</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-0.5">Tổng cộng</span>
                <div className="font-bold text-primary text-lg tracking-tight">
                  {formatCurrency(group.totalAmount)}
                </div>
              </div>
            </div>
          </div>

          {/* Tầng 3: Data Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100/50 dark:border-blue-900/30 transition-transform hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Tiến độ dạy</div>
                <Info size={12} className="text-blue-400/50" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tabular-nums">{taughtCount}</span>
                <span className="text-xs font-semibold text-blue-500/80">/ {sessionsCount} buổi</span>
              </div>
            </div>
            <div className="p-3.5 bg-orange-50/50 dark:bg-orange-900/10 rounded-xl border border-orange-100/50 dark:border-orange-900/30 transition-transform hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Chưa thu phí</div>
                <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tabular-nums">{unpaidCount}</span>
                <span className="text-xs font-semibold text-orange-500/80">{formatCurrency(unpaidAmount)}</span>
              </div>
            </div>
          </div>

          {/* Tầng 4: Visual Progress */}
          <div className="space-y-4 pt-1">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Đã thực hiện
                </span>
                <span className="text-blue-600 dark:text-blue-400 tabular-nums">{Math.round(teachingProgress)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                  style={{ width: `${teachingProgress}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  Đã thanh toán
                </span>
                <span className="text-orange-600 dark:text-orange-400 tabular-nums">{Math.round(paymentProgress)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                  style={{ width: `${paymentProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Tầng 5: History Tags */}
          <div className="pt-4 border-t border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Chi tiết buổi học</span>
              </div>
              <span className="text-[9px] text-muted-foreground hidden group-hover/card:block animate-in fade-in slide-in-from-right-2">Nhấn để đổi trạng thái thanh toán</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.sessions
                .sort((a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime())
                .map((session) => (
                  <Tooltip key={session.id}>
                    <TooltipTrigger asChild>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          onTogglePayment(session.id);
                        }}
                        className={`relative group/tag px-3 py-2 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-2.5 active:scale-95 hover:shadow-sm ${session.paid
                          ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200/50 dark:border-blue-800/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100/50 dark:hover:bg-blue-900/20'
                          : 'bg-orange-50/50 dark:bg-orange-900/10 border-orange-200/50 dark:border-orange-800/30 text-orange-700 dark:text-orange-300 hover:bg-orange-100/50 dark:hover:bg-orange-900/20'
                          }`}
                      >
                        <CalendarIcon size={12} className="opacity-60" />
                        <span className="tabular-nums">{formatDate(session.sessionDate)}</span>
                        <div className="w-[1px] h-3 bg-current opacity-20" />
                        <span className="tabular-nums">{formatCurrency(session.totalAmount)}</span>

                        {session.completed ? (
                          <div className={`p-0.5 rounded-full ${session.paid ? 'bg-blue-200/50 text-blue-600' : 'bg-orange-200/50 text-orange-600'}`}>
                            <Check size={8} strokeWidth={4} />
                          </div>
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSession(session.id);
                          }}
                          className="ml-1 p-1 -mr-1 opacity-0 group-hover/tag:opacity-100 transition-all text-destructive hover:bg-destructive/10 rounded-lg"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="flex flex-col gap-1 p-2">
                      <span className="font-bold">{formatDate(session.sessionDate)}</span>
                      <span className="text-[10px] opacity-80">
                        {session.completed ? "Trạng thái: Đã dạy" : "Trạng thái: Chưa dạy"} •
                        {session.paid ? " Đã thu tiền" : " Chưa thu tiền"}
                      </span>
                    </TooltipContent>
                  </Tooltip>
                ))}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const StudentCard = React.memo(StudentCardComponent, (prevProps, nextProps) => {
  // Only re-render if these specific props change
  return (
    prevProps.group.studentId === nextProps.group.studentId &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.group.sessions.length === nextProps.group.sessions.length &&
    prevProps.group.allPaid === nextProps.group.allPaid &&
    // Check if any session payment status changed
    prevProps.group.sessions.every((session, index) =>
      session.paid === nextProps.group.sessions[index]?.paid
    )
  );
});
