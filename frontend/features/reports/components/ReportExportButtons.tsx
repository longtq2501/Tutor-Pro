'use client';

import { Button } from '@/components/ui/button';
import { reportApi } from '@/lib/services';
import type { MonthlyReportData } from '@/lib/types';
import html2canvas from 'html2canvas';
import { toBlob as toBlobFromHtml } from 'html-to-image';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface ReportExportButtonsProps {
  disabled: boolean;
  studentId: number | null;
  data: MonthlyReportData | null;
}

export function ReportExportButtons({ disabled, studentId, data }: ReportExportButtonsProps) {
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingPng, setExportingPng] = useState(false);

  const fileBaseName = useMemo(() => {
    if (!data) return 'BaoCao';
    const studentName = (data.studentName || 'HocSinh')
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .replace(/[^a-zA-Z0-9\s_-]/g, '')
      .trim()
      .replace(/\s+/g, '_');
    return `BaoCao_${studentName || 'HocSinh'}_T${data.month}_${data.year}`;
  }, [data]);

  const handleExportPdf = async () => {
    if (!data || !studentId) return;

    setExportingPdf(true);
    try {
      const blob = await reportApi.exportPdf(studentId, data.month, data.year);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${fileBaseName}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success('Xuất PDF thành công');
    } catch (error) {
      console.error(error);
      toast.error('Xuất PDF thất bại');
    } finally {
      setExportingPdf(false);
    }
  };

  const handleExportPng = async () => {
    const reportEl = document.getElementById('report-preview');
    if (!reportEl || !data) return;

    setExportingPng(true);
    try {
      let blob = await toBlobFromHtml(reportEl, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        style: {
          backgroundColor: '#ffffff',
          color: '#111827',
        },
      });

      if (!blob) {
        const canvas = await html2canvas(reportEl, {
          scale: 2,
          useCORS: true,
          logging: false,
          removeContainer: true,
          imageTimeout: 0,
          backgroundColor: '#ffffff',
          foreignObjectRendering: true,
          onclone: (_doc, clonedRoot) => {
            if (clonedRoot instanceof HTMLElement) {
              clonedRoot.style.backgroundColor = '#ffffff';
              clonedRoot.style.color = '#111827';
            }
          },
        });

        blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((result) => {
            if (result) {
              resolve(result);
              return;
            }
            reject(new Error('Không tạo được ảnh PNG'));
          }, 'image/png');
        });
      }

      const url = URL.createObjectURL(blob);
      try {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${fileBaseName}.png`;
        anchor.click();
      } finally {
        URL.revokeObjectURL(url);
      }

      toast.success('Xuất PNG thành công');
    } catch (error) {
      console.error(error);
      toast.error('Xuất PNG thất bại');
    } finally {
      setExportingPng(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        onClick={handleExportPdf}
        disabled={disabled || exportingPdf || exportingPng}
        className="h-10 px-5 font-bold rounded-lg shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
      >
        {exportingPdf ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            <span>Đang xuất PDF...</span>
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Xuất PDF</span>
          </>
        )}
      </Button>
      <Button
        variant="outline"
        onClick={handleExportPng}
        disabled={disabled || exportingPng || exportingPdf}
        className="h-10 px-5 font-bold rounded-lg border border-border/80 bg-background hover:bg-muted text-foreground flex items-center gap-2 shadow-xs"
      >
        {exportingPng ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
            <span>Đang xuất PNG...</span>
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Xuất ảnh PNG</span>
          </>
        )}
      </Button>
    </div>
  );
}
