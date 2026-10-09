"use client";

import { cn } from "@/lib/utils";
import { FormValues } from "../../hooks/useSmartFeedbackForm";

interface ReadOnlyFieldProps {
    label: string;
    content?: string | null;
    rating?: string;
    className?: string;
}

/** Single read-only field — unified style matching edit mode */
const ReadOnlyField = ({ label, content, rating, className }: ReadOnlyFieldProps) => (
    <div className={cn("space-y-1.5", className)}>
        {/* P4: sentence-case label, 13-14px, weight 500 — no uppercase/numbering */}
        <h4 className="text-[13px] font-medium text-muted-foreground">{label}</h4>
        <div className="px-0 py-1 min-h-[2rem]">
            {rating && (
                <span className="inline-block px-2.5 py-0.5 mb-1.5 mr-2 rounded-lg bg-primary/10 text-primary text-[12px] font-semibold">
                    {rating}
                </span>
            )}
            {content ? (
                <p className="whitespace-pre-wrap leading-relaxed text-[13px] text-foreground/90">{content}</p>
            ) : (
                <span className="text-muted-foreground/40 italic text-[12px]">Chưa có thông tin...</span>
            )}
        </div>
    </div>
);

interface FeedbackViewModeProps {
    values: FormValues;
}

export function FeedbackViewMode({ values }: FeedbackViewModeProps) {
    return (
        <div className="space-y-5 animate-in fade-in transition-transform duration-200">
            {/* Section: Buổi học */}
            <section className="space-y-3">
                <h4 className="text-[13px] font-semibold text-muted-foreground pb-1.5 border-b border-border/40">
                    Buổi học
                </h4>
                <ReadOnlyField
                    label="Nội dung bài học"
                    content={values.lessonContent}
                />
            </section>

            {/* Section: Đánh giá */}
            <section className="space-y-3">
                <h4 className="text-[13px] font-semibold text-muted-foreground pb-1.5 border-b border-border/40">
                    Đánh giá
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </section>

            {/* Section: Cần cải thiện */}
            {(values.knowledgeGaps || values.solutions) && (
                <section className="space-y-3">
                    <h4 className="text-[13px] font-semibold text-muted-foreground pb-1.5 border-b border-border/40">
                        Cần cải thiện
                    </h4>
                    <div className="space-y-4">
                        <ReadOnlyField
                            label="Kiến thức chưa nắm vững"
                            content={values.knowledgeGaps}
                        />
                        <ReadOnlyField
                            label="Lý do / giải pháp"
                            content={values.solutions}
                        />
                    </div>
                </section>
            )}
        </div>
    );
}
