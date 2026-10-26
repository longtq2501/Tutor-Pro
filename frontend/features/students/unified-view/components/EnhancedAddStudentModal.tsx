import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useParents } from '@/features/students/parents-view/hooks/useParents';
import { useStudentForm } from '@/features/students/student-modal/hooks/useStudentForm';
import type { Student } from '@/lib/types';
import { cn, formatCurrency } from '@/lib/utils';
import {
    Check,
    ChevronRight,
    Eye,
    EyeOff,
    Loader2,
    Lock,
    Mail,
    Plus,
    RefreshCw,
    ShieldCheck,
    UserCircle,
    UserPlus
} from 'lucide-react';
import { useEffect, useState } from 'react';
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

    const { parents, loadParents } = useParents();

    useEffect(() => {
        if (open) {
            setStep(1);
        }
    }, [open]);

    const [showPassword, setShowPassword] = useState(false);

    const generatePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let pass = "";
        for (let i = 0; i < 10; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        updateField('password', pass);
    };

    const generateEmailFromStudentName = () => {
        if (!formData.name) return;
        const normalized = formData.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const email = normalized.toLowerCase()
            .replace(/\s+/g, "")
            .replace(/[^a-z0-9]/g, "") + "@students.tutormanagement.com";
        updateField('email', email);
    };

    const handleParentAdded = (newParentId?: number) => {
        loadParents();
        if (newParentId) {
            updateField('parentId', newParentId);
        }
        setShowAddParent(false);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[520px] w-[95vw] max-w-[95vw] sm:w-full p-0 bg-card rounded-2xl shadow-xl border border-border flex flex-col max-h-[90dvh] overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-border flex-shrink-0 bg-card">
                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <DialogTitle className="text-base font-semibold text-foreground">
                                {editingStudent ? 'Cập Nhật Hồ Sơ Học Sinh' : 'Thêm Học Sinh Mới'}
                            </DialogTitle>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {step === 1 ? 'Bước 1/3: Thông tin cá nhân & liên hệ' :
                                    step === 2 ? 'Bước 2/3: Thiết lập học vụ & ghi chú' :
                                        'Bước 3/3: Tài khoản học sinh (Tùy chọn)'}
                            </p>
                        </div>
                    </div>

                    {/* Step indicator */}
                    <div className="grid grid-cols-3 gap-2 mt-4">
                        <div className={cn("h-1.5 rounded-full transition-colors", step >= 1 ? "bg-primary" : "bg-muted")} />
                        <div className={cn("h-1.5 rounded-full transition-colors", step >= 2 ? "bg-primary" : "bg-muted")} />
                        <div className={cn("h-1.5 rounded-full transition-colors", step >= 3 ? "bg-primary" : "bg-muted")} />
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 p-5 overflow-y-auto min-h-0">
                    {step === 1 && (
                        <div className="space-y-4">
                            {/* Basic Info */}
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-sm font-medium">
                                    Họ và tên <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Ví dụ: Nguyễn Văn A"
                                    className="h-10 rounded-lg"
                                    value={formData.name}
                                    onChange={e => updateField('name', e.target.value)}
                                />
                            </div>

                            {/* Parent Selection */}
                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium">Phụ huynh liên kết</Label>
                                <div className="flex gap-2">
                                    <Select
                                        value={formData.parentId?.toString() || ''}
                                        onValueChange={(val) => updateField('parentId', Number(val))}
                                    >
                                        <SelectTrigger className="flex-1 h-10 rounded-lg">
                                            <SelectValue placeholder="-- Chọn phụ huynh --" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {parents.map(parent => (
                                                <SelectItem key={parent.id} value={parent.id.toString()}>
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
                                        className="h-10 w-10 shrink-0 rounded-lg"
                                        onClick={() => setShowAddParent(true)}
                                        title="Thêm phụ huynh mới"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div className="space-y-1.5">
                                    <Label htmlFor="phone" className="text-sm font-medium">Số điện thoại</Label>
                                    <Input
                                        id="phone"
                                        placeholder="0901234567"
                                        className="h-10 rounded-lg"
                                        value={formData.phone || ''}
                                        onChange={e => updateField('phone', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="startMonth" className="text-sm font-medium">Tháng bắt đầu</Label>
                                    <Input
                                        id="startMonth"
                                        type="month"
                                        className="h-10 rounded-lg"
                                        value={formData.startMonth || ''}
                                        onChange={e => updateField('startMonth', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="schedule" className="text-sm font-medium">
                                    Lịch học cố định <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="schedule"
                                    placeholder="Ví dụ: T2, T4 (18:00 - 19:30)"
                                    className="h-10 rounded-lg"
                                    value={formData.schedule}
                                    onChange={e => updateField('schedule', e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">Nhập tóm tắt lịch học để hiển thị trên thẻ.</p>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            {/* Status Toggle */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Trạng thái học tập</Label>
                                <div className="bg-muted/40 p-1 rounded-lg inline-flex w-full border border-border">
                                    <button
                                        type="button"
                                        onClick={() => updateField('active', true)}
                                        className={cn(
                                            "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors",
                                            formData.active
                                                ? "bg-background text-foreground shadow-sm"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Đang học
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => updateField('active', false)}
                                        className={cn(
                                            "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors",
                                            !formData.active
                                                ? "bg-background text-foreground shadow-sm"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Đã nghỉ / Tạm dừng
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Nguồn học sinh</Label>
                                <div className="bg-muted/40 p-1 rounded-lg inline-flex w-full border border-border">
                                    {([
                                        ['trung_tam', 'Trung tâm'],
                                        ['day_rieng', 'Dạy riêng'],
                                    ] as const).map(([value, label]) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => updateField('nguon', value)}
                                            className={cn(
                                                "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors",
                                                formData.nguon === value
                                                    ? "bg-background text-foreground shadow-sm"
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            {/* Hourly Rate */}
                            <div className="space-y-1.5">
                                <Label htmlFor="price" className="text-sm font-medium">Học phí / giờ (VNĐ)</Label>
                                <div className="relative">
                                    <Input
                                        id="price"
                                        type="number"
                                        placeholder="200000"
                                        className="h-10 pl-3 pr-8 rounded-lg"
                                        value={formData.pricePerHour}
                                        onChange={e => updateField('pricePerHour', Number(e.target.value))}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium pointer-events-none">
                                        đ
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground text-right">{formatCurrency(formData.pricePerHour)} / buổi 1h</p>
                            </div>

                            {/* Notes */}
                            <div className="space-y-1.5">
                                <Label htmlFor="notes" className="text-sm font-medium">Ghi chú thêm</Label>
                                <Textarea
                                    id="notes"
                                    rows={3}
                                    placeholder="Ghi chú về trình độ, mục tiêu hoặc cần lưu ý..."
                                    className="resize-none rounded-lg"
                                    value={formData.notes || ''}
                                    onChange={e => updateField('notes', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            {/* Create Account Toggle */}
                            <div className={cn(
                                "p-4 rounded-xl border transition-colors",
                                formData.createAccount
                                    ? "bg-primary/5 border-primary/30"
                                    : "bg-muted/30 border-border"
                            )}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                                            formData.createAccount ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                        )}>
                                            <ShieldCheck className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-semibold cursor-pointer" htmlFor="createAccount">
                                                Tạo tài khoản học sinh
                                            </Label>
                                            <p className="text-xs text-muted-foreground">Cho phép học sinh đăng nhập vào hệ thống</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        id="createAccount"
                                        onClick={() => updateField('createAccount', !formData.createAccount)}
                                        className={cn(
                                            "w-11 h-6 rounded-full relative transition-colors duration-200 focus:outline-none",
                                            formData.createAccount ? "bg-primary" : "bg-muted-foreground/30"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 shadow-sm",
                                            formData.createAccount ? "translate-x-5" : "translate-x-0"
                                        )} />
                                    </button>
                                </div>
                            </div>

                            {formData.createAccount && (
                                <div className="space-y-4 pt-1">
                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1.5">
                                                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                                                Email đăng nhập
                                            </Label>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 text-xs px-2 text-primary hover:text-primary/80"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    generateEmailFromStudentName();
                                                }}
                                            >
                                                Tự động tạo
                                            </Button>
                                        </div>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="hocsinh@students.tutormanagement.com"
                                            className="h-10 rounded-lg"
                                            value={formData.email || ''}
                                            onChange={e => updateField('email', e.target.value)}
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="pass" className="text-sm font-medium flex items-center gap-1.5">
                                                <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                                                Mật khẩu
                                            </Label>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 text-xs px-2 text-primary hover:text-primary/80"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    generatePassword();
                                                }}
                                            >
                                                <RefreshCw className="w-3 h-3 mr-1" />
                                                Ngẫu nhiên
                                            </Button>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="pass"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Mật khẩu"
                                                className="h-10 pl-3 pr-10 rounded-lg"
                                                value={formData.password || ''}
                                                onChange={e => updateField('password', e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!formData.createAccount && (
                                <div className="text-center py-6 px-4 bg-muted/20 rounded-xl border border-dashed border-border">
                                    <ShieldCheck className="w-7 h-7 text-muted-foreground/40 mx-auto mb-2" />
                                    <p className="text-xs text-muted-foreground max-w-[280px] mx-auto">
                                        Học sinh sẽ không có tài khoản đăng nhập. Bạn có thể thiết lập tài khoản này sau bất cứ lúc nào.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border flex gap-2.5 flex-shrink-0 bg-card">
                    <Button
                        variant="outline"
                        className="flex-1 h-10 font-medium"
                        onClick={step === 1 ? onClose : () => setStep(prev => prev - 1)}
                        disabled={loading}
                    >
                        {step === 1 ? 'Hủy' : 'Quay lại'}
                    </Button>

                    {step < 3 ? (
                        <Button
                            className="flex-1 h-10 font-medium"
                            onClick={() => setStep(prev => prev + 1)}
                            disabled={!formData.name || !formData.schedule}
                        >
                            Tiếp tục
                            <ChevronRight className="w-4 h-4 ml-1.5" />
                        </Button>
                    ) : (
                        <Button
                            className="flex-1 h-10 font-medium"
                            onClick={submit}
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Check className="w-4 h-4 mr-1.5" />
                            )}
                            {editingStudent ? 'Lưu Thay Đổi' : 'Tạo Học Sinh'}
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