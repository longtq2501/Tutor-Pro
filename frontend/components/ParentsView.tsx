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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Users className="text-indigo-600" size={32} />
          <h2 className="text-2xl font-bold text-gray-800">Quản lý phụ huynh</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Thêm phụ huynh
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm theo tên, email, số điện thoại..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Tổng số phụ huynh</p>
          <p className="text-2xl font-bold text-blue-600">{parents.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Có email</p>
          <p className="text-2xl font-bold text-green-600">
            {parents.filter(p => p.email).length}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Tổng học sinh</p>
          <p className="text-2xl font-bold text-purple-600">
            {parents.reduce((sum, p) => sum + p.studentCount, 0)}
          </p>
        </div>
      </div>

      {/* Parents List */}
      {parents.length === 0 ? (
        <div className="text-center py-16">
          <UserPlus className="mx-auto text-gray-300 mb-4" size={64} />
          <p className="text-gray-500 text-lg">Chưa có phụ huynh nào</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Thêm phụ huynh đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parents.map((parent) => (
            <div
              key={parent.id}
              className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all hover:border-indigo-300"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    {parent.name}
                  </h3>
                  <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                    {parent.studentCount} học sinh
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(parent)}
                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                    title="Sửa"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(parent.id)}
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {parent.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} className="text-gray-400" />
                    <span className="truncate">{parent.email}</span>
                  </div>
                )}
                {parent.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} className="text-gray-400" />
                    <span>{parent.phone}</span>
                  </div>
                )}
                {parent.notes && (
                  <p className="text-gray-500 text-xs mt-2 line-clamp-2">
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingParent ? 'Sửa thông tin phụ huynh' : 'Thêm phụ huynh mới'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Họ tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:bg-white focus:outline-none placeholder:text-gray-500 transition-all"
                  placeholder="Nhập họ tên phụ huynh"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:bg-white focus:outline-none placeholder:text-gray-500 transition-all"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:bg-white focus:outline-none placeholder:text-gray-500 transition-all"
                  placeholder="0123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:bg-white focus:outline-none resize-none placeholder:text-gray-500 transition-all"
                  placeholder="Ghi chú về phụ huynh..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3 px-6 rounded-xl transition-all border-2 border-gray-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
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