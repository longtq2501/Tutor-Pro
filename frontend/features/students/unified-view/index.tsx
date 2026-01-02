import { RecurringScheduleModal } from '@/features/calendar/recurring-schedule/components/RecurringScheduleModal';
import { useStudents } from '@/features/students/student-list/hooks/useStudents';
import { recurringSchedulesApi } from '@/lib/services/recurring-schedule';
import type { RecurringSchedule } from '@/lib/types';
import { Student } from '@/lib/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AddSessionModal } from './components/AddSessionModal';
import { EnhancedAddStudentModal } from './components/EnhancedAddStudentModal';
import { OptimizedStudentGrid } from './components/OptimizedStudentGrid';
import { StudentDetailModal } from './components/StudentDetailModal';
import { UnifiedContactHeader } from './components/UnifiedContactHeader';

export default function UnifiedContactManagement() {
    const { students, loading } = useStudents();

    // State for search and filter
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);

    // Schedule & Session Modals
    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
    const [sessionModalOpen, setSessionModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [existingSchedule, setExistingSchedule] = useState<RecurringSchedule | null>(null);
    const [isFetchingSchedule, setIsFetchingSchedule] = useState(false);

    // Detail Modal State
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedStudentDetail, setSelectedStudentDetail] = useState<Student | null>(null);

    // Custom useDebounce hook logic
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Computed Stats
    const stats = useMemo(() => {
        const active = students.filter(s => s.active).length;
        const inactive = students.filter(s => !s.active).length;
        // Count unique parents
        const uniqueParents = new Set(students.filter(s => s.parentId).map(s => s.parentId));
        const parentCount = uniqueParents.size;

        // Calculate total debt
        const totalDebtValue = students.reduce((sum, s) => sum + (s.totalUnpaid || 0), 0);
        const totalDebt = new Intl.NumberFormat('vi-VN', {
            notation: "compact",
            compactDisplay: "short",
            maximumFractionDigits: 1
        }).format(totalDebtValue) + 'đ';

        return {
            active,
            inactive,
            parents: parentCount,
            totalDebt
        };
    }, [students]);

    // Filtered Students
    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            // 1. Status Filter
            if (filter === 'active' && !student.active) return false;
            if (filter === 'inactive' && student.active) return false;

            // 2. Search Filter
            if (debouncedSearchTerm) {
                const lowerTerm = debouncedSearchTerm.toLowerCase();
                const matchName = student.name.toLowerCase().includes(lowerTerm);
                const matchPhone = student.phone?.includes(debouncedSearchTerm) || false;
                const matchParent = student.parentName?.toLowerCase().includes(lowerTerm) || false;
                const matchParentPhone = student.parentPhone?.includes(debouncedSearchTerm) || false;

                return matchName || matchPhone || matchParent || matchParentPhone;
            }

            return true;
        });
    }, [students, filter, debouncedSearchTerm]);

    // Handlers
    const handleViewSchedule = useCallback((student: Student) => {
        setSelectedStudent(student);
        setScheduleModalOpen(true);
        setExistingSchedule(null);
        setIsFetchingSchedule(true);

        recurringSchedulesApi.getByStudentId(student.id).then(schedule => {
            setExistingSchedule(schedule || null);
        }).finally(() => {
            setIsFetchingSchedule(false);
        });
    }, []);

    const handleAddSession = useCallback((student: Student) => {
        setSelectedStudent(student);
        setSessionModalOpen(true);
    }, []);

    const handleAddStudent = useCallback(() => {
        setEditingStudent(null);
        setIsModalOpen(true);
    }, []);

    const handleEditStudent = useCallback((student: Student) => {
        setEditingStudent(student);
        setIsModalOpen(true);
    }, []);

    const handleViewDetails = useCallback((student: Student) => {
        setSelectedStudentDetail(student);
        setDetailModalOpen(true);
    }, []);

    return (
        <div className="container mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8 max-w-7xl">
            <UnifiedContactHeader
                stats={stats}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filter={filter}
                onFilterChange={setFilter}
                onAddStudent={handleAddStudent}
            />

            <OptimizedStudentGrid
                students={filteredStudents}
                isLoading={loading}
                onViewSchedule={handleViewSchedule}
                onAddSession={handleAddSession}
                onEdit={handleEditStudent}
                onViewDetails={handleViewDetails}
            />

            {isModalOpen && (
                <EnhancedAddStudentModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        toast.success(editingStudent ? 'Cập nhật thành công' : 'Thêm mới thành công');
                    }}
                    editingStudent={editingStudent}
                />
            )}
            {/* Recurring Schedule Modal */}
            {scheduleModalOpen && selectedStudent && (
                <RecurringScheduleModal
                    studentId={selectedStudent.id}
                    studentName={selectedStudent.name}
                    existingSchedule={existingSchedule}
                    isLoadingData={isFetchingSchedule}
                    onClose={() => setScheduleModalOpen(false)}
                    onSuccess={() => {
                        setScheduleModalOpen(false);
                        toast.success('Cập nhật lịch cố định thành công');
                    }}
                />
            )}

            {/* Add Session Modal */}
            {sessionModalOpen && selectedStudent && (
                <AddSessionModal
                    open={sessionModalOpen}
                    onClose={() => setSessionModalOpen(false)}
                    student={selectedStudent}
                    onSuccess={() => {
                        // Optional: Refresh some stats if needed
                    }}
                />
            )}

            {/* Student Detail Modal */}
            {detailModalOpen && selectedStudentDetail && (
                <StudentDetailModal
                    open={detailModalOpen}
                    student={selectedStudentDetail}
                    onClose={() => setDetailModalOpen(false)}
                    onEdit={(s) => {
                        setDetailModalOpen(false);
                        handleEditStudent(s);
                    }}
                    onAddSession={(s) => {
                        setDetailModalOpen(false);
                        handleAddSession(s);
                    }}
                    onViewSchedule={(s) => {
                        setDetailModalOpen(false);
                        handleViewSchedule(s);
                    }}
                />
            )}
        </div>
    );
}
