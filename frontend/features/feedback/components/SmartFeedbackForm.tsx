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

    return (
        <div className="flex flex-col h-full relative">
            <FeedbackHeader
                isEditing={isEditing}
                hasData={hasData}
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

            {isEditing && (
                <div className="p-4 border-t border-border/40 bg-background/95 backdrop-blur shrink-0 flex justify-end">
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isSaving}
                        className="h-9 px-6 text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
                    >
                        {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <Save className="w-3.5 h-3.5 mr-2" />}
                        Lưu Đánh Giá
                    </Button>
                </div>
            )}

            {isLoading && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-[100] flex items-center justify-center rounded-[2rem]">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Đang tải dữ liệu...
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
