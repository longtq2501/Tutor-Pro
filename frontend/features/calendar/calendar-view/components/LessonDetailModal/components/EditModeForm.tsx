'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { LessonStatus } from '@/lib/types/lesson-status';
import { LESSON_STATUS_LABELS } from '@/lib/types/lesson-status';
import { cn } from '@/lib/utils';
import { AlertCircle, Clock } from 'lucide-react';
import { LessonDetailFormData } from '../types';
import { LibrarySelection } from './LibrarySelection';

interface EditModeFormProps {
    formData: LessonDetailFormData;
    setFormData: (data: LessonDetailFormData) => void;
    handleSubmit: (e?: React.FormEvent) => void;
    activeTab: 'lessons' | 'documents';
    setActiveTab: (tab: 'lessons' | 'documents') => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedCategory: string;
    setSelectedCategory: (cat: string) => void;
    categories: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filteredItems: any[];
    selectedLessonIds: Set<number>;
    selectedDocumentIds: Set<number>;
    currentTabSelectedCount: number;
    toggleSelection: (id: number) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getCategoryName: (item: any) => string;
}

export function EditModeForm({
    formData,
    setFormData,
    handleSubmit,
    ...libraryProps
}: EditModeFormProps) {
    const timeError = formData.startTime && formData.endTime && formData.endTime <= formData.startTime;
    const isCancellation = formData.status === 'CANCELLED_BY_STUDENT' || formData.status === 'CANCELLED_BY_TUTOR';

    return (
        <form
            id="premium-edit-form"
            onSubmit={handleSubmit}
            className="flex-1 min-h-0 animate-in fade-in slide-in-from-right-2 duration-200 flex flex-col"
        >
            <div className="flex-1 min-h-0 flex flex-col gap-4 lg:grid lg:grid-cols-[290px_minmax(0,1fr)] lg:gap-5">

                {/* LEFT: Form fields */}
                <div className="space-y-3 lg:overflow-y-auto lg:no-scrollbar">

                    {/* Time row */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Start time */}
                        <div className="space-y-1.5">
                            <Label htmlFor="start-time" className="text-xs text-muted-foreground font-medium">
                                Bắt đầu
                            </Label>
                            <div className="relative">
                                <Input
                                    id="start-time"
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    className="pr-8 text-sm font-medium"
                                />
                                <Clock className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50 pointer-events-none" />
                            </div>
                        </div>

                        {/* End time */}
                        <div className="space-y-1.5">
                            <Label htmlFor="end-time" className="text-xs text-muted-foreground font-medium">
                                Kết thúc
                            </Label>
                            <div className="relative">
                                <Input
                                    id="end-time"
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                    className={cn(
                                        "pr-8 text-sm font-medium",
                                        timeError && "border-destructive focus-visible:ring-destructive/20"
                                    )}
                                />
                                <Clock className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50 pointer-events-none" />
                            </div>
                            {timeError && (
                                <p className="flex items-center gap-1 text-[11px] text-destructive font-medium">
                                    <AlertCircle size={10} className="shrink-0" />
                                    Giờ kết thúc phải sau bắt đầu
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-1.5">
                        <Label htmlFor="subject" className="text-xs text-muted-foreground font-medium">
                            Môn học
                        </Label>
                        <Input
                            id="subject"
                            type="text"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            placeholder="VD: Toán 12, Vật lý..."
                            className="text-sm font-medium"
                        />
                    </div>

                    {/* Status */}
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground font-medium">
                            Trạng thái
                        </Label>
                        <Select
                            value={formData.status}
                            onValueChange={(val) => setFormData({ ...formData, status: val as LessonStatus })}
                        >
                            <SelectTrigger className={cn(
                                "text-sm font-medium",
                                isCancellation && "border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10"
                            )}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(LESSON_STATUS_LABELS).map(([val, label]) => (
                                    <SelectItem key={val} value={val} className="text-sm">
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {isCancellation && (
                            <p className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                                <AlertCircle size={11} className="shrink-0" />
                                Buổi hủy tính 0đ, không ghi nhận học phí
                            </p>
                        )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-1.5">
                        <Label htmlFor="notes" className="text-xs text-muted-foreground font-medium">
                            Ghi chú
                        </Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                            placeholder="Nội dung ghi chú buổi học..."
                            className="resize-none text-sm font-medium no-scrollbar"
                        />
                    </div>
                </div>

                {/* RIGHT: Library */}
                <div className="min-h-[220px] lg:min-h-0 lg:h-full flex flex-col">
                    <LibrarySelection {...libraryProps} />
                </div>
            </div>
        </form>
    );
}
