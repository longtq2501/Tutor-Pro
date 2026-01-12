'use client';

import { invoicesApi, sessionsApi } from '@/lib/services';
import { useState } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useFinanceContext } from '../context/FinanceContext';
import { useFinanceData } from './useFinanceData';
import { isCancelledStatus } from '@/lib/types/lesson-status';
import type { SessionRecord } from '@/lib/types/finance';

export function useFinanceActions() {
  const { refreshData, records } = useFinanceData();
  const { selectedStudentIds, clearSelection } = useFinanceContext();
  const queryClient = useQueryClient();

  const [generatingInvoice, setGeneratingInvoice] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [showEmailResult, setShowEmailResult] = useState(false);
  const [emailResult, setEmailResult] = useState<any>(null);

  // Helper to get selected session Ids based on selected students
  const getSelectedSessionIds = () => {
    // records contains all raw sessions.
    // select sessions where studentId is in selectedStudentIds
    // AND exclude broken/cancelled sessions from financial actions
    return records
      .filter((r: SessionRecord) => selectedStudentIds.includes(r.studentId) && (!r.status || !isCancelledStatus(r.status)))
      .map((r: SessionRecord) => r.id);
  };

  const markSelectedPaid = async () => {
    const sessionIds = getSelectedSessionIds();
    if (sessionIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất một học sinh!');
      return;
    }

    if (!confirm(`Đánh dấu ${sessionIds.length} buổi học của ${selectedStudentIds.length} học sinh là đã thanh toán?`)) {
      return;
    }

    const promise = async () => {
      // Parallelize? Be careful with backend limits. Serial for safety.
      for (const id of sessionIds) {
        await sessionsApi.togglePayment(id);
      }
      await refreshData();
      // Invalidate dashboard stats to reflect payment changes
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-monthly'] });
      clearSelection();
    };

    toast.promise(promise(), {
      loading: 'Đang cập nhật thanh toán...',
      success: 'Đã cập nhật thành công!',
      error: 'Có lỗi xảy ra khi cập nhật.'
    });
  };

  const generateBulkInvoice = async () => {
    const sessionIds = getSelectedSessionIds();
    if (sessionIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất một học sinh!');
      return;
    }

    try {
      setGeneratingInvoice(true);

      // We assume the backend can handle multiple students if provided, 
      // OR we just use the first student's month?
      // Invoices typically are per month.
      // If we are in "All Time" mode, mixed months might be tricky.
      // Existing logic `useInvoiceActions` takes `studentId` and `month` from the first session.
      // Let's stick to that but pass `selectedStudentIds`.

      const firstSession = records.find(r => sessionIds.includes(r.id));
      if (!firstSession) return;

      const response = await invoicesApi.downloadInvoicePDF({
        studentId: selectedStudentIds[0], // Primary student (unused if multiple)
        month: firstSession.month, // Provide a month context 
        sessionRecordIds: sessionIds,
        multipleStudents: selectedStudentIds.length > 1,
        selectedStudentIds: selectedStudentIds
      });

      const filename = selectedStudentIds.length === 1
        ? `Bao-Gia-${selectedStudentIds[0]}.pdf`
        : `Bao-Gia-Tong-Hop-${selectedStudentIds.length}-HS.pdf`;

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Đã tải xuống báo giá!');
    } catch (error) {
      console.error('Invoice error:', error);
      toast.error('Không thể tạo báo giá.');
    } finally {
      setGeneratingInvoice(false);
    }
  };

  const sendBulkEmail = async () => {
    const sessionIds = getSelectedSessionIds();
    if (selectedStudentIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất một học sinh!');
      return;
    }

    if (!confirm(`Gửi email báo giá cho ${selectedStudentIds.length} học sinh đã chọn?`)) {
      return;
    }

    try {
      setSendingEmail(true);
      const result = await invoicesApi.sendInvoiceEmailBatch({
        selectedStudentIds: selectedStudentIds,
        sessionRecordIds: sessionIds,
        month: '' // Backend likely deduces or ignores if session IDs provided
      });
      setEmailResult(result);
      setShowEmailResult(true);
    } catch (error: any) {
      console.error('Email error:', error);
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
    clearSelection(); // Optional: clear after success?
    refreshData();
  };

  return {
    generatingInvoice,
    sendingEmail,
    showEmailResult,
    emailResult,
    markSelectedPaid,
    generateBulkInvoice,
    sendBulkEmail,
    closeEmailResult
  };
}
