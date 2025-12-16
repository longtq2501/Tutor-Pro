
'use client';

import { useState, useEffect } from 'react';
import { X, Save, Calendar, Users, Mail, Phone, UserCircle } from 'lucide-react';
import { parentsApi, studentsApi } from '../lib/api';
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
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-card rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-border">
        
        {/* Header */}
        <div className="bg-card border-b border-border px-8 py-6 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
                  <UserCircle size={28} />
               </div>
               <div>
                  <h2 className="text-xl font-bold text-card-foreground">
                    {student ? 'Cập Nhật Hồ Sơ' : 'Thêm Học Sinh Mới'}
                  </h2>
                  <p className="text-sm text-muted-foreground">Điền thông tin chi tiết bên dưới</p>
               </div>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-full transition-all"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Form */}
        <div className="px-8 py-6 overflow-y-auto custom-scrollbar flex-1 bg-muted/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column */}
            <div className="space-y-6">
               <div>
                 <label className="block text-sm font-bold text-card-foreground mb-2">
                   Họ và tên <span className="text-destructive">*</span>
                 </label>
                 <input
                   type="text"
                   value={formData.name}
                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                   className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all placeholder:text-muted-foreground text-foreground font-medium"
                   placeholder="Nguyễn Văn A"
                 />
               </div>

               <div>
                 <label className="block text-sm font-bold text-card-foreground mb-2">
                   Số điện thoại
                 </label>
                 <input
                   type="tel"
                   value={formData.phone || ''}
                   onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                   className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all placeholder:text-muted-foreground text-foreground font-medium"
                   placeholder="0901234567"
                 />
               </div>

               <div>
                 <label className="block text-sm font-bold text-card-foreground mb-2">
                   Lịch học dự kiến <span className="text-destructive">*</span>
                 </label>
                 <input
                   type="text"
                   value={formData.schedule}
                   onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                   className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all placeholder:text-muted-foreground text-foreground font-medium"
                   placeholder="T2, T4 (18:00)"
                 />
               </div>

               <div>
                 <label className="block text-sm font-bold text-card-foreground mb-2">
                   Học phí / giờ (VNĐ)
                 </label>
                 <div className="relative">
                   <input
                     type="number"
                     value={formData.pricePerHour}
                     onChange={(e) =>
                       setFormData({ ...formData, pricePerHour: parseInt(e.target.value) || 200000 })
                     }
                     className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all font-semibold text-foreground"
                     step="10000"
                   />
                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₫</span>
                 </div>
               </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
                {/* Parent Selector */}
                <div>
                  <label className="block text-sm font-bold text-card-foreground mb-2 flex items-center gap-2">
                    <Users size={16} className="text-primary" />
                    Phụ huynh liên kết
                  </label>
                  <select
                    value={formData.parentId || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      parentId: e.target.value ? Number(e.target.value) : undefined 
                    })}
                    className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all appearance-none text-foreground font-medium"
                    disabled={loadingParents}
                  >
                    <option value="">-- Chọn phụ huynh --</option>
                    {parents.map(parent => (
                      <option key={parent.id} value={parent.id}>
                        {parent.name} {parent.studentCount > 0 ? `(${parent.studentCount} HS)` : ''}
                      </option>
                    ))}
                  </select>
                  
                  {/* Selected Parent Info Card */}
                  {selectedParent && (
                    <div className="mt-3 p-3 bg-primary/5 rounded-xl border border-primary/10 flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg text-primary">
                         <UserCircle size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-card-foreground text-sm">
                          {selectedParent.name}
                        </p>
                        <div className="flex flex-col gap-1 mt-1">
                           {selectedParent.phone && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Phone size={10} /> {selectedParent.phone}
                              </span>
                           )}
                           {selectedParent.email && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Mail size={10} /> {selectedParent.email}
                              </span>
                           )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Start Month */}
                <div>
                  <label className="block text-sm font-bold text-card-foreground mb-2 flex items-center gap-2">
                    <Calendar size={16} className="text-primary" />
                    Tháng bắt đầu
                  </label>
                  <input
                    type="month"
                    value={formData.startMonth || new Date().toISOString().slice(0, 7)}
                    onChange={handleStartMonthChange}
                    className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all text-foreground font-medium"
                  />
                </div>

                {/* Status Toggle */}
                <div className="p-4 bg-background border border-input rounded-xl">
                   <label className="block text-sm font-bold text-card-foreground mb-3">Trạng thái học tập</label>
                   <div className="flex bg-muted p-1 rounded-lg">
                     <button
                       type="button"
                       onClick={() => setFormData({ ...formData, active: true })}
                       className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${
                         formData.active
                           ? 'bg-background text-emerald-600 shadow-sm'
                           : 'text-muted-foreground hover:text-foreground'
                       }`}
                     >
                       Đang học
                     </button>
                     <button
                       type="button"
                       onClick={() => setFormData({ ...formData, active: false })}
                       className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${
                         !formData.active
                           ? 'bg-background text-destructive shadow-sm'
                           : 'text-muted-foreground hover:text-foreground'
                       }`}
                     >
                       Đã nghỉ
                     </button>
                   </div>
                </div>
            </div>

            {/* Notes - Full Width */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-card-foreground mb-2">
                Ghi chú thêm
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:border-ring focus:ring-1 focus:ring-ring outline-none resize-none placeholder:text-muted-foreground text-foreground"
                placeholder="Ví dụ: Học sinh cần chú ý phần ngữ pháp..."
                rows={3}
              />
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="bg-card border-t border-border px-8 py-5 flex gap-4 flex-shrink-0">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-3.5 bg-muted text-muted-foreground font-bold rounded-xl hover:bg-muted/80 transition-all disabled:opacity-50"
          >
            Hủy Bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-6 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"/> : <Save size={20} />}
            {student ? 'Lưu Thay Đổi' : 'Tạo Hồ Sơ'}
          </button>
        </div>
      </div>
    </div>
  );
}
