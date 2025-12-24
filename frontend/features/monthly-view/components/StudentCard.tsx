// 📁 monthly-view/components/StudentCard.tsx
import { CheckCircle, AlertTriangle, FileText, Trash2, Check } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import type { GroupedRecord } from '../types';

interface StudentCardProps {
  group: GroupedRecord;
  isSelected: boolean;
  onToggleSelection: () => void;
  onTogglePayment: (sessionId: number) => void;
  onToggleAllPayments: () => void;
  onGenerateInvoice: () => void;
  onDeleteSession: (sessionId: number) => void;
}

export function StudentCard({
  group,
  isSelected,
  onToggleSelection,
  onTogglePayment,
  onToggleAllPayments,
  onGenerateInvoice,
  onDeleteSession,
}: StudentCardProps) {
  return (
    <div 
      className={`bg-card rounded-xl border transition-all duration-200 ${
        isSelected 
          ? 'border-primary ring-1 ring-ring shadow-md' 
          : 'border-border hover:border-primary/50 hover:shadow-sm'
      }`}
    >
      {/* Header */}
      <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border">
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelection}
            className="w-5 h-5 text-primary rounded focus:ring-ring"
          />
          <div>
            <h3 className="text-lg font-bold leading-tight">{group.studentName}</h3>
            <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <span className="bg-muted px-2 py-0.5 rounded font-medium">
                {group.totalSessions} buổi
              </span>
              <span>x {formatCurrency(group.pricePerHour)}/h</span>
              <span className="text-border">|</span>
              <span className="font-bold text-primary">
                {formatCurrency(group.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={onToggleAllPayments}
            className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${
              group.allPaid 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100'
                : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 hover:bg-orange-100'
            }`}
          >
            {group.allPaid ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
            {group.allPaid ? 'Đã TT Tất Cả' : 'Chưa TT Hết'}
          </button>
          <button
            onClick={onGenerateInvoice}
            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <FileText size={18} />
          </button>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="p-4 bg-muted/30 rounded-b-xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {group.sessions
            .sort((a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime())
            .map((session) => (
              <div 
                key={session.id}
                className={`relative group p-3 rounded-lg border text-sm transition-all ${
                  session.paid 
                    ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50 hover:border-green-300' 
                    : 'bg-card border-border hover:border-primary/50 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold">
                    {formatDate(session.sessionDate)}
                  </span>
                  {session.paid && <CheckCircle size={14} className="text-green-600 dark:text-green-500" />}
                </div>
                
                <div className="flex items-center gap-2 text-xs mb-1">
                  <span className="text-muted-foreground">{session.hours} giờ</span>
                  {session.completed ? (
                    <span className="text-green-600 dark:text-green-400 font-medium flex items-center">
                      <Check size={12} className="mr-0.5"/> Đã dạy
                    </span>
                  ) : (
                    <span className="text-muted-foreground italic">Dự kiến</span>
                  )}
                </div>

                <div className="font-medium">
                  {formatCurrency(session.totalAmount)}
                </div>

                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button 
                    onClick={() => onDeleteSession(session.id)}
                    className="p-1 bg-card border border-destructive/20 text-destructive rounded hover:bg-destructive/10 shadow-sm"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}