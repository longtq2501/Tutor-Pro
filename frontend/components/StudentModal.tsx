// src/components/StudentModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Save, Calendar, Users, Mail, Phone } from 'lucide-react';
import { parentsApi, studentsApi } from '@/lib/api';
import type { Parent, Student, StudentRequest } from '@/lib/types';

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
    active: true,
    startMonth: new Date().toISOString().slice(0, 7),
    parentId: undefined,
  });
  const [loading, setLoading] = useState(false);

  const [parents, setParents] = useState<Parent[]>([]);
  const [loadingParents, setLoadingParents] = useState(false);

  useEffect(() => {
    loadParents();
  }, []);
  
  const loadParents = async () => {
    try {
      setLoadingParents(true);
      const data = await parentsApi.getAll();
      setParents(data);
    } catch (error) {
      console.error('Error loading parents:', error);
    } finally {
      setLoadingParents(false);
    }
  };

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        phone: student.phone || '',
        schedule: student.schedule,
        pricePerHour: student.pricePerHour,
        notes: student.notes || '',
        active: student.active,
        startMonth: student.startMonth || new Date().toISOString().slice(0, 7),
        parentId: student.parentId,
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        schedule: '',
        pricePerHour: 200000,
        notes: '',
        active: true,
        startMonth: new Date().toISOString().slice(0, 7),
        parentId: undefined,
      });
    }
  }, [student]);

  const handleStartMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ 
      ...formData, 
      startMonth: e.target.value || new Date().toISOString().slice(0, 7) 
    });
  };

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

  const selectedParent = formData.parentId 
    ? parents.find(p => p.id === formData.parentId)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* ✅ Custom scrollbar styling */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #6366f1 0%, #a855f7 100%);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #4f46e5 0%, #9333ea 100%);
        }
      `}</style>
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-5 rounded-t-2xl flex-shrink-0">
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

        {/* ✅ Scrollable content with custom scrollbar */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Tên học sinh <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none placeholder:text-gray-500"
                placeholder="Nhập tên học sinh"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none placeholder:text-gray-500"
                placeholder="0901234567"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Lịch học <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none placeholder:text-gray-500"
                placeholder="Ví dụ: Thứ 2, 4, 6 - 18:00"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Giá mỗi giờ (VNĐ)
              </label>
              <input
                type="number"
                value={formData.pricePerHour}
                onChange={(e) =>
                  setFormData({ ...formData, pricePerHour: parseInt(e.target.value) || 200000 })
                }
                className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none placeholder:text-gray-500"
                placeholder="200000"
                min="0"
                step="10000"
              />
            </div>

            {/* Parent Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                <Users className="inline mr-2" size={16} />
                Phụ huynh
              </label>
              <select
                value={formData.parentId || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  parentId: e.target.value ? Number(e.target.value) : undefined 
                })}
                className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                disabled={loadingParents}
              >
                <option value="" className="text-gray-500">-- Chưa có phụ huynh --</option>
                {parents.map(parent => (
                  <option key={parent.id} value={parent.id} className="text-gray-900">
                    {parent.name}
                    {parent.email && ` (${parent.email})`}
                    {parent.studentCount > 0 && ` - ${parent.studentCount} HS`}
                  </option>
                ))}
              </select>
              
              {/* Show selected parent info */}
              {selectedParent && (
                <div className="mt-2 p-3 bg-indigo-50 rounded-lg border border-indigo-200 animate-fadeIn">
                  <p className="font-semibold text-indigo-900 text-sm">
                    ✓ {selectedParent.name}
                  </p>
                  {selectedParent.email && (
                    <p className="text-indigo-700 text-xs flex items-center gap-1 mt-1">
                      <Mail size={12} />
                      {selectedParent.email}
                    </p>
                  )}
                  {selectedParent.phone && (
                    <p className="text-indigo-700 text-xs flex items-center gap-1 mt-1">
                      <Phone size={12} />
                      {selectedParent.phone}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Tháng bắt đầu học */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                <Calendar className="inline mr-2" size={16} />
                Tháng bắt đầu học <span className="text-red-500">*</span>
              </label>
              <input
                type="month"
                value={formData.startMonth || new Date().toISOString().slice(0, 7)}
                onChange={handleStartMonthChange}
                className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Tháng bắt đầu học với bạn (có thể chọn tháng quá khứ)
              </p>
            </div>

            {/* Trạng thái */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Trạng thái
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, active: true })}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                    formData.active
                      ? 'bg-green-100 border-2 border-green-500 text-green-700 shadow-sm'
                      : 'bg-gray-100 border-2 border-gray-200 text-gray-600'
                  }`}
                >
                  ✓ Đang học
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, active: false })}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                    !formData.active
                      ? 'bg-red-100 border-2 border-red-500 text-red-700 shadow-sm'
                      : 'bg-gray-100 border-2 border-gray-200 text-gray-600'
                  }`}
                >
                  ✕ Đã nghỉ
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Ghi chú
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none resize-none placeholder:text-gray-500"
                placeholder="Ghi chú về học sinh..."
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Fixed footer với buttons */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex-shrink-0">
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white px-6 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {loading ? 'Đang lưu...' : student ? 'Cập nhật' : 'Thêm học sinh'}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-white hover:bg-gray-100 text-gray-700 px-6 py-3.5 rounded-xl font-semibold transition-all border-2 border-gray-200 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}