"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, FileSpreadsheet, Loader2, Pencil, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner"; // Used sonner as requested

import { feedbackService } from "../services/feedbackService";
import { FeedbackStatus } from "../types";
import { CommentGenerator } from "./CommentGenerator";

// Schema validation
const formSchema = z.object({
    lessonContent: z.string().min(1, "Nội dung bài học là bắt buộc"),
    attitudeRating: z.string().min(1, "Vui lòng chọn đánh giá"),
    attitudeComment: z.string().min(1, "Vui lòng nhập nhận xét"),
    absorptionRating: z.string().min(1, "Vui lòng chọn đánh giá"),
    absorptionComment: z.string().min(1, "Vui lòng nhập nhận xét"),
    knowledgeGaps: z.string().optional(),
    solutions: z.string().optional(),
});

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
    const [isLoading, setIsLoading] = useState(false);
    const [existingFeedbackId, setExistingFeedbackId] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [hasData, setHasData] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
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

    // Load existing feedback
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const existing = await feedbackService.getFeedbackBySession(sessionRecordId, studentId);
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
                    setHasData(false);
                }
            } catch (error) {
                console.error("Failed to load feedback", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [sessionRecordId, studentId, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
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
            setIsEditing(false); // Exit edit mode on save
            onSuccess?.();
        } catch (error) {
            toast.error("Không thể lưu đánh giá.");
        } finally {
            setIsLoading(false);
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

    // Compact Read-Only Field Component
    const ReadOnlyField = ({ label, content, rating, className }: { label: string, content?: string | null, rating?: string, className?: string }) => (
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

    return (
        <div className="flex flex-col h-full relative">
            {/* Header / Toolbar - Fixed at Top */}
            <div className="flex items-center justify-between py-3 px-4 sm:px-6 border-b border-border/40 shrink-0 bg-background/95 backdrop-blur z-20">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black uppercase tracking-wide bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        {isEditing ? "Đang chỉnh sửa" : "Phiếu đánh giá"}
                    </h3>
                </div>
                <div className="flex gap-2">
                    {!isEditing ? (
                        <>
                            {hasData && (
                                <>
                                    <Button variant="outline" size="sm" onClick={exportExcel} className="h-8 text-[10px] uppercase font-bold tracking-wider">
                                        <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" /> XLS
                                    </Button>
                                    <Button variant="secondary" size="sm" onClick={copyToClipboard} className="h-8 text-[10px] uppercase font-bold tracking-wider">
                                        <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy
                                    </Button>
                                </>
                            )}
                            <Button
                                onClick={() => setIsEditing(true)}
                                size="sm"
                                className="h-8 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] uppercase font-black tracking-wider shadow-none border-0"
                            >
                                <Pencil className="w-3.5 h-3.5 mr-1.5" />
                                {hasData ? "Chỉnh sửa" : "Viết đánh giá"}
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(false)}
                            className="h-8 text-[10px] uppercase font-bold tracking-wider text-muted-foreground"
                        >
                            <X className="w-3.5 h-3.5 mr-1.5" /> Hủy
                        </Button>
                    )}
                </div>
            </div>

            {/* Content Area - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {isEditing ? (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* 1. NỘI DUNG BÀI HỌC */}
                            <FormField
                                control={form.control}
                                name="lessonContent"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">1. Nội dung bài học</FormLabel>
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
                                    ratings={RATINGS}
                                    studentName={studentName}
                                />
                                <CommentGenerator
                                    form={form}
                                    label="3. Khả năng tiếp thu"
                                    ratingField="absorptionRating"
                                    commentField="absorptionComment"
                                    category="ABSORPTION"
                                    ratings={RATINGS}
                                    studentName={studentName}
                                />
                            </div>

                            {/* 4 & 5: Hổng & Giải pháp (Grid) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CommentGenerator
                                    form={form}
                                    label="4. Kiến thức chưa nắm vững"
                                    ratingField="dummyRating1" // Not used
                                    commentField="knowledgeGaps"
                                    category="GAPS"
                                    studentName={studentName}
                                    hideRating={true}
                                />
                                <CommentGenerator
                                    form={form}
                                    label="5. Lý do / Giải pháp"
                                    ratingField="dummyRating2" // Not used
                                    commentField="solutions"
                                    category="SOLUTIONS"
                                    studentName={studentName}
                                    hideRating={true}
                                />
                            </div>
                        </form>
                    </Form>
                ) : (
                    <div className="space-y-6 animate-in fade-in active:scale-[0.99] transition-transform duration-200">
                        {/* View Mode */}
                        <ReadOnlyField
                            label="1. Nội dung bài học"
                            content={form.getValues("lessonContent")}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ReadOnlyField
                                label="2. Thái độ học tập"
                                rating={form.getValues("attitudeRating")}
                                content={form.getValues("attitudeComment")}
                            />
                            <ReadOnlyField
                                label="3. Khả năng tiếp thu"
                                rating={form.getValues("absorptionRating")}
                                content={form.getValues("absorptionComment")}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ReadOnlyField
                                label="4. Kiến thức chưa nắm vững"
                                content={form.getValues("knowledgeGaps")}
                            />
                            <ReadOnlyField
                                label="5. Lý do / Giải pháp"
                                content={form.getValues("solutions")}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Footer / Actions - Fixed at Bottom */}
            {isEditing && (
                <div className="p-4 border-t border-border/40 bg-background/95 backdrop-blur shrink-0 flex justify-end">
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isLoading}
                        className="h-9 px-6 text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
                    >
                        {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <Save className="w-3.5 h-3.5 mr-2" />}
                        Lưu Đánh Giá
                    </Button>
                </div>
            )}
        </div>
    );
}
