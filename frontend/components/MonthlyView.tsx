// src/components/MonthlyView.tsx
'use client';

import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { sessionsApi } from '@/lib/api';
import type { SessionRecord } from '@/lib/types';

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

export default function MonthlyView() {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [records, setRecords] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, [selectedMonth]);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const response = await sessionsApi.getByMonth(selectedMonth);
      setRecords(response.data);
    } catch (error) {
      console.error('Error loading records:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeMonth = (direction: number) => {
    const date = new Date(selectedMonth + '-01');
    date.setMonth(date.getMonth() + direction);
    setSelectedMonth(date.toISOString().slice(0, 7));
  };

  const handleTogglePayment = async (id: number) => {
    try {
      await sessionsApi.togglePayment(id);
      loadRecords();
    } catch (error) {
      console.error('Error toggling payment:', error);
      alert('Không thể cập nhật trạng thái thanh toán!');
    }
  };

  const handleDeleteRecord = async (id: number) => {
    if (!confirm('Xóa bản ghi này?')) return;

    try {
      await sessionsApi.delete(id);
      loadRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Không thể xóa bản ghi!');
    }
  };

  const groupedRecords = records.reduce((acc, record) => {
    const key = record.studentId;
    if (!acc[key]) {
      acc[key] = {
        ...record,
        sessions: 0,
        hours: 0,
        totalAmount: 0,
        paid: false,  // Có thể set dựa trên logic, ví dụ: nếu tất cả paid thì true
        recordIds: []  // Để track các record ID nếu cần delete/toggle
      };
    }
    acc[key].sessions += record.sessions;
    acc[key].hours += record.hours;
    acc[key].totalAmount += record.totalAmount;
    acc[key].recordIds.push(record.id);
    // Nếu cần, set paid nếu tất cả records của học sinh đều paid
    if (record.paid) acc[key].paid = true;  // Hoặc logic khác
    return acc;
  }, {} as Record<number, SessionRecord & { recordIds: number[] }>);

  const groupedRecordsArray = Object.values(groupedRecords);
  // Tính tổng tháng từ records gốc (không group)
  const totalSessions = records.reduce((sum, r) => sum + r.sessions, 0);
  const totalPaid = records
    .filter((r) => r.paid)
    .reduce((sum, r) => sum + r.totalAmount, 0);
  const totalUnpaid = records
    .filter((r) => !r.paid)
    .reduce((sum, r) => sum + r.totalAmount, 0);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Month Selector */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => changeMonth(-1)}
          className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          {getMonthName(selectedMonth)}
        </h2>
        <button
          onClick={() => changeMonth(1)}
          className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Month Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Tổng buổi học</p>
          <p className="text-2xl font-bold text-blue-600">
            {totalSessions} buổi
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Đã thu trong tháng</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(totalPaid)}
          </p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Chưa thu trong tháng</p>
          <p className="text-2xl font-bold text-orange-600">
            {formatCurrency(totalUnpaid)}
          </p>
        </div>
      </div>

      {/* Records List */}
      {records.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="mx-auto text-gray-300 mb-4" size={64} />
          <p className="text-gray-500 text-lg">
            Chưa có buổi học nào trong tháng này
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {groupedRecordsArray.map((groupedRecord) => (
            <div
              key={groupedRecord.studentId}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-800">
                      {groupedRecord.studentName}
                    </h3>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {groupedRecord.sessions} buổi × 2h = {groupedRecord.hours}h
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{formatCurrency(groupedRecord.pricePerHour)}/giờ</span>
                    <span>•</span>
                    <span className="font-semibold text-gray-800">
                      Tổng: {formatCurrency(groupedRecord.totalAmount)}
                    </span>
                    <span>•</span>
                    <span>
                        {new Date(groupedRecord.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => groupedRecord.recordIds.forEach(id => handleTogglePayment(id))}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      groupedRecord.paid
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    }`}
                  >
                    {groupedRecord.paid ? (
                      <>
                        <CheckCircle size={16} className="inline mr-1" />
                        Đã thanh toán
                      </>
                    ) : (
                      <>
                        <XCircle size={16} className="inline mr-1" />
                        Chưa thanh toán
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Xóa tất cả bản ghi của ${groupedRecord.studentName}?`)) {
                        groupedRecord.recordIds.forEach(id => handleDeleteRecord(id));
                      }
                    }}
                    className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}