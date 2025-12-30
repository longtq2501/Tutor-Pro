'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Filter, Download, Plus, CheckCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useUnpaidSessions } from './hooks/useUnpaidSessions';
import { useSessionSelection } from './hooks/useSessionSelection';
import { useInvoiceActions } from './hooks/useInvoiceActions';
import { groupSessionsByStudent } from './utils/groupSessions';
import { getMonthName } from './utils/formatters';
import { SummaryCards } from './components/SummaryCards';
import { ActionSection } from './components/ActionSection';
import { EmailResultModal } from './components/EmailResultModal';
import { StudentGroup } from './components/StudentGroup';
import { PremiumEmptyState } from './components/PremiumEmptyState';
import { PremiumLoadingSkeleton } from './components/PremiumLoadingSkeleton';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { PremiumActionButton } from './components/PremiumActionButton';
import { cn } from '@/lib/utils';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1
    }
  },
  exit: { opacity: 0, y: -20 }
};

export default function UnpaidSessionsView() {
  const { records, loading, loadUnpaidRecords, deleteRecord } = useUnpaidSessions();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Filter records based on search term
  const filteredRecords = React.useMemo(() => {
    if (!searchTerm.trim()) return records;
    const term = searchTerm.toLowerCase();
    return records.filter(r =>
      r.studentName.toLowerCase().includes(term) ||
      getMonthName(r.month).toLowerCase().includes(term)
    );
  }, [records, searchTerm]);

  const groupedRecords = groupSessionsByStudent(filteredRecords);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const triggerSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

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
    triggerSuccess();
  });

  const handleExportAll = () => {
    const allSessionIds = records.map(r => r.id);
    const allStudentIds = Array.from(new Set(records.map(r => r.studentId)));
    generateCombinedInvoice(allSessionIds, allStudentIds);
  };

  const totalUnpaid = records.reduce((sum, r) => sum + r.totalAmount, 0);
  const totalSessions = records.reduce((sum, r) => sum + r.sessions, 0);
  const filteredTotalSessions = filteredRecords.length;

  if (loading && records.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PremiumLoadingSkeleton />
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl sm:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60"
          >
            Công Nợ
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-muted-foreground font-medium"
          >
            Chào mừng trở lại, <span className="text-foreground">Quản Trị Viên</span>
          </motion.p>
        </div>

        {/* Quick Actions (Desktop) */}
        <div className="hidden sm:flex items-center gap-3">
          <AnimatePresence>
            {isSearching && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <input
                  type="text"
                  placeholder="Tìm học sinh..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border-2 border-primary/20 focus:border-primary outline-none text-sm font-medium bg-background/50 backdrop-blur-sm"
                  autoFocus
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSearching(!isSearching)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl",
              "border bg-card transition-all",
              isSearching ? "border-primary bg-primary/10 text-primary" : "hover:bg-accent border-border text-foreground",
              "text-sm font-bold shadow-sm"
            )}
          >
            <Filter className="w-4 h-4" />
            {isSearching ? 'Đóng bộ lọc' : 'Bộ lọc'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportAll}
            disabled={generatingInvoice || records.length === 0}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl",
              "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/25",
              "hover:brightness-110 transition-all",
              "text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {generatingInvoice ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {generatingInvoice ? 'Đang xuất...' : 'Xuất báo cáo'}
          </motion.button>
        </div>
      </div>

      {/* Alert Banner */}
      {records.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={cn(
            "p-5 rounded-2xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50",
            "dark:border-orange-900/30 dark:from-orange-950/20 dark:to-amber-950/20",
            "flex items-start gap-4 shadow-sm"
          )}
        >
          <div className="p-2.5 bg-orange-500 rounded-xl shadow-lg shadow-orange-500/20">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-orange-900 dark:text-orange-400">Buổi học chưa thanh toán</h4>
            <p className="text-orange-700 dark:text-orange-300/80 mt-0.5">
              Có <span className="font-black underline">{totalSessions} buổi học</span> từ <span className="font-bold">{groupedRecords.length} học sinh</span> chưa được thanh toán.
            </p>
          </div>
        </motion.div>
      )}

      {/* Selection floating bar (Desktop) */}
      <AnimatePresence>
        {selectedSessions.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 hidden sm:block"
          >
            <div className="bg-foreground text-background p-4 rounded-3xl shadow-2xl flex items-center justify-between gap-6 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-4 pl-2">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-black">
                  {selectedSessions.length}
                </div>
                <div className="text-sm font-bold">Buổi học đã chọn</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={clearSelection}
                  className="px-4 py-2 rounded-xl hover:bg-white/5 transition-colors font-bold text-sm"
                >
                  Bỏ chọn
                </button>
                <button
                  onClick={() => markAllPaid(selectedSessions)}
                  className="bg-green-500 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-green-500/20 hover:scale-105 transition-all"
                >
                  Đánh dấu thanh toán
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
        <PremiumEmptyState />
      ) : (
        <div className="space-y-6 sm:space-y-8">
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

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{ duration: 0.6 }}
              className="w-32 h-32 rounded-full bg-green-500 flex items-center justify-center shadow-3xl shadow-green-500/40"
            >
              <CheckCircle2 className="w-16 h-16 text-white" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Sheet Actions */}
      <div className="sm:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-2xl flex items-center justify-center z-50 border-4 border-background"
            >
              <Plus className="w-8 h-8" />
            </motion.button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-[2.5rem] border-t-0 bg-background pt-8 pb-10 px-6">
            <div className="space-y-4">
              <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" />
              <h3 className="text-lg font-bold mb-4 text-center">Hành động nhanh</h3>
              <PremiumActionButton
                icon={CheckCircle}
                label="Đánh dấu đã thanh toán"
                shortLabel="Thanh toán"
                variant="primary"
                onClick={() => markAllPaid(selectedSessions)}
                disabled={selectedSessions.length === 0}
              />
              <PremiumActionButton
                icon={Download}
                label="Tải báo giá PDF"
                shortLabel="Hóa đơn"
                variant="secondary"
                onClick={() => generateCombinedInvoice(selectedSessions, selectedStudents)}
                disabled={selectedSessions.length === 0 || generatingInvoice}
              />
              <PremiumActionButton
                icon={Filter}
                label={isSearching ? "Đóng bộ lọc tìm kiếm" : "Mở bộ lọc dữ liệu"}
                shortLabel="Bộ lọc"
                variant="tertiary"
                onClick={() => {
                  setIsSearching(!isSearching);
                  if (isSearching) setSearchTerm('');
                }}
              />
              {isSearching && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-2 pb-2"
                >
                  <input
                    type="text"
                    placeholder="Nhập tên học sinh..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary outline-none text-sm font-bold bg-muted/30"
                    autoFocus
                  />
                </motion.div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.div>
  );
}
