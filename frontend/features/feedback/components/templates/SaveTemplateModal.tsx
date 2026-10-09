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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bookmark, Loader2 } from "lucide-react";
import { useFeedbackTemplates } from "../../hooks/useFeedbackTemplates";

interface SaveTemplateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialContent: string;
    initialCategory: string;
}

export function SaveTemplateModal({
    open,
    onOpenChange,
    initialContent,
    initialCategory,
}: SaveTemplateModalProps) {
    const { createTemplate, isCreating } = useFeedbackTemplates();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState(initialContent);
    const [category, setCategory] = useState(initialCategory || "ATTITUDE");

    // Sync content if initialContent changes when opened
    const handleOpenChange = (isOpen: boolean) => {
        if (isOpen) {
            setContent(initialContent);
            setCategory(initialCategory || "ATTITUDE");
            setTitle("");
        }
        onOpenChange(isOpen);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        await createTemplate({
            title: title.trim(),
            content: content.trim(),
            category,
        });

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[480px] p-6 rounded-3xl">
                <DialogHeader className="pb-2 border-b border-border/40">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <Bookmark className="w-4 h-4" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-bold">
                                Lưu thành mẫu câu mới
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                Lưu nội dung này để tái sử dụng nhanh cho các buổi dạy sau
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground">
                            Tên gợi nhớ của mẫu câu <span className="text-destructive">*</span>
                        </label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="VD: Khen thái độ tích cực, Nhắc bài tập..."
                            className="h-9 rounded-xl text-xs"
                            autoFocus
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
                            Nội dung nhận xét <span className="text-destructive">*</span>
                        </label>
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[100px] rounded-xl text-xs leading-relaxed"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onOpenChange(false)}
                            className="rounded-xl text-xs"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={isCreating || !title.trim()}
                            className="rounded-xl text-xs gap-1.5"
                        >
                            {isCreating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            Lưu mẫu câu
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
