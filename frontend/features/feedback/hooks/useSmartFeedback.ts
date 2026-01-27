"use client";

import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { feedbackService } from "../services/feedbackService";

/**
 * Interface for useSmartFeedback hook props.
 */
interface UseSmartFeedbackProps {
    /** The react-hook-form instance */
    form: UseFormReturn<any>;
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
    const [keywords, setKeywords] = useState<string[]>([]);
    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [tone, setTone] = useState<string>("FRIENDLY");
    const [length, setLength] = useState<string>("MEDIUM");
    const [inputValue, setInputValue] = useState("");

    const currentRating = hideRating ? "ANY" : form.watch(ratingField);

    useEffect(() => {
        if (currentRating) {
            fetchKeywords(currentRating);
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

    const addCustomKeyword = (kw: string) => {
        const trimmed = kw.trim();
        if (trimmed && !selectedKeywords.includes(trimmed)) {
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
            const isWildcardCategory = category === "GAPS" || category === "SOLUTIONS";
            const level = isWildcardCategory ? "ANY" : (hideRating ? "ANY" : mapRatingToLevel(currentRating));

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
