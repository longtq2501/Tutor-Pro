// ============================================================================
// FILE: admin-dashboard/components/MonthlyRevenueChart.tsx
// ============================================================================
import { TrendingUp, DollarSign } from 'lucide-react';
import type { MonthlyChartData } from '../types/dashboard.types';
import { formatCurrency, getMonthName } from '../utils/formatters';

interface MonthlyRevenueChartProps {
  data: MonthlyChartData[];
}

const MonthBar = ({ item }: { item: MonthlyChartData }) => (
  <div className="group">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-2">
      <div className="flex flex-col">
        <span className="font-bold text-card-foreground text-base lg:text-lg group-hover:text-primary transition-colors">
          {getMonthName(item.month)}
        </span>
        <span className="text-xs text-muted-foreground font-bold">
          Tổng: {formatCurrency(item.total)}
        </span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="text-base lg:text-lg font-bold text-emerald-600 dark:text-emerald-400">
          {formatCurrency(item.totalPaid)}
        </div>
        {item.totalUnpaid > 0 && (
          <div className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30 px-2 py-0.5 rounded-full">
            Nợ: {formatCurrency(item.totalUnpaid)}
          </div>
        )}
      </div>
    </div>
    
    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 lg:h-3 overflow-hidden">
      <div
        className="bg-gradient-to-r from-emerald-400 to-emerald-600 dark:from-emerald-600 dark:to-emerald-400 h-full rounded-full transition-all duration-500 ease-out relative"
        style={{ width: `${item.paidPercentage}%` }}
      >
        <div className="absolute inset-0 bg-white/20"></div>
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-border">
    <DollarSign className="mx-auto text-muted-foreground mb-2" size={32} />
    <p className="text-muted-foreground font-medium">Chưa có dữ liệu doanh thu</p>
  </div>
);

export const MonthlyRevenueChart = ({ data }: MonthlyRevenueChartProps) => (
  <div className="bg-card rounded-2xl lg:rounded-3xl shadow-sm border border-border overflow-hidden">
    <div className="p-5 lg:p-6 border-b border-border flex items-center gap-3">
      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex-shrink-0">
        <TrendingUp className="text-indigo-600 dark:text-indigo-400" size={20} />
      </div>
      <div className="min-w-0">
        <h2 className="text-base lg:text-lg font-bold text-card-foreground">Biểu Đồ Doanh Thu</h2>
        <p className="text-xs lg:text-sm text-muted-foreground">Thống kê thu nhập theo từng tháng</p>
      </div>
    </div>

    <div className="p-5 lg:p-6">
      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-5 lg:space-y-6">
          {data.map((item) => (
            <MonthBar key={item.month} item={item} />
          ))}
        </div>
      )}
    </div>
  </div>
);
