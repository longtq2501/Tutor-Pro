"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { feedbackTemplateService } from "../services/feedbackTemplateService";
import { FeedbackTemplateRequest } from "../types";

export function useFeedbackTemplates(category?: string) {
    const queryClient = useQueryClient();

    const {
        data: templates = [],
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['feedback-templates', category],
        queryFn: () => feedbackTemplateService.getTemplates(category),
        staleTime: 2 * 60 * 1000,
    });

    const createMutation = useMutation({
        mutationFn: (req: FeedbackTemplateRequest) => feedbackTemplateService.createTemplate(req),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['feedback-templates'] });
            toast.success("Đã lưu mẫu nhận xét mới");
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || "Không thể lưu mẫu nhận xét";
            toast.error(msg);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, req }: { id: number; req: FeedbackTemplateRequest }) =>
            feedbackTemplateService.updateTemplate(id, req),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['feedback-templates'] });
            toast.success("Đã cập nhật mẫu nhận xét");
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || "Không thể cập nhật mẫu nhận xét";
            toast.error(msg);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => feedbackTemplateService.deleteTemplate(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['feedback-templates'] });
            toast.success("Đã xóa mẫu nhận xét");
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || "Không thể xóa mẫu nhận xét";
            toast.error(msg);
        },
    });

    return {
        templates,
        isLoading,
        error,
        refetch,
        createTemplate: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        updateTemplate: (id: number, req: FeedbackTemplateRequest) =>
            updateMutation.mutateAsync({ id, req }),
        isUpdating: updateMutation.isPending,
        deleteTemplate: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
    };
}
