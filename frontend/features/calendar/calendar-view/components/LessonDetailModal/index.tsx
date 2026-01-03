import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { SmartFeedbackForm } from "@/features/feedback/components/SmartFeedbackForm";
import type { LessonStatus } from '@/lib/types/lesson-status';
import { isCompletedStatus } from '@/lib/types/lesson-status';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
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
        sortBy,
        setSortBy,
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
        getCategoryName
    } = useLessonDetailModal(props);

    const { onClose } = props;
    const isTaughtOrPaid = isCompletedStatus(localSession.status as LessonStatus);

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />

            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.2 }
                }}
                className={cn(
                    "relative bg-card rounded-[2rem] shadow-2xl w-full border border-border/60 flex flex-col transition-all duration-300",
                    isTaughtOrPaid
                        ? "max-w-6xl h-[90vh] overflow-hidden"
                        : mode === 'edit'
                            ? "max-w-4xl h-[90vh] overflow-hidden"
                            : "max-w-lg overflow-hidden"
                )}
            >
                <ModalHeader session={localSession} onClose={onClose} />

                {/* Main Content */}
                <div className={cn(
                    "flex-1 w-full",
                    isTaughtOrPaid ? "flex flex-col lg:grid lg:grid-cols-12 lg:overflow-hidden" : "overflow-hidden"
                )}>

                    {/* LEFT COLUMN */}
                    <div className={cn(
                        "flex flex-col bg-background",
                        isTaughtOrPaid ? "lg:h-full lg:col-span-4 border-r border-border/60 lg:overflow-hidden" : "w-full overflow-hidden h-full"
                    )}>
                        <div className="p-6 flex-1 lg:overflow-y-auto no-scrollbar space-y-6">
                            <StudentCard session={localSession} />

                            {mode === 'view' ? (
                                <ViewModeContent session={localSession} />
                            ) : (
                                <EditModeForm
                                    formData={formData}
                                    setFormData={setFormData}
                                    handleSubmit={handleSubmit}
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    sortBy={sortBy}
                                    setSortBy={setSortBy}
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

                        <ModalFooter
                            mode={mode}
                            setMode={setMode}
                            loading={loading}
                            isDirty={isDirty}
                            globalSelectedCount={globalSelectedCount}
                            handleDuplicate={handleDuplicate}
                            setConfirmDeleteOpen={setConfirmDeleteOpen}
                        />
                    </div>

                    {/* RIGHT COLUMN */}
                    {isTaughtOrPaid && (
                        <div className="lg:col-span-8 bg-muted/5 lg:h-full lg:overflow-hidden flex flex-col">
                            <div className="flex-1 lg:overflow-hidden flex flex-col">
                                <SmartFeedbackForm
                                    sessionRecordId={localSession.id}
                                    studentId={localSession.studentId}
                                    studentName={localSession.studentName}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Floating Badge */}
                <AnimatePresence>
                    {mode === 'edit' && globalSelectedCount > 0 && (
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="fixed bottom-8 right-8 z-50 pointer-events-none"
                        >
                            <div className="bg-primary text-primary-foreground px-5 py-3 rounded-full shadow-2xl flex items-center gap-3">
                                <span className="bg-primary-foreground/20 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black">
                                    {globalSelectedCount}
                                </span>
                                <span className="text-xs font-black">✓ {globalSelectedCount} mục đã chọn</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

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
        </div>,
        document.body
    );
}
