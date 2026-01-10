package com.tutor_management.backend.modules.exercise.service;

import com.tutor_management.backend.modules.exercise.dto.response.ImportPreviewResponse;

/**
 * AI-assisted parsing engine for converting raw unstructured text into structured assessment data.
 * Supports specialized syntax for Multiple Choice (MCQ) and Essay question formats.
 */
public interface ExerciseParserService {
    
    /**
     * Orchestrates the parsing pipeline for a provided text block.
     * 
     * @param content Raw string containing exercise metadata and question sections.
     * @return {@link ImportPreviewResponse} Detailed structured data or a list of parsing/validation errors.
     */
    ImportPreviewResponse parseFromText(String content);
}
