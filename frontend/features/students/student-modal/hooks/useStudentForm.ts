// ============================================================================
// 📁 student-modal/hooks/useStudentForm.ts
// ============================================================================
import { studentsApi } from '@/lib/services';
import type { Student, StudentRequest } from '@/lib/types';
import { useEffect, useState } from 'react';

const initialFormData: StudentRequest = {
  name: '',
  phone: '',
  schedule: '',
  pricePerHour: 200000,
  notes: '',
  active: true,
  startMonth: new Date().toISOString().slice(0, 7),
  parentId: undefined,
  createAccount: false,
  email: '',
  password: '',
};

export function useStudentForm(student: Student | null, onSuccess: () => void) {
  const [formData, setFormData] = useState<StudentRequest>(initialFormData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!student) {
      setFormData(initialFormData);
      return;
    }
    setFormData({
      name: student.name,
      phone: student.phone || '',
      schedule: student.schedule,
      pricePerHour: student.pricePerHour,
      notes: student.notes || '',
      active: student.active,
      startMonth: student.startMonth || new Date().toISOString().slice(0, 7),
      parentId: student.parentId,
      createAccount: !!student.accountEmail,
      email: student.accountEmail || '',
      password: '',
    });
  }, [student]);

  const updateField = <K extends keyof StudentRequest>(field: K, value: StudentRequest[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const submit = async () => {
    if (!formData.name || !formData.schedule) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    try {
      setLoading(true);
      await (student ? studentsApi.update(student.id, formData) : studentsApi.create(formData));
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