import { TrendingUp, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { formatCurrency } from '../utils/statusColors';

interface WeeklyStatsProps {
    stats: {
        total: number;
        completed: number;
        revenue: number;
        pending: number;
        hours: number;
    };
}

/**
 * WeeklyStats Component
 * 
 * Displays a compact summary of statistics for a specific week or period.
 */
export function WeeklyStats({ stats }: WeeklyStatsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-card p-4 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                    <Clock size={20} />
                </div>
                <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Tổng buổi</div>
                    <div className="text-base font-bold">{stats.total}</div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                    <CheckCircle2 size={20} />
                </div>
                <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Hoàn thành</div>
                    <div className="text-base font-bold">{stats.completed}</div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl">
                    <TrendingUp size={20} />
                </div>
                <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Dự kiến thu</div>
                    <div className="text-base font-bold">{formatCurrency(stats.revenue)}</div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl">
                    <AlertCircle size={20} />
                </div>
                <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Chờ thanh toán</div>
                    <div className="text-base font-bold">{stats.pending}</div>
                </div>
            </div>
        </div>
    );
}
