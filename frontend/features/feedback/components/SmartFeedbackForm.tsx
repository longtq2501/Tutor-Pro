"use client";

import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useSmartFeedbackForm } from "../hooks/useSmartFeedbackForm";
import { FeedbackHeader } from "./form/FeedbackHeader";
import { FeedbackViewMode } from "./form/FeedbackViewMode";
import { FeedbackFormFields } from "./form/FeedbackFormFields";

interface SmartFeedbackFormProps {
    sessionRecordId: number;
    studentId: number;
    studentName: string;
    onSuccess?: () => void;
}

const RATINGS = ["Xuất Sắc", "Giỏi", "Khá", "Trung Bình", "Tệ"];

// P4: Track how many of the 5 key fields are filled (for footer progress)
function countFilledFields(values: ReturnType<typeof useSmartFeedbackForm>['watchedValues']): number {
    const fields = [
        values.lessonContent,
        values.attitudeRating,
        values.attitudeComment,
        values.absorptionRating,
        values.absorptionComment,
    ];
    return fields.filter(v => v && String(v).trim().length > 0).length;
}

export function SmartFeedbackForm({
    sessionRecordId,
    studentId,
    studentName,
    onSuccess,
}: SmartFeedbackFormProps) {
    const {
        form,
        isSaving,
        isLoading,
        isEditing,
        setIsEditing,
        hasData,
        onSubmit,
        copyToClipboard,
        exportExcel,
        watchedValues,
    } = useSmartFeedbackForm({
        sessionRecordId,
        studentId,
        onSuccess,
    });

    const filledCount = isEditing ? countFilledFields(watchedValues) : 0;

    return (
        <div className="flex flex-col h-full relative">
            <FeedbackHeader
                isEditing={isEditing}
                hasData={hasData}
                isDirty={form.formState.isDirty}
                onEdit={() => setIsEditing(true)}
                onCancel={() => setIsEditing(false)}
                onCopy={copyToClipboard}
                onExport={exportExcel}
            />

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {isEditing ? (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FeedbackFormFields
                                form={form}
                                studentName={studentName}
                                ratings={RATINGS}
                            />
                        </form>
                    </Form>
                ) : (
                    <FeedbackViewMode values={watchedValues} />
                )}
            </div>

            {/* P4: Sticky footer with progress on left, Save on right */}
            {isEditing && (
                <div className="p-4 border-t border-border/40 bg-background/95 backdrop-blur shrink-0 flex items-center justify-between gap-3">
                    {/* Progress indicator */}
                    <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                            {[1,2,3,4,5].map((i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 w-4 rounded-full transition-colors ${
                                        i <= filledCount
                                            ? 'bg-primary'
                                            : 'bg-muted-foreground/20'
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-[12px] text-muted-foreground">
                            Đã điền {filledCount}/5 mục
                        </span>
                    </div>

                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isSaving}
                        className="h-9 px-5 text-sm font-semibold shadow-lg shadow-emerald-500/20 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
                    >
                        {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <Save className="w-3.5 h-3.5 mr-2" />}
                        Lưu đánh giá
                    </Button>
                </div>
            )}

            {isLoading && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-[100] flex items-center justify-center rounded-[2rem]">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-[12px] text-muted-foreground">
                            Đang tải dữ liệu...
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
