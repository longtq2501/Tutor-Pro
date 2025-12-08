// src/components/AddSessionModal.tsx
import { useState, ChangeEvent } from 'react';
import { X, Plus } from 'lucide-react';

interface AddSessionModalProps {
  onClose: () => void;
  onSubmit: (sessions: number, hoursPerSession: number) => void;
}

export default function AddSessionModal({ onClose, onSubmit }: AddSessionModalProps) {
  const [sessions, setSessions] = useState(1);
  const [hoursPerSession, setHoursPerSession] = useState(2);
  const [customHoursInput, setCustomHoursInput] = useState(hoursPerSession.toString()); 
 
  const handleQuickSelect = (hours: number) => {
    setHoursPerSession(hours);
    setCustomHoursInput(hours.toString());
  };

  const handleCustomHoursChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setCustomHoursInput(input);
   
    const parsedValue = parseFloat(input);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      setHoursPerSession(parsedValue);
    } 
  };

  const handleSubmit = () => {
    console.log('Submitting with hoursPerSession:', hoursPerSession);  // 🆕 Thêm log để debug
    if (sessions <= 0 || hoursPerSession <= 0) {
      alert('Vui lòng nhập số buổi và số giờ hợp lệ!');
      return;
    }
    onSubmit(sessions, hoursPerSession);
  };

  const totalHours = sessions * hoursPerSession;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
     
      {/* Modal Content: Sử dụng flex flex-col để stack ổn định, giới hạn max-h để tránh vỡ layout */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col flex-shrink-0">
        {/* Header: Sticky để luôn hiển thị */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-5 rounded-t-2xl z-10 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Thêm buổi học</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all"
            >
              <X size={24} />
            </button>
          </div>
          <div className="text-sm font-light mt-1">Ghi nhận giờ học cho học sinh này</div>
        </div>

        {/* Form Content: Sử dụng flex-1 để chiếm không gian còn lại và scroll nếu cần */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            {/* Số buổi học */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Số buổi học <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={sessions}
                onChange={(e) => setSessions(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-gray-900 placeholder-gray-400"
                placeholder="1"
                min="1"
              />
            </div>

            {/* Số giờ mỗi buổi */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Số giờ mỗi buổi <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 1.5, 2, 2.5, 3].map((hours) => (
                    <button
                    key={hours}
                    type="button" 
                    onClick={() => handleQuickSelect(hours)}
                    className={`px-3 py-2 rounded-lg font-medium transition-all ${
                        hoursPerSession === hours  // 🆕 Bỏ kiểm tra customHoursInput, chỉ dựa trên hoursPerSession
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    >
                    {hours}h
                    </button>
                ))}
                </div>
              <div className="mt-2">
                <input
                  type="number"
                  value={customHoursInput}
                  onChange={handleCustomHoursChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-gray-900 placeholder-gray-400"
                  placeholder="Hoặc nhập số giờ tùy chỉnh"
                  min="0.5"
                  step="0.5"
                />
              </div>
            </div>

            {/* Tổng giờ */}
            <div className="bg-indigo-50 rounded-xl p-4 border-2 border-indigo-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Tổng số giờ:</span>
                <span className="text-2xl font-bold text-indigo-600">
                  {totalHours} giờ
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {sessions} buổi × {hoursPerSession} giờ
              </div>
            </div>
          </div>
        </div>

        {/* Buttons: Đặt ở cuối modal, flex-shrink-0 để luôn hiển thị, tích hợp padding vào form content */}
        <div className="flex gap-3 p-6 pt-0 flex-shrink-0">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40"
          >
            <Plus size={20} />
            Thêm buổi học
          </button>
          <button
            type="button" 
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3.5 rounded-xl font-semibold transition-all"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
