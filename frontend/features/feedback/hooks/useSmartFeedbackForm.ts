"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { feedbackService } from "../services/feedbackService";
import { FeedbackStatus } from "../types";

export const formSchema = z.object({
    lessonContent: z.string().optional(),
    attitudeRating: z.string().optional(),
    attitudeComment: z.string().optional(),
    absorptionRating: z.string().optional(),
    absorptionComment: z.string().optional(),
    knowledgeGaps: z.string().optional(),
    solutions: z.string().optional(),
}).refine(
    (data) => {
        return Boolean(
            data.lessonContent?.trim() ||
            data.attitudeComment?.trim() ||
            data.absorptionComment?.trim() ||
            data.knowledgeGaps?.trim() ||
            data.solutions?.trim() ||
            data.attitudeRating ||
            data.absorptionRating
        );
    },
    {
        message: "Vui lòng nhập nội dung nhận xét trước khi lưu.",
        path: ["attitudeComment"],
    }
);

export type FormValues = z.infer<typeof formSchema>;

interface UseSmartFeedbackFormProps {
    sessionRecordId: number;
    studentId: number;
    defaultLessonContent?: string;
    onSuccess?: () => void;
}

export function useSmartFeedbackForm({
    sessionRecordId,
    studentId,
    defaultLessonContent,
    onSuccess,
}: UseSmartFeedbackFormProps) {
    const queryClient = useQueryClient();
    const [isSaving, setIsSaving] = useState(false);
    const [existingFeedbackId, setExistingFeedbackId] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [hasData, setHasData] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            lessonContent: defaultLessonContent || "",
            attitudeRating: "Khá",
            attitudeComment: "",
            absorptionRating: "Khá",
            absorptionComment: "",
            knowledgeGaps: "",
            solutions: "",
        },
    });

    const { data: existing, isLoading } = useQuery({
        queryKey: ['session-feedback', sessionRecordId, studentId],
        queryFn: () => feedbackService.getFeedbackBySession(sessionRecordId, studentId),
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        if (existing) {
            setExistingFeedbackId(existing.id);
            setHasData(true);
            form.reset({
                lessonContent: existing.lessonContent || defaultLessonContent || "",
                attitudeRating: existing.attitudeRating || "Khá",
                attitudeComment: existing.attitudeComment || "",
                absorptionRating: existing.absorptionRating || "Khá",
                absorptionComment: existing.absorptionComment || "",
                knowledgeGaps: existing.knowledgeGaps || "",
                solutions: existing.solutions || "",
            });
        } else {
            setExistingFeedbackId(null);
            setHasData(false);
            form.reset({
                lessonContent: defaultLessonContent || "",
                attitudeRating: "Khá",
                attitudeComment: "",
                absorptionRating: "Khá",
                absorptionComment: "",
                knowledgeGaps: "",
                solutions: "",
            });
        }
    }, [existing, defaultLessonContent, form]);

    const onSubmit = async (values: FormValues) => {
        setIsSaving(true);
        try {
            const payload = {
                sessionRecordId,
                studentId,
                lessonContent: values.lessonContent?.trim() || defaultLessonContent || "Ôn tập kiến thức và rèn luyện kỹ năng",
                attitudeRating: values.attitudeRating || "Khá",
                attitudeComment: values.attitudeComment || "",
                absorptionRating: values.absorptionRating || "Khá",
                absorptionComment: values.absorptionComment || "",
                knowledgeGaps: values.knowledgeGaps || "",
                solutions: values.solutions || "",
                status: FeedbackStatus.SUBMITTED
            };

            if (existingFeedbackId) {
                await feedbackService.updateFeedback(existingFeedbackId, payload);
                toast.success("Đã cập nhật đánh giá.");
            } else {
                const newId = await feedbackService.createFeedback(payload);
                setExistingFeedbackId(newId);
                setHasData(true);
                toast.success("Đã lưu đánh giá mới.");
            }

            queryClient.invalidateQueries({ queryKey: ['session-feedback', sessionRecordId, studentId] });
            setIsEditing(false);
            onSuccess?.();
        } catch (error) {
            toast.error("Không thể lưu đánh giá.");
        } finally {
            setIsSaving(false);
        }
    };

    const copyToClipboard = async () => {
        if (!existingFeedbackId) {
            toast.error("Vui lòng lưu đánh giá trước khi copy.");
            return;
        }
        try {
            const text = await feedbackService.getClipboardContent(existingFeedbackId);
            navigator.clipboard.writeText(text);
            toast.success("Đã copy nội dung!");
        } catch (e) {
            toast.error("Lỗi khi copy.");
        }
    };

    const exportExcel = async () => {
        try {
            await feedbackService.exportStudentFeedback(studentId);
            toast.success("Đã tải xuống file Excel!");
        } catch (error) {
            toast.error("Lỗi khi xuất file Excel.");
        }
    };

    return {
        form,
        isSaving,
        isLoading,
        isEditing,
        setIsEditing,
        hasData,
        onSubmit,
        copyToClipboard,
        exportExcel,
        watchedValues: form.watch(),
    };
}
