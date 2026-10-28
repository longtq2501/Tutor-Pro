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

import { FileBarChart2, ArrowRight } from 'lucide-react';

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

      <div className="bg-card rounded-2xl shadow-xs border border-border/80 dark:border-border/60 overflow-hidden flex-1 flex flex-col min-h-0 h-full w-full p-4 sm:p-5">
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
              <div className="rounded-2xl border-2 border-dashed border-border/80 dark:border-border/60 bg-muted/20 dark:bg-muted/10 p-8 text-center flex-1 flex flex-col items-center justify-center min-h-[320px]">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/25 text-primary flex items-center justify-center mb-4 shadow-xs">
                  <FileBarChart2 className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-base sm:text-lg font-bold text-foreground mb-1.5">
                  Chưa có dữ liệu bản xem trước
                </h4>
                <p className="text-sm text-muted-foreground max-w-md mb-6 leading-relaxed font-medium">
                  Vui lòng chọn học sinh và tháng ở bộ lọc phía trên, sau đó bấm nút <strong className="text-foreground">&quot;Tạo báo cáo&quot;</strong> để xem tổng hợp kết quả học tập và chuyên cần.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-border/80 shadow-xs">
                    <span className="h-5 w-5 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center text-[11px]">1</span>
                    Chọn học sinh
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/60 hidden sm:inline" />
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-border/80 shadow-xs">
                    <span className="h-5 w-5 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center text-[11px]">2</span>
                    Chọn tháng
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/60 hidden sm:inline" />
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary font-bold shadow-xs">
                    <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-[11px]">3</span>
                    Bấm &quot;Tạo báo cáo&quot;
                  </span>
                </div>
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

        <div data-tour="reports-export-actions" className="shrink-0 pt-3 mt-4 border-t border-border/60">
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
