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

/**
 * Props for the FeedbackFormFields component
 */
interface FeedbackFormFieldsProps {
    /** The form instance from react-hook-form */
    form: UseFormReturn<FormValues>;
    /** Name of the student */
    studentName: string;
    /** Available rating levels */
    ratings: string[];
    /** The subject being taught */
    subject?: string;
    /** Targeted language for comments */
    language?: string;
}

/**
 * Renders the collection of feedback fields for a session.
 * Includes lesson content, attitude, absorption, gaps, and solutions.
 * 
 * DESIGN: Uses a 1-column stack layout to provide maximum horizontal space
 * for AI-generated comments and manual input.
 */
export function FeedbackFormFields({
    form,
    studentName,
    ratings,
    subject,
    language
}: FeedbackFormFieldsProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 max-w-4xl mx-auto">
            <LessonContentSection form={form} />

            <div className="space-y-6">
                <PerformanceSection
                    form={form}
                    studentName={studentName}
                    ratings={ratings}
                    subject={subject}
                    language={language}
                />

                <GapSolutionsSection
                    form={form}
                    studentName={studentName}
                    subject={subject}
                    language={language}
                />
            </div>
        </div>
    );
}

/**
 * Section for inputting the main lesson content.
 */
function LessonContentSection({ form }: { form: UseFormReturn<FormValues> }) {
    return (
        <FormField
            control={form.control}
            name="lessonContent"
            render={({ field }) => (
                <FormItem className="bg-muted/20 p-6 rounded-[2rem] border border-border/40">
                    <FormLabel className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-4 block">
                        1. Nội dung bài học
                    </FormLabel>
                    <FormControl>
                        <Textarea
                            {...field}
                            placeholder="Hôm nay con học những gì? (e.g. Vocabulary, Grammar...)"
                            className="text-sm min-h-[100px] bg-background/50 rounded-2xl border-border/40 focus:bg-background transition-all"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

/**
 * Section for Attitude and Absorption feedback.
 */
function PerformanceSection({
    form,
    studentName,
    ratings,
    subject,
    language
}: FeedbackFormFieldsProps) {
    return (
        <div className="flex flex-col gap-6">
            <CommentGenerator
                form={form}
                label="2. Thái độ học tập"
                ratingField="attitudeRating"
                commentField="attitudeComment"
                category="ATTITUDE"
                ratings={ratings}
                studentName={studentName}
                subject={subject}
                language={language}
            />
            <CommentGenerator
                form={form}
                label="3. Khả năng tiếp thu"
                ratingField="absorptionRating"
                commentField="absorptionComment"
                category="ABSORPTION"
                ratings={ratings}
                studentName={studentName}
                subject={subject}
                language={language}
            />
        </div>
    );
}

/**
 * Section for Knowledge Gaps and Solutions.
 */
function GapSolutionsSection({
    form,
    studentName,
    subject,
    language
}: Omit<FeedbackFormFieldsProps, "ratings">) {
    return (
        <div className="flex flex-col gap-6">
            <CommentGenerator
                form={form}
                label="4. Kiến thức chưa nắm vững"
                ratingField="knowledgeGapsRating"
                commentField="knowledgeGaps"
                category="GAPS"
                studentName={studentName}
                hideRating={true}
                subject={subject}
                language={language}
            />
            <CommentGenerator
                form={form}
                label="5. Lý do / Giải pháp"
                ratingField="solutionsRating"
                commentField="solutions"
                category="SOLUTIONS"
                studentName={studentName}
                hideRating={true}
                subject={subject}
                language={language}
            />
        </div>
    );
}
