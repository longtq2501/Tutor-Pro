// src/components/Dashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { User, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import type { DashboardStats, MonthlyStats } from '@/lib/types';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
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
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Tổng học sinh</p>
              <p className="text-3xl font-bold text-indigo-600">
                {stats.totalStudents}
              </p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <User className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Tổng đã thu</p>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(stats.totalPaidAllTime)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Chưa thu</p>
              <p className="text-xl font-bold text-orange-600">
                {formatCurrency(stats.totalUnpaidAllTime)}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <XCircle className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Tháng này</p>
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency(stats.currentMonthTotal)}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Doanh thu theo tháng
        </h2>
        {monthlyStats.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Chưa có dữ liệu</p>
        ) : (
          <div className="space-y-3">
            {monthlyStats.slice(0, 6).map((month) => {
              const total = month.totalPaid + month.totalUnpaid;
              const percentage = total > 0 ? (month.totalPaid / total) * 100 : 0;

              return (
                <div key={month.month} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-800">
                      {getMonthName(month.month)}
                    </span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(month.totalPaid)}
                      </div>
                      {month.totalUnpaid > 0 && (
                        <div className="text-sm text-orange-600">
                          Chưa thu: {formatCurrency(month.totalUnpaid)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}