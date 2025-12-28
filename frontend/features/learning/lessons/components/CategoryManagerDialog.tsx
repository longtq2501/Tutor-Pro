'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    Plus,
    Pencil,
    Trash2,
    Loader2,
    Tag,
    Palette
} from 'lucide-react';
import { useLessonCategories } from '../hooks/useLessonCategories';
import { LessonCategoryDTO } from '../types';

interface CategoryManagerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CategoryManagerDialog({
    open,
    onOpenChange,
}: CategoryManagerDialogProps) {
    const { categories, isLoading, createCategory, updateCategory, deleteCategory } = useLessonCategories();
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        color: '#3b82f6',
        icon: 'folder',
        displayOrder: 0,
    });

    const resetForm = () => {
        setFormData({ name: '', color: '#3b82f6', icon: 'folder', displayOrder: 0 });
        setIsEditing(false);
        setEditingId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && editingId) {
            await updateCategory(editingId, formData);
        } else {
            await createCategory(formData);
        }
        resetForm();
    };

    const handleEdit = (category: LessonCategoryDTO) => {
        setFormData({
            name: category.name,
            color: category.color || '#3b82f6',
            icon: category.icon || 'folder',
            displayOrder: category.displayOrder || 0,
        });
        setEditingId(category.id);
        setIsEditing(true);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Tag className="h-5 w-5 text-primary" />
                        Quản Lý Danh Mục
                    </DialogTitle>
                    <DialogDescription>
                        Tạo và chỉnh sửa các danh mục để phân loại bài giảng.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg bg-muted/30">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cat-name">Tên danh mục</Label>
                            <Input
                                id="cat-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="VD: Toán học, Tiếng Anh..."
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cat-color">Màu sắc</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="cat-color"
                                    type="color"
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    className="w-12 p-1 h-10"
                                />
                                <Input
                                    type="text"
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    className="flex-1"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        {isEditing && (
                            <Button type="button" variant="ghost" onClick={resetForm}>
                                Hủy
                            </Button>
                        )}
                        <Button type="submit">
                            {isEditing ? (
                                <>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Cập nhật
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Thêm mới
                                </>
                            )}
                        </Button>
                    </div>
                </form>

                <div className="mt-6">
                    <h4 className="font-semibold mb-3 text-sm uppercase text-muted-foreground tracking-wider">Danh sách hiện tại</h4>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Màu</TableHead>
                                    <TableHead>Tên</TableHead>
                                    <TableHead className="text-right">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                                            Chưa có danh mục nào
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    categories.map((cat) => (
                                        <TableRow key={cat.id}>
                                            <TableCell>
                                                <div
                                                    className="w-4 h-4 rounded-full shadow-sm border border-white/20"
                                                    style={{ backgroundColor: cat.color || '#3b82f6' }}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{cat.name}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => deleteCategory(cat.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
