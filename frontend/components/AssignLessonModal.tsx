/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Users, CheckCircle2 } from 'lucide-react';
import { studentsApi, lessonLibraryApi } from '@/lib/api';
import type { Student } from '@/lib/types';
import { toast } from 'sonner';

interface AssignLessonModalProps {
  lessonId: number;
  lessonTitle: string;
  currentlyAssignedStudentIds: number[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssignLessonModal({
  lessonId,
  lessonTitle,
  currentlyAssignedStudentIds,
  onClose,
  onSuccess,
}: AssignLessonModalProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>(currentlyAssignedStudentIds);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await studentsApi.getAll();
      setStudents(data.filter((s) => s.active));
    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Không thể tải danh sách học sinh');
    } finally {
      setLoading(false);
    }
  };

  const toggleStudent = (studentId: number) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Calculate changes
      const toAssign = selectedStudentIds.filter(
        (id) => !currentlyAssignedStudentIds.includes(id)
      );
      const toUnassign = currentlyAssignedStudentIds.filter(
        (id) => !selectedStudentIds.includes(id)
      );

      // Execute changes
      if (toAssign.length > 0) {
        await lessonLibraryApi.assignToStudents(lessonId, toAssign);
      }
      if (toUnassign.length > 0) {
        await lessonLibraryApi.unassignFromStudents(lessonId, toUnassign);
      }

      toast.success(
        `Đã cập nhật: ${toAssign.length} gán mới, ${toUnassign.length} thu hồi`
      );
      onSuccess();
    } catch (error: any) {
      console.error('Error updating assignments:', error);
      toast.error('Không thể cập nhật phân công');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Giao Bài Giảng
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {lessonTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selection Summary */}
          <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <span className="text-sm font-medium text-foreground">
              Đã chọn {selectedStudentIds.length} học sinh
            </span>
            {selectedStudentIds.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedStudentIds([])}
                className="text-xs"
              >
                Bỏ chọn tất cả
              </Button>
            )}
          </div>

          {/* Student List */}
          <ScrollArea className="h-[400px] pr-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {students.map((student) => {
                  const isSelected = selectedStudentIds.includes(student.id);
                  const wasAssigned = currentlyAssignedStudentIds.includes(student.id);

                  return (
                    <button
                      key={student.id}
                      onClick={() => toggleStudent(student.id)}
                      className={`
                        w-full p-3 rounded-lg border-2 transition-all text-left
                        ${
                          isSelected
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-card hover:border-primary/50'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`
                            w-10 h-10 rounded-full flex items-center justify-center font-bold
                            ${
                              isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-foreground'
                            }
                          `}
                          >
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.schedule}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {wasAssigned && (
                            <Badge variant="secondary" className="text-xs">
                              Đang học
                            </Badge>
                          )}
                          {isSelected && (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose} disabled={submitting}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || selectedStudentIds.length === 0}
              className="bg-primary hover:bg-primary/90"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Cập Nhật
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}