'use client';

import { useState } from 'react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { SmartFeedbackForm } from "@/features/feedback/components/SmartFeedbackForm";
import type { LessonStatus } from '@/lib/types/lesson-status';
import { isCompletedStatus } from '@/lib/types/lesson-status';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { createPortal } from 'react-dom';

// Internal Components
import { EditModeForm } from './components/EditModeForm';
import { ModalFooter } from './components/ModalFooter';
import { ModalHeader } from './components/ModalHeader';
import { StudentCard } from './components/StudentCard';
import { ViewModeContent } from './components/ViewModeContent';
import { LessonDetailModalProps } from './types';
import { useLessonDetailModal } from './useLessonDetailModal';

export function LessonDetailModal(props: LessonDetailModalProps) {
    const {
        localSession,
        mode,
        setMode,
        formData,
        setFormData,
        loading,
        isDirty,
        confirmDeleteOpen,
        setConfirmDeleteOpen,
        activeTab,
        setActiveTab,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        selectedLessonIds,
        selectedDocumentIds,
        filteredItems,
        categories,
        globalSelectedCount,
        currentTabSelectedCount,
        toggleSelection,
        handleSubmit,
        handleDuplicate,
        handleDelete,
        handleConvertToOnline,
        handleRevertToOffline,
        canConvert,
        isConverting,
        showConvertConfirm,
        setShowConvertConfirm,
        showRevertConfirm,
        setShowRevertConfirm,
        getCategoryName
    } = useLessonDetailModal(props);

    const { onClose } = props;
    const isTaughtOrPaid = isCompletedStatus(localSession.status as LessonStatus);
    const [mobileFeedbackOpen, setMobileFeedbackOpen] = useState(false);

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-xs"
            />

            {/* Modal panel */}
            <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "20%", opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                className={cn(
                    // Base
                    "relative bg-card shadow-2xl w-full border border-border/60 flex flex-col overflow-hidden",
                    // Mobile: bottom sheet | Desktop: centered dialog
                    "rounded-t-[1.75rem] sm:rounded-2xl",
                    // Sizing
                    mode === 'edit'
                        ? "max-w-4xl max-h-[92dvh] sm:max-h-[88dvh] lg:h-[600px]"
                        : isTaughtOrPaid
                            ? "max-w-4xl lg:max-w-5xl max-h-[92dvh] sm:max-h-[88dvh] lg:h-[620px]"
                            : "max-w-md max-h-[90dvh]"
                )}
            >
                {/* 1. Modal Header */}
                <ModalHeader
                    session={localSession}
                    currentStatus={mode === 'edit' ? formData.status : undefined}
                    onClose={onClose}
                />

                {/* 2. Main Content Body */}
                <div className="flex-1 w-full overflow-hidden flex flex-col lg:flex-row min-h-0">
                    {/* MAIN COLUMN: Details (view mode) or Full Edit form (edit mode) */}
                    <div className={cn(
                        "flex flex-col min-h-0",
                        isTaughtOrPaid && mode === 'view'
                            ? "w-full lg:w-[380px] xl:w-[400px] shrink-0 lg:border-r border-border/60"
                            : "w-full flex-1"
                    )}>
                        <div className={cn(
                            "flex-1 px-4 sm:px-6 py-3.5 sm:py-4",
                            mode === 'edit'
                                ? "overflow-y-auto lg:overflow-hidden flex flex-col gap-3.5"
                                : "overflow-y-auto space-y-3.5"
                        )}>
                            <StudentCard
                                session={localSession}
                                currentStatus={mode === 'edit' ? formData.status : undefined}
                            />

                            {mode === 'view' ? (
                                <ViewModeContent
                                    session={localSession}
                                    canConvert={canConvert}
                                    onConvertToOnline={() => setShowConvertConfirm(true)}
                                    onRevertToOffline={() => setShowRevertConfirm(true)}
                                    isConverting={isConverting}
                                    onOpenFeedback={() => setMobileFeedbackOpen(true)}
                                    isTaughtOrPaid={isTaughtOrPaid}
                                />
                            ) : (
                                <EditModeForm
                                    formData={formData}
                                    setFormData={setFormData}
                                    handleSubmit={handleSubmit}
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    selectedCategory={selectedCategory}
                                    setSelectedCategory={setSelectedCategory}
                                    categories={categories}
                                    filteredItems={filteredItems}
                                    selectedLessonIds={selectedLessonIds}
                                    selectedDocumentIds={selectedDocumentIds}
                                    currentTabSelectedCount={currentTabSelectedCount}
                                    toggleSelection={toggleSelection}
                                    getCategoryName={getCategoryName}
                                />
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Feedback (desktop only, view mode for completed/paid sessions) */}
                    {isTaughtOrPaid && mode === 'view' && (
                        <div className="hidden lg:flex flex-1 min-h-0 overflow-y-auto flex-col bg-muted/15 dark:bg-muted/5">
                            <SmartFeedbackForm
                                sessionRecordId={localSession.id}
                                studentId={localSession.studentId}
                                studentName={localSession.studentName}
                            />
                        </div>
                    )}
                </div>

                {/* 3. Full-width Footer at Root Level */}
                <ModalFooter
                    mode={mode}
                    setMode={(m) => {
                        setMode(m);
                        setMobileFeedbackOpen(false);
                    }}
                    loading={loading}
                    isDirty={isDirty}
                    globalSelectedCount={globalSelectedCount}
                    handleDuplicate={handleDuplicate}
                    setConfirmDeleteOpen={setConfirmDeleteOpen}
                />

                {/* 4. Mobile Slide-Over Feedback Panel */}
                <AnimatePresence>
                    {isTaughtOrPaid && mode === 'view' && mobileFeedbackOpen && (
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 28, stiffness: 280 }}
                            className="absolute inset-0 z-50 bg-card flex flex-col min-h-0 lg:hidden"
                        >
                            {/* Navigation Bar */}
                            <div className="px-4 py-3 bg-card border-b border-border/60 flex items-center justify-between shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setMobileFeedbackOpen(false)}
                                    className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                                >
                                    <ArrowLeft size={16} />
                                    <span>Quay lại buổi học</span>
                                </button>
                                <span className="text-xs font-semibold text-muted-foreground truncate max-w-[150px]">
                                    {localSession.studentName}
                                </span>
                            </div>

                            {/* Full-height Feedback Form on Mobile */}
                            <div className="flex-1 min-h-0 overflow-y-auto flex flex-col bg-muted/10 dark:bg-muted/5">
                                <SmartFeedbackForm
                                    sessionRecordId={localSession.id}
                                    studentId={localSession.studentId}
                                    studentName={localSession.studentName}
                                    onSuccess={() => setMobileFeedbackOpen(false)}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating selection badge */}
                <AnimatePresence>
                    {mode === 'edit' && globalSelectedCount > 0 && (
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="fixed bottom-8 right-8 z-50 pointer-events-none"
                        >
                            <div className="bg-primary text-primary-foreground px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5">
                                <span className="bg-primary-foreground/20 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">
                                    {globalSelectedCount}
                                </span>
                                <span className="text-xs font-bold">{globalSelectedCount} mục đã chọn</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Confirm dialogs */}
            {confirmDeleteOpen && (
                <ConfirmDialog
                    open={confirmDeleteOpen}
                    onOpenChange={setConfirmDeleteOpen}
                    onConfirm={handleDelete}
                    title="Xác nhận xóa?"
                    description="Buổi học này sẽ bị xóa vĩnh viễn khỏi lịch dạy. Bạn không thể hoàn tác thao tác này."
                    confirmText="Xác nhận xóa"
                    variant="destructive"
                />
            )}

            {showConvertConfirm && (
                <ConfirmDialog
                    open={showConvertConfirm}
                    onOpenChange={setShowConvertConfirm}
                    onConfirm={handleConvertToOnline}
                    title="Chuyển sang Online?"
                    description="Học sinh sẽ nhận được thông báo với link tham gia buổi học online. Bạn có muốn tiếp tục?"
                    confirmText="Xác nhận"
                />
            )}

            {showRevertConfirm && (
                <ConfirmDialog
                    open={showRevertConfirm}
                    onOpenChange={setShowRevertConfirm}
                    onConfirm={handleRevertToOffline}
                    title="Hủy phòng học Online?"
                    description="Thao tác này sẽ xóa phòng học online hiện tại. Dữ liệu chat/bảng trắng (nếu có) sẽ bị mất. Bạn có chắc chắn không?"
                    confirmText="Hủy Online"
                    variant="destructive"
                />
            )}
        </div>,
        document.body
    );
}
