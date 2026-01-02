"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Shuffle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { feedbackService } from "../services/feedbackService";

interface CommentGeneratorProps {
    form: UseFormReturn<any>;
    label: string;
    ratingField: string;
    commentField: string;
    category: "ATTITUDE" | "ABSORPTION" | "GAPS" | "SOLUTIONS";
    ratings?: string[];
    studentName: string;
    hideRating?: boolean;
}

export function CommentGenerator({
    form,
    label,
    ratingField,
    commentField,
    category,
    ratings = [],
    studentName,
    hideRating = false,
}: CommentGeneratorProps) {
    const [keywords, setKeywords] = useState<string[]>([]);
    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const currentRating = hideRating ? "ANY" : form.watch(ratingField);

    useEffect(() => {
        if (currentRating) {
            fetchKeywords(currentRating);
            setSelectedKeywords([]); // Reset keywords on rating change
        }
    }, [currentRating]);

    const fetchKeywords = async (rating: string) => {
        // For GAPS and SOLUTIONS, we always want keywords for ANY rating level
        const isWildcardCategory = category === "GAPS" || category === "SOLUTIONS";
        const levelToFetch = isWildcardCategory ? "ANY" : (hideRating ? "ANY" : mapRatingToLevel(rating));

        try {
            const kws = await feedbackService.getKeywords(category, levelToFetch);
            setKeywords(kws);
        } catch (e) {
            console.error(e);
            setKeywords([]);
        }
    };

    const mapRatingToLevel = (rating: string): string => {
        const ratingMap: Record<string, string> = {
            "Xuất sắc": "XUAT_SAC",
            "Xuất Sắc": "XUAT_SAC",
            "Giỏi": "GIOI",
            "Khá": "KHA",
            "Trung bình": "TRUNG_BINH",
            "Trung Bình": "TRUNG_BINH",
            "Tệ": "TE",
        };
        return ratingMap[rating] || "ANY";
    };

    const toggleKeyword = (keyword: string) => {
        if (selectedKeywords.includes(keyword)) {
            setSelectedKeywords(selectedKeywords.filter((k) => k !== keyword));
        } else {
            setSelectedKeywords([...selectedKeywords, keyword]);
        }
    };

    const generate = async () => {
        if (!currentRating && !hideRating) return;
        setIsGenerating(true);
        try {
            const isWildcardCategory = category === "GAPS" || category === "SOLUTIONS";
            let level = isWildcardCategory ? "ANY" : (hideRating ? "ANY" : mapRatingToLevel(currentRating));

            const res = await feedbackService.generateComment({
                category,
                ratingLevel: level,
                keywords: selectedKeywords,
                studentName,
            });

            form.setValue(commentField, res.generatedComment);
        } catch (error) {
            console.error("Generate error", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-3 border p-3 rounded-2xl bg-muted/20 border-border/40 shadow-sm">
            {!hideRating && (
                <FormField
                    control={form.control}
                    name={ratingField}
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                {label}
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger className="bg-background h-9 text-xs font-bold rounded-xl border-border/60 shadow-sm">
                                        <SelectValue placeholder="Chọn mức độ" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="rounded-xl border-border/60">
                                    {ratings.map((r) => (
                                        <SelectItem key={r} value={r} className="text-xs font-medium">
                                            {r}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            {hideRating && (
                <div className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1 mb-2">{label}</div>
            )}

            {/* Keywords */}
            {keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 my-2 transition-all">
                    {keywords.map((k) => (
                        <Badge
                            key={k}
                            variant={selectedKeywords.includes(k) ? "default" : "outline"}
                            className="cursor-pointer hover:opacity-80 select-none text-[10px] px-2 py-0.5 rounded-md font-bold"
                            onClick={() => toggleKeyword(k)}
                        >
                            {k}
                        </Badge>
                    ))}
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
                <Button
                    type="button"
                    size="sm"
                    className="w-full group bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0 shadow-sm h-8 rounded-xl text-[10px] font-black uppercase tracking-wider"
                    onClick={generate}
                    disabled={isGenerating || (!currentRating && !hideRating)}
                >
                    {isGenerating ? (
                        <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
                    ) : (
                        <Sparkles className="w-3 h-3 mr-1.5 text-yellow-300 group-hover:scale-110 transition-transform" />
                    )}
                    Gợi ý ý tưởng
                </Button>
                <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    title="Shuffle"
                    onClick={generate}
                    disabled={isGenerating || (!currentRating && !hideRating)}
                    className="w-8 h-8 rounded-xl border-border/60"
                >
                    <Shuffle className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
            </div>

            <FormField
                control={form.control}
                name={commentField}
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Textarea
                                {...field}
                                placeholder={`Nhận xét chi tiết...`}
                                className="min-h-[6rem] resize-none focus-visible:ring-primary rounded-xl bg-background border-border/60 text-xs font-medium leading-relaxed p-3"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
