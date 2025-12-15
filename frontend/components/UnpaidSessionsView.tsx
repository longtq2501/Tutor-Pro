/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { 
  AlertCircle, CheckCircle, XCircle, Trash2, Calendar, FileText, 
  Users, Mail, Loader2, DollarSign 
} from 'lucide-react';
import { sessionsApi, invoicesApi } from '@/lib/api';
import type { SessionRecord } from '@/lib/types';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const getMonthName = (monthStr: string) => {
  const [year, month] = monthStr.split('-');
  return `${month}/${year}`;
};

export default function UnpaidSessionsView() {
  const [records, setRecords] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSessions, setSelectedSessions] = useState<number[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  // Email result modal state
  const [showEmailResult, setShowEmailResult] = useState(false);
  const [emailResult, setEmailResult] = useState<{
    success: boolean;
    summary?: any;
    successDetails?: any[];
    errors?: string[];
    message?: string;
  } | null>(null);

  useEffect(() => {
    loadUnpaidRecords();
  }, []);

  const loadUnpaidRecords = async () => {
    try {
      setLoading(true);
      // Fetch all unpaid sessions
      const response = await sessionsApi.getUnpaid();
      setRecords(response);
      setSelectedSessions([]);
      setSelectedStudents([]);
      setSelectAll(false);
    } catch (error) {
      console.error('Error loading unpaid records:', error);
      alert('Không thể tải danh sách buổi học chưa thanh toán!');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePayment = async (id: number) => {
    try {
      await sessionsApi.togglePayment(id);
      loadUnpaidRecords();
    } catch (error) {
      console.error('Error toggling payment:', error);
      alert('Không thể cập nhật trạng thái thanh toán!');
    }
  };

  const handleDeleteRecord = async (id: number) => {
    if (!confirm('Xóa buổi học này?')) return;

    try {
      await sessionsApi.delete(id);
      loadUnpaidRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Không thể xóa buổi học!');
    }
  };

  const toggleSessionSelection = (sessionId: number) => {
    if (selectedSessions.includes(sessionId)) {
      setSelectedSessions(selectedSessions.filter(id => id !== sessionId));
    } else {
      setSelectedSessions([...selectedSessions, sessionId]);
    }
  };

  const toggleStudentSelection = (studentId: number) => {
    const group = groupedRecords[studentId];
    if (!group) return;

    const allSessionIds = group.sessions.map(s => s.id);
    const allSelected = allSessionIds.every(id => selectedSessions.includes(id));

    if (allSelected) {
      // Bỏ chọn tất cả buổi của học sinh này
      setSelectedSessions(selectedSessions.filter(id => !allSessionIds.includes(id)));
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      // Chọn tất cả buổi của học sinh này
      const newSessions = [...selectedSessions, ...allSessionIds.filter(id => !selectedSessions.includes(id))];
      setSelectedSessions(newSessions);
      if (!selectedStudents.includes(studentId)) {
        setSelectedStudents([...selectedStudents, studentId]);
      }
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedSessions([]);
      setSelectedStudents([]);
    } else {
      const allSessionIds = records.map(r => r.id);
      const allStudentIds = Object.keys(groupedRecords).map(Number);
      setSelectedSessions(allSessionIds);
      setSelectedStudents(allStudentIds);
    }
    setSelectAll(!selectAll);
  };

  const handleMarkAllPaid = async () => {
    if (selectedSessions.length === 0) {
      alert('Vui lòng chọn ít nhất một buổi học!');
      return;
    }

    if (!confirm(`Đánh dấu ${selectedSessions.length} buổi học đã chọn là đã thanh toán?`)) {
      return;
    }

    try {
      for (const sessionId of selectedSessions) {
        await sessionsApi.togglePayment(sessionId);
      }
      alert('Đã cập nhật trạng thái thanh toán!');
      loadUnpaidRecords();
    } catch (error) {
      console.error('Error marking paid:', error);
      alert('Không thể cập nhật trạng thái!');
    }
  };

  const handleGenerateCombinedInvoice = async () => {
    if (selectedSessions.length === 0) {
      alert('Vui lòng chọn ít nhất một buổi học!');
      return;
    }

    try {
      setGeneratingInvoice(true);

      // Lấy tháng của buổi học đầu tiên đã chọn
      const firstSession = records.find(r => selectedSessions.includes(r.id));
      if (!firstSession) return;

      const response = await invoicesApi.downloadInvoicePDF({
        studentId: selectedStudents[0] || firstSession.studentId,
        month: firstSession.month,
        sessionRecordIds: selectedSessions,
        multipleStudents: selectedStudents.length > 1,
        selectedStudentIds: selectedStudents.length > 1 ? selectedStudents : undefined
      });

      const filename = selectedStudents.length === 1
        ? `Bao-Gia-Chua-Thanh-Toan.pdf`
        : `Bao-Gia-Chua-Thanh-Toan-${selectedStudents.length}-HS.pdf`;

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Không thể tạo báo giá!');
    } finally {
      setGeneratingInvoice(false);
    }
  };

  const handleSendEmail = async () => {
    if (selectedStudents.length === 0) {
      alert('Vui lòng chọn ít nhất một học sinh!');
      return;
    }
  
    if (!confirm(`Gửi email báo giá cho ${selectedStudents.length} học sinh đã chọn?`)) {
      return;
    }
  
    try {
      setSendingEmail(true);
  
      // Lấy tất cả session IDs đã chọn
      const sessionIds = selectedSessions; // Đây là danh sách ID buổi học đã chọn
      
      if (sessionIds.length === 0) {
        alert('Vui lòng chọn ít nhất một buổi học!');
        setSendingEmail(false);
        return;
      }
  
      // KHÔNG dùng month nữa, chỉ truyền sessionRecordIds
      const result = await invoicesApi.sendInvoiceEmailBatch({
          selectedStudentIds: selectedStudents, // Vẫn cần để kiểm tra cùng phụ huynh
          sessionRecordIds: sessionIds,
          month: ''
      });
  
      setEmailResult(result);
      setShowEmailResult(true);
  
    } catch (error: any) {
      console.error('Error sending email:', error);
      setEmailResult({
        success: false,
        message: error.response?.data?.error || 'Lỗi khi gửi email',
      });
      setShowEmailResult(true);
    } finally {
      setSendingEmail(false);
    }
  };

  // Group by student
  const groupedRecords = records.reduce((acc, record) => {
    const key = record.studentId;
    if (!acc[key]) {
      acc[key] = {
        studentId: record.studentId,
        studentName: record.studentName,
        pricePerHour: record.pricePerHour,
        sessions: [],
        totalSessions: 0,
        totalHours: 0,
        totalAmount: 0,
        months: new Set<string>(),
      };
    }
    acc[key].sessions.push(record);
    acc[key].totalSessions += record.sessions;
    acc[key].totalHours += record.hours;
    acc[key].totalAmount += record.totalAmount;
    acc[key].months.add(record.month);
    return acc;
  }, {} as Record<number, {
    studentId: number;
    studentName: string;
    pricePerHour: number;
    sessions: SessionRecord[];
    totalSessions: number;
    totalHours: number;
    totalAmount: number;
    months: Set<string>;
  }>);

  const groupedRecordsArray = Object.values(groupedRecords);

  const totalUnpaid = records.reduce((sum, r) => sum + r.totalAmount, 0);
  const totalSessions = records.reduce((sum, r) => sum + r.sessions, 0);

  const selectedTotal = selectedSessions.reduce((acc, sessionId) => {
    const session = records.find(r => r.id === sessionId);
    if (session) {
      acc.totalSessions += session.sessions;
      acc.totalHours += session.hours;
      acc.totalAmount += session.totalAmount;
    }
    return acc;
  }, { totalSessions: 0, totalHours: 0, totalAmount: 0 });

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
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <AlertCircle className="text-orange-600" size={32} />
        <h2 className="text-2xl font-bold text-gray-800">Buổi học chưa thanh toán</h2>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Tổng chưa thanh toán</p>
          <p className="text-2xl font-bold text-orange-600">
            {formatCurrency(totalUnpaid)}
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Số buổi học</p>
          <p className="text-2xl font-bold text-blue-600">{totalSessions} buổi</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Số học sinh</p>
          <p className="text-2xl font-bold text-purple-600">{groupedRecordsArray.length} HS</p>
        </div>
      </div>

      {/* Action Section */}
      {records.length > 0 && (
        <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border-2 border-orange-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Users className="text-orange-600" size={24} />
              <h3 className="text-xl font-bold text-gray-800">Thanh toán & Gửi báo giá</h3>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSelectAll}
                className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg font-medium transition-colors"
              >
                {selectAll ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </button>
              <div className="text-sm text-gray-600">
                Đã chọn: <span className="font-bold text-orange-600">{selectedSessions.length}/{totalSessions}</span> buổi
              </div>
            </div>
          </div>

          {selectedSessions.length > 0 && (
            <div className="mb-4 p-4 bg-white rounded-xl border border-orange-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Buổi đã chọn</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedTotal.totalSessions} buổi</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Tổng giờ</p>
                  <p className="text-2xl font-bold text-green-600">{selectedTotal.totalHours} giờ</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Tổng tiền</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(selectedTotal.totalAmount)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={handleMarkAllPaid}
              disabled={selectedSessions.length === 0}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle size={20} />
              Đánh dấu đã thanh toán
            </button>

            <button
              onClick={handleGenerateCombinedInvoice}
              disabled={generatingInvoice || selectedSessions.length === 0}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generatingInvoice ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <FileText size={20} />
                  Tải báo giá PDF
                </>
              )}
            </button>

            <button
              onClick={handleSendEmail}
              disabled={sendingEmail || selectedStudents.length === 0}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sendingEmail ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Mail size={20} />
                  Gửi email
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Email Result Modal */}
      {showEmailResult && emailResult && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className={`p-6 rounded-t-2xl ${
              emailResult.success 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                : 'bg-gradient-to-r from-red-500 to-rose-500'
            }`}>
              <div className="flex items-center gap-3 text-white">
                {emailResult.success ? (
                  <CheckCircle size={32} />
                ) : (
                  <XCircle size={32} />
                )}
                <h3 className="text-2xl font-bold">
                  {emailResult.success ? 'Gửi email thành công!' : 'Có lỗi xảy ra'}
                </h3>
              </div>
            </div>

            <div className="p-6">
              {emailResult.summary && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Tổng số</p>
                    <p className="text-2xl font-bold text-blue-600">{emailResult.summary.total}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Đã gửi</p>
                    <p className="text-2xl font-bold text-green-600">{emailResult.summary.sent}</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-600">Thất bại</p>
                    <p className="text-2xl font-bold text-red-600">{emailResult.summary.failed || 0}</p>
                  </div>
                </div>
              )}

              {emailResult.successDetails && emailResult.successDetails.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-gray-800 mb-3">Email đã gửi:</h4>
                  <div className="space-y-2">
                    {emailResult.successDetails.map((detail, index) => (
                      <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="font-medium">{detail.student}</p>
                        <p className="text-sm text-gray-600">
                          {detail.parent} • {detail.email}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {emailResult.errors && emailResult.errors.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-gray-800 mb-3">Lỗi:</h4>
                  <div className="space-y-2">
                    {emailResult.errors.map((error, index) => (
                      <div key={index} className="p-3 bg-red-50 rounded-lg text-sm text-red-700">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {emailResult.message && !emailResult.summary && (
                <div className={`p-4 rounded-lg ${
                  emailResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {emailResult.message}
                </div>
              )}

              <button
                onClick={() => {
                  setShowEmailResult(false);
                  setEmailResult(null);
                }}
                className="w-full mt-6 bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Records List */}
      {records.length === 0 ? (
        <div className="text-center py-16">
          <CheckCircle className="mx-auto text-green-400 mb-4" size={64} />
          <p className="text-gray-500 text-lg">Tuyệt vời! Không có buổi học nào chưa thanh toán</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedRecordsArray.map((group) => {
            const allSessionIds = group.sessions.map(s => s.id);
            const isStudentSelected = allSessionIds.every(id => selectedSessions.includes(id));

            return (
              <div
                key={group.studentId}
                className={`border-2 rounded-xl p-5 transition-all ${
                  isStudentSelected
                    ? 'border-orange-300 bg-orange-50'
                    : 'border-gray-200'
                }`}
              >
                {/* Student Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={isStudentSelected}
                      onChange={() => toggleStudentSelection(group.studentId)}
                      className="h-5 w-5 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {group.studentName}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">
                          {group.totalSessions} buổi × 2h = {group.totalHours}h
                        </span>
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                          {Array.from(group.months).map(m => getMonthName(m)).join(', ')}
                        </span>
                        <span className="font-semibold text-gray-800">
                          Tổng: {formatCurrency(group.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sessions Grid */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {group.sessions
                      .sort((a, b) => a.sessionDate.localeCompare(b.sessionDate))
                      .map((session) => (
                        <div
                          key={session.id}
                          className={`relative group border-2 rounded-lg p-3 cursor-pointer transition-all ${
                            selectedSessions.includes(session.id)
                              ? 'bg-orange-100 border-orange-300'
                              : 'bg-white border-gray-200 hover:border-orange-300'
                          }`}
                          onClick={() => toggleSessionSelection(session.id)}
                        >
                          <div className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              checked={selectedSessions.includes(session.id)}
                              onChange={() => {}}
                              className="mt-1 h-4 w-4 text-orange-600 rounded"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-1 mb-1">
                                <Calendar size={12} className="text-gray-600" />
                                <span className="text-xs font-semibold text-gray-800">
                                  {formatDate(session.sessionDate)}
                                </span>
                              </div>
                              <div className="text-xs text-gray-600">
                                {getMonthName(session.month)}
                              </div>
                              <div className="text-xs font-medium text-orange-600 mt-1">
                                {formatCurrency(session.totalAmount)}
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRecord(session.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 bg-red-100 hover:bg-red-200 text-red-600 p-1 rounded"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}