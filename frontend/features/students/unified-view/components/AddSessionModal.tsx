import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogTitle
} from '@/components/ui/dialog';
import { Student } from '@/lib/types';
import { Calendar, Loader2 } from 'lucide-react';
import React from 'react';
import { AttachmentSection } from './session-modal/AttachmentSection';
import { SessionFormFields } from './session-modal/SessionFormFields';
import { TimeSelection } from './session-modal/TimeSelection';
import { useAddSessionForm } from '../hooks/useAddSessionForm';

interface AddSessionModalProps {
    open: boolean;
    onClose: () => void;
    student: Student | null;
    onSuccess?: () => void;
}

/**
 * Modal to add a new learning session for a student.
 * Complies with 50-line component limit by delegating logic and UI parts.
 */
export function AddSessionModal({ open, onClose, student, onSuccess }: AddSessionModalProps) {
    const {
        formData, updateField, duration, handleSubmit, loading,
        lessons, documents, selectedLessonIds, selectedDocIds,
        toggleLesson, toggleDoc
    } = useAddSessionForm(student, onClose, onSuccess);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] w-[95vw] max-w-[95vw] sm:w-full max-h-[90vh] p-0 overflow-hidden bg-card rounded-3xl shadow-2xl border-2 border-border/50 flex flex-col">
                <ModalHeader studentName={student?.name} />
                <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                    <form id="session-form" onSubmit={handleSubmit}>
                        <SessionFormFields formData={formData} updateField={updateField} />
                        <TimeSelection
                            startTime={formData.startTime}
                            endTime={formData.endTime}
                            duration={duration}
                            updateField={updateField}
                        />
                        <AttachmentSection
                            lessons={lessons}
                            documents={documents}
                            selectedLessonIds={selectedLessonIds}
                            selectedDocIds={selectedDocIds}
                            toggleLesson={toggleLesson}
                            toggleDoc={toggleDoc}
                        />
                    </form>
                </div>
                <ModalFooter loading={loading} onClose={onClose} />
            </DialogContent>
        </Dialog>
    );
}

function ModalHeader({ studentName }: { studentName?: string }) {
    return (
        <div className="p-6 border-b bg-gradient-to-br from-blue-500/10 via-primary/10 to-purple-500/10 rounded-t-3xl flex-shrink-0">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-primary flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Calendar className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                    <DialogTitle className="text-xl font-bold tracking-tight">Thêm Buổi Học</DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                        <span className="text-muted-foreground/70">Học sinh:</span>
                        <span className="font-semibold text-foreground bg-background/50 px-2 py-0.5 rounded-md">{studentName}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

function ModalFooter({ loading, onClose }: { loading: boolean; onClose: () => void }) {
    return (
        <div className="p-6 border-t flex gap-3 bg-gradient-to-br from-muted/20 to-muted/40 rounded-b-3xl flex-shrink-0">
            <Button variant="outline" className="flex-1 h-12 rounded-xl border-2 font-semibold" onClick={onClose} disabled={loading}>Hủy Bỏ</Button>
            <Button type="submit" form="session-form" className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-primary text-white rounded-xl shadow-lg font-semibold" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Calendar className="w-4 h-4 mr-2" />}
                {loading ? 'Đang tạo...' : 'Tạo Buổi Học'}
            </Button>
        </div>
    );
}