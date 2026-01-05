
// ============================================================================
// 📁 tutor-homework-view/index.tsx
// ============================================================================
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useStudents } from './hooks/useStudents';
import { useHomeworks } from './hooks/useHomeworks';
import { useOptimisticHomework } from './hooks/useOptimisticHomework';
import { ExerciseLibraryPanel } from './components/ExerciseLibraryPanel';
import { StudentDropZone } from './components/StudentDropZone';
import { HomeworkStats } from './components/HomeworkStats';
import { HomeworkCard } from './components/HomeworkCard';
import { EmptyState } from './components/EmptyState';
import CreateHomeworkDialog from '@/features/learning/homework/create-homework-dialog';
import TutorHomeworkDetailDialog from '@/features/learning/homework/tutor-homework-detail';
import type { Homework, Document } from '@/lib/types';
import { addDays } from 'date-fns';

export default function TutorHomeworkView() {
  const { hasAnyRole } = useAuth();
  const isAdmin = hasAnyRole(['ADMIN']);
  const { students, selectedStudent, setSelectedStudent } = useStudents();

  // Homework management for selected student
  const { homeworks, stats, loading, loadHomeworks, deleteHomework } = useHomeworks(selectedStudent, isAdmin);
  const { mutate: assignHomework } = useOptimisticHomework();

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);

  // Handlers
  const handleDropDocument = (studentId: number, doc: Document) => {
    assignHomework({
      studentId,
      title: doc.title,
      description: `Bài tập được giao từ: ${doc.title}`,
      dueDate: addDays(new Date(), 7).toISOString(), // Default 7 days
      priority: 'MEDIUM',
      attachmentUrls: [doc.filePath],
    });
  };

  return (
    <div className="h-[calc(100vh-80px)] flex gap-6 overflow-hidden">
      {/* LEFT: Library Panel */}
      <ExerciseLibraryPanel />

      {/* RIGHT: Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto pr-2">

        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-6 pt-1">
          <div className="flex items-center gap-3">
            {selectedStudent && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedStudent(null)}
                className="rounded-full hover:bg-secondary"
              >
                <ArrowLeft size={18} />
              </Button>
            )}
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {selectedStudent
                  ? students.find(s => s.id === selectedStudent)?.name
                  : "Tổng quan bài tập"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {selectedStudent
                  ? "Quản lý bài tập chi tiết cho học sinh này"
                  : "Chọn học sinh hoặc kéo thả bài tập để giao nhanh"}
              </p>
            </div>
          </div>

          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {(selectedStudent || !students.length) ? "Tạo bài tập thủ công" : "Chọn học sinh để tạo"}
          </Button>
        </div>

        {/* VIEW MODE: STUDENT GRID vs HOMEWORK LIST */}
        {!selectedStudent ? (
          // DASHBOARD MODE: Student Grid
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-10">
            {students.map(student => (
              <StudentDropZone
                key={student.id}
                student={student}
                isSelected={false}
                onSelect={setSelectedStudent}
                onDropDocument={handleDropDocument}
              />
            ))}
            {students.length === 0 && (
              <div className="col-span-full py-10 text-center text-muted-foreground">
                Đang tải danh sách học sinh...
              </div>
            )}
          </div>
        ) : (
          // DETAIL MODE: Homework List
          <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-right-4 duration-300">
            {stats && <HomeworkStats stats={stats} />}

            <div className="space-y-3">
              {loading && !homeworks.length ? (
                <div className="py-20 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Đang tải dữ liệu...</p>
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
          </div>
        )}

      </div>

      {/* Dialogs */}
      {selectedStudent && (
        <CreateHomeworkDialog
          studentId={selectedStudent}
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSuccess={loadHomeworks}
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