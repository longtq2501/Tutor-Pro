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
            <DialogContent className="w-[calc(100%-1rem)] max-w-[calc(100vw-1rem)] sm:max-w-[600px] md:max-w-[700px] h-[95vh] sm:h-auto sm:max-h-[85vh] flex flex-col p-0 overflow-hidden gap-0 rounded-2xl sm:rounded-lg">
                <DialogHeader className="px-4 py-4 sm:p-6 sm:pb-4 shrink-0">
                    <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                        <Tag className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" />
                        <span className="truncate">Quản Lý Danh Mục</span>
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm">
                        Tạo và chỉnh sửa các danh mục để phân loại bài giảng.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4 space-y-4 sm:space-y-6 min-h-0">
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 border p-3 sm:p-4 rounded-xl sm:rounded-lg bg-muted/30">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="space-y-1.5 sm:space-y-2">
                                <Label htmlFor="cat-name" className="text-xs sm:text-sm">
                                    Tên danh mục
                                </Label>
                                <Input
                                    id="cat-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="VD: Toán học, Tiếng Anh..."
                                    required
                                    className="h-9 sm:h-10 text-sm"
                                />
                            </div>
                            <div className="space-y-1.5 sm:space-y-2">
                                <Label htmlFor="cat-color" className="text-xs sm:text-sm flex items-center gap-1.5">
                                    <Palette className="h-3.5 w-3.5 text-muted-foreground" />
                                    Màu sắc
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="cat-color"
                                        type="color"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="w-10 sm:w-12 p-1 h-9 sm:h-10 cursor-pointer"
                                    />
                                    <Input
                                        type="text"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="flex-1 h-9 sm:h-10 text-sm font-mono"
                                        placeholder="#3b82f6"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-1 sm:pt-2">
                            {isEditing && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={resetForm}
                                    className="h-8 sm:h-9 text-xs sm:text-sm px-3"
                                >
                                    Hủy
                                </Button>
                            )}
                            <Button
                                type="submit"
                                className="h-8 sm:h-9 text-xs sm:text-sm px-3"
                            >
                                {isEditing ? (
                                    <>
                                        <Pencil className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        Cập nhật
                                    </>
                                ) : (
                                    <>
                                        <Plus className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        Thêm mới
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>

                    {/* Categories List */}
                    <div>
                        <h4 className="font-semibold mb-2 sm:mb-3 text-xs sm:text-sm uppercase text-muted-foreground tracking-wider">
                            Danh sách hiện tại
                        </h4>
                        {isLoading ? (
                            <div className="flex justify-center py-8 sm:py-12">
                                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table */}
                                <div className="hidden sm:block border rounded-xl sm:rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-16">Màu</TableHead>
                                                <TableHead>Tên</TableHead>
                                                <TableHead className="text-right w-24">Thao tác</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {categories.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-center py-8 text-sm text-muted-foreground">
                                                        Chưa có danh mục nào
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                categories.map((cat) => (
                                                    <TableRow key={cat.id}>
                                                        <TableCell>
                                                            <div
                                                                className="w-5 h-5 rounded-full shadow-sm border border-white/20"
                                                                style={{ backgroundColor: cat.color || '#3b82f6' }}
                                                            />
                                                        </TableCell>
                                                        <TableCell className="font-medium">{cat.name}</TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleEdit(cat)}
                                                                    className="h-8 w-8"
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-destructive hover:text-destructive h-8 w-8"
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
                                </div>

                                {/* Mobile Cards */}
                                <div className="sm:hidden space-y-2">
                                    {categories.length === 0 ? (
                                        <div className="text-center py-8 text-sm text-muted-foreground border rounded-xl">
                                            Chưa có danh mục nào
                                        </div>
                                    ) : (
                                        categories.map((cat) => (
                                            <div
                                                key={cat.id}
                                                className="flex items-center gap-3 p-3 border rounded-xl bg-card active:scale-[0.98] transition-transform"
                                            >
                                                <div
                                                    className="w-10 h-10 rounded-full shadow-sm border-2 border-white/20 shrink-0"
                                                    style={{ backgroundColor: cat.color || '#3b82f6' }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">{cat.name}</p>
                                                    <p className="text-xs text-muted-foreground font-mono">{cat.color || '#3b82f6'}</p>
                                                </div>
                                                <div className="flex gap-1 shrink-0">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEdit(cat)}
                                                        className="h-8 w-8"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive h-8 w-8"
                                                        onClick={() => deleteCategory(cat.id)}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}