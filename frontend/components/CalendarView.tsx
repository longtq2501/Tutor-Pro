'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Clock, CheckCircle, XCircle, 
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

// Helper to get YYYY-MM-DD in local time
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Modals
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedDateStr, setSelectedDateStr] = useState<string>('');

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setSelectedDay(prev => prev ? {
          ...prev,
          sessions: prev.sessions.filter(s => s.id !== sessionId)
        } : null);
      }
    } catch (error) {
      console.error(error);
      alert('Lỗi khi xóa.');
    }
  };

  const handleTogglePayment = async (sessionId: number) => {
    try {
      const updated = await sessionsApi.togglePayment(sessionId);
      
      // Update sessions list
      setSessions(prev => prev.map(s => s.id === sessionId ? updated : s));
      
      // ✅ Update modal if open
      if (selectedDay) {
        setSelectedDay(prev => prev ? {
          ...prev,
          sessions: prev.sessions.map(s => s.id === sessionId ? updated : s)
        } : null);
      }
    } catch (error) {
      console.error(error);
      alert('Không thể cập nhật trạng thái thanh toán!');
    }
  };

  const handleToggleComplete = async (sessionId: number) => {
    try {
      const updated = await sessionsApi.toggleCompleted(sessionId);
      
      // Update sessions list
      setSessions(prev => prev.map(s => s.id === sessionId ? updated : s));
      
      // ✅ Update modal if open
      if (selectedDay) {
        setSelectedDay(prev => prev ? {
          ...prev,
          sessions: prev.sessions.map(s => s.id === sessionId ? updated : s)
        } : null);
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
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white rounded-md shadow-sm transition-all">
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <div className="px-4 font-bold text-gray-800 min-w-[140px] text-center">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white rounded-md shadow-sm transition-all">
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="flex gap-4 text-sm items-center flex-wrap justify-center">
           <div className="flex flex-col items-center px-3 border-r border-gray-100">
             <span className="text-gray-500 text-xs uppercase">Đã Dạy</span>
             <span className="font-bold text-gray-800 text-lg">{stats.completed}/{stats.total}</span>
           </div>
           <div className="flex flex-col items-center px-3 border-r border-gray-100">
             <span className="text-gray-500 text-xs uppercase">Doanh Thu</span>
             <span className="font-bold text-indigo-600 text-lg">{formatCurrency(stats.revenue)}</span>
           </div>
           <div className="flex flex-col items-center px-3 border-r border-gray-100">
             <span className="text-gray-500 text-xs uppercase">Chưa Thu</span>
             <span className="font-bold text-orange-500 text-lg">{stats.pending}</span>
           </div>
           
           <button 
             onClick={handleAutoGenerate}
             disabled={isGenerating}
             className="ml-2 px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-medium transition-colors flex items-center gap-2 border border-emerald-200"
             title="Tạo lịch tự động"
           >
             {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
             <span className="hidden md:inline">Tạo Lịch</span>
           </button>
        </div>

        <button 
          onClick={() => setCurrentDate(new Date())}
          className="text-sm font-medium text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          Về Hôm Nay
        </button>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {DAYS.map((day, i) => (
            <div key={day} className={`py-3 text-center text-sm font-semibold ${i === 0 ? 'text-red-500' : 'text-gray-600'}`}>
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 auto-rows-fr bg-gray-200 gap-px">
          {calendarDays.map((day, idx) => (
            <div 
              key={idx}
              onClick={() => handleDayClick(day)}
              className={`
                min-h-[120px] bg-white p-2 relative group cursor-pointer transition-colors
                ${!day.isCurrentMonth ? 'bg-gray-50/50 text-gray-400' : 'hover:bg-indigo-50/30'}
                ${day.isToday ? 'bg-indigo-50/20' : ''}
              `}
            >
              {/* Day Number */}
              <div className="flex justify-between items-start mb-2">
                <span className={`
                  w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold
                  ${day.isToday ? 'bg-indigo-600 text-white shadow-md' : ''}
                  ${day.date.getDay() === 0 && !day.isToday ? 'text-red-500' : ''}
                `}>
                  {day.date.getDate()}
                </span>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddSessionClick(day.dateStr);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-indigo-100 rounded text-indigo-600 transition-all"
                  title="Thêm buổi học"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Event Chips */}
              <div className="space-y-1">
                {day.sessions.slice(0, 3).map((session) => (
                  <div 
                    key={session.id}
                    className={`
                      text-xs px-1.5 py-1 rounded truncate font-medium border flex items-center gap-1
                      ${!session.completed 
                        ? 'bg-white border-dashed border-gray-300 text-gray-500' 
                        : session.paid
                          ? 'bg-green-50 border-green-200 text-green-700 shadow-sm'
                          : 'bg-orange-50 border-orange-200 text-orange-700 shadow-sm'
                      }
                    `}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      !session.completed ? 'bg-gray-300' : session.paid ? 'bg-green-400' : 'bg-orange-400'
                    }`}></span>
                    {session.studentName}
                  </div>
                ))}
                {day.sessions.length > 3 && (
                  <div className="text-xs text-gray-400 pl-1">
                    + {day.sessions.length - 3} nữa...
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
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedDay(null)} />
           
           <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">
                       {selectedDay.date.getDate()} {MONTHS[selectedDay.date.getMonth()]}
                    </h3>
                    <p className="text-sm text-gray-500">{selectedDay.sessions.length} buổi học</p>
                 </div>
                 <div className="flex gap-2">
                    <button 
                       onClick={() => handleAddSessionClick(selectedDay.dateStr)}
                       className="p-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                       title="Thêm buổi học"
                    >
                       <Plus size={20} />
                    </button>
                    <button onClick={() => setSelectedDay(null)} className="p-2 hover:bg-gray-200 rounded-lg text-gray-500">
                       <XCircle size={24} />
                    </button>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                 {selectedDay.sessions.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                       <CalendarIcon className="mx-auto mb-2 opacity-50" size={40} />
                       <p>Chưa có lịch học nào.</p>
                    </div>
                 ) : (
                    selectedDay.sessions.map((session) => (
                       <div key={session.id} className={`
                          group flex flex-col border rounded-xl p-4 transition-all
                          ${session.completed 
                            ? 'bg-white border-gray-200 hover:shadow-md hover:border-indigo-200' 
                            : 'bg-gray-50 border-dashed border-gray-300 hover:border-gray-400'}
                       `}>
                          <div className="flex justify-between items-start mb-3">
                             <div>
                                <h4 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                  {session.studentName}
                                  {!session.completed && (
                                    <span className="text-xs font-normal px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full">
                                      Dự kiến
                                    </span>
                                  )}
                                </h4>
                                <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                   <Clock size={14} />
                                   <span>{session.hours}h ({formatCurrency(session.pricePerHour)}/h)</span>
                                </div>
                             </div>
                             <div className="text-right">
                                <div className={`font-bold text-lg ${session.completed ? 'text-indigo-600' : 'text-gray-400'}`}>
                                   {formatCurrency(session.totalAmount)}
                                </div>
                             </div>
                          </div>
                          
                          <div className="pt-3 border-t border-gray-100 flex justify-between items-center mt-auto gap-2">
                             <div className="flex gap-2">
                                <button
                                    onClick={() => handleToggleComplete(session.id)}
                                    className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                                      session.completed
                                          ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
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
                                        ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'
                                        : session.paid 
                                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                          : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                    }`}
                                >
                                    {session.paid ? <CheckSquare size={14} /> : <Square size={14} />}
                                    {session.paid ? 'Đã TT' : 'Chưa TT'}
                                </button>
                             </div>

                             <button 
                                onClick={() => handleDeleteSession(session.id)}
                                className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
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

      {/* Add Session Modal (Reusing existing component structure logic) */}
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
          // If AddSessionModal supports pre-filling date:
          initialDate={selectedDateStr}
        />
      )}
    </div>
  );
}