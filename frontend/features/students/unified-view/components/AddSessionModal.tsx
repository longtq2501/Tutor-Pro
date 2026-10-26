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
 */
export function AddSessionModal({ open, onClose, student, onSuccess }: AddSessionModalProps) {
    const {
        formData, updateField, duration, handleSubmit, loading,
        lessons, documents, selectedLessonIds, selectedDocIds,
        toggleLesson, toggleDoc
    } = useAddSessionForm(student, onClose, onSuccess);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] w-[95vw] max-w-[95vw] sm:w-full p-0 bg-card rounded-2xl shadow-xl border border-border flex flex-col max-h-[90dvh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3.5 p-5 border-b border-border flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <DialogTitle className="text-base font-semibold">Thêm Buổi Học</DialogTitle>
                        {student?.name && (
                            <p className="text-sm text-muted-foreground mt-0.5">Học sinh: <span className="font-medium text-foreground">{student.name}</span></p>
                        )}
                    </div>
                </div>

                {/* Scrollable form content */}
                <div className="flex-1 overflow-y-auto min-h-0 p-5">
                    <form id="session-form" onSubmit={handleSubmit} className="space-y-0">
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

                {/* Footer */}
                <div className="p-4 border-t border-border flex gap-2.5 flex-shrink-0">
                    <Button variant="outline" className="flex-1 h-10" onClick={onClose} disabled={loading}>
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        form="session-form"
                        className="flex-1 h-10"
                        disabled={loading}
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {loading ? 'Đang tạo...' : 'Tạo Buổi Học'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}