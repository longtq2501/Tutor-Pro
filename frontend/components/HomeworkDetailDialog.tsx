/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { homeworkApi } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, Upload, X, AlertCircle, CheckCircle2, 
  Calendar, Clock, Award, ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';
import { Homework } from '@/lib/types';

interface HomeworkDetailDialogProps {
  homework: Homework;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function HomeworkDetailDialog({
  homework,
  open,
  onClose,
  onUpdate,
}: HomeworkDetailDialogProps) {
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<{ url: string; filename: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      // ✅ Upload từng file một (không Promise.all để debug dễ hơn)
      for (const file of Array.from(files)) {
        console.log('📤 Uploading file:', file.name, file.size, file.type);
        
        const result = await homeworkApi.student.uploadFile(file);
        console.log('✅ Upload success:', result);
        
        setUploadedFiles(prev => [...prev, result]);
      }
      
      toast.success(`Upload thành công ${files.length} file!`);
    } catch (error: any) {
      console.error('❌ Upload failed:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast.error(`Không thể upload file: ${error.response?.data?.message || error.message}`);
    } finally {
      setUploading(false);
      // Reset input để có thể upload lại cùng file
      e.target.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Vui lòng upload ít nhất 1 file');
      return;
    }

    setSubmitting(true);
    try {
      console.log('📤 Submitting homework:', {
        id: homework.id,
        notes: submissionNotes,
        files: uploadedFiles.map(f => f.url)
      });

      await homeworkApi.student.submit(
        homework.id,
        submissionNotes,
        uploadedFiles.map(f => f.url)
      );
      
      toast.success('Nộp bài thành công!');
      setSubmissionNotes('');
      setUploadedFiles([]);
      onUpdate();
      onClose();
    } catch (error: any) {
      console.error('❌ Submit failed:', error);
      toast.error(`Không thể nộp bài: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkInProgress = async () => {
    try {
      await homeworkApi.student.updateStatus(homework.id, 'IN_PROGRESS');
      toast.success('Đã đánh dấu đang làm!');
      onUpdate();
    } catch (error: any) {
      console.error('❌ Update status failed:', error);
      toast.error(`Không thể cập nhật trạng thái: ${error.response?.data?.message || error.message}`);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      ASSIGNED: { variant: 'default', label: 'Đã giao' },
      IN_PROGRESS: { variant: 'secondary', label: 'Đang làm' },
      SUBMITTED: { variant: 'outline', label: 'Đã nộp' },
      GRADED: { variant: 'default', label: 'Đã chấm' },
      OVERDUE: { variant: 'destructive', label: 'Quá hạn' },
    };
    const config = variants[status] || variants.ASSIGNED;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const canSubmit = homework.status === 'ASSIGNED' || homework.status === 'IN_PROGRESS';
  const isGraded = homework.status === 'GRADED';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{homework.title}</DialogTitle>
              <DialogDescription className="mt-2">
                {getStatusBadge(homework.status)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Info Section */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Hạn nộp:</span>
              <span className="font-medium">
                {format(new Date(homework.dueDate), 'dd/MM/yyyy HH:mm', { locale: vi })}
              </span>
            </div>

            {homework.daysUntilDue !== undefined && homework.daysUntilDue >= 0 && (
              <div className="flex items-center gap-2 text-yellow-600">
                <Clock className="h-4 w-4" />
                <span>Còn {homework.daysUntilDue} ngày</span>
              </div>
            )}

            {homework.isOverdue && (
              <div className="flex items-center gap-2 text-red-600 font-medium">
                <AlertCircle className="h-4 w-4" />
                <span>Đã quá hạn</span>
              </div>
            )}

            {homework.score !== undefined && (
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Điểm:</span>
                <span className="font-bold text-green-600">{homework.score}/100</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">📝 Nội dung bài tập</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {homework.description || 'Không có mô tả'}
            </p>
          </div>

          {/* Tutor Notes */}
          {homework.tutorNotes && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">💡 Ghi chú từ giáo viên</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">{homework.tutorNotes}</p>
            </div>
          )}

          {/* Attachments */}
          {homework.attachmentUrls.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">📎 Tài liệu đính kèm</h3>
              <div className="space-y-2">
                {homework.attachmentUrls.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="flex-1 text-sm">File {index + 1}</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Submission Section */}
          {canSubmit && (
            <div className="space-y-4">
              <h3 className="font-semibold">📤 Nộp bài</h3>

              <div>
                <label className="text-sm font-medium mb-2 block">Ghi chú (tùy chọn)</label>
                <Textarea
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="Nhập ghi chú về bài làm của bạn..."
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Upload file bài làm</label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading}
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? 'Đang upload...' : 'Chọn file'}
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <span className="text-xs text-muted-foreground">
                    PDF, Word, Image, ZIP (Max 50MB)
                  </span>
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">File đã upload ({uploadedFiles.length}):</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm truncate">{file.filename}</span>
                      </div>
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

              <div className="flex gap-2">
                {homework.status === 'ASSIGNED' && (
                  <Button
                    variant="outline"
                    onClick={handleMarkInProgress}
                  >
                    Đánh dấu đang làm
                  </Button>
                )}
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || uploading || uploadedFiles.length === 0}
                  className="flex-1"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {submitting ? 'Đang nộp bài...' : 'Nộp bài'}
                </Button>
              </div>
            </div>
          )}

          {/* Grading Section */}
          {isGraded && (
            <div className="space-y-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <h3 className="font-semibold text-green-900 dark:text-green-100">📊 Kết quả chấm điểm</h3>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-green-700 dark:text-green-300">Điểm số:</span>
                <span className="text-3xl font-bold text-green-600">{homework.score}/100</span>
              </div>

              {homework.feedback && (
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">💬 Nhận xét:</p>
                  <p className="text-sm text-green-600 dark:text-green-400">{homework.feedback}</p>
                </div>
              )}

              {homework.gradedAt && (
                <p className="text-xs text-green-600 dark:text-green-400">
                  Chấm điểm lúc: {format(new Date(homework.gradedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                </p>
              )}
            </div>
          )}

          {/* Submitted Info */}
          {homework.status === 'SUBMITTED' && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                ✅ Đã nộp bài lúc: {homework.submittedAt && format(new Date(homework.submittedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
              </p>
              {homework.submissionNotes && (
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                  Ghi chú: {homework.submissionNotes}
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}