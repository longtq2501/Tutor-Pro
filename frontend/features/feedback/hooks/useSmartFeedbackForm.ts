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
    lessonContent: z.string().min(1, "Nội dung bài học là bắt buộc"),
    attitudeRating: z.string().min(1, "Vui lòng chọn đánh giá"),
    attitudeComment: z.string().min(1, "Vui lòng nhập nhận xét"),
    absorptionRating: z.string().min(1, "Vui lòng chọn đánh giá"),
    absorptionComment: z.string().min(1, "Vui lòng nhập nhận xét"),
    knowledgeGaps: z.string().optional(),
    solutions: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

interface UseSmartFeedbackFormProps {
    sessionRecordId: number;
    studentId: number;
    onSuccess?: () => void;
}

export function useSmartFeedbackForm({
    sessionRecordId,
    studentId,
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
            lessonContent: "4 kĩ năng tiếng anh và Ngữ Pháp và Ôn Tập",
            attitudeRating: "",
            attitudeComment: "",
            absorptionRating: "",
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
                lessonContent: existing.lessonContent,
                attitudeRating: existing.attitudeRating,
                attitudeComment: existing.attitudeComment,
                absorptionRating: existing.absorptionRating,
                absorptionComment: existing.absorptionComment,
                knowledgeGaps: existing.knowledgeGaps || "",
                solutions: existing.solutions || "",
            });
        } else {
            setExistingFeedbackId(null);
            setHasData(false);
            form.reset({
                lessonContent: "4 kĩ năng tiếng anh và Ngữ Pháp và Ôn Tập",
                attitudeRating: "",
                attitudeComment: "",
                absorptionRating: "",
                absorptionComment: "",
                knowledgeGaps: "",
                solutions: "",
            });
        }
    }, [existing, form]);

    const onSubmit = async (values: FormValues) => {
        setIsSaving(true);
        try {
            const payload = {
                sessionRecordId,
                studentId,
                ...values,
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
