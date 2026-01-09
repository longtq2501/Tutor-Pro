'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { DollarSign, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import type { MonthlyChartData } from '../types/dashboard.types';
import { PremiumMonthlyRevenueBar } from './PremiumMonthlyRevenueBar';
import { RevenueGrowthChart } from './RevenueGrowthChart';
import { List, LineChart as LineChartIcon } from 'lucide-react';

interface EnhancedRevenueChartProps {
    data: MonthlyChartData[];
    isLoading?: boolean;
}

const ChartSkeleton = () => (
    <div className="space-y-3 sm:space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
                key={i}
                className="h-[88px] w-full rounded-2xl bg-muted/40 animate-pulse border border-border/50"
            />
        ))}
    </div>
);

const EmptyState = () => (
    <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-border">
        <DollarSign className="mx-auto text-muted-foreground mb-2" size={32} />
        <p className="text-muted-foreground font-medium">Chưa có dữ liệu doanh thu</p>
    </div>
);

export function EnhancedRevenueChart({ data, isLoading = false }: EnhancedRevenueChartProps) {
    const [timeRange, setTimeRange] = useState<'6m' | '1y' | 'all'>('6m');

    // Filter data based on time range
    const filteredData = (() => {
        switch (timeRange) {
            case '6m':
                return data.slice(0, 6);
            case '1y':
                return data.slice(0, 12);
            case 'all':
                return data;
            default:
                return data.slice(0, 6);
        }
    })();

    return (
        <div className="space-y-6">
            {/* Premium Header */}
            <div
                className={cn(
                    "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
                    "p-5 sm:p-6 rounded-2xl border bg-card"
                )}
            >
                <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={cn(
                        "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl",
                        "bg-gradient-to-br from-blue-500 to-purple-500",
                        "flex items-center justify-center shadow-lg"
                    )}>
                        <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>

                    {/* Title */}
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold">Biểu Đồ Doanh Thu</h2>
                        <p className="text-sm text-muted-foreground">
                            Thống kê thu nhập theo từng tháng
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Time Range Selector */}
                    <ToggleGroup
                        type="single"
                        value={timeRange}
                        onValueChange={(v) => v && setTimeRange(v as '6m' | '1y' | 'all')}
                        className="border rounded-lg p-1 bg-muted/30"
                    >
                        <ToggleGroupItem value="6m" size="sm" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                            6th
                        </ToggleGroupItem>
                        <ToggleGroupItem value="1y" size="sm" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                            1n
                        </ToggleGroupItem>
                        <ToggleGroupItem value="all" size="sm" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                            Tất cả
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>
            </div>

            {/* Content Area */}
            {isLoading ? (
                <ChartSkeleton />
            ) : filteredData.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="space-y-6">
                    {/* Always show chart */}
                    <div className="p-6 rounded-2xl border bg-card/50">
                        <RevenueGrowthChart data={filteredData} />
                    </div>

                    {/* Always show detailed list */}
                    <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground px-1 uppercase tracking-wider">
                            Chi tiết từng tháng
                        </h3>
                        {filteredData.map((month, index) => (
                            <PremiumMonthlyRevenueBar
                                key={month.month}
                                month={month}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
