"use client";

import { useState, useRef, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../../hooks/useSmartFeedbackForm";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useFeedbackTemplates } from "../../hooks/useFeedbackTemplates";
import { FeedbackTemplate } from "../../types";
import { TemplateManagerModal } from "../templates/TemplateManagerModal";
import { SaveTemplateModal } from "../templates/SaveTemplateModal";
import { Settings2, Plus, Bookmark, Zap } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface UnifiedFeedbackFieldProps {
    form: UseFormReturn<FormValues>;
    label: string;
    commentField: keyof FormValues;
    ratingField?: keyof FormValues;
    ratings?: string[];
    placeholder: string;
    category: "GENERAL" | "ATTITUDE" | "ABSORPTION" | "GAPS" | "SOLUTIONS";
    className?: string;
}

export function UnifiedFeedbackField({
    form,
    label,
    commentField,
    ratingField,
    ratings = ["Xuất Sắc", "Giỏi", "Khá", "Trung Bình", "Tệ"],
    placeholder,
    category,
    className,
}: UnifiedFeedbackFieldProps) {
    const { templates } = useFeedbackTemplates(category);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const [isFocused, setIsFocused] = useState(false);
    const [isManagerOpen, setIsManagerOpen] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const blurTimerRef = useRef<NodeJS.Timeout | null>(null);

    const currentComment = form.watch(commentField) || "";
    const currentRating = ratingField ? form.watch(ratingField) : undefined;

    // Auto-expand textarea height
    const handleInput = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.max(56, textareaRef.current.scrollHeight)}px`;
        }
    };

    useEffect(() => {
        handleInput();
    }, [currentComment]);

    const handleFocus = () => {
        if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
        setIsFocused(true);
    };

    const handleBlur = () => {
        // Delay blur so clicking on chips or modal buttons is not cancelled
        blurTimerRef.current = setTimeout(() => {
            setIsFocused(false);
        }, 220);
    };

    // Insert snippet at exact cursor position
    const handleInsertSnippet = (template: FeedbackTemplate) => {
        const text = template.content.trim();
        const textarea = textareaRef.current;
        const currentVal = form.getValues(commentField) || "";

        if (!textarea) {
            const nextVal = currentVal.trim() ? `${currentVal.trim()} ${text}` : text;
            form.setValue(commentField, nextVal, { shouldDirty: true, shouldValidate: true });
            return;
        }

        const start = textarea.selectionStart ?? currentVal.length;
        const end = textarea.selectionEnd ?? currentVal.length;
        const before = currentVal.substring(0, start);
        const after = currentVal.substring(end);

        const separator = before.length > 0 && !before.endsWith(" ") && !before.endsWith("\n") ? " " : "";
        const nextVal = `${before}${separator}${text}${after}`;

        form.setValue(commentField, nextVal, { shouldDirty: true, shouldValidate: true });

        // Maintain focus and advance cursor position
        requestAnimationFrame(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                const nextPos = start + separator.length + text.length;
                textareaRef.current.setSelectionRange(nextPos, nextPos);
                textareaRef.current.style.height = "auto";
                textareaRef.current.style.height = `${Math.max(56, textareaRef.current.scrollHeight)}px`;
            }
        });
    };

    return (
        <div className={cn("space-y-1.5", className)}>
            {/* Label: sentence case, 13-14px, weight 500, no uppercase/numbering */}
            <div className="flex items-center justify-between">
                <label className="text-[13px] sm:text-[14px] font-medium text-foreground tracking-normal block">
                    {label}
                </label>

                {/* Character counter: only shown when typed, >= 12px */}
                {currentComment.length > 0 && (
                    <span className="text-[12px] font-mono text-muted-foreground tabular-nums">
                        {currentComment.length} ký tự
                    </span>
                )}
            </div>

            {/* Rating Pill Selector (if field has rating) */}
            {ratingField && (
                <div
                    role="radiogroup"
                    aria-label={label}
                    className="flex flex-wrap items-center gap-1.5 pt-0.5 pb-1"
                >
                    {ratings.map((r) => {
                        const isSelected = currentRating === r;
                        return (
                            <button
                                key={r}
                                type="button"
                                role="radio"
                                aria-checked={isSelected}
                                aria-pressed={isSelected}
                                onClick={() =>
                                    form.setValue(ratingField, r, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                    })
                                }
                                className={cn(
                                    "text-[12px] px-2.5 py-1 rounded-lg border transition-all select-none font-medium",
                                    isSelected
                                        ? "bg-primary text-primary-foreground border-primary font-semibold shadow-sm"
                                        : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border/50"
                                )}
                            >
                                {r}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Unified Textarea Control */}
            <FormField
                control={form.control}
                name={commentField}
                render={({ field }) => (
                    <FormItem className="space-y-1.5">
                        <FormControl>
                            <div className="relative">
                                <Textarea
                                    {...field}
                                    ref={(e) => {
                                        field.ref(e);
                                        textareaRef.current = e;
                                    }}
                                    rows={2}
                                    placeholder={placeholder}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    onInput={handleInput}
                                    className="min-h-[56px] resize-none rounded-xl border border-border/60 bg-background px-3 py-2 text-[13px] leading-relaxed transition-colors focus:border-primary/60 focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground/50 placeholder:italic overflow-hidden"
                                />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Quick Templates Bar: ONLY shown when textarea is focused */}
            {isFocused && (
                <div
                    onMouseDown={(e) => e.preventDefault()}
                    className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar animate-in fade-in slide-in-from-top-1 duration-150"
                >
                    <div className="flex items-center gap-1 shrink-0 text-amber-500 mr-0.5">
                        <Zap className="w-3 h-3 fill-amber-500" />
                        <span className="text-[11px] font-medium text-muted-foreground hidden xs:inline">
                            Mẫu:
                        </span>
                    </div>

                    <TooltipProvider delayDuration={150}>
                        <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
                            {templates.slice(0, 5).map((t) => (
                                <Tooltip key={t.id}>
                                    <TooltipTrigger asChild>
                                        <button
                                            type="button"
                                            onClick={() => handleInsertSnippet(t)}
                                            className="text-[11px] px-2.5 py-0.5 rounded-lg border border-border/50 bg-muted/40 hover:bg-primary/10 hover:border-primary/40 text-foreground transition-all shrink-0 flex items-center gap-1 font-medium whitespace-nowrap active:scale-95"
                                        >
                                            <Plus className="w-3 h-3 text-muted-foreground" />
                                            <span>{t.title}</span>
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="bottom"
                                        className="max-w-[260px] text-xs p-2 rounded-lg leading-relaxed shadow-md"
                                    >
                                        {t.content}
                                    </TooltipContent>
                                </Tooltip>
                            ))}

                            {/* Settings icon button for template management */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        onClick={() => setIsManagerOpen(true)}
                                        className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                                        aria-label="Quản lý kho mẫu câu"
                                    >
                                        <Settings2 className="w-3.5 h-3.5" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs">
                                    Quản lý kho mẫu câu ({templates.length})
                                </TooltipContent>
                            </Tooltip>

                            {/* Bookmark button to save current text */}
                            {currentComment.trim().length > 0 && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            type="button"
                                            onClick={() => setIsSaveModalOpen(true)}
                                            className="p-1 rounded-md text-primary hover:bg-primary/10 transition-colors shrink-0 flex items-center gap-0.5 text-[11px] font-medium"
                                        >
                                            <Bookmark className="w-3.5 h-3.5" />
                                            <span className="hidden sm:inline">Lưu mẫu</span>
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="text-xs">
                                        Lưu câu này thành mẫu mới
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                    </TooltipProvider>
                </div>
            )}

            {/* Modals for managing & saving templates */}
            <TemplateManagerModal
                open={isManagerOpen}
                onOpenChange={setIsManagerOpen}
                initialCategory={category}
                onSelectTemplate={handleInsertSnippet}
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
