"use client";

import { useState, useEffect } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { feedbackService } from "../services/feedbackService";

/**
 * Interface for useSmartFeedback hook props.
 */
interface UseSmartFeedbackProps {
    /** The react-hook-form instance */
    form: UseFormReturn<FieldValues>;
    /** Field name for the rating value */
    ratingField: string;
    /** Field name for the comment textarea */
    commentField: string;
    /** Feedback category (ATTITUDE, ABSORPTION, etc.) */
    category: "ATTITUDE" | "ABSORPTION" | "GAPS" | "SOLUTIONS";
    /** Name of the student for placeholder injection */
    studentName: string;
    /** If true, standard rating selection is skipped */
    hideRating?: boolean;
    /** The subject being taught */
    subject?: string;
    /** The targeted output language */
    language?: string;
}

// --- Constants for Static Fallback Keywords ---
const STATIC_KEYWORDS: Record<string, string[]> = {
    ATTITUDE: ['Tập trung', 'Hăng hái', 'Ngoan', 'Mất tập trung', 'Làm việc riêng', 'Tiếp thu tốt', 'Chưa nghiêm túc'],
    ABSORPTION: ['Hiểu bài', 'Vận dụng tốt', 'Quên kiến thức', 'Cần ôn tập', 'Tốc độ chậm', 'Nhanh nhẹn', 'Hổng kiến thức'],
    GAPS: ['Ngữ pháp', 'Từ vựng', 'Phát âm', 'Kỹ năng nghe', 'Kỹ năng nói', 'Cấu trúc câu'],
    SOLUTIONS: ['Luyện tập thêm', 'Ôn bài cũ', 'Làm bài tập', 'Đọc thêm sách', 'Ghi chú kỹ']
};

/**
 * Custom hook to manage the state and logic for AI-powered smart feedback generation.
 * Handles keyword fetching, tag management, and API communication for comment generation.
 */
export function useSmartFeedback({
    form,
    ratingField,
    commentField,
    category,
    studentName,
    hideRating = false,
    subject = "Tiếng Anh",
    language = "Vietnamese",
}: UseSmartFeedbackProps) {
    const [keywords, setKeywords] = useState<string[]>(STATIC_KEYWORDS[category] || STATIC_KEYWORDS.ATTITUDE);
    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [tone, setTone] = useState<string>("FRIENDLY");
    const [length, setLength] = useState<string>("MEDIUM");
    const [inputValue, setInputValue] = useState("");

    const currentRating = hideRating ? "ANY" : form.watch(ratingField);

    // Update keywords when category changes
    useEffect(() => {
        setKeywords(STATIC_KEYWORDS[category] || STATIC_KEYWORDS.ATTITUDE);
        setSelectedKeywords([]); // Reset selected when switching category
    }, [category]);

    const mapRatingToLevel = (rating: string): string => {
        const ratingMap: Record<string, string> = {
            "Xuất sắc": "XS",
            "Xuất Sắc": "XS",
            "Giỏi": "TO",
            "Khá": "OK",
            "Trung bình": "TR",
            "Trung Bình": "TR",
            "Tệ": "TE",
        };
        return ratingMap[rating] || "OK";
    };

    const toggleKeyword = (kw: string) => {
        setSelectedKeywords(prev =>
            prev.includes(kw) ? prev.filter(k => k !== kw) : [...prev, kw]
        );
    };

    const addCustomKeyword = (kw: string) => {
        const trimmed = kw.trim();
        if (trimmed && !keywords.includes(trimmed)) {
            setKeywords(prev => [trimmed, ...prev]);
            setSelectedKeywords(prev => [...prev, trimmed]);
        }
    };

    const removeKeyword = (kw: string) => {
        setSelectedKeywords(prev => prev.filter(k => k !== kw));
    };

    const generate = async (force: boolean = false) => {
        if (!currentRating && !hideRating) return;

        // Finalize current input if any
        const finalKeywords = [...selectedKeywords];
        const trimmedInput = inputValue.trim();
        if (trimmedInput && !finalKeywords.includes(trimmedInput)) {
            finalKeywords.push(trimmedInput);
        }

        setIsGenerating(true);
        try {
            const level = hideRating ? "ANY" : mapRatingToLevel(currentRating);

            const res = await feedbackService.generateComment({
                category,
                ratingLevel: level,
                keywords: finalKeywords,
                studentName,
                subject,
                language,
                tone,
                length,
                forceRefresh: force,
            });

            form.setValue(commentField, res.generatedComment);

            // If we automatically added a keyword, clear input and add it permanently
            if (trimmedInput) {
                addCustomKeyword(trimmedInput);
                setInputValue("");
            }
        } catch {
            console.error("Generate error");
        } finally {
            setIsGenerating(false);
        }
    };

    return {
        keywords,
        selectedKeywords,
        currentRating,
        isGenerating,
        tone,
        length,
        inputValue,
        setTone,
        setLength,
        setInputValue,
        toggleKeyword,
        addCustomKeyword,
        removeKeyword,
        generate,
    };
}
