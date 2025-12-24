// ============================================================================
// FILE: calendar-view/components/CalendarGrid.tsx
// ============================================================================
import { Plus } from 'lucide-react';
import { DAYS } from '../constants';
import type { CalendarDay } from '../types';

interface Props {
  days: CalendarDay[];
  onDayClick: (day: CalendarDay) => void;
  onAddSession: (dateStr: string) => void;
}

export const CalendarGrid = ({ days, onDayClick, onAddSession }: Props) => (
  <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
    <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-800 border-b border-border">
      {DAYS.map((day, i) => (
        <div key={day} className={`py-2 text-center text-xs font-semibold ${i === 0 ? 'text-rose-500' : 'text-muted-foreground'}`}>
          {day}
        </div>
      ))}
    </div>

    <div className="grid grid-cols-7 auto-rows-fr bg-background dark:bg-slate-900">
      {days.map((day, idx) => (
        <div key={idx} onClick={() => onDayClick(day)} className={`min-h-[90px] p-1.5 relative group cursor-pointer transition-all border-b border-r border-border ${!day.isCurrentMonth ? 'bg-slate-50/20 dark:bg-slate-900/40' : 'bg-card hover:bg-slate-50/60 dark:hover:bg-slate-800/60'} ${day.isToday ? 'ring-1 ring-inset ring-primary/30 bg-primary/5' : ''} ${(idx + 1) % 7 === 0 ? 'border-r-0' : ''}`}>
          <div className="flex justify-between items-start mb-1">
            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold transition-all ${day.isToday ? 'bg-primary text-primary-foreground shadow-sm' : day.date.getDay() === 0 ? 'text-rose-500' : !day.isCurrentMonth ? 'text-muted-foreground/40' : 'text-card-foreground'}`}>
              {day.date.getDate()}
            </span>
            <button onClick={(e) => { e.stopPropagation(); onAddSession(day.dateStr); }} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-primary/10 rounded-full text-primary transition-all">
              <Plus size={14} />
            </button>
          </div>

          <div className="space-y-0.5">
            {day.sessions.slice(0, 1).map((session) => (
              <div key={session.id} className={`text-xs px-1.5 py-0.5 rounded-md truncate font-semibold border flex items-center gap-1.5 transition-all ${!session.completed ? 'bg-white border-slate-200 text-slate-500 dark:bg-slate-800/70 dark:border-slate-700 dark:text-slate-400' : session.paid ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800/70 dark:text-emerald-500/90' : 'bg-orange-50/70 border-orange-200/80 text-orange-700 dark:bg-orange-900/30 dark:border-orange-800/70 dark:text-orange-500/90'}`}>
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${!session.completed ? 'bg-slate-300' : session.paid ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
                <span className="truncate">{session.studentName}</span>
              </div>
            ))}
            {day.sessions.length > 1 && (
              <div className="text-xs text-primary font-medium pl-1 hover:underline pt-0.5">
                + {day.sessions.length - 1} nữa...
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);