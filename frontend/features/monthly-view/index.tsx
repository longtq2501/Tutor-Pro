// 📁 monthly-view/index.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { useMonthlyRecords } from './hooks/useMonthlyRecords';
import { useAutoGenerate } from './hooks/useAutoGenerate';
import { useStudentSelection } from './hooks/useStudentSelection';
import { useInvoiceActions } from './hooks/useInvoiceActions';
import { groupRecordsByStudent, calculateTotalStats, calculateSelectedStats } from './utils/groupRecords';
import { MonthSelector } from './components/MonthSelector';
import { AutoGenerateBanner } from './components/AutoGenerateBanner';
import { BulkActionsToolbar } from './components/BulkActionsToolbar';
import { StudentCard } from './components/StudentCard';
import { EmailResultModal } from './components/EmailResultModal';
import { EmptyState } from './components/EmptyState';

export default function MonthlyView() {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [emailResult, setEmailResult] = useState<any>(null);

  const { records, loading, loadRecords, togglePayment, deleteRecord } = useMonthlyRecords(selectedMonth);
  const autoGen = useAutoGenerate(selectedMonth);
  const groupedRecordsArray = useMemo(() => groupRecordsByStudent(records), [records]);
  const selection = useStudentSelection(groupedRecordsArray);
  const invoice = useInvoiceActions();

  const totalStats = useMemo(() => calculateTotalStats(records), [records]);
  const groupedRecordsMap = useMemo(() => {
    return groupedRecordsArray.reduce((acc, g) => {
      acc[g.studentId] = g;
      return acc;
    }, {} as Record<number, any>);
  }, [groupedRecordsArray]);
  const selectedStats = useMemo(
    () => calculateSelectedStats(selection.selectedStudents, groupedRecordsMap),
    [selection.selectedStudents, groupedRecordsMap]
  );

  const changeMonth = (direction: number) => {
    const date = new Date(selectedMonth + '-01');
    date.setMonth(date.getMonth() + direction);
    setSelectedMonth(date.toISOString().slice(0, 7));
    selection.clear();
  };

  const handleAutoGenerate = () => {
    autoGen.generate(loadRecords);
  };

  const handleGenerateCombinedInvoice = async () => {
    if (selection.selectedStudents.length === 0) return;
    const allSessionIds = selection.selectedStudents.flatMap(
      id => groupedRecordsMap[id]?.sessions.map((s: any) => s.id) || []
    );
    await invoice.generateCombined(selection.selectedStudents, selectedMonth, allSessionIds);
  };

  const handleSendEmail = async () => {
    if (selection.selectedStudents.length === 0) return;
    const result = await invoice.sendEmail(selection.selectedStudents, selectedMonth);
    if (result) {
      setEmailResult(result);
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
      <MonthSelector
        selectedMonth={selectedMonth}
        totalStats={totalStats}
        onMonthChange={changeMonth}
      />

      {autoGen.showPrompt && (
        <AutoGenerateBanner
          count={autoGen.count}
          generating={autoGen.generating}
          onGenerate={handleAutoGenerate}
          onDismiss={autoGen.dismiss}
        />
      )}

      <BulkActionsToolbar
        selectAll={selection.selectAll}
        selectedCount={selection.selectedStudents.length}
        selectedStats={selectedStats}
        isGenerating={autoGen.generating}
        generatingInvoice={invoice.generating}
        sendingEmail={invoice.sending}
        onToggleSelectAll={selection.toggleAll}
        onAutoGenerate={handleAutoGenerate}
        onGenerateInvoice={handleGenerateCombinedInvoice}
        onSendEmail={handleSendEmail}
      />

      <div className="grid gap-6">
        {records.length === 0 && !loading && !autoGen.showPrompt && (
          <EmptyState onAutoGenerate={handleAutoGenerate} />
        )}

        {groupedRecordsArray.map((group) => (
          <StudentCard
            key={group.studentId}
            group={group}
            isSelected={selection.selectedStudents.includes(group.studentId)}
            onToggleSelection={() => selection.toggle(group.studentId)}
            onTogglePayment={togglePayment}
            onToggleAllPayments={() => group.sessions.forEach(s => togglePayment(s.id))}
            onGenerateInvoice={() => 
              invoice.generateSingle(
                group.studentId,
                selectedMonth,
                group.sessions.map(s => s.id)
              )
            }
            onDeleteSession={deleteRecord}
          />
        ))}
      </div>

      {emailResult && (
        <EmailResultModal
          result={emailResult}
          onClose={() => setEmailResult(null)}
        />
      )}
    </div>
  );
}