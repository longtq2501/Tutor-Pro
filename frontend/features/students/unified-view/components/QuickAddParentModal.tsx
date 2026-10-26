import React, { useState } from 'react';
import axios from 'axios';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { parentsApi } from '@/lib/services';
import { toast } from 'sonner';
import { Edit2, Loader2, Plus, UserPlus } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

interface QuickAddParentModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (newParentId?: number) => void;
    initialData?: {
        id: number;
        name: string;
        email?: string;
        phone?: string;
        notes?: string;
    } | null;
}

export function QuickAddParentModal({ open, onClose, onSuccess, initialData }: QuickAddParentModalProps) {
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        notes: initialData?.notes || ''
    });

    React.useEffect(() => {
        if (initialData) {
            setFormData({ name: initialData.name, email: initialData.email || '', phone: initialData.phone || '', notes: initialData.notes || '' });
        } else {
            setFormData({ name: '', email: '', phone: '', notes: '' });
        }
    }, [initialData, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) { toast.error('Vui lòng nhập tên phụ huynh'); return; }
        try {
            setLoading(true);
            let res;
            if (initialData?.id) {
                res = await parentsApi.update(initialData.id, formData);
                toast.success('Cập nhật phụ huynh thành công');
            } else {
                res = await parentsApi.create(formData);
                toast.success('Thêm phụ huynh thành công');
            }
            await queryClient.invalidateQueries({ queryKey: ['parents'] });
            await queryClient.invalidateQueries({ queryKey: ['students'] });
            onSuccess(res.id);
            onClose();
        } catch (error: unknown) {
            let errorMessage = (initialData?.id ? 'Không thể cập nhật phụ huynh' : 'Không thể thêm phụ huynh');
            if (axios.isAxiosError(error)) errorMessage = error.response?.data?.message || errorMessage;
            else if (error instanceof Error) errorMessage = error.message;
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const isEditing = !!initialData?.id;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[460px] w-[95vw] max-w-[95vw] sm:w-full p-0 bg-card rounded-2xl shadow-xl border border-border flex flex-col max-h-[90dvh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3.5 p-5 border-b border-border flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <UserPlus className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <DialogTitle className="text-base font-semibold">
                            {isEditing ? 'Chỉnh Sửa Phụ Huynh' : 'Thêm Phụ Huynh Mới'}
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {isEditing ? 'Cập nhật thông tin liên hệ' : 'Thông tin liên hệ & ghi chú'}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto min-h-0 p-5">
                    <form id="parent-form" onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="parent-name" className="text-sm font-medium">Họ tên <span className="text-destructive">*</span></Label>
                            <Input
                                id="parent-name"
                                placeholder="Ví dụ: Nguyễn Văn A"
                                className="h-10"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                disabled={loading}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="parent-email" className="text-sm font-medium">Email</Label>
                                <Input
                                    id="parent-email"
                                    type="email"
                                    placeholder="example@email.com"
                                    className="h-10"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="parent-phone" className="text-sm font-medium">Số điện thoại</Label>
                                <Input
                                    id="parent-phone"
                                    placeholder="0901234567"
                                    className="h-10"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="parent-notes" className="text-sm font-medium">Ghi chú</Label>
                            <Textarea
                                id="parent-notes"
                                placeholder="Ghi chú về phụ huynh..."
                                className="resize-none"
                                rows={3}
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                disabled={loading}
                            />
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border flex gap-2.5 flex-shrink-0">
                    <Button type="button" variant="outline" className="flex-1 h-10" onClick={onClose} disabled={loading}>
                        Hủy
                    </Button>
                    <Button type="submit" form="parent-form" className="flex-1 h-10" disabled={loading}>
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {loading ? 'Đang lưu...' : isEditing ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
