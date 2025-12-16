'use client';

import { useState } from 'react';
import { X, Calendar, Clock, Bookmark, ChevronRight } from 'lucide-react';

interface AddSessionModalProps {
  onClose: () => void;
  onSubmit: (sessions: number, hoursPerSession: number, sessionDate: string, month: string) => void;
  initialDate?: string;
}

export default function AddSessionModal({ onClose, onSubmit, initialDate }: AddSessionModalProps) {
  const [sessions, setSessions] = useState<number>(1);
  const [hoursPerSession, setHoursPerSession] = useState<number>(2);
  
  const getDefaultDate = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [sessionDate, setSessionDate] = useState<string>(
    initialDate || getDefaultDate()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessions < 1 || hoursPerSession < 0.5 || !sessionDate) {
      alert('Vui lòng kiểm tra lại thông tin');
      return;
    }
    const month = sessionDate.substring(0, 7);
    onSubmit(sessions, hoursPerSession, sessionDate, month);
  };

  const totalHours = sessions * hoursPerSession;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-200 dark:border-slate-800">
        
        {/* Decorative Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-900 dark:to-slate-900 px-8 py-6 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4">
             <Bookmark size={100} />
           </div>
           <h2 className="text-2xl font-bold relative z-10">Thêm Buổi Học</h2>
           <p className="text-indigo-100 text-sm relative z-10 opacity-90">Ghi nhận lịch dạy mới</p>
           
           <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
           >
              <X size={20} />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Date Picker */}
          <div className="group">
             <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <Calendar size={16} className="text-indigo-500 dark:text-indigo-400" />
                Ngày dạy
             </label>
             <input
               type="date"
               value={sessionDate}
               onChange={(e) => setSessionDate(e.target.value)}
               className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 outline-none transition-all font-medium text-slate-800 dark:text-white"
               required
             />
          </div>

          <div className="grid grid-cols-2 gap-5">
             {/* Sessions Count */}
             <div>
               <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Số buổi</label>
               <input
                 type="number"
                 value={sessions}
                 onChange={(e) => setSessions(parseInt(e.target.value) || 1)}
                 min="1"
                 className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 outline-none transition-all font-bold text-center text-lg text-slate-800 dark:text-white"
                 required
               />
             </div>

             {/* Hours Count */}
             <div>
               <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
                 <Clock size={14} className="text-indigo-500 dark:text-indigo-400" /> Giờ / buổi
               </label>
               <input
                 type="number"
                 value={hoursPerSession}
                 onChange={(e) => setHoursPerSession(parseFloat(e.target.value) || 2)}
                 min="0.5"
                 step="0.5"
                 className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 outline-none transition-all font-bold text-center text-lg text-slate-800 dark:text-white"
                 required
               />
             </div>
          </div>

          {/* Summary Card */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
             <div className="flex justify-between items-center mb-3">
               <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Tổng thời lượng</span>
               <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                 {totalHours.toFixed(1)} <span className="text-sm font-medium text-slate-400 dark:text-slate-500">giờ</span>
               </span>
             </div>
             <div className="h-px bg-slate-200 dark:bg-slate-700 w-full mb-3" />
             <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
               <span>Ghi nhận cho tháng</span>
               <span className="bg-white dark:bg-slate-700 px-2 py-1 rounded border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200">
                  {sessionDate ? sessionDate.substring(0, 7) : '--/--'}
               </span>
             </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 py-3.5 rounded-xl font-bold transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-[2] bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-indigo-300 flex items-center justify-center gap-2 group"
            >
              Xác nhận <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}