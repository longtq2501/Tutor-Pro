"use client";

import { useState } from "react";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RatingSelect } from "./generator/RatingSelect";
import { TemplateManagerModal } from "./templates/TemplateManagerModal";
import { SaveTemplateModal } from "./templates/SaveTemplateModal";
import { useFeedbackTemplates } from "../hooks/useFeedbackTemplates";
import { FeedbackTemplate } from "../types";
import { Zap, Bookmark, Settings2, Plus, Sparkles, X, Check } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export interface CommentGeneratorProps {
    /** The form instance from react-hook-form */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: any;
    /** Label for the section */
    label: string;
    /** The field name for the rating selection */
    ratingField: string;
    /** The field name for the final comment text */
    commentField: string;
    /** The feedback category (e.g., ATTITUDE, ABSORPTION) */
    category: "ATTITUDE" | "ABSORPTION" | "GAPS" | "SOLUTIONS";
    /** List of available rating values */
    ratings?: string[];
    /** Name of the student */
    studentName?: string;
    /** If true, the rating selection UI is hidden (used for GAPS/SOLUTIONS) */
    hideRating?: boolean;
    /** The subject being taught */
    subject?: string;
    /** Targeted language for the comment */
    language?: string;
}

/**
 * Fast, tutor-friendly comment editor with quick templates and snippet management.
 * Replaces high-latency/unreliable AI generation with instant, customizable personal snippets.
 */
export function CommentGenerator({
    form,
    label,
    ratingField,
    commentField,
    category,
    ratings = [],
    hideRating = false,
}: CommentGeneratorProps) {
    const { templates, isLoading } = useFeedbackTemplates(category);

    const [isManagerOpen, setIsManagerOpen] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [recentlyAppliedId, setRecentlyAppliedId] = useState<number | null>(null);

    const currentComment = form.watch(commentField) || "";

    const handleApplyTemplate = (template: FeedbackTemplate) => {
        const text = template.content.trim();
        const currentText = (form.getValues(commentField) || "").trim();

        if (!currentText) {
            form.setValue(commentField, text, { shouldDirty: true, shouldValidate: true });
        } else {
            // Append with a newline if text already exists
            form.setValue(commentField, `${currentText}\n${text}`, {
                shouldDirty: true,
                shouldValidate: true,
            });
        }

        setRecentlyAppliedId(template.id);
        setTimeout(() => setRecentlyAppliedId(null), 1500);
    };

    const handleClearComment = () => {
        form.setValue(commentField, "", { shouldDirty: true, shouldValidate: true });
    };

    // Show top 4 templates as quick chips
    const quickChips = templates.slice(0, 4);

    return (
        <div className="relative p-5 rounded-[2rem] bg-card/70 dark:bg-slate-900/60 backdrop-blur-xl border border-border/50 dark:border-slate-800 shadow-sm space-y-4 transition-all duration-300 hover:border-primary/20">
            {/* Header: Rating or Section Label */}
            {!hideRating ? (
                <div className="space-y-3">
                    <RatingSelect
                        form={form}
                        name={ratingField}
                        label={label}
                        ratings={ratings}
                    />
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <div className="h-4 w-1 bg-primary/60 rounded-full" />
                    <div className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                        {label}
                    </div>
                </div>
            )}

            {/* Quick Templates Bar */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground font-semibold text-[11px]">
                        <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>Mẫu câu nhanh:</span>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsManagerOpen(true)}
                        className="h-6 px-2 text-[11px] text-primary hover:text-primary/80 hover:bg-primary/5 rounded-lg gap-1 font-medium"
                    >
                        <Settings2 className="w-3 h-3" />
                        Quản lý kho mẫu ({templates.length})
                    </Button>
                </div>

                <TooltipProvider delayDuration={200}>
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {quickChips.map((t) => {
                            const isApplied = recentlyAppliedId === t.id;
                            return (
                                <Tooltip key={t.id}>
                                    <TooltipTrigger asChild>
                                        <button
                                            type="button"
                                            onClick={() => handleApplyTemplate(t)}
                                            className={`text-[11px] px-2.5 py-1 rounded-xl border transition-all flex items-center gap-1 font-medium ${
                                                isApplied
                                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 scale-95"
                                                    : "bg-muted/40 hover:bg-primary/10 border-border/40 hover:border-primary/30 text-foreground"
                                            }`}
                                        >
                                            {isApplied ? (
                                                <Check className="w-3 h-3 text-emerald-500" />
                                            ) : (
                                                <Plus className="w-3 h-3 text-muted-foreground" />
                                            )}
                                            <span>{t.title}</span>
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="bottom"
                                        className="max-w-[280px] text-xs p-2.5 rounded-xl shadow-lg leading-relaxed"
                                    >
                                        {t.content}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}

                        {templates.length > 4 && (
                            <button
                                type="button"
                                onClick={() => setIsManagerOpen(true)}
                                className="text-[11px] px-2 py-1 rounded-xl bg-muted/30 hover:bg-muted text-muted-foreground border border-dashed border-border/60 transition-all font-medium"
                            >
                                +{templates.length - 4} mẫu khác
                            </button>
                        )}

                        {templates.length === 0 && !isLoading && (
                            <span className="text-[11px] text-muted-foreground/70 italic">
                                Chưa có mẫu câu nào. Bấm Quản lý để thêm mẫu đầu tiên!
                            </span>
                        )}
                    </div>
                </TooltipProvider>
            </div>

            {/* Comment Textarea Area */}
            <FormField
                control={form.control}
                name={commentField}
                render={({ field }) => (
                    <FormItem className="space-y-1.5">
                        <FormControl>
                            <div className="relative">
                                <Textarea
                                    {...field}
                                    placeholder="Nhập nhận xét chi tiết hoặc bấm chọn mẫu câu nhanh ở trên..."
                                    className="min-h-[6.5rem] resize-none focus-visible:ring-primary/20 rounded-2xl bg-muted/20 border-border/40 text-[13px] font-medium leading-relaxed p-3.5 pb-8 transition-all focus:bg-background shadow-inner placeholder:text-muted-foreground/50"
                                />

                                {/* Bottom Toolbar within Textarea */}
                                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        {field.value && field.value.trim() && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setIsSaveModalOpen(true)}
                                                className="h-6 px-2 text-[11px] rounded-lg text-primary hover:text-primary hover:bg-primary/10 gap-1 font-semibold"
                                            >
                                                <Bookmark className="w-3 h-3" />
                                                Lưu thành mẫu
                                            </Button>
                                        )}
                                        {field.value && field.value.trim() && (
                                            <button
                                                type="button"
                                                onClick={handleClearComment}
                                                className="text-muted-foreground hover:text-destructive flex items-center gap-0.5 transition-colors"
                                            >
                                                <X className="w-3 h-3" /> Xóa
                                            </button>
                                        )}
                                    </div>

                                    <span className="font-mono text-[10px] text-muted-foreground/70 tabular-nums">
                                        {(field.value || "").length} ký tự
                                    </span>
                                </div>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Modals */}
            <TemplateManagerModal
                open={isManagerOpen}
                onOpenChange={setIsManagerOpen}
                initialCategory={category}
                onSelectTemplate={handleApplyTemplate}
            />

            <SaveTemplateModal
                open={isSaveModalOpen}
                onOpenChange={setIsSaveModalOpen}
                initialContent={currentComment}
                initialCategory={category}
            />
        </div>
    );
}
