'use client';

import React, { useState } from 'react';
import { homeworkApi } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { CreateHomeworkRequest } from '@/lib/types';

interface CreateHomeworkDialogProps {
  studentId: number;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateHomeworkDialog({
  studentId,
  open,
  onClose,
  onSuccess,
}: CreateHomeworkDialogProps) {
  const { hasAnyRole } = useAuth();
  const isAdmin = hasAnyRole(['ADMIN']);

  const [formData, setFormData] = useState<CreateHomeworkRequest>({
    studentId,
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM',
    tutorNotes: '',
    attachmentUrls: [],
  });

  const [uploadedFiles, setUploadedFiles] = useState<{ url: string; filename: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const api = isAdmin ? homeworkApi.admin : homeworkApi.tutor;
      const uploadPromises = Array.from(files).map(file => api.uploadFile(file));
      const results = await Promise.all(uploadPromises);
      setUploadedFiles([...uploadedFiles, ...results]);
      toast.success('Upload file thành công!');
    } catch (error) {
      console.error('Failed to upload files:', error);
      toast.error('Không thể upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.dueDate) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setSubmitting(true);
    try {
      const api = isAdmin ? homeworkApi.admin : homeworkApi.tutor;
      
      await api.create({
        ...formData,
        attachmentUrls: uploadedFiles.map(f => f.url),
      });

      // Reset form
      setFormData({
        studentId,
        title: '',
        description: '',
        dueDate: '',
        priority: 'MEDIUM',
        tutorNotes: '',
        attachmentUrls: [],
      });
      setUploadedFiles([]);

      onSuccess();
    } catch (error) {
      console.error('Failed to create homework:', error);
      toast.error('Không thể tạo bài tập');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo bài tập mới</DialogTitle>
          <DialogDescription>
            Điền thông tin bài tập cho học sinh
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Tiêu đề <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="VD: Bài tập Toán - Chương 5"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Làm tất cả bài tập từ 5.1 đến 5.30..."
              rows={4}
            />
          </div>

          {/* Due Date and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">
                Hạn nộp <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Độ ưu tiên</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: 'LOW' | 'MEDIUM' | 'HIGH') =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Thấp</SelectItem>
                  <SelectItem value="MEDIUM">Trung bình</SelectItem>
                  <SelectItem value="HIGH">Cao</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tutor Notes */}
          <div className="space-y-2">
            <Label htmlFor="tutorNotes">Ghi chú cho học sinh</Label>
            <Textarea
              id="tutorNotes"
              value={formData.tutorNotes}
              onChange={(e) => setFormData({ ...formData, tutorNotes: e.target.value })}
              placeholder="Chú ý đặc biệt bài 5.15 và 5.20..."
              rows={3}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Tài liệu đính kèm</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                onClick={() => document.getElementById('tutor-file-upload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Đang upload...' : 'Chọn file'}
              </Button>
              <input
                id="tutor-file-upload"
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2 mt-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded">
                    <span className="text-sm truncate flex-1">{file.filename}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={submitting || uploading}>
              {submitting ? 'Đang tạo...' : 'Tạo bài tập'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}