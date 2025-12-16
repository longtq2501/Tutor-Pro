
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { 
  AlertCircle, CheckCircle, XCircle, Trash2, Calendar, FileText, 
  Users, Mail, Loader2 
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

interface StudentGroup {
  studentId: number;
  studentName: string;
  pricePerHour: number;
  sessions: SessionRecord[];
  totalSessions: number;
  totalHours: number;
  totalAmount: number;
  months: Set<string>;
}

export default function UnpaidSessionsView() {
  const [records, setRecords] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSessions, setSelectedSessions] = useState<number[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

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
      setSelectedSessions(selectedSessions.filter(id => !allSessionIds.includes(id)));
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
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
      const sessionIds = selectedSessions; 
      if (sessionIds.length === 0) {
        alert('Vui lòng chọn ít nhất một buổi học!');
        setSendingEmail(false);
        return;
      }
      const result = await invoicesApi.sendInvoiceEmailBatch({
          selectedStudentIds: selectedStudents,
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
  }, {} as Record<number, StudentGroup>);

  const groupedRecordsArray = Object.values(groupedRecords) as StudentGroup[];

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-lg p-6 transition-colors border border-border">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <AlertCircle className="text-orange-600 dark:text-orange-500" size={32} />
        <h2 className="text-2xl font-bold text-card-foreground">Buổi học chưa thanh toán</h2>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800/30">
          <p className="text-sm text-muted-foreground mb-1">Tổng chưa thanh toán</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {formatCurrency(totalUnpaid)}
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800/30">
          <p className="text-sm text-muted-foreground mb-1">Số buổi học</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalSessions} buổi</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800/30">
          <p className="text-sm text-muted-foreground mb-1">Số học sinh</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{groupedRecordsArray.length} HS</p>
        </div>
      </div>

      {/* Action Section */}
      {records.length > 0 && (
        <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 rounded-2xl border-2 border-orange-200 dark:border-orange-800/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Users className="text-orange-600 dark:text-orange-500" size={24} />
              <h3 className="text-xl font-bold text-card-foreground">Thanh toán & Gửi báo giá</h3>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSelectAll}
                className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-lg font-medium transition-colors border border-orange-200 dark:border-orange-800/50"
              >
                {selectAll ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </button>
              <div className="text-sm text-muted-foreground">
                Đã chọn: <span className="font-bold text-orange-600 dark:text-orange-400">{selectedSessions.length}/{totalSessions}</span> buổi
              </div>
            </div>
          </div>

          {selectedSessions.length > 0 && (
            <div className="mb-4 p-4 bg-white dark:bg-card rounded-xl border border-orange-200 dark:border-orange-800/50 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Buổi đã chọn</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedTotal.totalSessions} buổi</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Tổng giờ</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedTotal.totalHours} giờ</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Tổng tiền</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-border">
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

            <div className="p-6 text-card-foreground">
              {emailResult.summary && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Tổng số</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{emailResult.summary.total}</p>
                  </div>
                  <div className="text-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Đã gửi</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{emailResult.summary.sent}</p>
                  </div>
                  <div className="text-center p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Thất bại</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{emailResult.summary.failed || 0}</p>
                  </div>
                </div>
              )}

              {emailResult.successDetails && emailResult.successDetails.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-card-foreground mb-3">Email đã gửi:</h4>
                  <div className="space-y-2">
                    {emailResult.successDetails.map((detail, index) => (
                      <div key={index} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/50">
                        <p className="font-medium">{detail.student}</p>
                        <p className="text-sm text-muted-foreground">
                          {detail.parent} • {detail.email}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {emailResult.errors && emailResult.errors.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-card-foreground mb-3">Lỗi:</h4>
                  <div className="space-y-2">
                    {emailResult.errors.map((error, index) => (
                      <div key={index} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-700 dark:text-red-400">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {emailResult.message && !emailResult.summary && (
                <div className={`p-4 rounded-lg ${
                  emailResult.success 
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300' 
                    : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                }`}>
                  {emailResult.message}
                </div>
              )}

              <button
                onClick={() => {
                  setShowEmailResult(false);
                  setEmailResult(null);
                }}
                className="w-full mt-6 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold py-3 px-6 rounded-xl transition-colors"
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
          <p className="text-muted-foreground text-lg">Tuyệt vời! Không có buổi học nào chưa thanh toán</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedRecordsArray.map((group) => {
            const allSessionIds = group.sessions.map(s => s.id);
            const isStudentSelected = allSessionIds.every(id => selectedSessions.includes(id));

            return (
              <div
                key={group.studentId}
                className={`border rounded-xl p-5 transition-all ${
                  isStudentSelected
                    ? 'border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/10'
                    : 'border-border bg-card'
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
                      <h3 className="text-lg font-bold text-card-foreground mb-1">
                        {group.studentName}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full font-medium">
                          {group.totalSessions} buổi × 2h = {group.totalHours}h
                        </span>
                        <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full font-medium">
                          {Array.from(group.months).map(m => getMonthName(m)).join(', ')}
                        </span>
                        <span className="font-semibold text-foreground">
                          Tổng: {formatCurrency(group.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sessions Grid */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {group.sessions
                      .sort((a, b) => a.sessionDate.localeCompare(b.sessionDate))
                      .map((session) => (
                        <div
                          key={session.id}
                          className={`relative group border rounded-lg p-3 cursor-pointer transition-all ${
                            selectedSessions.includes(session.id)
                              ? 'bg-orange-100 border-orange-300 dark:bg-orange-900/30 dark:border-orange-600'
                              : 'bg-card border-border hover:border-orange-300 dark:hover:border-orange-500'
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
                                <Calendar size={12} className="text-muted-foreground" />
                                <span className="text-xs font-semibold text-card-foreground">
                                  {formatDate(session.sessionDate)}
                                </span>
                              </div>

                              <div className="flex items-center gap-[5px] mb-1">
                                {session.completed ? (
                                  <span className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                                    <CheckCircle size={10} />
                                    Đã dạy
                                  </span>
                                ) : (
                                  <span className="text-xs text-muted-foreground italic">
                                    Dự kiến
                                  </span>
                                )}
                              </div>

                              <div className="text-xs text-muted-foreground">
                                {getMonthName(session.month)}
                              </div>
                              <div className="text-xs font-medium text-orange-600 dark:text-orange-400 mt-1">
                                {formatCurrency(session.totalAmount)}
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRecord(session.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 p-1 rounded"
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
