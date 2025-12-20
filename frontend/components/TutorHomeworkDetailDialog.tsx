'use client';

import React, { useState } from 'react';
import { homeworkApi} from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { 
  FileText, Calendar, Clock, Award, 
  ExternalLink, Trash2, Edit, CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Homework } from '@/lib/types';

interface TutorHomeworkDetailDialogProps {
  homework: Homework;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
  onDelete: (id: number) => void;
}

export default function TutorHomeworkDetailDialog({
  homework,
  open,
  onClose,
  onUpdate,
  onDelete,
}: TutorHomeworkDetailDialogProps) {
  const { hasAnyRole } = useAuth();
  const isAdmin = hasAnyRole(['ADMIN']);

  const [gradingMode, setGradingMode] = useState(false);
  const [score, setScore] = useState<number>(homework.score || 0);
  const [feedback, setFeedback] = useState(homework.feedback || '');
  const [grading, setGrading] = useState(false);

  const handleGrade = async () => {
    if (score < 0 || score > 100) {
      toast.error('Điểm phải từ 0 đến 100');
      return;
    }

    setGrading(true);
    try {
      const api = isAdmin ? homeworkApi.admin : homeworkApi.tutor;
      await api.grade(homework.id, score, feedback);
      
      toast.success('Chấm điểm thành công!');
      setGradingMode(false);
      onUpdate();
    } catch (error) {
      console.error('Failed to grade homework:', error);
      toast.error('Không thể chấm điểm');
    } finally {
      setGrading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      ASSIGNED: { variant: 'default', label: 'Đã giao' },
      IN_PROGRESS: { variant: 'secondary', label: 'Đang làm' },
      SUBMITTED: { variant: 'outline', label: 'Chờ chấm' },
      GRADED: { variant: 'default', label: 'Đã chấm' },
      OVERDUE: { variant: 'destructive', label: 'Quá hạn' },
    };
    const config = variants[status] || variants.ASSIGNED;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const canGrade = homework.status === 'SUBMITTED';
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
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(homework.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
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

            {homework.score !== undefined && (
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Điểm:</span>
                <span className="font-bold text-green-600">{homework.score}/100</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Độ ưu tiên:</span>
              <Badge variant={homework.priority === 'HIGH' ? 'destructive' : 'secondary'}>
                {homework.priority === 'HIGH' ? 'Cao' : homework.priority === 'MEDIUM' ? 'Trung bình' : 'Thấp'}
              </Badge>
            </div>
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
              <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">💡 Ghi chú</h3>
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

          {/* Submission Info */}
          {(homework.status === 'SUBMITTED' || homework.status === 'GRADED') && (
            <div className="space-y-4">
              <h3 className="font-semibold">📤 Bài nộp của học sinh</h3>

              {homework.submittedAt && (
                <p className="text-sm text-muted-foreground">
                  Nộp lúc: {format(new Date(homework.submittedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                </p>
              )}

              {homework.submissionNotes && (
                <div>
                  <p className="text-sm font-medium mb-1">Ghi chú:</p>
                  <p className="text-sm text-muted-foreground">{homework.submissionNotes}</p>
                </div>
              )}

              {homework.submissionUrls.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">File đã nộp:</p>
                  <div className="space-y-2">
                    {homework.submissionUrls.map((url, index) => (
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
            </div>
          )}

          {/* Grading Section */}
          {canGrade && (
            <div className="space-y-4 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">📊 Chấm điểm</h3>
                {!gradingMode && (
                  <Button onClick={() => setGradingMode(true)} size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Chấm điểm
                  </Button>
                )}
              </div>

              {gradingMode && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="score">Điểm (0-100)</Label>
                    <Input
                      id="score"
                      type="number"
                      min="0"
                      max="100"
                      value={score}
                      onChange={(e) => setScore(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feedback">Nhận xét</Label>
                    <Textarea
                      id="feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Nhập nhận xét cho học sinh..."
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setGradingMode(false)}
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleGrade}
                      disabled={grading}
                      className="flex-1"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {grading ? 'Đang lưu...' : 'Lưu điểm'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Graded Display */}
          {isGraded && (
            <div className="space-y-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-green-900 dark:text-green-100">📊 Đã chấm điểm</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setScore(homework.score || 0);
                    setFeedback(homework.feedback || '');
                    setGradingMode(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Sửa điểm
                </Button>
              </div>

              {!gradingMode && (
                <>
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
                      Chấm lúc: {format(new Date(homework.gradedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                    </p>
                  )}
                </>
              )}

              {gradingMode && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="score-edit">Điểm (0-100)</Label>
                    <Input
                      id="score-edit"
                      type="number"
                      min="0"
                      max="100"
                      value={score}
                      onChange={(e) => setScore(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feedback-edit">Nhận xét</Label>
                    <Textarea
                      id="feedback-edit"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Nhập nhận xét cho học sinh..."
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setGradingMode(false)}
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleGrade}
                      disabled={grading}
                      className="flex-1"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {grading ? 'Đang lưu...' : 'Cập nhật điểm'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}