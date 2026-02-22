'use client';

import { GraduationCap, UserPlus } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StudentsList } from '@/features/admin/students/StudentsList';

export default function StudentsPage() {
    return (
        <div className="flex flex-col gap-8 pb-12">
            {/* Page Header */}
            <AdminPageHeader
                title="Học Sinh"
                subtitle="Theo dõi danh sách, lộ trình học tập và trạng thái học viên."
                category="Quản Lý Học Viên"
                icon={GraduationCap}
                actions={
                    <button className="flex md:hidden items-center justify-center gap-2 px-6 py-3 bg-[var(--admin-accent)] text-[var(--admin-bg)] rounded-xl text-xs font-black shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                        <UserPlus className="h-4 w-4" />
                        <span>THÊM MỚI</span>
                    </button>
                }
            />

            <StudentsList />
        </div>
    );
}
