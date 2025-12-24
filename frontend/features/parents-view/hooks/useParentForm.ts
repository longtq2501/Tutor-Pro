// 📁 parents-view/hooks/useParentForm.ts
import { useState } from 'react';
import { parentsApi } from '@/lib/services';
import type { Parent, ParentRequest } from '@/lib/types';

const initialFormData: ParentRequest = {
  name: '',
  email: '',
  phone: '',
  notes: '',
};

export function useParentForm(onSuccess: () => void) {
  const [showModal, setShowModal] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [formData, setFormData] = useState<ParentRequest>(initialFormData);

  const openCreate = () => {
    setEditingParent(null);
    setFormData(initialFormData);
    setShowModal(true);
  };

  const openEdit = (parent: Parent) => {
    setEditingParent(parent);
    setFormData({
      name: parent.name,
      email: parent.email || '',
      phone: parent.phone || '',
      notes: parent.notes || '',
    });
    setShowModal(true);
  };

  const close = () => {
    setShowModal(false);
    setEditingParent(null);
    setFormData(initialFormData);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên phụ huynh!');
      return;
    }

    try {
      if (editingParent) {
        await parentsApi.update(editingParent.id, formData);
      } else {
        await parentsApi.create(formData);
      }
      
      close();
      onSuccess();
    } catch (error: any) {
      console.error('Error saving parent:', error);
      alert(error.response?.data?.message || 'Không thể lưu thông tin phụ huynh!');
    }
  };

  return {
    showModal,
    editingParent,
    formData,
    setFormData,
    openCreate,
    openEdit,
    close,
    submit,
  };
}