'use client';

import { ReportExportButtons } from '@/features/reports/components/ReportExportButtons';
import { ReportForm } from '@/features/reports/components/ReportForm';
import { ReportPreview } from '@/features/reports/components/ReportPreview';
import { SessionFeedbackList } from '@/features/reports/components/SessionFeedbackList';
import { TutorCommentBox } from '@/features/reports/components/TutorCommentBox';
import { reportApi, studentsApi } from '@/lib/services';
import type { MonthlyReportData, Student } from '@/lib/types';
import { DashboardHeader } from '@/contexts/UIContext';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

function parseMonthValue(monthValue: string): { month: number; year: number } {
  const [year, month] = monthValue.split('-').map(Number);
  return { month, year };
}

function getCurrentMonthValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export default function ReportsFeature() {
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsLoaded, setStudentsLoaded] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [monthValue, setMonthValue] = useState(getCurrentMonthValue());
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportData, setReportData] = useState<MonthlyReportData | null>(null);
  const [comment, setComment] = useState('');

  const loadStudents = useCallback(async () => {
    if (studentsLoaded) return;
    try {
      const response = await studentsApi.getAll(0, 200);
      setStudents(response.content || []);
      setSelectedStudentId((prev) => prev ?? response.content?.[0]?.id ?? null);
      setStudentsLoaded(true);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải danh sách học sinh');
    }
  }, [studentsLoaded]);

  const generateReport = useCallback(async () => {
    if (!selectedStudentId || !monthValue) return;

    const { month, year } = parseMonthValue(monthValue);
    setLoadingReport(true);
    try {
      const data = await reportApi.getMonthlyReportData(selectedStudentId, month, year);
      setReportData(data);
      setComment(data.tutorComment || '');
    } catch (error) {
      console.error(error);
      toast.error('Không thể tạo báo cáo');
    } finally {
      setLoadingReport(false);
    }
  }, [monthValue, selectedStudentId]);

  const handleSaveComment = useCallback(
    async (value: string) => {
      if (!selectedStudentId) return;
      const { month, year } = parseMonthValue(monthValue);
      await reportApi.saveComment({
        studentId: selectedStudentId,
        month,
        year,
        comment: value,
      });
      setReportData((prev) => (prev ? { ...prev, tutorComment: value } : prev));
    },
    [monthValue, selectedStudentId],
  );

  const previewData = useMemo(() => {
    if (!reportData) return null;
    return {
      ...reportData,
      tutorComment: comment,
    };
  }, [comment, reportData]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  return (
    <div className="bg-transparent flex-1 flex flex-col min-h-0 h-full">
      <DashboardHeader
        title="Báo Cáo"
        subtitle="Tạo và xuất báo cáo tiến độ học sinh theo tháng."
      />

      <div className="bg-card rounded-2xl shadow-xl border border-border/40 overflow-hidden flex-1 flex flex-col min-h-0 h-full w-full p-4 sm:p-5">
        <div data-tour="reports-form" className="shrink-0 mb-4">
          <ReportForm
            students={students}
            selectedStudentId={selectedStudentId}
            monthValue={monthValue}
            isLoading={loadingReport}
            onStudentChange={setSelectedStudentId}
            onMonthChange={setMonthValue}
            onGenerate={generateReport}
          />
        </div>

        <div className="flex-1 min-h-0 flex flex-col lg:grid lg:grid-cols-[1.3fr_0.7fr] gap-4 overflow-y-auto lg:overflow-hidden">
          <div className="h-auto lg:h-full min-h-0 flex flex-col lg:overflow-y-auto pr-1 custom-scrollbar">
            {previewData ? (
              <div data-tour="reports-preview">
                <ReportPreview data={previewData} />
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground flex-1 flex items-center justify-center min-h-[220px]">
                Chọn học sinh và tháng, sau đó bấm "Tạo báo cáo" để xem preview.
              </div>
            )}
          </div>

          <div className="h-auto lg:h-full min-h-0 flex flex-col gap-4 lg:overflow-y-auto pr-1 custom-scrollbar">
            <div data-tour="reports-comment" className="shrink-0">
              <TutorCommentBox
                key={`${selectedStudentId ?? 'none'}-${monthValue}`}
                value={comment}
                disabled={!previewData}
                onChange={setComment}
                onSave={handleSaveComment}
              />
            </div>

            <div className="flex-1 min-h-0">
              <SessionFeedbackList feedbacks={previewData?.sessionFeedbacks || []} />
            </div>
          </div>
        </div>

        <div data-tour="reports-export-actions" className="shrink-0 pt-3 mt-4 border-t border-border/40">
          <ReportExportButtons
            disabled={!previewData || !selectedStudentId}
            studentId={selectedStudentId}
            data={previewData}
          />
        </div>
      </div>
    </div>
  );
}
