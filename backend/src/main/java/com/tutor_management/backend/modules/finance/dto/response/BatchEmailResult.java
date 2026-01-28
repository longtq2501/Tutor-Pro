package com.tutor_management.backend.modules.finance.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class BatchEmailResult {
    private boolean success;
    private String message;
    private EmailSummary summary;
    private List<EmailDetail> successDetails;
    private List<String> errors;

    @Data
    @Builder
    public static class EmailSummary {
        private int total;
        private int sent;
        private int failed;
    }

    @Data
    @Builder
    public static class EmailDetail {
        private String student;
        private String parent;
        private String email;
    }
}
