"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { useSmartFeedback } from "../hooks/useSmartFeedback";
import { KeywordList } from "./generator/KeywordList";
import { GeneratorActions } from "./generator/GeneratorActions";
import { RatingSelect } from "./generator/RatingSelect";

interface CommentGeneratorProps {
    form: UseFormReturn<any>;
    label: string;
    ratingField: string;
    commentField: string;
    category: "ATTITUDE" | "ABSORPTION" | "GAPS" | "SOLUTIONS";
    ratings?: string[];
    studentName: string;
    hideRating?: boolean;
}

export function CommentGenerator({
    form,
    label,
    ratingField,
    commentField,
    category,
    ratings = [],
    studentName,
    hideRating = false,
}: CommentGeneratorProps) {
    const {
        keywords,
        selectedKeywords,
        isGenerating,
        currentRating,
        toggleKeyword,
        generate,
    } = useSmartFeedback({
        form,
        ratingField,
        commentField,
        category,
        studentName,
        hideRating,
    });

    return (
        <div className="relative group/generator p-5 rounded-[2rem] bg-card/60 backdrop-blur-xl border border-border/40 shadow-xl shadow-primary/5 space-y-5 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none opacity-0 group-hover/generator:opacity-100 transition-opacity duration-700" />

            {!hideRating ? (
                <div className="space-y-3">
                    <RatingSelect form={form} name={ratingField} label={label} ratings={ratings} />
                </div>
            ) : (
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-1 w-4 bg-primary/40 rounded-full" />
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                        {label}
                    </div>
                </div>
            )}

            <div className="relative space-y-4">
                <KeywordList
                    keywords={keywords}
                    selectedKeywords={selectedKeywords}
                    onToggle={toggleKeyword}
                />

                <GeneratorActions
                    onGenerate={generate}
                    isGenerating={isGenerating}
                    disabled={!currentRating && !hideRating}
                />
            </div>

            <FormField
                control={form.control}
                name={commentField}
                render={({ field }) => (
                    <FormItem className="relative">
                        <FormControl>
                            <div className="relative">
                                <Textarea
                                    {...field}
                                    placeholder="Nhận xét chi tiết... (AI sẽ giúp bạn tinh chỉnh nội dung này)"
                                    className="min-h-[7rem] resize-none focus-visible:ring-primary/20 rounded-2xl bg-muted/30 border-border/40 text-[13px] font-medium leading-relaxed p-4 transition-all duration-300 focus:bg-background shadow-inner"
                                />
                                {/* Bottom Decoration */}
                                <div className="absolute bottom-2 right-3 flex items-center gap-1.5 opacity-40">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-primary italic">AI Assisted</span>
                                </div>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
