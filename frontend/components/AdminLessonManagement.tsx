'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Search, Eye, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { adminLessonsApi } from '@/lib/api';
import type { AdminLesson } from '@/lib/types';

export default function AdminLessonManagement() {
  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const data = await adminLessonsApi.getAll();
      setLessons(data);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa bài giảng này?')) return;
    try {
      await adminLessonsApi.delete(id);
      fetchLessons();
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  const handleTogglePublish = async (id: number) => {
    try {
      await adminLessonsApi.togglePublish(id);
      fetchLessons();
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  const filteredLessons = lessons.filter(l =>
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.tutorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quản lý Bài giảng</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus size={20} />
          Tạo bài giảng
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <input
          type="text"
          placeholder="Tìm kiếm bài giảng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4">Tiêu đề</th>
              <th className="text-left p-4">Giáo viên</th>
              <th className="text-center p-4">Học sinh</th>
              <th className="text-center p-4">Lượt xem</th>
              <th className="text-center p-4">Hoàn thành</th>
              <th className="text-center p-4">Trạng thái</th>
              <th className="text-center p-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredLessons.map((lesson) => (
              <tr key={lesson.id} className="border-t hover:bg-muted/50">
                <td className="p-4 font-medium">{lesson.title}</td>
                <td className="p-4">{lesson.tutorName}</td>
                <td className="text-center p-4">{lesson.assignedStudentCount}</td>
                <td className="text-center p-4">{lesson.totalViewCount}</td>
                <td className="text-center p-4">{lesson.completionRate.toFixed(1)}%</td>
                <td className="text-center p-4">
                  <button
                    onClick={() => handleTogglePublish(lesson.id)}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      lesson.isPublished
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {lesson.isPublished ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {lesson.isPublished ? 'Xuất bản' : 'Nháp'}
                  </button>
                </td>
                <td className="text-center p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-2 hover:bg-muted rounded-lg" title="Xem">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 hover:bg-muted rounded-lg" title="Sửa">
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg text-red-600"
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}