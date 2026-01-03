// ============================================================================
// FILE: student-dashboard/components/MonthlySessionsList.tsx
// ============================================================================
import DocumentPreviewModal from '@/features/documents/document-preview-modal';
import { LessonDetailModal } from '@/features/learning/lesson-view-wrapper/components/LessonDetailModal';
import { documentsApi } from '@/lib/services/document';
import type { DocumentDTO, Document as DocumentType } from '@/lib/types';
import { SessionRecord } from '@/lib/types';
import { cn } from '@/lib/utils';
import { addMonths, format, parseISO, subMonths } from 'date-fns';
import { vi } from 'date-fns/locale';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Calendar, CheckCircle, ChevronLeft, ChevronRight, Circle, Clock, ExternalLink, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface MonthlySessionsListProps {
    sessions: SessionRecord[];
    currentMonth: string;
    onMonthChange: (newMonth: string) => void;
    isLoading?: boolean;
}

export const MonthlySessionsList = ({
    sessions,
    currentMonth,
    onMonthChange,
    isLoading
}: MonthlySessionsListProps) => {
    const router = useRouter();
    const [previewDocument, setPreviewDocument] = useState<DocumentType | null>(null);
    const [selectedPreviewLessonId, setSelectedPreviewLessonId] = useState<number | null>(null);

    const handleDocumentClick = (doc: DocumentDTO) => {
        // "Inflate" DocumentDTO to a partial Document object for the preview modal
        const fullDoc: DocumentType = {
            ...doc,
            category: 'OTHER',
            categoryDisplayName: 'Tài liệu',
            downloadCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            formattedFileSize: (doc.fileSize / (1024 * 1024)).toFixed(2) + ' MB',
        };
        setPreviewDocument(fullDoc);
    };

    const handleDownload = async (doc: DocumentType) => {
        try {
            await documentsApi.downloadAndSave(doc.id, doc.fileName);
        } catch (error) {
            toast.error('Không thể tải xuống tài liệu');
        }
    };

    const handleLessonClick = (lessonId: number) => {
        setSelectedPreviewLessonId(lessonId);
    };

    const handlePrevMonth = () => {
        const date = parseISO(`${currentMonth}-01`);
        onMonthChange(format(subMonths(date, 1), 'yyyy-MM'));
    };

    const handleNextMonth = () => {
        const date = parseISO(`${currentMonth}-01`);
        onMonthChange(format(addMonths(date, 1), 'yyyy-MM'));
    };

    const formatMonthDisplay = (yyyyMM: string) => {
        try {
            return format(parseISO(`${yyyyMM}-01`), 'MMMM yyyy', { locale: vi });
        } catch (e) {
            return yyyyMM;
        }
    };

    // Simplified Status Logic for Student
    const getStudentStatus = (status: string) => {
        if (status === 'COMPLETED' || status === 'PAID') {
            return { label: 'Đã học', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400', icon: CheckCircle };
        }
        return { label: 'Chưa học', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400', icon: Circle };
    };

    return (
        <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm flex flex-col h-full">
            {/* Header with Month Toggle */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                        <Calendar size={22} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-card-foreground">Lịch Học Của Bạn</h2>
                        <p className="text-sm text-muted-foreground hidden sm:block">Danh sách các buổi học trong tháng</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-background rounded-full border border-border p-1 shadow-sm">
                    <button
                        onClick={handlePrevMonth}
                        className="p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <span className="text-sm font-semibold min-w-[100px] text-center capitalize">
                        {formatMonthDisplay(currentMonth)}
                    </span>
                    <button
                        onClick={handleNextMonth}
                        className="p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Sessions List */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-3 min-h-[300px]">
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 bg-muted/40 animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-10">
                        <Calendar className="w-12 h-12 mb-3 opacity-20" />
                        <p>Không có buổi học nào trong tháng này.</p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {sessions.map((session, index) => {
                            const statusConfig = getStudentStatus(session.status || '');
                            const StatusIcon = statusConfig.icon;

                            return (
                                <motion.div
                                    key={session.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-background/50 hover:bg-muted/50 border border-transparent hover:border-border transition-all rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 group"
                                >
                                    {/* Date Box */}
                                    <div className="flex-shrink-0 flex sm:flex-col items-center gap-2 sm:gap-0 bg-white dark:bg-black/20 border border-border rounded-xl p-2 sm:p-3 min-w-[70px] text-center shadow-sm">
                                        <span className="text-xs font-bold text-red-500 uppercase">
                                            {session.sessionDate ? format(parseISO(session.sessionDate), 'EEE', { locale: vi }) : 'N/A'}
                                        </span>
                                        <span className="text-xl sm:text-2xl font-black text-foreground">
                                            {session.sessionDate ? format(parseISO(session.sessionDate), 'dd') : '--'}
                                        </span>
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 text-sm text-foreground font-bold mb-1">
                                            <Clock size={14} className="text-muted-foreground" />
                                            {session.startTime?.slice(0, 5) || '??:??'} - {session.endTime?.slice(0, 5) || '??:??'}
                                        </div>

                                        {/* Subject (Lesson Topic) - Primary */}
                                        <div className="text-base font-semibold text-foreground mb-1 line-clamp-1">
                                            {session.subject || 'Buổi học chưa có chủ đề'}
                                        </div>

                                        {/* Notes - Secondary */}
                                        {session.notes && session.notes !== 'Auto-generated from recurring schedule' && (
                                            <div className="flex items-start gap-1.5 text-sm text-muted-foreground line-clamp-2 mb-2">
                                                <FileText size={14} className="mt-0.5 flex-shrink-0 opacity-70" />
                                                <span>{session.notes}</span>
                                            </div>
                                        )}

                                        {/* Fallback if default note */}
                                        {session.notes === 'Auto-generated from recurring schedule' && (
                                            <div className="mb-2">
                                                <span className="text-sm text-muted-foreground/40 italic">Chưa có ghi chú chi tiết</span>
                                            </div>
                                        )}

                                        {/* 🆕 Attachments Section */}
                                        {((session.lessons?.length ?? 0) > 0 || (session.documents?.length ?? 0) > 0) && (
                                            <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-border/50">
                                                {/* Lessons */}
                                                {session.lessons?.map(lesson => (
                                                    <button
                                                        key={lesson.id}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleLessonClick(lesson.id);
                                                        }}
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 text-xs font-medium border border-orange-200 dark:border-orange-800/30 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors cursor-pointer group/badge"
                                                    >
                                                        <BookOpen size={12} className="group-hover/badge:scale-110 transition-transform" />
                                                        <span className="truncate max-w-[150px]">{lesson.title}</span>
                                                        <ExternalLink size={10} className="opacity-0 group-hover/badge:opacity-100 transition-opacity ml-0.5" />
                                                    </button>
                                                ))}

                                                {/* Documents */}
                                                {session.documents?.map(doc => (
                                                    <button
                                                        key={doc.id}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDocumentClick(doc);
                                                        }}
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-200 dark:border-blue-800/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors cursor-pointer group/badge"
                                                    >
                                                        <FileText size={12} className="group-hover/badge:scale-110 transition-transform" />
                                                        <span className="truncate max-w-[150px]">{doc.title || doc.fileName}</span>
                                                        <ExternalLink size={10} className="opacity-0 group-hover/badge:opacity-100 transition-opacity ml-0.5" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Badge */}
                                    <div className={cn(
                                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold self-start sm:self-center ml-auto sm:ml-0 shrink-0",
                                        statusConfig.color
                                    )}>
                                        <StatusIcon size={14} />
                                        {statusConfig.label}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                )}
            </div>
            {/* Document Preview Modal */}
            {previewDocument && (
                <DocumentPreviewModal
                    document={previewDocument}
                    onClose={() => setPreviewDocument(null)}
                    onDownload={handleDownload}
                />
            )}

            {/* Lesson Detail / Preview Modal */}
            <LessonDetailModal
                lessonId={selectedPreviewLessonId}
                open={selectedPreviewLessonId !== null}
                onClose={() => setSelectedPreviewLessonId(null)}
            />
        </div>
    );
};
