package com.tutor_management.backend.modules.exercise.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.tutor_management.backend.modules.exercise.domain.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Preview DTO for a question during import
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class QuestionPreview {
    
    private QuestionType type;
    private String questionText;
    private Integer points;
    private Integer orderIndex;
    private String rubric;
    private List<OptionPreview> options;
    private String correctAnswer;
}
