
'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Clock, XCircle, 
  Plus, Trash2, ChevronLeft, ChevronRight, Zap, Loader2,
  BookOpen, BookDashed, CheckSquare, Square
} from 'lucide-react';
import { sessionsApi, studentsApi, recurringSchedulesApi } from '@/lib/api';
import type { SessionRecord, Student } from '@/lib/types';
import AddSessionModal from './AddSessionModal';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

const DAYS = ['CN', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy'];
const MONTHS = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

const getLocalDateStr = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface CalendarDay {
  date: Date;
  dateStr: string;
  sessions: SessionRecord[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedDateStr, setSelectedDateStr] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [currentDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const monthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      const [sessionsData, studentsData] = await Promise.all([
        sessionsApi.getByMonth(monthStr),
        studentsApi.getAll()
      ]);
      setSessions(sessionsData || []);
      setStudents(studentsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoGenerate = async () => {
    if (!confirm('Bạn có muốn tự động tạo lịch học cho tháng này dựa trên lịch cố định?')) return;
    try {
      setIsGenerating(true);
      const monthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      const result = await recurringSchedulesApi.generateSessions(monthStr);
      alert(`✅ ${result.message || 'Đã tạo xong các buổi học!'}`);
      loadData();
    } catch (error) {
      console.error('Error generating sessions:', error);
      alert('❌ Không thể tạo buổi học tự động. Vui lòng thử lại.');
    } finally {
      setIsGenerating(false);
    }
  };

  const changeMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay()); 
    const endDate = new Date(lastDayOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); 
    const days: CalendarDay[] = [];
    const iterator = new Date(startDate);
    iterator.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    while (iterator <= endDate) {
      const dateStr = getLocalDateStr(iterator);
      const daySessions = sessions.filter(s => s.sessionDate === dateStr);
      days.push({
        date: new Date(iterator),
        dateStr: dateStr,
        sessions: daySessions,
        isCurrentMonth: iterator.getMonth() === month,
        isToday: iterator.getTime() === today.getTime()
      });
      iterator.setDate(iterator.getDate() + 1);
    }
    return days;
  };

  const handleDayClick = (day: CalendarDay) => {
    setSelectedDay(day);
  };

  const handleAddSessionClick = (dateStr: string) => {
    setSelectedDateStr(dateStr);
    setShowAddSessionModal(true);
  };

  const handleDeleteSession = async (sessionId: number) => {
    if (!confirm('Bạn chắc chắn muốn xóa buổi học này?')) return;
    try {
      await sessionsApi.delete(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (selectedDay) {
        setSelectedDay(prev => prev ? { ...prev, sessions: prev.sessions.filter(s => s.id !== sessionId) } : null);
      }
    } catch (error) {
      console.error(error);
      alert('Lỗi khi xóa.');
    }
  };

  const handleTogglePayment = async (sessionId: number) => {
    try {
      const updated = await sessionsApi.togglePayment(sessionId);
      setSessions(prev => prev.map(s => s.id === sessionId ? updated : s));
      if (selectedDay) {
        setSelectedDay(prev => prev ? { ...prev, sessions: prev.sessions.map(s => s.id === sessionId ? updated : s) } : null);
      }
    } catch (error) {
      console.error(error);
      alert('Không thể cập nhật trạng thái thanh toán!');
    }
  };

  const handleToggleComplete = async (sessionId: number) => {
    try {
      const updated = await sessionsApi.toggleCompleted(sessionId);
      setSessions(prev => prev.map(s => s.id === sessionId ? updated : s));
      if (selectedDay) {
        setSelectedDay(prev => prev ? { ...prev, sessions: prev.sessions.map(s => s.id === sessionId ? updated : s) } : null);
      }
    } catch (error) {
      console.error('Error toggling completed:', error);
      alert('Không thể cập nhật trạng thái!');
    }
  };

  const calendarDays = getCalendarDays();
  const stats = {
    total: sessions.length,
    completed: sessions.filter(s => s.completed).length,
    scheduled: sessions.filter(s => !s.completed).length,
    revenue: sessions.reduce((sum, s) => sum + s.totalAmount, 0),
    pending: sessions.filter(s => !s.paid).length
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-card text-card-foreground p-3 rounded-2xl shadow-sm border border-border">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-md shadow-sm transition-all text-muted-foreground hover:text-foreground">
            <ChevronLeft size={18} />
          </button>
          <div className="px-3 font-bold text-card-foreground min-w-[130px] text-center">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-md shadow-sm transition-all text-muted-foreground hover:text-foreground">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex gap-3 text-sm items-center flex-wrap justify-center">
           <div className="flex flex-col items-center px-2 border-r border-border">
             <span className="text-muted-foreground text-xs uppercase">Đã Dạy</span>
             <span className="font-bold text-foreground text-base">{stats.completed}/{stats.total}</span>
           </div>
           <div className="flex flex-col items-center px-2 border-r border-border">
             <span className="text-muted-foreground text-xs uppercase">Doanh Thu</span>
             <span className="font-bold text-primary text-base">{formatCurrency(stats.revenue)}</span>
           </div>
           <div className="flex flex-col items-center px-2 border-r border-border">
             <span className="text-muted-foreground text-xs uppercase">Chưa Thu</span>
             <span className="font-bold text-orange-600 text-base">{stats.pending}</span>
           </div>
           
           <button 
             onClick={handleAutoGenerate}
             disabled={isGenerating}
             className="ml-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg font-medium transition-colors flex items-center gap-2 border border-emerald-200 dark:border-emerald-800/50"
           >
             {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
             <span className="hidden md:inline text-xs">Tạo Lịch</span>
           </button>
        </div>

        <button 
          onClick={() => setCurrentDate(new Date())}
          className="text-xs font-medium text-primary hover:text-primary/80 hover:bg-primary/10 px-2 py-1 rounded-lg transition-colors"
        >
          Về Hôm Nay
        </button>
      </div>

      {/* Grid */}
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-800 border-b border-border">
          {DAYS.map((day, i) => (
            <div key={day} className={`py-2 text-center text-xs font-semibold ${i === 0 ? 'text-rose-500' : 'text-muted-foreground'}`}>
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 auto-rows-fr bg-background dark:bg-slate-900">
          {calendarDays.map((day, idx) => (
            <div 
              key={idx}
              onClick={() => handleDayClick(day)}
              className={`
                min-h-[90px] p-1.5 relative group cursor-pointer transition-all border-b border-r border-border
                ${!day.isCurrentMonth ? 'bg-slate-50/20 dark:bg-slate-900/40' : 'bg-card hover:bg-slate-50/60 dark:hover:bg-slate-800/60'}
                ${day.isToday ? 'ring-1 ring-inset ring-primary/30 bg-primary/5' : ''}
                ${(idx + 1) % 7 === 0 ? 'border-r-0' : ''}
              `}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`
                  w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold transition-all
                  ${day.isToday 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : day.date.getDay() === 0 
                       ? 'text-rose-500' 
                       : !day.isCurrentMonth ? 'text-muted-foreground/40' : 'text-card-foreground'
                  }
                `}>
                  {day.date.getDate()}
                </span>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddSessionClick(day.dateStr);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-primary/10 rounded-full text-primary transition-all"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="space-y-0.5">
                {day.sessions.slice(0, 1).map((session) => (
                  <div 
                    key={session.id}
                    className={`
                      text-xs px-1.5 py-0.5 rounded-md truncate font-semibold border flex items-center gap-1.5 transition-all
                      ${!session.completed 
                        ? 'bg-white border-slate-200 text-slate-500 dark:bg-slate-800/70 dark:border-slate-700 dark:text-slate-400' 
                        : session.paid
                          ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800/70 dark:text-emerald-500/90'
                          : 'bg-orange-50/70 border-orange-200/80 text-orange-700 dark:bg-orange-900/30 dark:border-orange-800/70 dark:text-orange-500/90'
                      }
                    `}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      !session.completed 
                        ? 'bg-slate-300' 
                        : session.paid ? 'bg-emerald-500' : 'bg-orange-500'
                    }`}></span>
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

      {/* Day Detail Modal */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" onClick={() => setSelectedDay(null)} />
           
           <div className="relative bg-card rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200 border border-border">
              <div className="p-5 border-b border-border flex justify-between items-center bg-slate-50/50 dark:bg-muted/50 rounded-t-2xl">
                 <div>
                    <h3 className="text-xl font-bold text-card-foreground">
                       {selectedDay.date.getDate()} {MONTHS[selectedDay.date.getMonth()]}
                    </h3>
                    <p className="text-sm text-muted-foreground">{selectedDay.sessions.length} buổi học</p>
                 </div>
                 <div className="flex gap-2">
                    <button 
                       onClick={() => handleAddSessionClick(selectedDay.dateStr)}
                       className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                    >
                       <Plus size={20} />
                    </button>
                    <button onClick={() => setSelectedDay(null)} className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
                       <XCircle size={24} />
                    </button>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                 {selectedDay.sessions.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                       <CalendarIcon className="mx-auto mb-2 opacity-50" size={40} />
                       <p>Chưa có lịch học nào.</p>
                    </div>
                 ) : (
                    selectedDay.sessions.map((session) => (
                       <div key={session.id} className={`
                          group flex flex-col border rounded-xl p-4 transition-all
                          ${session.completed 
                            ? 'bg-card border-border hover:shadow-md hover:border-primary/30' 
                            : 'bg-slate-50 dark:bg-muted/30 border-dashed border-slate-300 dark:border-slate-700'}
                       `}>
                          <div className="flex justify-between items-start mb-3">
                             <div>
                                <h4 className="font-bold text-card-foreground text-lg flex items-center gap-2">
                                  {session.studentName}
                                  {!session.completed && (
                                    <span className="text-xs font-normal px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
                                      Dự kiến
                                    </span>
                                  )}
                                </h4>
                                <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                   <Clock size={14} />
                                   <span>{session.hours}h ({formatCurrency(session.pricePerHour)}/h)</span>
                                </div>
                             </div>
                             <div className="text-right">
                                <div className={`font-bold text-lg ${session.completed ? 'text-primary' : 'text-muted-foreground'}`}>
                                   {formatCurrency(session.totalAmount)}
                                </div>
                             </div>
                          </div>
                          
                          <div className="pt-3 border-t border-border flex justify-between items-center mt-auto gap-2">
                             <div className="flex gap-2">
                                <button
                                    onClick={() => handleToggleComplete(session.id)}
                                    className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                                      session.completed
                                          ? 'bg-primary/10 text-primary hover:bg-primary/20'
                                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                                    }`}
                                >
                                    {session.completed ? <BookOpen size={14} /> : <BookDashed size={14} />}
                                    {session.completed ? 'Đã Dạy' : 'Chưa Dạy'}
                                </button>
                                
                                <button
                                    onClick={() => handleTogglePayment(session.id)}
                                    disabled={!session.completed}
                                    className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                                      !session.completed 
                                        ? 'opacity-50 cursor-not-allowed bg-muted text-muted-foreground'
                                        : session.paid 
                                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50' 
                                          : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50'
                                    }`}
                                >
                                    {session.paid ? <CheckSquare size={14} /> : <Square size={14} />}
                                    {session.paid ? 'Đã TT' : 'Chưa TT'}
                                </button>
                             </div>

                             <button 
                                onClick={() => handleDeleteSession(session.id)}
                                className="text-muted-foreground hover:text-destructive p-2 rounded-full hover:bg-destructive/10 transition-colors"
                             >
                                <Trash2 size={16} />
                             </button>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>
        </div>
      )}

      {showAddSessionModal && (
        <AddSessionModal
          onClose={() => {
            setShowAddSessionModal(false);
            setSelectedStudentId(null);
            setSelectedDateStr('');
          }}
          onSubmit={async (sessionsCount, hoursPerSession, sessionDate, month) => {
            if (!selectedStudentId) {
              alert('Vui lòng chọn học sinh!');
              return;
            }
            try {
              await sessionsApi.create({
                studentId: selectedStudentId,
                month,
                sessions: sessionsCount,
                sessionDate: selectedDateStr || sessionDate,
                hoursPerSession,
              });
              setShowAddSessionModal(false);
              setSelectedStudentId(null);
              setSelectedDateStr('');
              loadData();
            } catch (error) {
              console.error(error);
              alert('Lỗi khi tạo buổi học.');
            }
          }}
          initialDate={selectedDateStr}
        />
      )}
    </div>
  );
}
