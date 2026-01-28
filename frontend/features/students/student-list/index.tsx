import { useStudents } from '@/features/students/student-list/hooks/useStudents';
import { useStudentFilters } from '@/features/students/student-list/hooks/useStudentFilters';
import { useStudentModals } from '@/features/students/student-list/hooks/useStudentModals';
import { useAddSession } from '@/features/students/student-list/hooks/useAddSession';
import { StudentListHeader } from '@/features/students/student-list/components/StudentListHeader';
import { FilterTabs } from '@/features/students/student-list/components/FilterTabs';
import { StudentGrid } from '@/features/students/student-list/components/StudentGrid';
import { StudentListSkeleton } from '@/features/students/student-list/components/StudentCardSkeleton';
import { StudentListModals } from '@/features/students/student-list/components/StudentListModals';

/**
 * StudentList Feature
 * Main entry point for student management.
 * Adheres to 50-line SOP by delegating to hooks and sub-components.
 */
export default function StudentList() {
  const { students, loading, loadStudents, deleteStudent } = useStudents();
  const {
    filterStatus, setFilterStatus, searchTerm, setSearchTerm,
    filteredStudents, activeCount, inactiveCount,
  } = useStudentFilters(students);
  const modals = useStudentModals();
  const handleLoadStudents = async () => { await loadStudents(); };
  const { handleAddSessionSubmit } = useAddSession(handleLoadStudents, modals.closeAddSession);

  if (loading) return (
    <div className="space-y-8">
      <div className="h-32 w-full bg-muted/30 animate-pulse rounded-3xl" />
      <div className="h-12 w-64 bg-muted/30 animate-pulse rounded-xl" />
      <StudentListSkeleton />
    </div>
  );

  return (
    <div className="space-y-8">
      <StudentListHeader
        activeCount={activeCount} inactiveCount={inactiveCount}
        searchTerm={searchTerm} onSearchChange={setSearchTerm}
        onAddClick={modals.openCreate}
      />
      <FilterTabs filterStatus={filterStatus} onFilterChange={setFilterStatus} />
      <StudentGrid
        students={filteredStudents}
        onEdit={modals.openEdit}
        onDelete={deleteStudent}
        onSchedule={modals.openSchedule}
        onAddSession={modals.openAddSession}
      />
      <StudentListModals
        modals={modals}
        students={students}
        loadStudents={handleLoadStudents}
        handleAddSessionSubmit={handleAddSessionSubmit}
      />
    </div>
  );
}
