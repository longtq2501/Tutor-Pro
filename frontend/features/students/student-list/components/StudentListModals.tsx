import StudentModal from '@/features/students/student-modal';
import AddSessionModal from '@/features/calendar/add-session-modal';
import { RecurringScheduleModal } from '@/features/calendar/recurring-schedule';
import { Student } from '@/lib/types';
import { StudentModalState } from '../hooks/useStudentModals';

interface StudentListModalsProps {
    modals: StudentModalState;
    students: Student[];
    loadStudents: () => Promise<void>;
    handleAddSessionSubmit: (
        studentId: number,
        sessionsCount: number,
        hoursPerSession: number,
        sessionDate: string,
        month: string,
        subject?: string,
        startTime?: string,
        endTime?: string
    ) => Promise<void>;
}

/**
 * Containment component for all modals used in the StudentList.
 */
export function StudentListModals({ modals, students, loadStudents, handleAddSessionSubmit }: StudentListModalsProps) {
    return (
        <>
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
        </>
    );
}
