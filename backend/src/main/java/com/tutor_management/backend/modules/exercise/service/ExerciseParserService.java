package com.tutor_management.backend.modules.exercise.service;

import com.tutor_management.backend.modules.exercise.dto.response.ImportPreviewResponse;

/**
 * Service interface for parsing exercise text format
 */
public interface ExerciseParserService {
    
    /**
     * Parse exercise content from text format
     * 
     * @param content The text content to parse
     * @return ImportPreviewResponse containing parsed data and validation results
     */
    ImportPreviewResponse parseFromText(String content);
}
