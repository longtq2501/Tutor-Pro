// ============================================================================
// 📁 student-list/components/StudentCard.tsx
// ============================================================================
import { Edit2, Trash2, Calendar, DollarSign, Repeat, Plus } from 'lucide-react';
import type { Student } from '@/lib/types';
import { formatCurrency } from '../utils/formatters';

interface StudentCardProps {
  student: Student;
  onEdit: () => void;
  onDelete: () => void;
  onSchedule: () => void;
  onAddSession: () => void;
}

export function StudentCard({ student, onEdit, onDelete, onSchedule, onAddSession }: StudentCardProps) {
  return (
    <div
      className={`
        group relative bg-card rounded-3xl p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
        ${student.active 
          ? 'border-border hover:border-primary' 
          : 'border-border bg-muted/30 opacity-80 hover:opacity-100'}
      `}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className={`
            w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-sm transition-transform group-hover:scale-105
            ${student.active 
              ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground' 
              : 'bg-muted text-muted-foreground'}
          `}>
            {student.name.charAt(0).toUpperCase()}
          </div>
          
          {/* Info */}
          <div>
            <h3 className="text-lg font-bold text-card-foreground leading-tight group-hover:text-primary transition-colors">
              {student.name}
            </h3>
            <div className={`text-xs px-2.5 py-1 rounded-full w-fit mt-1.5 font-bold flex items-center gap-1.5 ${
              student.active 
                ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                : 'bg-destructive/10 text-destructive border border-destructive/20'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${student.active ? 'bg-emerald-500' : 'bg-destructive'}`} />
              {student.active ? 'Đang học' : 'Đã nghỉ'}
            </div>
          </div>
        </div>
        
        {/* Edit Actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4 bg-background/90 backdrop-blur-sm p-1 rounded-lg shadow-sm border border-border">
          <button onClick={onEdit} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Sửa">
            <Edit2 size={16} />
          </button>
          <button onClick={onDelete} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors" title="Xóa">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center text-sm text-muted-foreground bg-slate-50 dark:bg-muted/50 p-3 rounded-xl border border-border">
          <div className="bg-white dark:bg-background p-1.5 rounded-md shadow-sm mr-3 text-primary border border-border">
            <DollarSign size={16} />
          </div>
          <span className="font-bold text-foreground">{formatCurrency(student.pricePerHour)}</span>
          <span className="text-muted-foreground ml-1">/ giờ</span>
        </div>

        {student.schedule && (
          <div className="flex items-center text-sm text-muted-foreground bg-slate-50 dark:bg-muted/50 p-3 rounded-xl border border-border">
            <div className="bg-white dark:bg-background p-1.5 rounded-md shadow-sm mr-3 text-primary border border-border">
              <Calendar size={16} />
            </div>
            <span className="font-medium line-clamp-1">{student.schedule}</span>
          </div>
        )}
        
        {/* Revenue Snapshot */}
        <div className="flex justify-between items-center text-sm pt-2">
          <span className="text-muted-foreground font-bold">Đang nợ</span>
          <span className={`font-bold ${
            (student.totalUnpaid || 0) > 0 ? 'text-destructive' : 'text-emerald-600 dark:text-emerald-400'
          }`}>
            {formatCurrency(student.totalUnpaid || 0)}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onSchedule}
          className="px-4 py-2.5 bg-slate-100 dark:bg-muted text-foreground hover:bg-slate-200 dark:hover:bg-accent border border-border rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
        >
          <Repeat size={16} />
          Lịch
        </button>
        <button
          onClick={onAddSession}
          disabled={!student.active}
          className="px-4 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <Plus size={16} />
          Buổi Học
        </button>
      </div>
    </div>
  );
}