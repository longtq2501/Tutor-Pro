package com.tutor_management.backend.modules.exercise.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Preview choice extracted during NLP parsing.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OptionPreview {
    
    private String label;
    private String optionText;
    private Boolean isCorrect;
}
