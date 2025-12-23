'use client';

import React, { useState, useEffect } from 'react';
import { adminLessonsApi, studentsApi } from '@/lib/api';
import type { CreateLessonRequest, Student, LessonImage, LessonResource } from '@/lib/types';
import { X, Plus, Upload, Link as LinkIcon } from 'lucide-react';

interface Props {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateLessonForm({ onSuccess, onCancel }: Props) {
  const [students, setStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState<CreateLessonRequest>({
    studentIds: [],
    tutorName: '',
    title: '',
    summary: '',
    content: '',
    lessonDate: new Date().toISOString().split('T')[0],
    videoUrl: '',
    thumbnailUrl: '',
    images: [],
    resources: [],
    isPublished: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await studentsApi.getAll();
      setStudents(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLessonsApi.create(formData);
      onSuccess?.();
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const toggleStudent = (id: number) => {
    setFormData(prev => ({
      ...prev,
      studentIds: prev.studentIds?.includes(id)
        ? prev.studentIds.filter(sid => sid !== id)
        : [...(prev.studentIds || []), id]
    }));
  };

  const addImage = () => {
    const url = prompt('Nhập URL hình ảnh (Cloudinary):');
    if (!url) return;
    
    setFormData(prev => ({
      ...prev,
      images: [
        ...(prev.images || []),
        { imageUrl: url, caption: '', displayOrder: (prev.images?.length || 0) + 1 }
      ]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  const addResource = () => {
    const url = prompt('Nhập URL tài liệu:');
    if (!url) return;
    const title = prompt('Tên tài liệu:') || 'Tài liệu';
    
    setFormData(prev => ({
      ...prev,
      resources: [
        ...(prev.resources || []),
        {
          title,
          resourceUrl: url,
          resourceType: 'PDF',
          displayOrder: (prev.resources?.length || 0) + 1
        }
      ]
    }));
  };

  const removeResource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources?.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border">
      <h2 className="text-2xl font-bold">Tạo bài giảng mới</h2>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tên giáo viên *</label>
          <input
            type="text"
            required
            value={formData.tutorName}
            onChange={(e) => setFormData(prev => ({ ...prev, tutorName: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Ngày học *</label>
          <input
            type="date"
            required
            value={formData.lessonDate}
            onChange={(e) => setFormData(prev => ({ ...prev, lessonDate: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tiêu đề *</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tóm tắt</label>
        <textarea
          value={formData.summary}
          onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
          rows={2}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Nội dung (Markdown)</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          rows={8}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
        />
      </div>

      {/* Video & Thumbnail */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Video URL</label>
          <input
            type="url"
            value={formData.videoUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
            placeholder="https://..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
          <input
            type="url"
            value={formData.thumbnailUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
            placeholder="https://..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Images */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium">Hình ảnh</label>
          <button
            type="button"
            onClick={addImage}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <Plus size={16} />
            Thêm ảnh
          </button>
        </div>
        <div className="space-y-2">
          {formData.images?.map((img, idx) => (
            <div key={idx} className="flex items-center gap-2 p-3 border rounded-lg">
              <img src={img.imageUrl} alt="" className="w-16 h-16 object-cover rounded" />
              <input
                type="text"
                value={img.caption}
                onChange={(e) => {
                  const newImages = [...(formData.images || [])];
                  newImages[idx].caption = e.target.value;
                  setFormData(prev => ({ ...prev, images: newImages }));
                }}
                placeholder="Chú thích..."
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <button type="button" onClick={() => removeImage(idx)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium">Tài liệu</label>
          <button
            type="button"
            onClick={addResource}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <Plus size={16} />
            Thêm tài liệu
          </button>
        </div>
        <div className="space-y-2">
          {formData.resources?.map((res, idx) => (
            <div key={idx} className="flex items-center gap-2 p-3 border rounded-lg">
              <LinkIcon size={18} />
              <span className="flex-1 truncate">{res.title}</span>
              <button type="button" onClick={() => removeResource(idx)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Students */}
      <div>
        <label className="block text-sm font-medium mb-3">Giao cho học sinh</label>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3">
          {students.map((student) => (
            <label key={student.id} className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer">
              <input
                type="checkbox"
                checked={formData.studentIds?.includes(student.id)}
                onChange={() => toggleStudent(student.id)}
                className="w-4 h-4"
              />
              <span className="text-sm">{student.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Publish */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.isPublished}
          onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
          className="w-4 h-4"
        />
        <span className="text-sm font-medium">Xuất bản ngay</span>
      </label>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Đang tạo...' : 'Tạo bài giảng'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border rounded-lg hover:bg-muted"
          >
            Hủy
          </button>
        )}
      </div>
    </form>
  );
}