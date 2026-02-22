'use client';

import { TrendingUp, Download, Filter, Plus } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { RevenueChart } from '@/features/admin/overview/RevenueChart';
import { QuickStats } from '@/features/admin/overview/QuickStats';
import { RecentTutors } from '@/features/admin/overview/RecentTutors';
import { ActivityFeed } from '@/features/admin/overview/ActivityFeed';
import { mainStats, revenueData } from '@/features/admin/overview/mock-data';

export default function OverviewPage() {
    return (
        <div className="flex flex-col gap-8 pb-12">
            {/* Page Header */}
            <AdminPageHeader
                title="Overview"
                subtitle="Trung tâm quản trị và theo dõi hiệu năng toàn hệ thống."
                category="Hệ Thống Phân Tích"
                icon={TrendingUp}
                actions={
                    <>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--admin-surface2)] border border-[var(--admin-border)] rounded-xl text-xs font-bold text-[var(--admin-text2)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface3)] transition-all">
                            <Filter className="h-4 w-4" />
                            <span>Bộ lọc</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--admin-surface2)] border border-[var(--admin-border)] rounded-xl text-xs font-bold text-[var(--admin-text2)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface3)] transition-all">
                            <Download className="h-4 w-4" />
                            <span>Xuất file</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--admin-accent)] text-[var(--admin-bg)] rounded-xl text-xs font-black shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:scale-105 transition-all">
                            <Plus className="h-4 w-4" />
                            <span>Thêm Metric</span>
                        </button>
                    </>
                }
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mainStats.map((stat, idx) => (
                    <StatCard key={stat.label} {...stat} index={idx} />
                ))}
            </div>

            {/* Charts Row */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                    <RevenueChart data={revenueData} />
                </div>
                <QuickStats />
            </div>

            {/* Tables Row */}
            <div className="flex flex-col lg:flex-row gap-6">
                <RecentTutors />
                <div className="w-full lg:w-[400px] flex shrink-0">
                    <ActivityFeed />
                </div>
            </div>
        </div>
    );
}
