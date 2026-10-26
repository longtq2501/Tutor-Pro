import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Calendar, FileText } from 'lucide-react';
import React from 'react';

interface SessionFormFieldsProps {
    formData: {
        sessionDate: string;
        subject: string;
        notes: string;
    };
    updateField: (field: string, value: string) => void;
}

/**
 * Basic form fields for AddSessionModal: Date, Subject, and Notes.
 */
export function SessionFormFields({ formData, updateField }: SessionFormFieldsProps) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                    <Label className="text-sm font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        Ngày học <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        type="date"
                        className="h-10 rounded-lg"
                        value={formData.sessionDate}
                        onChange={e => updateField('sessionDate', e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-sm font-medium flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-primary" />
                        Môn học
                    </Label>
                    <Input
                        placeholder="Ví dụ: Toán, Lý..."
                        className="h-10 rounded-lg"
                        value={formData.subject}
                        onChange={e => updateField('subject', e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <Label className="text-sm font-medium flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    Ghi chú
                </Label>
                <Textarea
                    placeholder="Nội dung buổi học, bài tập, hoặc ghi chú khác..."
                    rows={2}
                    className="resize-none rounded-lg"
                    value={formData.notes}
                    onChange={e => updateField('notes', e.target.value)}
                />
            </div>
        </div>
    );
}
