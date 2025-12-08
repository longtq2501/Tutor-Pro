// src/components/StudentModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { studentsApi } from '@/lib/api';
import type { Student, StudentRequest } from '@/lib/types';

interface StudentModalProps {
  student: Student | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StudentModal({ student, onClose, onSuccess }: StudentModalProps) {
  const [formData, setFormData] = useState<StudentRequest>({
    name: '',
    phone: '',
    schedule: '',
    pricePerHour: 200000,
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        phone: student.phone || '',
        schedule: student.schedule,
        pricePerHour: student.pricePerHour,
        notes: student.notes || '',
      });
    } else {
      // Reset form khi thêm mới
      setFormData({
        name: '',
        phone: '',
        schedule: '',
        pricePerHour: 200000,
        notes: '',
      });
    }
  }, [student]); // Thêm student vào dependency array

  const handleSubmit = async () => {
    if (!formData.name || !formData.schedule) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    try {
      setLoading(true);
      if (student) {
        await studentsApi.update(student.id, formData);
      } else {
        await studentsApi.create(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Không thể lưu thông tin học sinh!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-5 rounded-t-2xl z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {student ? 'Sửa thông tin học sinh' : 'Thêm học sinh mới'}
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <div className="space-y-5">
            {/* Tên học sinh */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên học sinh <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-gray-900 placeholder-gray-400"
                placeholder="Nhập tên học sinh"
              />
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-gray-900 placeholder-gray-400"
                placeholder="0901234567"
              />
            </div>

            {/* Lịch học */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Lịch học <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-gray-900 placeholder-gray-400"
                placeholder="Ví dụ: Thứ 2, 4, 6 - 18:00"
              />
            </div>

            {/* Giá mỗi giờ */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Giá mỗi giờ (VNĐ)
              </label>
              <input
                type="number"
                value={formData.pricePerHour}
                onChange={(e) =>
                  setFormData({ ...formData, pricePerHour: parseInt(e.target.value) || 0 })
                }
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-gray-900 placeholder-gray-400"
                placeholder="200000"
                min="0"
                step="10000"
              />
            </div>

            {/* Ghi chú */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ghi chú
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-gray-900 placeholder-gray-400 resize-none"
                placeholder="Ghi chú về học sinh..."
                rows={4}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white px-6 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 disabled:shadow-none"
            >
              <Save size={20} />
              {loading ? 'Đang lưu...' : student ? 'Cập nhật' : 'Thêm học sinh'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3.5 rounded-xl font-semibold transition-all"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}