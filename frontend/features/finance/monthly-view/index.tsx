// 📁 monthly-view/index.tsx
'use client';

import { useMonthlyView } from './hooks/useMonthlyView';
import { MonthSelector } from './components/MonthSelector';
import { AutoGenerateBanner } from './components/AutoGenerateBanner';
import { BulkActionsToolbar } from './components/BulkActionsToolbar';
import { StudentCard } from './components/StudentCard';
import { EmailResultModal } from './components/EmailResultModal';
import { EmptyState } from './components/EmptyState';
import { MonthlyViewSkeleton } from './components/MonthlyViewSkeleton';
import { MonthlyContentSkeleton } from './components/MonthlyContentSkeleton';

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

  return (
    <div className="space-y-6">
      <MonthSelector
        selectedMonth={selectedMonth}
        totalStats={totalStats}
        onMonthChange={changeMonth}
      />

      {loading && records.length === 0 ? (
        <MonthlyContentSkeleton />
      ) : (
        <>
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
        </>
      )}

      {emailResult && (
        <EmailResultModal
          result={emailResult}
          onClose={() => setEmailResult(null)}
        />
      )}
    </div>
  );
}
