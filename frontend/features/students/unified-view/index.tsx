import React, { useState, useMemo } from 'react';
import { UnifiedContactHeader } from './components/UnifiedContactHeader';
import { OptimizedStudentGrid } from './components/OptimizedStudentGrid';
import { useStudents } from '@/features/students/student-list/hooks/useStudents';
import { Student } from '@/lib/types';
import { toast } from 'sonner';
import { EnhancedAddStudentModal } from './components/EnhancedAddStudentModal';
import { RecurringScheduleModal } from '@/features/calendar/recurring-schedule/components/RecurringScheduleModal';
import { AddSessionModal } from './components/AddSessionModal';
import { recurringSchedulesApi } from '@/lib/services/recurring-schedule';
import type { RecurringSchedule } from '@/lib/types';

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
            if (searchTerm) {
                const lowerTerm = searchTerm.toLowerCase();
                const matchName = student.name.toLowerCase().includes(lowerTerm);
                const matchPhone = student.phone?.includes(searchTerm) || false;
                const matchParent = student.parentName?.toLowerCase().includes(lowerTerm) || false;
                const matchParentPhone = student.parentPhone?.includes(searchTerm) || false;

                return matchName || matchPhone || matchParent || matchParentPhone;
            }

            return true;
        });
    }, [students, filter, searchTerm]);

    // Handlers
    const handleViewSchedule = (student: Student) => {
        setSelectedStudent(student);
        setScheduleModalOpen(true);
        setExistingSchedule(null);
        setIsFetchingSchedule(true);

        recurringSchedulesApi.getByStudentId(student.id).then(schedule => {
            setExistingSchedule(schedule || null);
        }).finally(() => {
            setIsFetchingSchedule(false);
        });
    };

    const handleAddSession = (student: Student) => {
        setSelectedStudent(student);
        setSessionModalOpen(true);
    };

    const handleAddStudent = () => {
        setEditingStudent(null);
        setIsModalOpen(true);
    };

    const handleEditStudent = (student: Student) => {
        setEditingStudent(student);
        setIsModalOpen(true);
    };

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
        </div>
    );
}
