
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, ChevronLeft, ChevronRight, CheckCircle, XCircle, 
  Trash2, Clock, FileText, Users, Mail, Loader2, 
  Zap, AlertTriangle, X, Check
} from 'lucide-react';
import { sessionsApi, invoicesApi, recurringSchedulesApi } from '@/lib/api';
import type { SessionRecord } from '@/lib/types';

interface GroupedRecord {
  studentId: number;
  studentName: string;
  pricePerHour: number;
  sessions: SessionRecord[];
  totalSessions: number;
  totalHours: number;
  totalAmount: number;
  allPaid: boolean;
}

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

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  });
};

export default function MonthlyView() {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [records, setRecords] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  
  const [showAutoGeneratePrompt, setShowAutoGeneratePrompt] = useState(false);
  const [autoGenerateCount, setAutoGenerateCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const [showEmailResult, setShowEmailResult] = useState(false);
  const [emailResult, setEmailResult] = useState<{
    success: boolean;
    summary?: any;
    successDetails?: any[];
    errors?: string[];
    message?: string;
  } | null>(null);

  useEffect(() => {
    loadRecords();
  }, [selectedMonth]);

  useEffect(() => {
    checkAutoGenerate();
  }, [selectedMonth]);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const response = await sessionsApi.getByMonth(selectedMonth);
      setRecords(response || []);
      setSelectedStudents([]);
      setSelectAll(false);
    } catch (error) {
      console.error('Error loading records:', error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const checkAutoGenerate = async () => {
    if (sessionStorage.getItem(`ignore_auto_${selectedMonth}`)) return;
    try {
      const checkResult = await recurringSchedulesApi.checkMonth(selectedMonth);
      if (!checkResult.hasSessions) {
        const countResult = await recurringSchedulesApi.countSessions(selectedMonth);
        if (countResult.count > 0) {
          setAutoGenerateCount(countResult.count);
          setShowAutoGeneratePrompt(true);
        } else {
          setShowAutoGeneratePrompt(false);
        }
      } else {
        setShowAutoGeneratePrompt(false);
      }
    } catch (error) {
      console.error('Error checking auto-generate:', error);
    }
  };

  const handleAutoGenerate = async () => {
    try {
      setIsGenerating(true);
      const result = await recurringSchedulesApi.generateSessions(selectedMonth);
      alert(`✅ ${result.message || 'Đã tạo xong các buổi học!'}`);
      setShowAutoGeneratePrompt(false);
      loadRecords(); 
    } catch (error) {
      console.error('Error generating sessions:', error);
      alert('❌ Không thể tạo buổi học tự động. Vui lòng thử lại.');
    } finally {
      setIsGenerating(false);
    }
  };

  const dismissAutoGenerate = () => {
    setShowAutoGeneratePrompt(false);
    sessionStorage.setItem(`ignore_auto_${selectedMonth}`, 'true');
  };

  const changeMonth = (direction: number) => {
    const date = new Date(selectedMonth + '-01');
    date.setMonth(date.getMonth() + direction);
    setSelectedMonth(date.toISOString().slice(0, 7));
  };

  const groupedRecords = useMemo<Record<number, GroupedRecord>>(() => {
    return records.reduce((acc, record) => {
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
          allPaid: true,
        };
      }
      acc[key].sessions.push(record);
      acc[key].totalSessions += record.sessions;
      acc[key].totalHours += record.hours;
      acc[key].totalAmount += record.totalAmount;
      if (!record.paid) {
        acc[key].allPaid = false;
      }
      return acc;
    }, {} as Record<number, GroupedRecord>);
  }, [records]);

  const groupedRecordsArray = useMemo<GroupedRecord[]>(() => Object.values(groupedRecords), [groupedRecords]);

  const totalStats = useMemo(() => {
    return records.reduce((acc, r) => ({
      sessions: acc.sessions + r.sessions,
      paid: acc.paid + (r.paid ? r.totalAmount : 0),
      unpaid: acc.unpaid + (!r.paid ? r.totalAmount : 0)
    }), { sessions: 0, paid: 0, unpaid: 0 });
  }, [records]);

  const selectedStudentsStats = useMemo(() => {
    return selectedStudents.reduce((acc, studentId) => {
      const group = groupedRecords[studentId];
      if (group) {
        acc.totalSessions += group.totalSessions;
        acc.totalHours += group.totalHours;
        acc.totalAmount += group.totalAmount;
      }
      return acc;
    }, { totalSessions: 0, totalHours: 0, totalAmount: 0 });
  }, [selectedStudents, groupedRecords]);

  const handleTogglePayment = async (id: number) => {
    try {
      await sessionsApi.togglePayment(id);
      loadRecords();
    } catch (error) {
      console.error('Error toggling payment:', error);
    }
  };

  const handleDeleteRecord = async (id: number) => {
    if (!confirm('Xóa buổi học này?')) return;
    try {
      await sessionsApi.delete(id);
      loadRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const handleGenerateInvoice = async (studentId: number, sessionIds: number[]) => {
    try {
      const response = await invoicesApi.downloadInvoicePDF({
        studentId,
        month: selectedMonth,
        sessionRecordIds: sessionIds,
      });

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Bao-Gia-${selectedMonth}-${studentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Không thể tạo báo giá!');
    }
  };

  const toggleStudentSelection = (studentId: number) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(groupedRecordsArray.map(g => g.studentId));
    }
    setSelectAll(!selectAll);
  };

  const handleGenerateCombinedInvoice = async () => {
    if (selectedStudents.length === 0) return;
    try {
      setGeneratingInvoice(true);
      const allSessionIds: number[] = [];
      selectedStudents.forEach(studentId => {
        groupedRecords[studentId]?.sessions.forEach(s => allSessionIds.push(s.id));
      });

      const response = await invoicesApi.downloadInvoicePDF({
        studentId: selectedStudents[0], 
        month: selectedMonth,
        sessionRecordIds: allSessionIds,
        multipleStudents: true,
        selectedStudentIds: selectedStudents
      });

      const filename = `Bao-Gia-Tong-Hop-${selectedMonth}.pdf`;
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating combined invoice:', error);
      alert('Lỗi khi tạo báo giá.');
    } finally {
      setGeneratingInvoice(false);
    }
  };

  const handleSendEmail = async () => {
    if (selectedStudents.length === 0) return;
    if (!confirm(`Gửi email báo giá cho ${selectedStudents.length} học sinh?`)) return;

    try {
      setSendingEmail(true);
      let result;
      if (selectedStudents.length === 1) {
        result = await invoicesApi.sendInvoiceEmail({
          studentId: selectedStudents[0],
          month: selectedMonth,
        });
      } else {
        result = await invoicesApi.sendInvoiceEmailBatch({
          selectedStudentIds: selectedStudents,
          month: selectedMonth,
        });
      }
      setEmailResult(result);
      setShowEmailResult(true);
    } catch (error: any) {
      console.error('Error sending email:', error);
      setEmailResult({
        success: false,
        message: error.response?.data?.error || 'Lỗi kết nối server',
      });
      setShowEmailResult(true);
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading && records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Month Selector */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold text-card-foreground min-w-[200px] text-center">
            {getMonthName(selectedMonth)}
          </h2>
          <button onClick={() => changeMonth(1)} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
            <ChevronRight size={24} />
          </button>
        </div>
        
        <div className="flex gap-4 text-sm font-medium">
             <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg">
               {totalStats.sessions} buổi học
             </div>
             <div className="px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-lg">
               Còn nợ: {formatCurrency(totalStats.unpaid)}
             </div>
        </div>
      </div>

      {/* Auto-Generate Banner */}
      {showAutoGeneratePrompt && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap size={120} />
           </div>
           
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Zap size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Thiết lập lịch tự động?</h3>
                  <p className="text-indigo-100 max-w-lg">
                    Hệ thống phát hiện tháng này chưa có lịch học. 
                    Chúng tôi có thể tự động tạo <strong>{autoGenerateCount}</strong> buổi học dựa trên lịch cố định của học sinh.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                 <button 
                    onClick={handleAutoGenerate}
                    disabled={isGenerating}
                    className="flex-1 md:flex-none whitespace-nowrap px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-md flex items-center justify-center gap-2"
                 >
                    {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                    Tạo Lịch Ngay
                 </button>
                 <button 
                    onClick={dismissAutoGenerate}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white"
                    title="Bỏ qua"
                 >
                    <X size={20} />
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Bulk Actions Toolbar */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-5 sticky top-0 z-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={selectAll}
                  onChange={toggleSelectAll}
                  className="w-5 h-5 text-primary rounded focus:ring-ring"
                />
                <span className="font-semibold text-card-foreground">Chọn tất cả</span>
              </label>
              <div className="h-6 w-px bg-border"></div>
              <span className="text-sm text-muted-foreground">
                Đã chọn: <strong className="text-primary">{selectedStudents.length}</strong> học sinh
              </span>
            </div>

            <div className="flex gap-2 w-full md:w-auto flex-wrap">
              <button
                onClick={handleAutoGenerate}
                disabled={isGenerating}
                className="flex-1 md:flex-none px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-200 dark:border-emerald-800/50"
              >
                  {isGenerating ? <Loader2 className="animate-spin" size={18}/> : <Zap size={18} />}
                  Tạo Lịch Tự Động
              </button>

              <button
                onClick={handleGenerateCombinedInvoice}
                disabled={selectedStudents.length === 0 || generatingInvoice}
                className="flex-1 md:flex-none px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-indigo-200 dark:border-indigo-800/50"
              >
                  {generatingInvoice ? <Loader2 className="animate-spin" size={18}/> : <FileText size={18} />}
                  Tải Báo Giá
              </button>
              <button
                onClick={handleSendEmail}
                disabled={selectedStudents.length === 0 || sendingEmail}
                className="flex-1 md:flex-none px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  {sendingEmail ? <Loader2 className="animate-spin" size={18}/> : <Mail size={18} />}
                  Gửi Email
              </button>
            </div>
        </div>

        {/* Selected Summary */}
        {selectedStudents.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border flex gap-6 text-sm">
              <div>
                  <span className="text-muted-foreground">Số buổi:</span> 
                  <span className="ml-2 font-bold text-foreground">{selectedStudentsStats.totalSessions}</span>
              </div>
              <div>
                  <span className="text-muted-foreground">Thành tiền:</span> 
                  <span className="ml-2 font-bold text-primary">{formatCurrency(selectedStudentsStats.totalAmount)}</span>
              </div>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6">
        {records.length === 0 && !loading && !showAutoGeneratePrompt && (
           <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
              <Calendar className="mx-auto text-muted-foreground mb-4" size={64} />
              <p className="text-muted-foreground text-lg">Không có dữ liệu buổi học cho tháng này.</p>
              <button 
                  onClick={handleAutoGenerate}
                  className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
              >
                  <Zap size={18} />
                  Tạo Lịch Tự Động Ngay
              </button>
           </div>
        )}

        {groupedRecordsArray.map((group) => (
          <div 
            key={group.studentId}
            className={`bg-card rounded-xl border transition-all duration-200 ${
              selectedStudents.includes(group.studentId) 
                ? 'border-primary ring-1 ring-ring shadow-md' 
                : 'border-border hover:border-primary/50 hover:shadow-sm'
            }`}
          >
            {/* Student Header Row */}
            <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border">
               <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(group.studentId)}
                    onChange={() => toggleStudentSelection(group.studentId)}
                    className="w-5 h-5 text-primary rounded focus:ring-ring mt-1 md:mt-0"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-card-foreground leading-tight">{group.studentName}</h3>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                       <span className="bg-muted px-2 py-0.5 rounded text-muted-foreground font-medium">
                         {group.totalSessions} buổi
                       </span>
                       <span>x {formatCurrency(group.pricePerHour)}/h</span>
                       <span className="text-border">|</span>
                       <span className="font-bold text-primary">
                         {formatCurrency(group.totalAmount)}
                       </span>
                    </div>
                  </div>
               </div>

               <div className="flex items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={() => group.sessions.forEach(s => handleTogglePayment(s.id))}
                    className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${
                       group.allPaid 
                         ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
                         : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                    }`}
                  >
                    {group.allPaid ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                    {group.allPaid ? 'Đã TT Tất Cả' : 'Chưa TT Hết'}
                  </button>
                  <button
                    onClick={() => {
                        const ids = group.sessions.map(s => s.id);
                        handleGenerateInvoice(group.studentId, ids);
                    }}
                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <FileText size={18} />
                  </button>
               </div>
            </div>

            {/* Sessions Grid */}
            <div className="p-4 bg-muted/30 rounded-b-xl">
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {group.sessions
                    .sort((a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime())
                    .map((session) => (
                      <div 
                        key={session.id}
                        className={`relative group p-3 rounded-lg border text-sm transition-all ${
                          session.paid 
                             ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50 hover:border-green-300' 
                             : 'bg-card border-border hover:border-primary/50 hover:shadow-sm'
                        }`}
                      >
                         <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-card-foreground">
                               {formatDate(session.sessionDate)}
                            </span>
                            {session.paid && <CheckCircle size={14} className="text-green-600 dark:text-green-500" />}
                         </div>
                         
                         <div className="flex items-center gap-2 text-xs mb-1">
                             <span className="text-muted-foreground">{session.hours} giờ</span>
                             {session.completed ? (
                                <span className="text-green-600 dark:text-green-400 font-medium flex items-center"><Check size={12} className="mr-0.5"/> Đã dạy</span>
                             ) : (
                                <span className="text-muted-foreground italic">Dự kiến</span>
                             )}
                         </div>

                         <div className="font-medium text-foreground">
                            {formatCurrency(session.totalAmount)}
                         </div>

                         <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button 
                               onClick={() => handleDeleteRecord(session.id)}
                               className="p-1 bg-card border border-destructive/20 text-destructive rounded hover:bg-destructive/10 shadow-sm"
                            >
                               <Trash2 size={12} />
                            </button>
                         </div>
                      </div>
                  ))}
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Results Modal */}
      {showEmailResult && emailResult && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200 border border-border">
              <div className={`p-6 text-center ${
                  emailResult.success 
                    ? 'bg-green-50 dark:bg-green-900/20' 
                    : 'bg-red-50 dark:bg-red-900/20'
              }`}>
                 <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    emailResult.success 
                        ? 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400' 
                        : 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
                 }`}>
                    {emailResult.success ? <CheckCircle size={32} /> : <AlertTriangle size={32} />}
                 </div>
                 <h3 className={`text-xl font-bold ${
                    emailResult.success 
                        ? 'text-green-800 dark:text-green-300' 
                        : 'text-red-800 dark:text-red-300'
                 }`}>
                    {emailResult.success ? 'Gửi Email Thành Công' : 'Gửi Email Thất Bại'}
                 </h3>
                 <p className="text-muted-foreground mt-2 text-sm">{emailResult.message}</p>
              </div>
              
              {emailResult.summary && (
                 <div className="p-6 border-t border-border">
                    <div className="grid grid-cols-3 gap-2 text-center mb-4">
                       <div className="p-2 bg-muted rounded-lg">
                          <div className="text-xs text-muted-foreground">Tổng</div>
                          <div className="font-bold text-foreground">{emailResult.summary.total}</div>
                       </div>
                       <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-xs text-green-600 dark:text-green-400">Thành công</div>
                          <div className="font-bold text-green-700 dark:text-green-300">{emailResult.summary.sent}</div>
                       </div>
                       <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <div className="text-xs text-red-600 dark:text-red-400">Lỗi</div>
                          <div className="font-bold text-red-700 dark:text-red-300">{emailResult.summary.failed}</div>
                       </div>
                    </div>
                 </div>
              )}

              <div className="p-4 bg-muted/30 border-t border-border">
                 <button 
                    onClick={() => setShowEmailResult(false)}
                    className="w-full py-3 bg-card border border-border text-foreground font-bold rounded-xl hover:bg-muted transition-colors"
                 >
                    Đóng
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
