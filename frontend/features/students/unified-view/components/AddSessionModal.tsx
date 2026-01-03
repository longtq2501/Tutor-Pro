import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { documentsApi } from '@/lib/services/document';
import { lessonLibraryApi } from '@/lib/services/lesson-admin';
import { sessionsApi } from '@/lib/services/session';
import { Student } from '@/lib/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { addHours, format, parse, startOfHour } from 'date-fns';
import { BookOpen, Calendar, Clock, FileText, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface AddSessionModalProps {
    open: boolean;
    onClose: () => void;
    student: Student | null;
    onSuccess?: () => void;
}

export function AddSessionModal({ open, onClose, student, onSuccess }: AddSessionModalProps) {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    // Default to today, next hour
    const now = new Date();
    const nextHour = startOfHour(addHours(now, 1));
    const twoHoursLater = addHours(nextHour, 2);

    const [formData, setFormData] = useState({
        sessionDate: format(now, 'yyyy-MM-dd'),
        startTime: format(nextHour, 'HH:mm'),
        endTime: format(twoHoursLater, 'HH:mm'),
        subject: '',
        notes: '',
        pricePerHour: student?.pricePerHour || 0
    });

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // 🆕 Fetch Attachments
    const { data: documents } = useQuery({
        queryKey: ['documents'],
        queryFn: documentsApi.getAll
    });

    const { data: lessons } = useQuery({
        queryKey: ['lesson-library'],
        queryFn: lessonLibraryApi.getAll
    });

    const [selectedDocIds, setSelectedDocIds] = useState<number[]>([]);
    const [selectedLessonIds, setSelectedLessonIds] = useState<number[]>([]);

    const toggleDoc = (id: number) => {
        setSelectedDocIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleLesson = (id: number) => {
        setSelectedLessonIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    // Calculate duration
    const calculateDuration = () => {
        try {
            const start = parse(`${formData.sessionDate} ${formData.startTime}`, 'yyyy-MM-dd HH:mm', new Date());
            const end = parse(`${formData.sessionDate} ${formData.endTime}`, 'yyyy-MM-dd HH:mm', new Date());
            const durationMs = end.getTime() - start.getTime();
            const durationHours = durationMs / (1000 * 60 * 60);
            return durationHours > 0 ? durationHours : 0;
        } catch {
            return 0;
        }
    };

    const duration = calculateDuration();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!student) return;
        if (!formData.sessionDate || !formData.startTime || !formData.endTime) {
            toast.error('Vui lòng nhập đầy đủ thời gian.');
            return;
        }

        try {
            setLoading(true);

            // Calculate hours
            const start = parse(`${formData.sessionDate} ${formData.startTime}`, 'yyyy-MM-dd HH:mm', new Date());
            const end = parse(`${formData.sessionDate} ${formData.endTime}`, 'yyyy-MM-dd HH:mm', new Date());

            const durationMs = end.getTime() - start.getTime();
            const durationHours = durationMs / (1000 * 60 * 60);

            if (durationHours <= 0) {
                toast.error('Thời gian kết thúc phải sau thời gian bắt đầu.');
                return;
            }

            await sessionsApi.create({
                studentId: student.id,
                sessionDate: formData.sessionDate,
                month: format(new Date(formData.sessionDate), 'yyyy-MM'),
                sessions: 1,
                hoursPerSession: durationHours,
                startTime: formData.startTime,
                endTime: formData.endTime,
                subject: formData.subject,
                notes: formData.notes,
                status: 'SCHEDULED',
                // 🆕 Attachments
                documentIds: selectedDocIds,
                lessonIds: selectedLessonIds
            });

            toast.success('Thêm buổi học thành công');
            await queryClient.invalidateQueries({ queryKey: ['sessions'] });
            await queryClient.invalidateQueries({ queryKey: ['students'] });

            onSuccess?.();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Có lỗi xảy ra khi tạo buổi học.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] w-[95vw] max-w-[95vw] sm:w-full max-h-[90vh] p-0 overflow-hidden bg-card rounded-3xl shadow-2xl border-2 border-border/50 transition-all duration-300 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b bg-gradient-to-br from-blue-500/10 via-primary/10 to-purple-500/10 rounded-t-3xl flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-primary flex items-center justify-center flex-shrink-0 shadow-lg">
                            <Calendar className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-xl font-bold tracking-tight">
                                Thêm Buổi Học
                            </DialogTitle>
                            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                                <span className="text-muted-foreground/70">Học sinh:</span>
                                <span className="font-semibold text-foreground bg-background/50 px-2 py-0.5 rounded-md">
                                    {student?.name}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                    <form id="session-form" onSubmit={handleSubmit} className="space-y-5 animate-in slide-in-from-bottom-4 fade-in duration-300">
                        {/* Date & Subject Row */}
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

                        {/* Time Row with Duration Badge */}
                        <div className="space-y-3 bg-gradient-to-br from-primary/5 to-blue-500/5 p-4 rounded-2xl border border-primary/10">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-semibold flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-primary" />
                                    Thời gian
                                </Label>
                                {duration > 0 && (
                                    <div className="px-2.5 py-1 bg-primary/15 border border-primary/30 rounded-full text-xs font-bold text-primary flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{duration} giờ</span>
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide px-1">Bắt đầu</div>
                                    <Input
                                        type="time"
                                        className="h-14 px-4 rounded-xl border-2 border-border/40 focus:border-primary hover:border-primary/50 transition-all font-bold text-lg bg-background shadow-sm hover:shadow-md text-xs"
                                        value={formData.startTime}
                                        onChange={e => updateField('startTime', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide px-1">Kết thúc</div>
                                    <Input
                                        type="time"
                                        className="h-14 px-4 rounded-xl border-2 border-border/40 focus:border-primary hover:border-primary/50 transition-all font-bold text-lg bg-background shadow-sm hover:shadow-md text-xs"
                                        value={formData.endTime}
                                        onChange={e => updateField('endTime', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Notes Section */}
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

                        {/* 🆕 Attachments Selection */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/50">
                            {/* Lessons List */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
                                    <BookOpen className="w-3.5 h-3.5" />
                                    Đính kèm Bài giảng
                                    <Badge variant="secondary" className="ml-auto text-[10px] h-5 px-1.5">{selectedLessonIds.length} đã chọn</Badge>
                                </Label>
                                <ScrollArea className="h-[150px] w-full rounded-xl border border-border/50 bg-muted/20 p-2">
                                    <div className="space-y-2">
                                        {lessons?.map(lesson => (
                                            <div key={lesson.id} className="flex items-start space-x-2 p-1.5 hover:bg-muted/50 rounded-lg transition-colors">
                                                <Checkbox
                                                    id={`lesson-${lesson.id}`}
                                                    checked={selectedLessonIds.includes(lesson.id)}
                                                    onCheckedChange={() => toggleLesson(lesson.id)}
                                                />
                                                <label
                                                    htmlFor={`lesson-${lesson.id}`}
                                                    className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer pt-0.5"
                                                >
                                                    {lesson.title}
                                                    {lesson.summary && <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{lesson.summary}</p>}
                                                </label>
                                            </div>
                                        ))}
                                        {!lessons?.length && <p className="text-xs text-muted-foreground text-center py-4">Chưa có bài giảng nào</p>}
                                    </div>
                                </ScrollArea>
                            </div>

                            {/* Documents List */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                                    <FileText className="w-3.5 h-3.5" />
                                    Đính kèm Tài liệu
                                    <Badge variant="secondary" className="ml-auto text-[10px] h-5 px-1.5">{selectedDocIds.length} đã chọn</Badge>
                                </Label>
                                <ScrollArea className="h-[150px] w-full rounded-xl border border-border/50 bg-muted/20 p-2">
                                    <div className="space-y-2">
                                        {documents?.map(doc => (
                                            <div key={doc.id} className="flex items-center space-x-2 p-1.5 hover:bg-muted/50 rounded-lg transition-colors">
                                                <Checkbox
                                                    id={`doc-${doc.id}`}
                                                    checked={selectedDocIds.includes(doc.id)}
                                                    onCheckedChange={() => toggleDoc(doc.id)}
                                                />
                                                <label
                                                    htmlFor={`doc-${doc.id}`}
                                                    className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                >
                                                    {doc.title || doc.fileName}
                                                </label>
                                            </div>
                                        ))}
                                        {!documents?.length && <p className="text-xs text-muted-foreground text-center py-4">Chưa có tài liệu nào</p>}
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 p-6 border-t flex gap-3 bg-gradient-to-br from-muted/20 to-muted/40 rounded-b-3xl relative z-10">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1 h-12 rounded-xl hover:bg-muted/70 transition-all border-2 font-semibold"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Hủy Bỏ
                    </Button>
                    <Button
                        type="submit"
                        form="session-form"
                        className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-primary hover:from-blue-600 hover:to-primary/90 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Đang tạo...
                            </>
                        ) : (
                            <>
                                <Calendar className="w-4 h-4 mr-2" />
                                Tạo Buổi Học
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}