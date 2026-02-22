import { studentsApi } from '@/lib/services';
import type { Student, StudentRequest } from '@/lib/types';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

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
  const queryClient = useQueryClient();

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
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    try {
      setLoading(true);
      await (student ? studentsApi.update(student.id, formData) : studentsApi.create(formData));
      await queryClient.invalidateQueries({ queryKey: ['students'] });
      onSuccess();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err?.response?.data?.message || 'Không thể lưu thông tin học sinh!';
      if (message.toLowerCase().includes('email') && message.toLowerCase().includes('tồn tại')) {
        toast.error(`Lỗi: Email ${formData.email || ''} đã được sử dụng bởi một tài khoản khác.`);
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { formData, loading, updateField, submit };
}