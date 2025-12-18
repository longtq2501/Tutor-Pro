'use client';

import { useState, useEffect } from 'react';
import { User, CheckCircle, XCircle, TrendingUp, DollarSign, Users, BarChart3 } from 'lucide-react';
import { dashboardApi } from '../lib/api';
import type { DashboardStats, MonthlyStats } from '@/lib/types';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
};

const getMonthName = (monthStr: string) => {
  const [year, month] = monthStr.split('-');
  return `Tháng ${month}/${year}`;
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [loading, setLoading] = useState(true);

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, monthlyData] = await Promise.all([
        dashboardApi.getStats(currentMonth),
        dashboardApi.getMonthlyStats(),
      ]);
      setStats(statsData);
      setMonthlyStats(monthlyData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground font-medium">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Stats Cards Grid - Responsive: 1 col mobile -> 2 cols tablet -> 4 cols desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-6">
        
        {/* Total Students */}
        <div className="bg-card rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-border group">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-muted-foreground text-xs font-bold mb-1.5 uppercase tracking-wider">Tổng Học Sinh</p>
              <h3 className="text-3xl font-extrabold text-card-foreground group-hover:text-primary transition-colors">
                {stats.totalStudents}
              </h3>
            </div>
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2.5 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
              <Users className="text-indigo-600 dark:text-indigo-400" size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20 w-fit px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800/30">
             <TrendingUp size={12} className="mr-1 flex-shrink-0" /> 
             <span className="whitespace-nowrap">Đang hoạt động</span>
          </div>
        </div>

        {/* Revenue This Month */}
        <div className="bg-card rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-border group">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-muted-foreground text-xs font-bold mb-1.5 uppercase tracking-wider">Doanh Thu Tháng</p>
              <h3 className="text-xl xl:text-2xl font-extrabold text-card-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight break-all">
                {formatCurrency(stats.currentMonthTotal)}
              </h3>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
              <BarChart3 className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground font-medium truncate">
             Cập nhật thời gian thực
          </div>
        </div>

        {/* Total Paid */}
        <div className="bg-card rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-border group">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-muted-foreground text-xs font-bold mb-1.5 uppercase tracking-wider">Tổng Đã Thu</p>
              <h3 className="text-xl xl:text-2xl font-extrabold text-card-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight break-all">
                {formatCurrency(stats.totalPaidAllTime)}
              </h3>
            </div>
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2.5 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
              <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={20} />
            </div>
          </div>
          <div className="mt-3 w-full bg-emerald-100 dark:bg-emerald-900/30 rounded-full h-1.5">
            <div className="bg-emerald-500 dark:bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
          </div>
        </div>

        {/* Total Unpaid */}
        <div className="bg-card rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-border group">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-muted-foreground text-xs font-bold mb-1.5 uppercase tracking-wider">Chưa Thu</p>
              <h3 className="text-xl xl:text-2xl font-extrabold text-card-foreground group-hover:text-destructive transition-colors leading-tight break-all">
                {formatCurrency(stats.totalUnpaidAllTime)}
              </h3>
            </div>
            <div className="bg-rose-100 dark:bg-rose-900/30 p-2.5 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
              <XCircle className="text-rose-600 dark:text-rose-400" size={20} />
            </div>
          </div>
          <div className="mt-3 w-full bg-rose-100 dark:bg-rose-900/30 rounded-full h-1.5">
            <div className="bg-rose-500 dark:bg-rose-500 h-1.5 rounded-full transition-all duration-500" style={{ width: '25%' }}></div>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Chart List */}
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
          {monthlyStats.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-border">
               <DollarSign className="mx-auto text-muted-foreground mb-2" size={32} />
               <p className="text-muted-foreground font-medium">Chưa có dữ liệu doanh thu</p>
            </div>
          ) : (
            <div className="space-y-5 lg:space-y-6">
              {monthlyStats.slice(0, 6).map((month) => {
                const total = month.totalPaid + month.totalUnpaid;
                const paidPercentage = total > 0 ? (month.totalPaid / total) * 100 : 0;
                
                return (
                  <div key={month.month} className="group">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-2">
                      <div className="flex flex-col">
                        <span className="font-bold text-card-foreground text-base lg:text-lg group-hover:text-primary transition-colors">
                          {getMonthName(month.month)}
                        </span>
                        <span className="text-xs text-muted-foreground font-bold">
                           Tổng: {formatCurrency(total)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="text-base lg:text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(month.totalPaid)}
                        </div>
                        {month.totalUnpaid > 0 && (
                          <div className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30 px-2 py-0.5 rounded-full">
                            Nợ: {formatCurrency(month.totalUnpaid)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 lg:h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-400 to-emerald-600 dark:from-emerald-600 dark:to-emerald-400 h-full rounded-full transition-all duration-500 ease-out relative"
                        style={{ width: `${paidPercentage}%` }}
                      >
                         <div className="absolute inset-0 bg-white/20"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}