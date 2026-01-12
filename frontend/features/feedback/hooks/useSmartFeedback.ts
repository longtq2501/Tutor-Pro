"use client";

import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { feedbackService } from "../services/feedbackService";

interface UseSmartFeedbackProps {
    form: UseFormReturn<any>;
    ratingField: string;
    commentField: string;
    category: "ATTITUDE" | "ABSORPTION" | "GAPS" | "SOLUTIONS";
    studentName: string;
    hideRating?: boolean;
}

export function useSmartFeedback({
    form,
    ratingField,
    commentField,
    category,
    studentName,
    hideRating = false,
}: UseSmartFeedbackProps) {
    const [keywords, setKeywords] = useState<string[]>([]);
    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const currentRating = hideRating ? "ANY" : form.watch(ratingField);

    useEffect(() => {
        if (currentRating) {
            fetchKeywords(currentRating);
            setSelectedKeywords([]);
        }
    }, [currentRating]);

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

    const fetchKeywords = async (rating: string) => {
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

    const toggleKeyword = (keyword: string) => {
        setSelectedKeywords(prev =>
            prev.includes(keyword)
                ? prev.filter((k) => k !== keyword)
                : [...prev, keyword]
        );
    };

    const generate = async () => {
        if (!currentRating && !hideRating) return;
        setIsGenerating(true);
        try {
            const isWildcardCategory = category === "GAPS" || category === "SOLUTIONS";
            const level = isWildcardCategory ? "ANY" : (hideRating ? "ANY" : mapRatingToLevel(currentRating));

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

    return {
        keywords,
        selectedKeywords,
        isGenerating,
        currentRating,
        toggleKeyword,
        generate,
    };
}
