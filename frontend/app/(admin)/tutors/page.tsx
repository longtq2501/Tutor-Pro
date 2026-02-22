'use client';

import { Users, UserPlus } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { TutorsList } from '@/features/admin/tutors/TutorsList';

export default function TutorsPage() {
    return (
        <div className="flex flex-col gap-8 pb-12">
            {/* Page Header */}
            <AdminPageHeader
                title="Gia Sư"
                subtitle="Quản lý danh sách, phân quyền và theo dõi hiệu suất gia sư."
                category="Quản Lý Nhân Sự"
                icon={Users}
                actions={
                    <button className="flex md:hidden items-center justify-center gap-2 px-6 py-3 bg-[var(--admin-accent)] text-[var(--admin-bg)] rounded-xl text-xs font-black shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                        <UserPlus className="h-4 w-4" />
                        <span>THÊM MỚI</span>
                    </button>
                }
            />

            <TutorsList />
        </div>
    );
}
