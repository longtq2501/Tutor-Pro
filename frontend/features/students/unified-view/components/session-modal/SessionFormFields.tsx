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
        <div className="space-y-5 animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-sm font-semibold flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        Ngày học
                    </Label>
                    <div className="relative group">
                        <Input
                            type="date"
                            className="h-12 pl-4 rounded-xl border-2 border-muted-foreground/20 focus:border-primary/50 hover:border-primary/30 transition-all bg-muted/30"
                            value={formData.sessionDate}
                            onChange={e => updateField('sessionDate', e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-sm font-semibold flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-primary" />
                        Môn học
                    </Label>
                    <Input
                        placeholder="Ví dụ: Toán, Lý..."
                        className="h-12 rounded-xl border-2 border-muted-foreground/20 focus:border-primary/50 hover:border-primary/30 transition-all bg-muted/30"
                        value={formData.subject}
                        onChange={e => updateField('subject', e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    Ghi chú
                </Label>
                <Textarea
                    placeholder="Nội dung buổi học, bài tập, hoặc ghi chú khác..."
                    rows={2}
                    className="resize-none rounded-xl border-2 border-muted-foreground/20 focus:border-primary/50 hover:border-primary/30 transition-all bg-muted/30"
                    value={formData.notes}
                    onChange={e => updateField('notes', e.target.value)}
                />
            </div>
        </div>
    );
}
