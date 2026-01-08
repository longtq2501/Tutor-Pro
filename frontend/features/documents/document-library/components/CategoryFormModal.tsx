import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { documentsApi } from '@/lib/services';
import type { Category } from '@/lib/types';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Palette } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/hooks/useQueryKeys';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Category | null;
    onSuccess?: () => void;
}

export function CategoryFormModal({ open, onOpenChange, initialData, onSuccess }: Props) {
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        active: true,
        displayOrder: 0,
        color: '#3b82f6',
        icon: '📁'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                code: initialData.code,
                description: initialData.description || '',
                active: initialData.active ?? true,
                displayOrder: initialData.displayOrder || 0,
                color: initialData.color || '#3b82f6',
                icon: initialData.icon || '📁'
            });
        } else {
            // Reset for create mode
            setFormData({
                name: '',
                code: '',
                description: '',
                active: true,
                displayOrder: 0,
                color: '#3b82f6',
                icon: '📁'
            });
        }
    }, [initialData, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const promise = initialData
            ? documentsApi.updateCategory(initialData.id, formData)
            : documentsApi.createCategory(formData);

        toast.promise(promise, {
            loading: initialData ? 'Đang cập nhật danh mục...' : 'Đang tạo danh mục...',
            success: (data) => {
                // Invalidate queries
                queryClient.invalidateQueries({ queryKey: [...queryKeys.documents.all, 'categories'] });
                onSuccess?.();
                onOpenChange(false);
                return initialData
                    ? `Cập nhật danh mục "${data.name}" thành công`
                    : `Tạo danh mục "${data.name}" thành công`;
            },
            error: (err) => {
                console.error(err);
                return err?.response?.data?.message || (initialData ? 'Không thể cập nhật danh mục' : 'Không thể tạo danh mục');
            }
        });

        promise.finally(() => setLoading(false));
    };

    // Auto-generate code from name if creating
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        if (!initialData) {
            const suggestedCode = name
                .toUpperCase()
                .normalize('NFD') // Remove accents
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^A-Z0-9]/g, '_');
            setFormData(prev => ({ ...prev, name, code: suggestedCode }));
        } else {
            setFormData(prev => ({ ...prev, name }));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Tên danh mục <span className="text-destructive">*</span></Label>
                        <Input
                            id="name"
                            required
                            placeholder="Ví dụ: Tài liệu IELTS"
                            value={formData.name}
                            onChange={handleNameChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="icon">Biểu tượng / Emoji</Label>
                            <Input
                                id="icon"
                                placeholder="📁, 📚..."
                                value={formData.icon}
                                onChange={e => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="color" className="flex items-center gap-2">
                                <Palette size={14} /> Màu sắc
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    id="color"
                                    type="color"
                                    value={formData.color}
                                    onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                    className="w-12 p-1 h-9 cursor-pointer"
                                />
                                <Input
                                    type="text"
                                    value={formData.color}
                                    onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                    className="flex-1 h-9 text-xs font-mono"
                                    placeholder="#3b82f6"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="code">Mã code <span className="text-destructive">*</span></Label>
                        <Input
                            id="code"
                            required
                            placeholder="AUTO_GENERATED"
                            value={formData.code}
                            onChange={e => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                            disabled={!!initialData} // Lock code editing for simplicity unless requested
                        />
                        <p className="text-[10px] text-muted-foreground">Mã code dùng để định danh hệ thống (duy nhất).</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả (Tùy chọn)</Label>
                        <Input
                            id="description"
                            placeholder="Mô tả ngắn gọn về danh mục..."
                            value={formData.description}
                            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Hủy</Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {initialData ? 'Lưu thay đổi' : 'Tạo mới'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
