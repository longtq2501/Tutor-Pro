"use client";

import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../../hooks/useSmartFeedbackForm";
import { UnifiedFeedbackField } from "./UnifiedFeedbackField";

interface FeedbackFormFieldsProps {
    form: UseFormReturn<FormValues>;
    studentName?: string;
    ratings?: string[];
    subject?: string;
    language?: string;
}

/**
 * Standardized feedback form fields grouped into 3 clean sections:
 * 1. Buổi học (Nội dung bài học)
 * 2. Đánh giá (Thái độ học tập & Khả năng tiếp thu)
 * 3. Cần cải thiện (Kiến thức chưa nắm vững & Lý do / giải pháp)
 */
export function FeedbackFormFields({
    form,
    ratings = ["Xuất Sắc", "Giỏi", "Khá", "Trung Bình", "Tệ"],
}: FeedbackFormFieldsProps) {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Nhóm 1: Buổi học */}
            <section className="space-y-3">
                <h4 className="text-[13px] font-semibold text-muted-foreground pb-1.5 border-b border-border/40">
                    Buổi học
                </h4>
                <UnifiedFeedbackField
                    form={form}
                    label="Nội dung bài học"
                    commentField="lessonContent"
                    placeholder="VD: Ôn tập ngữ pháp thì Hiện tại hoàn thành, luyện phát âm..."
                    category="GENERAL"
                />
            </section>

            {/* Nhóm 2: Đánh giá */}
            <section className="space-y-3">
                <h4 className="text-[13px] font-semibold text-muted-foreground pb-1.5 border-b border-border/40">
                    Đánh giá
                </h4>
                {/* Side-by-side on desktop, vertical on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <UnifiedFeedbackField
                        form={form}
                        label="Thái độ học tập"
                        commentField="attitudeComment"
                        ratingField="attitudeRating"
                        ratings={ratings}
                        placeholder="VD: Tập trung, tương tác sôi nổi, có tiến bộ rõ rệt..."
                        category="ATTITUDE"
                    />

                    <UnifiedFeedbackField
                        form={form}
                        label="Khả năng tiếp thu"
                        commentField="absorptionComment"
                        ratingField="absorptionRating"
                        ratings={ratings}
                        placeholder="VD: Nắm chắc công thức cơ bản, bài nâng cao cần gợi ý..."
                        category="ABSORPTION"
                    />
                </div>
            </section>

            {/* Nhóm 3: Cần cải thiện */}
            <section className="space-y-3">
                <h4 className="text-[13px] font-semibold text-muted-foreground pb-1.5 border-b border-border/40">
                    Cần cải thiện
                </h4>
                <div className="space-y-5">
                    <UnifiedFeedbackField
                        form={form}
                        label="Kiến thức chưa nắm vững"
                        commentField="knowledgeGaps"
                        placeholder="VD: Chưa phân biệt được câu điều kiện loại 2 và 3..."
                        category="GAPS"
                    />

                    <UnifiedFeedbackField
                        form={form}
                        label="Lý do / giải pháp"
                        commentField="solutions"
                        placeholder="VD: Cần giao thêm 3 bài tập về nhà, nhắc nhở làm bài trước thứ 5..."
                        category="SOLUTIONS"
                    />
                </div>
            </section>
        </div>
    );
}
