// ============================================================================
// 📁 unpaid-sessions/index.tsx  
// ============================================================================
'use client';

import { AlertCircle } from 'lucide-react';
import { useUnpaidSessions } from './hooks/useUnpaidSessions';
import { useSessionSelection } from './hooks/useSessionSelection';
import { useInvoiceActions } from './hooks/useInvoiceActions';
import { groupSessionsByStudent } from './utils/groupSessions';
import { SummaryCards } from './components/SummaryCards';
import { ActionSection } from './components/ActionSection';
import { EmailResultModal } from './components/EmailResultModal';
import { StudentGroup } from './components/StudentGroup';
import { EmptyState } from './components/EmptyState';

export default function UnpaidSessionsView() {
  const { records, loading, loadUnpaidRecords, deleteRecord } = useUnpaidSessions();
  const groupedRecords = groupSessionsByStudent(records);
  
  const {
    selectedSessions,
    selectedStudents,
    selectAll,
    selectedTotal,
    toggleSession,
    toggleStudent,
    toggleSelectAll,
    clearSelection,
  } = useSessionSelection(records, groupedRecords);

  const {
    generatingInvoice,
    sendingEmail,
    showEmailResult,
    emailResult,
    markAllPaid,
    generateCombinedInvoice,
    sendEmail,
    closeEmailResult,
  } = useInvoiceActions(records, () => {
    loadUnpaidRecords();
    clearSelection();
  });

  const totalUnpaid = records.reduce((sum, r) => sum + r.totalAmount, 0);
  const totalSessions = records.reduce((sum, r) => sum + r.sessions, 0);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-lg p-6 transition-colors border border-border">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <AlertCircle className="text-orange-600 dark:text-orange-500" size={32} />
        <h2 className="text-2xl font-bold text-card-foreground">Buổi học chưa thanh toán</h2>
      </div>

      <SummaryCards
        totalUnpaid={totalUnpaid}
        totalSessions={totalSessions}
        totalStudents={groupedRecords.length}
      />

      {records.length > 0 && (
        <ActionSection
          totalSessions={totalSessions}
          selectedSessionsCount={selectedSessions.length}
          selectedStudentsCount={selectedStudents.length}
          selectedTotal={selectedTotal}
          selectAll={selectAll}
          generatingInvoice={generatingInvoice}
          sendingEmail={sendingEmail}
          onToggleSelectAll={toggleSelectAll}
          onMarkPaid={() => markAllPaid(selectedSessions)}
          onGenerateInvoice={() => generateCombinedInvoice(selectedSessions, selectedStudents)}
          onSendEmail={() => sendEmail(selectedSessions, selectedStudents)}
        />
      )}

      <EmailResultModal
        show={showEmailResult}
        result={emailResult}
        onClose={closeEmailResult}
      />

      {records.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {groupedRecords.map((group) => {
            const allSessionIds = group.sessions.map(s => s.id);
            const isStudentSelected = allSessionIds.every(id => selectedSessions.includes(id));

            return (
              <StudentGroup
                key={group.studentId}
                group={group}
                isSelected={isStudentSelected}
                selectedSessions={selectedSessions}
                onToggleStudent={() => toggleStudent(group.studentId, group)}
                onToggleSession={toggleSession}
                onDeleteSession={deleteRecord}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}