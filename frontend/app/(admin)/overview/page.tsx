'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Download, Filter, Plus } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { RevenueChart } from '@/features/admin/overview/RevenueChart';
import { QuickStats } from '@/features/admin/overview/QuickStats';
import { RecentTutors } from '@/features/admin/overview/RecentTutors';
import { ActivityFeed } from '@/features/admin/overview/ActivityFeed';
import { adminStatsApi } from '@/lib/services/admin-stats';
import type { OverviewStats, MonthlyRevenue } from '@/lib/types/admin';

export default function OverviewPage() {
    const [stats, setStats] = useState<OverviewStats | null>(null);
    const [revenue, setRevenue] = useState<MonthlyRevenue[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [overviewData, revenueData] = await Promise.all([
                    adminStatsApi.getOverview(),
                    adminStatsApi.getMonthlyRevenue(6)
                ]);
                setStats(overviewData);
                setRevenue(revenueData);
            } catch (error) {
                console.error('Failed to fetch overview data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const statCards = [
        {
            label: 'Tổng Doanh Thu',
            value: stats?.totalRevenueAllTime || '0 ₫',
            badge: { text: 'All time', variant: 'green' as const },
            glowColor: '#22c55e',
        },
        {
            label: 'Tổng Gia Sư',
            value: (stats?.totalTutors || 0).toString(),
            badge: { text: `${stats?.proAccounts || 0} Pro`, variant: 'accent' as const },
            glowColor: '#6366f1',
        },
        {
            label: 'Học Sinh Active',
            value: (stats?.activeStudents || 0).toString(),
            badge: { text: `${stats?.totalStudents || 0} Total`, variant: 'green' as const },
            glowColor: '#22c55e',
        },
        {
            label: 'Yêu Cầu Hỗ Trợ',
            value: (stats?.pendingIssues || 0).toString().padStart(2, '0'),
            badge: { text: 'Pending', variant: 'amber' as const },
            glowColor: '#f59e0b',
        },
    ];

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
                {statCards.map((stat, idx) => (
                    <StatCard key={stat.label} {...stat} index={idx} />
                ))}
            </div>

            {/* Charts Row */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                    <RevenueChart data={revenue.map(r => ({ month: r.month, value: r.totalRevenue }))} />
                </div>
                <QuickStats stats={stats} />
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
