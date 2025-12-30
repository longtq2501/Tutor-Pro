// 📁 monthly-view/index.tsx
'use client';

import { Loader2 } from 'lucide-react';
import { useMonthlyView } from './hooks/useMonthlyView';
import { MonthSelector } from './components/MonthSelector';
import { AutoGenerateBanner } from './components/AutoGenerateBanner';
import { BulkActionsToolbar } from './components/BulkActionsToolbar';
import { StudentCard } from './components/StudentCard';
import { EmailResultModal } from './components/EmailResultModal';
import { EmptyState } from './components/EmptyState';

export default function MonthlyView() {
  const {
    selectedMonth,
    emailResult,
    setEmailResult,
    records,
    loading,
    togglePayment,
    deleteRecord,
    autoGen,
    groupedRecordsArray,
    selection,
    invoice,
    totalStats,
    selectedStats,
    changeMonth,
    handleAutoGenerate,
    handleGenerateCombinedInvoice,
    handleSendEmail,
  } = useMonthlyView();

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
