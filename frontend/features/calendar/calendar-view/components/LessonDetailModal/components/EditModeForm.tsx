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

interface EditModeFormProps {
    formData: LessonDetailFormData;
    setFormData: (data: LessonDetailFormData) => void;
    handleSubmit: (e?: React.FormEvent) => void;
    // Props for LibrarySelection
    activeTab: 'lessons' | 'documents';
    setActiveTab: (tab: 'lessons' | 'documents') => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    sortBy: string;
    setSortBy: (sort: string) => void;
    selectedCategory: string;
    setSelectedCategory: (cat: string) => void;
    categories: string[];
    filteredItems: any[];
    selectedLessonIds: Set<number>;
    selectedDocumentIds: Set<number>;
    currentTabSelectedCount: number;
    toggleSelection: (id: number) => void;
    getCategoryName: (item: any) => string;
}

export function EditModeForm({
    formData,
    setFormData,
    handleSubmit,
    ...libraryProps
}: EditModeFormProps) {
    return (
        <form id="premium-edit-form" onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Bắt đầu</label>
                    <div className="relative">
                        <input
                            type="time"
                            value={formData.startTime}
                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            className="w-full h-10 pl-3 pr-10 rounded-xl bg-muted/40 border-border/60 focus:bg-background focus:ring-2 focus:ring-primary/10 text-xs font-bold outline-none transition-all appearance-none"
                        />
                        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Kết thúc</label>
                    <div className="relative">
                        <input
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            className="w-full h-10 pl-3 pr-10 rounded-xl bg-muted/40 border-border/60 focus:bg-background focus:ring-2 focus:ring-primary/10 text-xs font-bold outline-none transition-all appearance-none"
                        />
                        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Môn học</label>
                    <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Môn học..."
                        className="w-full h-10 px-3 rounded-xl bg-muted/40 border-border/60 focus:bg-background focus:ring-2 focus:ring-primary/10 text-xs font-bold outline-none transition-all"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Trạng thái</label>
                    <Select
                        value={formData.status}
                        onValueChange={(val) => setFormData({ ...formData, status: val as LessonStatus })}
                    >
                        <SelectTrigger className="h-10 px-3 rounded-xl bg-muted/40 border-border/60 focus:bg-background text-xs font-bold shadow-none">
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
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Ghi chú</label>
                <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
                    placeholder="Ghi chú buổi học..."
                    className="w-full p-3 rounded-xl bg-muted/40 border-border/60 focus:bg-background focus:ring-2 focus:ring-primary/10 text-xs font-medium outline-none resize-none no-scrollbar"
                />
            </div>

            <LibrarySelection {...libraryProps} />
        </form>
    );
}
