import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { LessonStatus } from '@/lib/types/lesson-status';
import { LESSON_STATUS_LABELS } from '@/lib/types/lesson-status';
import { Clock } from 'lucide-react';
import { LessonDetailFormData } from '../types';
import { LibrarySelection } from './LibrarySelection';
import type { LessonLibraryDTO } from '@/features/learning/lessons/types';
import type { Document } from '@/lib/types/document';

interface EditModeFormProps {
    formData: LessonDetailFormData;
    setFormData: (data: LessonDetailFormData) => void;
    handleSubmit: (e?: React.FormEvent) => void;
    // Props for LibrarySelection
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
    return (
        <form id="premium-edit-form" onSubmit={handleSubmit} className="h-full min-h-0 animate-in fade-in slide-in-from-right-2 duration-300">
            <div className="h-full min-h-0 flex flex-col gap-4 lg:grid lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-4">
                <div className="space-y-4 lg:space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
                        <div className="space-y-1 sm:space-y-1.5">
                            <label className="text-[11px] sm:text-[12px] font-medium text-muted-foreground ml-1">Bắt đầu</label>
                            <div className="relative">
                                <input
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    className="w-full h-[33px] sm:h-10 pl-2 sm:pl-3 pr-7 sm:pr-10 rounded-lg sm:rounded-xl bg-muted/40 border-border/60 focus:bg-background focus:ring-2 focus:ring-primary/10 text-[10px] sm:text-[11px] font-bold outline-none transition-all appearance-none"
                                />
                                <Clock className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>
                        <div className="space-y-1 sm:space-y-1.5">
                            <label className="text-[11px] sm:text-[12px] font-medium text-muted-foreground ml-1">Kết thúc</label>
                            <div className="relative">
                                <input
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                    className="w-full h-[33px] sm:h-10 pl-2 sm:pl-3 pr-7 sm:pr-10 rounded-lg sm:rounded-xl bg-muted/40 border-border/60 focus:bg-background focus:ring-2 focus:ring-primary/10 text-[10px] sm:text-[11px] font-bold outline-none transition-all appearance-none"
                                />
                                <Clock className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground pointer-events-none" />
                            </div>
                            {/* D5: inline validation error */}
                            {formData.startTime && formData.endTime && formData.endTime <= formData.startTime && (
                                <p className="text-[10px] text-red-500 ml-1 mt-0.5">Giờ kết thúc phải sau giờ bắt đầu</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
                        <div className="space-y-1 sm:space-y-1.5">
                            <label className="text-[11px] sm:text-[12px] font-medium text-muted-foreground ml-1">Môn học</label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                placeholder="Môn học..."
                                className="w-full h-[33px] sm:h-10 px-2 sm:px-3 rounded-lg sm:rounded-xl bg-muted/40 border-border/60 focus:bg-background focus:ring-2 focus:ring-primary/10 text-[10px] sm:text-[11px] font-bold outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-1 sm:space-y-1.5">
                            <label className="text-[11px] sm:text-[12px] font-medium text-muted-foreground ml-1">Trạng thái</label>
                            <Select
                                value={formData.status}
                                onValueChange={(val) => setFormData({ ...formData, status: val as LessonStatus })}
                            >
                                <SelectTrigger className="h-[33px] sm:h-10 px-2 sm:px-3 rounded-lg sm:rounded-xl bg-muted/40 border-border/60 focus:bg-background text-[10px] sm:text-[11px] font-bold shadow-none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border/60 shadow-xl">
                                    {Object.entries(LESSON_STATUS_LABELS).map(([val, label]) => (
                                        <SelectItem key={val} value={val} className="text-xs font-medium">
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {(formData.status === 'CANCELLED_BY_STUDENT' || formData.status === 'CANCELLED_BY_TUTOR') && (
                                <p className="text-[10px] text-amber-600 dark:text-amber-400 ml-1">
                                    Buổi học hủy sẽ tính 0đ và không tính vào học phí
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1 sm:space-y-1.5">
                        <label className="text-[11px] sm:text-[12px] font-medium text-muted-foreground ml-1">Ghi chú</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                            placeholder="Ghi chú buổi học..."
                            className="w-full p-2 sm:p-3 rounded-lg sm:rounded-xl bg-muted/40 border-border/60 focus:bg-background focus:ring-2 focus:ring-primary/10 text-[9px] sm:text-[11px] font-medium outline-none resize-none no-scrollbar"
                        />
                    </div>
                </div>

                <div className="min-h-[320px] lg:min-h-0 lg:h-full">
                    <LibrarySelection {...libraryProps} />
                </div>
            </div>
        </form>
    );
}
