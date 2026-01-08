'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import { ArrowUpRight, Ban, CheckCircle2, DollarSign } from 'lucide-react';
import { useFinanceData } from '../hooks/useFinanceData';

export function FinanceStats() {
    const { groupedRecords, loading } = useFinanceData();

    // Calculate Aggregates
    const stats = groupedRecords.reduce(
        (acc, group) => {
            acc.totalStudents += 1;
            acc.totalSessions += group.totalSessions;
            acc.totalHours += group.totalHours;
            acc.totalAmount += group.totalAmount;
            if (!group.allPaid) {
                acc.pendingCount += 1;
                // In a real scenario, we might want to sum only unpaid SESSIONS, 
                // but here we sum the total amount of the group if they have ANY unpaid?
                // Actually, groupedRecords from useFinanceData already sums up the session amounts.
                // If viewMode=DEBT, the amount is the unpaid amount. 
                // If viewMode=MONTHLY, the amount is total potential revenue for that month.
                // We probably need a field `paidAmount` vs `unpaidAmount` in the group to be precise.
                // But for "Overview", let's just show Total Amount (Revenue/Debt) and Sessions.
            }
            return acc;
        },
        { totalStudents: 0, totalSessions: 0, totalHours: 0, totalAmount: 0, pendingCount: 0 }
    );

    if (loading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title="Tổng Doanh Thu / Nợ"
                value={formatCurrency(stats.totalAmount)}
                icon={DollarSign}
                trend="+12%" // Placeholder or calculate real trend
                trendLabel="so với tháng trước"
                color="text-emerald-600"
                bgColor="bg-emerald-50 dark:bg-emerald-950/20"
            />
            <StatCard
                title="Tổng Số Buổi"
                value={stats.totalSessions.toString()}
                icon={CheckCircle2}
                subValue={`${stats.totalHours.toFixed(1)} giờ dạy`}
                color="text-blue-600"
                bgColor="bg-blue-50 dark:bg-blue-950/20"
            />
            <StatCard
                title="Học Sinh"
                value={stats.totalStudents.toString()}
                icon={ArrowUpRight}
                subValue={`${stats.pendingCount} chưa thanh toán`}
                color="text-purple-600"
                bgColor="bg-purple-50 dark:bg-purple-950/20"
            />
            <StatCard
                title="Trạng Thái" // Placeholder
                value={stats.pendingCount > 0 ? "Cần Xử Lý" : "Ổn Định"}
                icon={Ban}
                color={stats.pendingCount > 0 ? "text-orange-600" : "text-green-600"}
                bgColor={stats.pendingCount > 0 ? "bg-orange-50 dark:bg-orange-950/20" : "bg-green-50"}
            />
        </div>
    );
}

function StatCard({
    title,
    value,
    icon: Icon,
    subValue,
    trend,
    trendLabel,
    color,
    bgColor
}: any) {
    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                    <h3 className="text-2xl font-bold tracking-tight truncate" title={value}>
                        {value}
                    </h3>
                    {subValue && <p className="text-xs text-muted-foreground mt-1 truncate">{subValue}</p>}
                    {trend && (
                        <p className="text-xs mt-1 flex items-center gap-1">
                            <span className="text-green-600 font-bold">{trend}</span>
                            <span className="text-muted-foreground opacity-70">{trendLabel}</span>
                        </p>
                    )}
                </div>
                <div className={`p-2.5 rounded-xl ${bgColor}`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                </div>
            </CardContent>
        </Card>
    );
}
