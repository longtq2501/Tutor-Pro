// ============================================================================
// 📁 unpaid-sessions/hooks/useInvoiceActions.ts
// ============================================================================
import { useState } from 'react';
import { sessionsApi, invoicesApi } from '@/lib/services';
import type { SessionRecord } from '@/lib/types';

export function useInvoiceActions(records: SessionRecord[], onReload: () => void) {
  const [generatingInvoice, setGeneratingInvoice] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [showEmailResult, setShowEmailResult] = useState(false);
  const [emailResult, setEmailResult] = useState<any>(null);

  const markAllPaid = async (selectedSessions: number[]) => {
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
      onReload();
    } catch (error) {
      console.error('Error marking paid:', error);
      alert('Không thể cập nhật trạng thái!');
    }
  };

  const generateCombinedInvoice = async (selectedSessions: number[], selectedStudents: number[]) => {
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

  const sendEmail = async (selectedSessions: number[], selectedStudents: number[]) => {
    if (selectedStudents.length === 0) {
      alert('Vui lòng chọn ít nhất một học sinh!');
      return;
    }
    if (!confirm(`Gửi email báo giá cho ${selectedStudents.length} học sinh đã chọn?`)) {
      return;
    }
    try {
      setSendingEmail(true);
      const result = await invoicesApi.sendInvoiceEmailBatch({
        selectedStudentIds: selectedStudents,
        sessionRecordIds: selectedSessions,
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

  const closeEmailResult = () => {
    setShowEmailResult(false);
    setEmailResult(null);
  };

  return {
    generatingInvoice,
    sendingEmail,
    showEmailResult,
    emailResult,
    markAllPaid,
    generateCombinedInvoice,
    sendEmail,
    closeEmailResult,
  };
}