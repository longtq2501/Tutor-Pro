import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    UserPlus, X, UserCircle, Plus, ChevronRight, Check, Loader2, Calendar
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { useStudentForm } from '@/features/students/student-modal/hooks/useStudentForm';
import type { Student } from '@/lib/types';
import { useParents } from '@/features/students/parents-view/hooks/useParents';
import { QuickAddParentModal } from './QuickAddParentModal';

interface EnhancedAddStudentModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editingStudent: Student | null;
}

export function EnhancedAddStudentModal({
    open,
    onClose,
    onSuccess,
    editingStudent
}: EnhancedAddStudentModalProps) {
    const [step, setStep] = useState(1);
    const [showAddParent, setShowAddParent] = useState(false);
    const { formData, loading, updateField, submit } = useStudentForm(editingStudent, () => {
        onSuccess();
        onClose();
    });

    // Use parents hook for selector
    const { parents, loadParents } = useParents();

    // Reset step when reopening
    useEffect(() => {
        if (open) {
            setStep(1);
        }
    }, [open]);

    // Handle successful parent addition
    const handleParentAdded = (newParentId?: number) => {
        loadParents(); // Refresh list
        if (newParentId) {
            updateField('parentId', newParentId);
        }
        setShowAddParent(false);
    };

    const handleNextStep = () => {
        // Basic validation for step 1
        if (!formData.name) {
            // Ideally use toast, but native alert for simplicity in this logic block or just rely on submit validation
            // preventing progress if critical fields missing
        }
        setStep(2);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px] w-[95vw] max-w-[95vw] sm:w-full max-h-[92vh] p-0 overflow-hidden bg-card rounded-3xl shadow-2xl border-2 border-border/50 transition-all duration-300 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b bg-gradient-to-br from-muted/30 to-muted/10 rounded-t-3xl flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <UserPlus className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-xl font-bold tracking-tight">
                                {editingStudent ? 'Cập Nhật Hồ Sơ' : 'Thêm Học Sinh Mới'}
                            </DialogTitle>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {step === 1 ? 'Thông tin cá nhân & liên hệ' : 'Thiết lập học vụ & ghi chú'}
                            </p>
                        </div>
                        {/* Close Button removed */}
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center gap-3 mt-6">
                        <div className={cn(
                            "flex-1 h-2 rounded-full transition-all duration-500 shadow-sm",
                            step >= 1 ? "bg-primary" : "bg-muted"
                        )} />
                        <div className={cn(
                            "flex-1 h-2 rounded-full transition-all duration-500 shadow-sm",
                            step >= 2 ? "bg-primary" : "bg-muted"
                        )} />
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                    {step === 1 && (
                        <div className="space-y-5 animate-in slide-in-from-left-4 fade-in duration-300">
                            {/* Basic Info */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">
                                    Họ và tên <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Ví dụ: Nguyễn Văn A"
                                    className="h-11 rounded-xl border-muted-foreground/20 focus:border-primary/50 transition-colors"
                                    value={formData.name}
                                    onChange={e => updateField('name', e.target.value)}
                                />
                            </div>

                            {/* Parent Selection */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Phụ huynh liên kết</Label>
                                <div className="flex gap-2">
                                    <Select
                                        value={formData.parentId?.toString()}
                                        onValueChange={(val) => updateField('parentId', Number(val))}
                                    >
                                        <SelectTrigger className="flex-1 h-11 rounded-xl border-muted-foreground/20 focus:border-primary/50 transition-colors">
                                            <SelectValue placeholder="-- Chọn phụ huynh --" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {parents.map(parent => (
                                                <SelectItem key={parent.id} value={parent.id.toString()} className="rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <UserCircle className="w-4 h-4 text-muted-foreground" />
                                                        <span>{parent.name}</span>
                                                        {parent.studentCount > 0 && (
                                                            <span className="text-xs text-muted-foreground">({parent.studentCount} HS)</span>
                                                        )}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-11 w-11 shrink-0 rounded-xl hover:bg-primary/10 hover:border-primary/50 transition-all"
                                        onClick={() => setShowAddParent(true)}
                                        title="Thêm phụ huynh mới"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm font-medium">Số điện thoại</Label>
                                    <Input
                                        id="phone"
                                        placeholder="0901234567"
                                        className="h-11 rounded-xl border-muted-foreground/20 focus:border-primary/50 transition-colors"
                                        value={formData.phone}
                                        onChange={e => updateField('phone', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="startMonth" className="text-sm font-medium">Tháng bắt đầu</Label>
                                    <Input
                                        id="startMonth"
                                        type="month"
                                        className="h-11 rounded-xl border-muted-foreground/20 focus:border-primary/50 transition-colors"
                                        value={formData.startMonth}
                                        onChange={e => updateField('startMonth', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="schedule" className="text-sm font-medium">
                                    Lịch học cố định <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="schedule"
                                    placeholder="Ví dụ: T2, T4 (18:00 - 19:30)"
                                    className="h-11 rounded-xl border-muted-foreground/20 bg-muted/30 focus:bg-background focus:border-primary/50 transition-all"
                                    value={formData.schedule}
                                    onChange={e => updateField('schedule', e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">Nhập tóm tắt lịch học để hiển thị trên thẻ.</p>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                            {/* Status Toggle */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Trạng thái học tập</Label>
                                <div className="bg-muted/50 p-1.5 rounded-xl inline-flex w-full shadow-sm border border-border/30">
                                    <button
                                        type="button"
                                        onClick={() => updateField('active', true)}
                                        className={cn(
                                            "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                                            formData.active
                                                ? "bg-background text-foreground shadow-md border border-border/50"
                                                : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                                        )}
                                    >
                                        Đang học
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => updateField('active', false)}
                                        className={cn(
                                            "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                                            !formData.active
                                                ? "bg-background text-foreground shadow-md border border-border/50"
                                                : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                                        )}
                                    >
                                        Đã nghỉ / Tạm dừng
                                    </button>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            {/* Hourly Rate */}
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-sm font-medium">Học phí / giờ (VNĐ)</Label>
                                <div className="relative">
                                    <Input
                                        id="price"
                                        type="number"
                                        placeholder="200000"
                                        className="h-12 pl-4 pr-12 text-lg font-semibold tracking-wide rounded-xl border-muted-foreground/20 focus:border-primary/50 transition-colors"
                                        value={formData.pricePerHour}
                                        onChange={e => updateField('pricePerHour', Number(e.target.value))}
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium pointer-events-none">
                                        đ
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground text-right">{formatCurrency(formData.pricePerHour)} / buổi 1h</p>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <Label htmlFor="notes" className="text-sm font-medium">Ghi chú thêm</Label>
                                <Textarea
                                    id="notes"
                                    rows={4}
                                    placeholder="Ghi chú về trình độ, mục tiêu hoặc cần lưu ý..."
                                    className="resize-none rounded-xl border-muted-foreground/20 focus:border-primary/50 transition-colors"
                                    value={formData.notes}
                                    onChange={e => updateField('notes', e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 p-6 border-t flex gap-3 bg-gradient-to-br from-muted/10 to-muted/30 rounded-b-3xl relative z-10">
                    <Button
                        variant="outline"
                        className="flex-1 h-11 rounded-xl hover:bg-muted/50 transition-all"
                        onClick={step === 1 ? onClose : () => setStep(1)}
                        disabled={loading}
                    >
                        {step === 1 ? 'Hủy Bỏ' : 'Quay lại'}
                    </Button>

                    {step < 2 ? (
                        <Button
                            className="flex-1 h-11 rounded-xl shadow-md hover:shadow-lg transition-all"
                            onClick={handleNextStep}
                            disabled={!formData.name || !formData.schedule} // Basic Validation
                        >
                            Tiếp tục
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            className="flex-1 group h-11 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-md hover:shadow-lg transition-all"
                            onClick={submit}
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Check className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" />
                            )}
                            {editingStudent ? 'Lưu Thay Đổi' : 'Tạo Hồ Sơ'}
                        </Button>
                    )}
                </div>

                {/* Quick Add Parent Modal (Nested) */}
                {showAddParent && (
                    <QuickAddParentModal
                        open={showAddParent}
                        onClose={() => setShowAddParent(false)}
                        onSuccess={handleParentAdded}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}