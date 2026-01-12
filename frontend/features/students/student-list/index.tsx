// ============================================================================
// 📁 student-list/index.tsx
// ============================================================================
'use client';

import { sessionsApi } from '@/lib/services';
import type { SessionRecordRequest } from '@/lib/types';
import { useStudents } from './hooks/useStudents';
import { useStudentFilters } from './hooks/useStudentFilters';
import { useStudentModals } from './hooks/useStudentModals';
import { StudentListHeader } from './components/StudentListHeader';
import { FilterTabs } from './components/FilterTabs';
import { StudentCard } from './components/StudentCard';
import { EmptyState } from './components/EmptyState';
import { StudentListSkeleton } from './components/StudentCardSkeleton';
import StudentModal from '@/features/students/student-modal';
import AddSessionModal from '@/features/calendar/add-session-modal';
import { RecurringScheduleModal } from '@/features/calendar/recurring-schedule';

export default function StudentList() {
  const { students, loading, loadStudents, deleteStudent } = useStudents();
  const {
    filterStatus,
    setFilterStatus,
    searchTerm,
    setSearchTerm,
    filteredStudents,
    activeCount,
    inactiveCount,
  } = useStudentFilters(students);
  const modals = useStudentModals();

  const handleAddSessionSubmit = async (
    studentId: number,
    sessionsCount: number,
    hoursPerSession: number,
    sessionDate: string,
    month: string,
    subject?: string,
    startTime?: string,
    endTime?: string
  ) => {
    try {
      const requestData: SessionRecordRequest = {
        studentId,
        month,
        sessions: sessionsCount,
        sessionDate,
        hoursPerSession,
        subject,
        startTime,
        endTime,
        status: 'SCHEDULED'
      };

      await sessionsApi.create(requestData);
      modals.closeAddSession();
      await loadStudents();
      alert(`Đã thêm buổi học thành công!`);
    } catch (error) {
      console.error('Error adding session:', error);
      alert('Không thể thêm buổi học!');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-32 w-full bg-muted/30 animate-pulse rounded-3xl" />
        <div className="h-12 w-64 bg-muted/30 animate-pulse rounded-xl" />
        <StudentListSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <StudentListHeader
        activeCount={activeCount}
        inactiveCount={inactiveCount}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={modals.openCreate}
      />

      {/* Filter Tabs */}
      <FilterTabs filterStatus={filterStatus} onFilterChange={setFilterStatus} />

      {/* Student Grid */}
      {filteredStudents.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onEdit={() => modals.openEdit(student)}
              onDelete={() => deleteStudent(student.id)}
              onSchedule={() => modals.openSchedule(student)}
              onAddSession={() => modals.openAddSession(student.id)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {modals.showModal && (
        <StudentModal
          student={modals.editingStudent}
          onClose={modals.closeStudentModal}
          onSuccess={() => {
            modals.closeStudentModal();
            loadStudents();
          }}
        />
      )}

      {modals.showAddSessionModal && modals.selectedStudentIdForSession && (
        <AddSessionModal
          onClose={modals.closeAddSession}
          onSubmit={handleAddSessionSubmit}
          students={students}
          initialStudentId={modals.selectedStudentIdForSession}
        />
      )}

      {modals.showRecurringModal && modals.selectedStudentForSchedule && (
        <RecurringScheduleModal
          studentId={modals.selectedStudentForSchedule.id}
          studentName={modals.selectedStudentForSchedule.name}
          existingSchedule={null}
          onClose={modals.closeSchedule}
          onSuccess={() => {
            modals.closeSchedule();
            loadStudents();
          }}
        />
      )}
    </div>
  );
}