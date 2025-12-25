package com.tutor_management.backend.modules.document.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentCategoryStats {
    private Long grammar;
    private Long vocabulary;
    private Long reading;
    private Long listening;
    private Long speaking;
    private Long writing;
    private Long exercises;
    private Long exam;
    private Long pet;
    private Long fce;
    private Long ielts;
    private Long toeic;
    private Long other;
}
