// ============================================================================
// FILE: calendar-view/components/CalendarGrid.tsx
// ============================================================================
import { Plus } from 'lucide-react';
import { DAYS } from '../constants';
import type { CalendarDay } from '../types';
import { CompactLessonList } from './CompactLessonList';
import type { SessionRecord } from '@/lib/types/finance';

interface Props {
  days: CalendarDay[];
  onDayClick: (day: CalendarDay) => void;
  onAddSession: (dateStr: string) => void;
  onSessionClick?: (session: SessionRecord) => void;
  onSessionEdit?: (session: SessionRecord) => void;
  onUpdate?: (updated: SessionRecord) => void;
  onDelete?: (id: number) => void;
  onContextMenu?: (e: React.MouseEvent, session: SessionRecord) => void;
}

export const CalendarGrid = ({ days, onDayClick, onAddSession, onSessionClick, onSessionEdit, onUpdate, onDelete, onContextMenu }: Props) => (

  <div className="bg-card rounded-xl md:rounded-2xl shadow-sm border border-border overflow-hidden">
    <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-800 border-b border-border">
      {DAYS.map((day, i) => (
        <div key={day} className={`py-1.5 sm:py-2 text-center text-[10px] sm:text-xs font-semibold ${i === 0 ? 'text-rose-500' : 'text-muted-foreground'}`}>
          <span className="hidden sm:inline">{day}</span>
          <span className="sm:hidden">{day.slice(0, 1)}</span>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-7 auto-rows-fr bg-background dark:bg-slate-900">
      {days.map((day, idx) => (
        <div key={idx} onClick={() => onDayClick(day)} className={`min-h-[60px] sm:min-h-[80px] md:min-h-[90px] p-1 sm:p-1.5 relative group cursor-pointer transition-all border-b border-r border-border ${!day.isCurrentMonth ? 'bg-slate-50/20 dark:bg-slate-900/40' : 'bg-card hover:bg-slate-50/60 dark:hover:bg-slate-800/60'} ${day.isToday ? 'ring-1 ring-inset ring-primary/30 bg-primary/5' : ''} ${(idx + 1) % 7 === 0 ? 'border-r-0' : ''}`}>
          <div className="flex justify-between items-start mb-0.5 sm:mb-1">
            <span className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full text-[10px] sm:text-xs font-bold transition-all ${day.isToday ? 'bg-primary text-primary-foreground shadow-sm' : day.date.getDay() === 0 ? 'text-rose-500' : !day.isCurrentMonth ? 'text-muted-foreground/40' : 'text-card-foreground'}`}>
              {day.date.getDate()}
            </span>
            <button onClick={(e) => { e.stopPropagation(); onAddSession(day.dateStr); }} className="hidden md:block opacity-0 group-hover:opacity-100 p-1 hover:bg-primary/10 rounded-full text-primary transition-all">
              <Plus size={14} />
            </button>
          </div>

          {/* Use CompactLessonList component */}
          <CompactLessonList
            sessions={day.sessions}
            onSessionClick={onSessionClick}
            onSessionEdit={onSessionEdit}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onContextMenu={onContextMenu}
          />
        </div>
      ))}
    </div>
  </div>
);
