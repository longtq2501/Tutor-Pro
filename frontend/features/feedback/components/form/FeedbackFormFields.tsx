"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../../hooks/useSmartFeedbackForm";
import { CommentGenerator } from "../CommentGenerator";

interface FeedbackFormFieldsProps {
    form: UseFormReturn<FormValues>;
    studentName: string;
    ratings: string[];
}

export function FeedbackFormFields({ form, studentName, ratings }: FeedbackFormFieldsProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* 1. NỘI DUNG BÀI HỌC */}
            <FormField
                control={form.control}
                name="lessonContent"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                            1. Nội dung bài học
                        </FormLabel>
                        <FormControl>
                            <Textarea {...field} placeholder="Nhập nội dung..." className="text-sm min-h-[80px]" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* 2 & 3: Thái độ & Tiếp thu (Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CommentGenerator
                    form={form}
                    label="2. Thái độ học tập"
                    ratingField="attitudeRating"
                    commentField="attitudeComment"
                    category="ATTITUDE"
                    ratings={ratings}
                    studentName={studentName}
                />
                <CommentGenerator
                    form={form}
                    label="3. Khả năng tiếp thu"
                    ratingField="absorptionRating"
                    commentField="absorptionComment"
                    category="ABSORPTION"
                    ratings={ratings}
                    studentName={studentName}
                />
            </div>

            {/* 4 & 5: Hổng & Giải pháp (Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CommentGenerator
                    form={form}
                    label="4. Kiến thức chưa nắm vững"
                    ratingField="knowledgeGapsRating" // Placeholder, hideRating is true
                    commentField="knowledgeGaps"
                    category="GAPS"
                    studentName={studentName}
                    hideRating={true}
                />
                <CommentGenerator
                    form={form}
                    label="5. Lý do / Giải pháp"
                    ratingField="solutionsRating" // Placeholder, hideRating is true
                    commentField="solutions"
                    category="SOLUTIONS"
                    studentName={studentName}
                    hideRating={true}
                />
            </div>
        </div>
    );
}
