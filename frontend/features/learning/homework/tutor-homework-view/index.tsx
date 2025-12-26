// ============================================================================
// 📁 tutor-homework-view/index.tsx
// ============================================================================
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import type { Homework } from '@/lib/types';
import { useStudents } from './hooks/useStudents';
import { useHomeworks } from './hooks/useHomeworks';
import { StudentSelector } from './components/StudentSelector';
import { HomeworkStats } from './components/HomeworkStats';
import { HomeworkCard } from './components/HomeworkCard';
import { EmptyState } from './components/EmptyState';
import CreateHomeworkDialog from '@/features/learning/homework/create-homework-dialog';
import TutorHomeworkDetailDialog from '@/features/learning/homework/tutor-homework-detail';

export default function TutorHomeworkView() {
  const { hasAnyRole } = useAuth();
  const isAdmin = hasAnyRole(['ADMIN']);

  const { students, selectedStudent, setSelectedStudent } = useStudents();
  const { homeworks, stats, loading, loadHomeworks, deleteHomework } = useHomeworks(selectedStudent, isAdmin);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);

  const handleCreateSuccess = () => {
    setCreateDialogOpen(false);
    loadHomeworks();
    toast.success('Tạo bài tập thành công!');
  };

  // Only show loading if we have a selected student and are loading
  if (selectedStudent && loading && !stats) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <StudentSelector
          students={students}
          selectedStudent={selectedStudent}
          onSelect={setSelectedStudent}
        />

        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo bài tập mới
        </Button>
      </div>

      {/* Stats */}
      {selectedStudent && stats && <HomeworkStats stats={stats} />}

      {/* Homework List */}
      <div className="space-y-4">
        {!selectedStudent ? (
          <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed rounded-lg border-muted-foreground/25">
            <div className="p-4 bg-muted/50 rounded-full mb-4">
              <Plus className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-medium text-muted-foreground">Chưa chọn học sinh</h3>
            <p className="text-sm text-muted-foreground/80 max-w-xs mt-1">
              Vui lòng chọn một học sinh từ danh sách bên trên để xem và quản lý bài tập.
            </p>
          </div>
        ) : homeworks.length === 0 ? (
          <EmptyState onCreateClick={() => setCreateDialogOpen(true)} />
        ) : (
          homeworks.map((homework) => (
            <HomeworkCard
              key={homework.id}
              homework={homework}
              onClick={() => setSelectedHomework(homework)}
            />
          ))
        )}
      </div>

      {/* Dialogs */}
      {selectedStudent && (
        <CreateHomeworkDialog
          studentId={selectedStudent}
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {selectedHomework && (
        <TutorHomeworkDetailDialog
          homework={selectedHomework}
          open={!!selectedHomework}
          onClose={() => setSelectedHomework(null)}
          onUpdate={loadHomeworks}
          onDelete={deleteHomework}
        />
      )}
    </div>
  );
}