// ============================================================================
// 📁 student-modal/hooks/useStudentForm.ts
// ============================================================================
import { useState, useEffect } from 'react';
import { studentsApi } from '@/lib/services';
import type { Student, StudentRequest } from '@/lib/types';

const initialFormData: StudentRequest = {
  name: '',
  phone: '',
  schedule: '',
  pricePerHour: 200000,
  notes: '',
  active: true,
  startMonth: new Date().toISOString().slice(0, 7),
  parentId: undefined,
};

export function useStudentForm(student: Student | null, onSuccess: () => void) {
  const [formData, setFormData] = useState<StudentRequest>(initialFormData);
  const [loading, setLoading] = useState(false);

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
      setFormData(initialFormData);
    }
  }, [student]);

  const updateField = (field: keyof StudentRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const submit = async () => {
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

  return { formData, loading, updateField, submit };
}