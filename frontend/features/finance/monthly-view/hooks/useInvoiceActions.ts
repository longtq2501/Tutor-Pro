// 📁 monthly-view/hooks/useInvoiceActions.ts
import { useState } from 'react';
import { invoicesApi } from '@/lib/services';

export function useInvoiceActions() {
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);

  const generateSingle = async (studentId: number, month: string, sessionIds: number[]) => {
    try {
      const response = await invoicesApi.downloadInvoicePDF({
        studentId,
        month,
        sessionRecordIds: sessionIds,
      });

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Bao-Gia-${month}-${studentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Không thể tạo báo giá!');
    }
  };

  const generateCombined = async (studentIds: number[], month: string, allSessionIds: number[]) => {
    try {
      setGenerating(true);
      const response = await invoicesApi.downloadInvoicePDF({
        studentId: studentIds[0],
        month,
        sessionRecordIds: allSessionIds,
        multipleStudents: true,
        selectedStudentIds: studentIds,
      });

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Bao-Gia-Tong-Hop-${month}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating combined invoice:', error);
      alert('Lỗi khi tạo báo giá.');
    } finally {
      setGenerating(false);
    }
  };

  const sendEmail = async (studentIds: number[], month: string) => {
    if (!confirm(`Gửi email báo giá cho ${studentIds.length} học sinh?`)) return null;

    try {
      setSending(true);
      if (studentIds.length === 1) {
        return await invoicesApi.sendInvoiceEmail({ studentId: studentIds[0], month });
      } else {
        return await invoicesApi.sendInvoiceEmailBatch({ selectedStudentIds: studentIds, month });
      }
    } catch (error: any) {
      console.error('Error sending email:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Lỗi kết nối server',
      };
    } finally {
      setSending(false);
    }
  };

  return { generating, sending, generateSingle, generateCombined, sendEmail };
}