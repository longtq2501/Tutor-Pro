'use client';

import { useState, useEffect } from 'react';
import { FileText, HardDrive } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DocumentsGrid } from '@/features/admin/documents/DocumentsGrid';
import { adminDocumentsApi } from '@/lib/services/admin-documents';
import type { AdminDocumentStats } from '@/lib/types/admin';

export default function DocumentsPage() {
    const [stats, setStats] = useState<AdminDocumentStats | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminDocumentsApi.getStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch doc stats:', error);
            }
        };
        fetchStats();
    }, []);

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
                            <span className="text-sm font-bold text-[var(--admin-text)]">
                                {stats ? `${stats.totalStorageMB.toFixed(1)} MB` : '...'} / 10 GB
                            </span>
                        </div>
                    </div>
                }
            />

            <DocumentsGrid />
        </div>
    );
}
