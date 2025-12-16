
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Plus, Edit2, Trash2, Mail, Phone, UserPlus } from 'lucide-react';
import { parentsApi } from '@/lib/api';
import type { Parent, ParentRequest } from '@/lib/types';

export default function ParentsView() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [formData, setFormData] = useState<ParentRequest>({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  useEffect(() => {
    loadParents();
  }, []);

  const loadParents = async () => {
    try {
      setLoading(true);
      const data = await parentsApi.getAll();
      setParents(data);
    } catch (error) {
      console.error('Error loading parents:', error);
      alert('Không thể tải danh sách phụ huynh!');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (keyword: string) => {
    setSearchTerm(keyword);
    if (!keyword.trim()) {
      loadParents();
      return;
    }

    try {
      const results = await parentsApi.search(keyword);
      setParents(results);
    } catch (error) {
      console.error('Error searching parents:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      
      setShowModal(false);
      setEditingParent(null);
      resetForm();
      loadParents();
    } catch (error: any) {
      console.error('Error saving parent:', error);
      alert(error.response?.data?.message || 'Không thể lưu thông tin phụ huynh!');
    }
  };

  const handleEdit = (parent: Parent) => {
    setEditingParent(parent);
    setFormData({
      name: parent.name,
      email: parent.email || '',
      phone: parent.phone || '',
      notes: parent.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa phụ huynh này? Lưu ý: Không thể xóa nếu còn học sinh liên kết.')) {
      return;
    }

    try {
      await parentsApi.delete(id);
      loadParents();
    } catch (error: any) {
      console.error('Error deleting parent:', error);
      alert(error.response?.data?.message || 'Không thể xóa phụ huynh!');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      notes: '',
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingParent(null);
    resetForm();
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-lg p-6 transition-colors border border-border">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Users className="text-primary" size={32} />
          <h2 className="text-2xl font-bold text-card-foreground">Quản lý phụ huynh</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Thêm phụ huynh
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Tìm theo tên, email, số điện thoại..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-border rounded-xl focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none bg-background text-foreground placeholder:text-muted-foreground transition-colors"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800/30">
          <p className="text-sm text-muted-foreground mb-1">Tổng số phụ huynh</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{parents.length}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-100 dark:border-green-800/30">
          <p className="text-sm text-muted-foreground mb-1">Có email</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {parents.filter(p => p.email).length}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-100 dark:border-purple-800/30">
          <p className="text-sm text-muted-foreground mb-1">Tổng học sinh</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {parents.reduce((sum, p) => sum + p.studentCount, 0)}
          </p>
        </div>
      </div>

      {/* Parents List */}
      {parents.length === 0 ? (
        <div className="text-center py-16">
          <UserPlus className="mx-auto text-muted-foreground mb-4" size={64} />
          <p className="text-muted-foreground text-lg">Chưa có phụ huynh nào</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 text-primary hover:text-primary/80 font-medium"
          >
            Thêm phụ huynh đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parents.map((parent) => (
            <div
              key={parent.id}
              className="border border-border rounded-xl p-5 hover:shadow-lg transition-all hover:border-primary/50 bg-card"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-card-foreground mb-1">
                    {parent.name}
                  </h3>
                  <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {parent.studentCount} học sinh
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(parent)}
                    className="p-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                    title="Sửa"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(parent.id)}
                    className="p-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {parent.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail size={16} />
                    <span className="truncate">{parent.email}</span>
                  </div>
                )}
                {parent.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone size={16} />
                    <span>{parent.phone}</span>
                  </div>
                )}
                {parent.notes && (
                  <p className="text-muted-foreground text-xs mt-2 line-clamp-2">
                    {parent.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
            <div className="p-6 border-b border-border bg-muted/30">
              <h3 className="text-2xl font-bold text-card-foreground">
                {editingParent ? 'Sửa thông tin phụ huynh' : 'Thêm phụ huynh mới'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-card-foreground mb-2">
                  Họ tên <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none text-foreground placeholder:text-muted-foreground transition-all"
                  placeholder="Nhập họ tên phụ huynh"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-card-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none text-foreground placeholder:text-muted-foreground transition-all"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-card-foreground mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none text-foreground placeholder:text-muted-foreground transition-all"
                  placeholder="0123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-card-foreground mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none resize-none text-foreground placeholder:text-muted-foreground transition-all"
                  placeholder="Ghi chú về phụ huynh..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-muted hover:bg-muted/80 text-foreground font-bold py-3 px-6 rounded-xl transition-all border border-border"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  {editingParent ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
