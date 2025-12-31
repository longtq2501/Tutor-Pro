import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { parentsApi } from '@/lib/services';
import { toast } from 'sonner';
import { Loader2, Plus, UserPlus, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

interface QuickAddParentModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (newParentId?: number) => void;
}

export function QuickAddParentModal({ open, onClose, onSuccess }: QuickAddParentModalProps) {
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        notes: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Vui lòng nhập tên phụ huynh');
            return;
        }

        try {
            setLoading(true);
            const res = await parentsApi.create(formData);
            toast.success('Thêm phụ huynh thành công');

            // Invalidate parents list to refresh dropdowns
            await queryClient.invalidateQueries({ queryKey: ['parents'] });

            onSuccess(res.id);
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Không thể thêm phụ huynh. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] w-[95vw] max-w-[95vw] sm:w-full max-h-[92vh] p-0 overflow-hidden bg-card rounded-3xl shadow-2xl border-2 border-border/50 transition-all duration-300 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b bg-gradient-to-br from-muted/30 to-muted/10 rounded-t-3xl flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <UserPlus className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-xl font-bold tracking-tight">
                                Thêm Phụ Huynh Mới
                            </DialogTitle>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Thông tin liên hệ & ghi chú
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                    <form id="parent-form" onSubmit={handleSubmit} className="space-y-5 animate-in slide-in-from-left-4 fade-in duration-300">
                        <div className="space-y-2">
                            <Label htmlFor="parent-name" className="text-sm font-medium">Họ tên <span className="text-red-500">*</span></Label>
                            <Input
                                id="parent-name"
                                placeholder="Ví dụ: Nguyễn Văn A"
                                className="h-11 rounded-xl border-muted-foreground/20 focus:border-primary/50 transition-colors"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                disabled={loading}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="parent-email" className="text-sm font-medium">Email</Label>
                                <Input
                                    id="parent-email"
                                    type="email"
                                    placeholder="example@email.com"
                                    className="h-11 rounded-xl border-muted-foreground/20 focus:border-primary/50 transition-colors"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="parent-phone" className="text-sm font-medium">Số điện thoại</Label>
                                <Input
                                    id="parent-phone"
                                    placeholder="0901234567"
                                    className="h-11 rounded-xl border-muted-foreground/20 focus:border-primary/50 transition-colors"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="parent-notes" className="text-sm font-medium">Ghi chú</Label>
                            <Textarea
                                id="parent-notes"
                                placeholder="Ghi chú về phụ huynh..."
                                className="resize-none rounded-xl border-muted-foreground/20 focus:border-primary/50 transition-colors"
                                rows={3}
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                disabled={loading}
                            />
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 p-6 border-t flex gap-3 bg-gradient-to-br from-muted/10 to-muted/30 rounded-b-3xl relative z-10">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1 h-11 rounded-xl hover:bg-muted/50 transition-all"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Hủy Bỏ
                    </Button>
                    <Button
                        type="submit"
                        form="parent-form"
                        className="flex-1 h-11 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-md hover:shadow-lg transition-all"
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Plus className="w-4 h-4 mr-2" />
                        )}
                        Thêm Mới
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
