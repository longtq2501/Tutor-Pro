'use client';

import { FileText, HardDrive } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DocumentsGrid } from '@/features/admin/documents/DocumentsGrid';

export default function DocumentsPage() {
    return (
        <div className="flex flex-col gap-8 pb-12">
            {/* Page Header */}
            <AdminPageHeader
                title="Tài Liệu"
                subtitle="Quản lý, kiểm duyệt và phân phối tài liệu học tập toàn hệ thống."
                category="Kho Lưu Trữ Hệ Thống"
                icon={FileText}
                actions={
                    <div className="flex items-center gap-4 px-6 py-3 bg-[var(--admin-surface2)] border border-[var(--admin-border)] rounded-2xl">
                        <HardDrive className="h-5 w-5 text-[var(--admin-text3)]" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-[var(--admin-text3)] uppercase tracking-widest">Dung lượng sử dụng</span>
                            <span className="text-sm font-bold text-[var(--admin-text)]">1.2 GB / 5 GB</span>
                        </div>
                    </div>
                }
            />

            <DocumentsGrid />
        </div>
    );
}
