// ============================================================================
// 📁 student-modal/index.tsx
// ============================================================================
'use client';

import { Calendar } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import type { Student } from '@/lib/types';
import { useEffect } from 'react';
import { useParents } from './hooks/useParents';
import { useStudentForm } from './hooks/useStudentForm';
import { StudentModalHeader } from './components/StudentModalHeader';
import { BasicInfoFields } from './components/BasicInfoFields';
import { ParentSelector } from './components/ParentSelector';
import { StatusToggle } from './components/StatusToggle';
import { StudentModalFooter } from './components/StudentModalFooter';

interface StudentModalProps {
  student: Student | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StudentModal({ student, onClose, onSuccess }: StudentModalProps) {
  const { parents, loading: loadingParents } = useParents();
  const { formData, loading, updateField, submit } = useStudentForm(student, onSuccess);

  // Body scroll lock & Sidebar hiding (Problem 2)
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    return () => {
      document.body.style.overflow = 'unset';
      // Only remove modal-open if no other modals are open
      setTimeout(() => {
        const otherModals = document.querySelectorAll('[role="dialog"]');
        if (otherModals.length === 0) {
          document.body.classList.remove('modal-open');
        }
      }, 0);
    };
  }, []);

  return (
    <div role="dialog" className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300 ease-out">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative bg-card rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300 ease-out border border-border">

        <StudentModalHeader isEdit={!!student} onClose={onClose} />

        {/* Scrollable Form */}
        <div className="px-8 py-6 overflow-y-auto custom-scrollbar flex-1 bg-muted/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Left Column */}
            <BasicInfoFields
              name={formData.name}
              phone={formData.phone || ''}
              schedule={formData.schedule}
              pricePerHour={formData.pricePerHour}
              onChange={updateField}
            />

            {/* Right Column */}
            <div className="space-y-6">
              <ParentSelector
                parentId={formData.parentId}
                parents={parents}
                loading={loadingParents}
                onChange={(parentId) => updateField('parentId', parentId)}
              />

              {/* Start Month */}
              <div>
                <label className="block text-sm font-bold text-card-foreground mb-2 flex items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  Tháng bắt đầu
                </label>
                <DatePicker
                  value={formData.startMonth ? new Date(formData.startMonth + '-01') : undefined}
                  onChange={(date) => {
                    if (date) {
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      updateField('startMonth', `${year}-${month}`);
                    }
                  }}
                  placeholder="Chọn tháng bắt đầu"
                  className="w-full"
                />
              </div>

              <StatusToggle
                active={formData.active ?? true}
                onChange={(active: boolean) => updateField('active', active)}
              />
            </div>

            {/* Notes - Full Width */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-card-foreground mb-2">
                Ghi chú thêm
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => updateField('notes', e.target.value)}
                className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:border-ring focus:ring-1 focus:ring-ring outline-none resize-none placeholder:text-muted-foreground text-foreground"
                placeholder="Ví dụ: Học sinh cần chú ý phần ngữ pháp..."
                rows={3}
              />
            </div>
          </div>
        </div>

        <StudentModalFooter
          isEdit={!!student}
          loading={loading}
          onClose={onClose}
          onSubmit={submit}
        />
      </div>
    </div>
  );
}