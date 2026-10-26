"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Award, BookOpen, FileCheck2, FileText, Pencil, Sparkles } from "lucide-react";
import type { FormValues } from "../../hooks/useSmartFeedbackForm";

interface ReadOnlyFieldProps {
    label: string;
    content?: string | null;
    rating?: string;
    className?: string;
}

/** Single read-only field inside a clean card */
const ReadOnlyField = ({ label, content, rating, className }: ReadOnlyFieldProps) => (
    <div className={cn("space-y-1.5", className)}>
        <div className="flex items-center justify-between">
            <h5 className="text-xs font-semibold text-muted-foreground">{label}</h5>
            {rating && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold border border-primary/20">
                    {rating}
                </span>
            )}
        </div>
        <div className="p-3 rounded-lg bg-muted/30 border border-border/40 min-h-[2.5rem]">
            {content ? (
                <p className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm text-foreground/90 font-medium">
                    {content}
                </p>
            ) : (
                <span className="text-muted-foreground/50 italic text-xs">Chưa có nhận xét</span>
            )}
        </div>
    </div>
);

interface FeedbackViewModeProps {
    values: FormValues;
    hasData?: boolean;
    onEdit?: () => void;
}

export function FeedbackViewMode({ values, hasData, onEdit }: FeedbackViewModeProps) {
    // If no feedback data exists, show an elegant empty state with CTA
    if (!hasData) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-10 sm:py-14 px-4 h-full min-h-[300px]">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 shadow-2xs">
                    <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h4 className="text-base font-bold text-foreground mb-1.5">
                    Chưa có phiếu đánh giá
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mb-5 leading-relaxed">
                    Buổi học này chưa được ghi nhận đánh giá. Hãy viết nhận xét về nội dung bài học và tiến độ tiếp thu của học sinh.
                </p>
                {onEdit && (
                    <Button
                        type="button"
                        onClick={onEdit}
                        className="h-9 px-4 sm:px-5 rounded-xl bg-primary hover:bg-primary/90 font-semibold text-xs sm:text-sm gap-2 shadow-sm"
                    >
                        <Pencil size={14} />
                        <span>Viết đánh giá ngay</span>
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in transition-transform duration-200">
            {/* Section: Buổi học */}
            <div className="p-4 rounded-xl border border-border/50 bg-card shadow-2xs space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                    <BookOpen size={15} className="text-primary" />
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                        Nội dung bài học
                    </h4>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
                    <p className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm text-foreground/95 font-medium">
                        {values.lessonContent || "Chưa có nội dung"}
                    </p>
                </div>
            </div>

            {/* Section: Đánh giá */}
            <div className="p-4 rounded-xl border border-border/50 bg-card shadow-2xs space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                    <Award size={15} className="text-amber-500" />
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                        Đánh giá học sinh
                    </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <ReadOnlyField
                        label="Thái độ học tập"
                        rating={values.attitudeRating}
                        content={values.attitudeComment}
                    />
                    <ReadOnlyField
                        label="Khả năng tiếp thu"
                        rating={values.absorptionRating}
                        content={values.absorptionComment}
                    />
                </div>
            </div>

            {/* Section: Cần cải thiện */}
            {(values.knowledgeGaps || values.solutions) && (
                <div className="p-4 rounded-xl border border-amber-200/50 dark:border-amber-800/40 bg-amber-50/30 dark:bg-amber-950/20 shadow-2xs space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-amber-200/40 dark:border-amber-800/40">
                        <FileCheck2 size={15} className="text-amber-600 dark:text-amber-400" />
                        <h4 className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                            Cần cải thiện & Giải pháp
                        </h4>
                    </div>
                    <div className="space-y-3">
                        {values.knowledgeGaps && (
                            <ReadOnlyField
                                label="Kiến thức chưa nắm vững"
                                content={values.knowledgeGaps}
                            />
                        )}
                        {values.solutions && (
                            <ReadOnlyField
                                label="Lý do & giải pháp"
                                content={values.solutions}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
