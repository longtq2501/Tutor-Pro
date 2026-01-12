"use client";

import { cn } from "@/lib/utils";
import { FormValues } from "../../hooks/useSmartFeedbackForm";

interface ReadOnlyFieldProps {
    label: string;
    content?: string | null;
    rating?: string;
    className?: string;
}

const ReadOnlyField = ({ label, content, rating, className }: ReadOnlyFieldProps) => (
    <div className={cn("space-y-1.5", className)}>
        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</h4>
        <div className="p-3 bg-white dark:bg-muted/20 border border-border/40 rounded-xl min-h-[3rem] text-sm">
            {rating && (
                <span className="inline-block px-2 py-0.5 mb-1.5 mr-2 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wide">
                    {rating}
                </span>
            )}
            {content ? (
                <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">{content}</p>
            ) : (
                <span className="text-muted-foreground/40 italic text-xs">Chưa có thông tin...</span>
            )}
        </div>
    </div>
);

interface FeedbackViewModeProps {
    values: FormValues;
}

export function FeedbackViewMode({ values }: FeedbackViewModeProps) {
    return (
        <div className="space-y-6 animate-in fade-in transition-transform duration-200">
            <ReadOnlyField
                label="1. Nội dung bài học"
                content={values.lessonContent}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ReadOnlyField
                    label="2. Thái độ học tập"
                    rating={values.attitudeRating}
                    content={values.attitudeComment}
                />
                <ReadOnlyField
                    label="3. Khả năng tiếp thu"
                    rating={values.absorptionRating}
                    content={values.absorptionComment}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ReadOnlyField
                    label="4. Kiến thức chưa nắm vững"
                    content={values.knowledgeGaps}
                />
                <ReadOnlyField
                    label="5. Lý do / Giải pháp"
                    content={values.solutions}
                />
            </div>
        </div>
    );
}
