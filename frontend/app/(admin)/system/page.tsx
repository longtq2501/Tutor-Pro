'use client';

import { Settings, RefreshCcw } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { SystemSettingsPanels } from '@/features/admin/system/SystemSettingsPanels';

export default function AdminSystem() {
    return (
        <div className="flex flex-col gap-8 pb-12">
            {/* Page Header */}
            <AdminPageHeader
                title="Cấu Hình Hệ Thống"
                subtitle="Quản lý các tham số vận hành, tài chính và bảo mật của toàn bộ nền tảng."
                category="Quản Trị Kỹ Thuật"
                icon={Settings}
                actions={
                    <button className="flex items-center gap-2 px-4 py-2 bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-xl text-xs font-bold text-[var(--admin-text2)] hover:text-[var(--admin-text)] transition-all">
                        <RefreshCcw className="h-4 w-4" />
                        <span>LÀM MỚI CACHE</span>
                    </button>
                }
            />

            <SystemSettingsPanels />
        </div>
    );
}
