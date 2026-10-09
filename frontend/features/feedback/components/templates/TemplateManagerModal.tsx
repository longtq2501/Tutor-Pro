"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Edit2, Bookmark, Check, Sparkles, Loader2 } from "lucide-react";
import { useFeedbackTemplates } from "../../hooks/useFeedbackTemplates";
import { FeedbackTemplate } from "../../types";

interface TemplateManagerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialCategory?: string;
    onSelectTemplate?: (template: FeedbackTemplate) => void;
}

const CATEGORY_MAP: Record<string, string> = {
    ATTITUDE: "Thái độ",
    ABSORPTION: "Tiếp thu",
    GAPS: "Hổng kiến thức",
    SOLUTIONS: "Giải pháp",
    GENERAL: "Chung",
};

export function TemplateManagerModal({
    open,
    onOpenChange,
    initialCategory = "ALL",
    onSelectTemplate,
}: TemplateManagerModalProps) {
    const {
        templates,
        isLoading,
        createTemplate,
        isCreating,
        updateTemplate,
        isUpdating,
        deleteTemplate,
        isDeleting,
    } = useFeedbackTemplates();

    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<FeedbackTemplate | null>(null);

    // Form states
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState<string>("ATTITUDE");

    const filteredTemplates = templates.filter((t) => {
        if (selectedCategory === "ALL") return true;
        return t.category === selectedCategory || t.category === "GENERAL";
    });

    const handleOpenCreate = () => {
        setEditingTemplate(null);
        setTitle("");
        setContent("");
        setCategory(selectedCategory === "ALL" ? "ATTITUDE" : selectedCategory);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (t: FeedbackTemplate) => {
        setEditingTemplate(t);
        setTitle(t.title);
        setContent(t.content);
        setCategory(t.category);
        setIsFormOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        if (editingTemplate) {
            await updateTemplate(editingTemplate.id, {
                title: title.trim(),
                content: content.trim(),
                category,
            });
        } else {
            await createTemplate({
                title: title.trim(),
                content: content.trim(),
                category,
            });
        }

        setIsFormOpen(false);
        setEditingTemplate(null);
        setTitle("");
        setContent("");
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa mẫu câu này không?")) {
            await deleteTemplate(id);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[620px] max-h-[85vh] flex flex-col p-6 rounded-3xl">
                <DialogHeader className="pb-3 border-b border-border/40">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                <Bookmark className="w-5 h-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-base font-bold">
                                    Kho mẫu câu nhận xét
                                </DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                    Quản lý và sử dụng các câu nhận xét thường dùng để điền nhanh
                                </DialogDescription>
                            </div>
                        </div>
                        {!isFormOpen && (
                            <Button
                                size="sm"
                                onClick={handleOpenCreate}
                                className="rounded-xl gap-1.5 h-8 text-xs font-semibold shadow-sm"
                            >
                                <Plus className="w-3.5 h-3.5" /> Thêm mẫu mới
                            </Button>
                        )}
                    </div>
                </DialogHeader>

                {isFormOpen ? (
                    <form onSubmit={handleSave} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-foreground">
                                Tiêu đề mẫu câu <span className="text-destructive">*</span>
                            </label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="VD: Khen tiếp thu nhanh, Nhắc nhở bài tập..."
                                className="h-9 rounded-xl text-xs"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-foreground">
                                Phân loại mục
                            </label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="h-9 rounded-xl text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl">
                                    <SelectItem value="ATTITUDE">Thái độ học tập</SelectItem>
                                    <SelectItem value="ABSORPTION">Khả năng tiếp thu</SelectItem>
                                    <SelectItem value="GAPS">Hổng kiến thức</SelectItem>
                                    <SelectItem value="SOLUTIONS">Lý do / Giải pháp</SelectItem>
                                    <SelectItem value="GENERAL">Dùng chung mọi mục</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-foreground">
                                Nội dung nhận xét chi tiết <span className="text-destructive">*</span>
                            </label>
                            <Textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Nhập câu nhận xét hoàn chỉnh để chèn nhanh vào buổi học..."
                                className="min-h-[110px] rounded-xl text-xs leading-relaxed"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsFormOpen(false)}
                                className="rounded-xl text-xs"
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={isCreating || isUpdating}
                                className="rounded-xl text-xs gap-1.5"
                            >
                                {(isCreating || isUpdating) && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                {editingTemplate ? "Cập nhật" : "Lưu mẫu câu"}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="flex flex-col flex-1 min-h-0 space-y-3">
                        {/* Categories pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
                            <button
                                type="button"
                                onClick={() => setSelectedCategory("ALL")}
                                className={`px-3 py-1.5 rounded-full font-medium transition-all ${
                                    selectedCategory === "ALL"
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "bg-muted/60 text-muted-foreground hover:bg-muted"
                                }`}
                            >
                                Tất cả ({templates.length})
                            </button>
                            {Object.entries(CATEGORY_MAP).map(([catKey, catLabel]) => {
                                const count = templates.filter((t) => t.category === catKey).length;
                                return (
                                    <button
                                        key={catKey}
                                        type="button"
                                        onClick={() => setSelectedCategory(catKey)}
                                        className={`px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ${
                                            selectedCategory === catKey
                                                ? "bg-primary text-primary-foreground shadow-sm"
                                                : "bg-muted/60 text-muted-foreground hover:bg-muted"
                                        }`}
                                    >
                                        {catLabel} ({count})
                                    </button>
                                );
                            })}
                        </div>

                        {/* Templates List */}
                        <ScrollArea className="flex-1 pr-2 max-h-[380px]">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12 text-muted-foreground text-xs gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Đang tải danh sách mẫu...
                                </div>
                            ) : filteredTemplates.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground text-xs space-y-2">
                                    <p>Chưa có mẫu câu nào trong mục này.</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleOpenCreate}
                                        className="rounded-xl text-xs"
                                    >
                                        <Plus className="w-3.5 h-3.5 mr-1" /> Thêm mẫu đầu tiên
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {filteredTemplates.map((t) => (
                                        <div
                                            key={t.id}
                                            className="p-3.5 rounded-2xl border border-border/40 bg-card hover:bg-muted/30 transition-all flex flex-col gap-2 group"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-semibold text-xs text-foreground">
                                                        {t.title}
                                                    </span>
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-[10px] px-2 py-0.5 rounded-md font-normal"
                                                    >
                                                        {CATEGORY_MAP[t.category] || t.category}
                                                    </Badge>
                                                    {t.isSystem ? (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-[10px] px-2 py-0.5 rounded-md text-muted-foreground border-border/50"
                                                        >
                                                            Mặc định
                                                        </Badge>
                                                    ) : (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-[10px] px-2 py-0.5 rounded-md text-primary border-primary/30 bg-primary/5"
                                                        >
                                                            Cá nhân
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    {onSelectTemplate && (
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            onClick={() => {
                                                                onSelectTemplate(t);
                                                                onOpenChange(false);
                                                            }}
                                                            className="h-7 text-[11px] px-2.5 rounded-lg font-medium"
                                                        >
                                                            <Check className="w-3 h-3 mr-1" /> Dùng
                                                        </Button>
                                                    )}
                                                    {t.isOwner && (
                                                        <>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() => handleOpenEdit(t)}
                                                                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                            </Button>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                disabled={isDeleting}
                                                                onClick={() => handleDelete(t.id)}
                                                                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                                                {t.content}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
