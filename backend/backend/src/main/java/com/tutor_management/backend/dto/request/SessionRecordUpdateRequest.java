package com.tutor_management.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho UPDATE operation - tất cả fields là optional
 * Chỉ update các field không null
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionRecordUpdateRequest {
    // Tất cả đều optional - không có @NotNull, @NotBlank
    private String month;
    private Integer sessions;
    private Double hoursPerSession;
    private String sessionDate;
    private String notes;
    private Boolean completed;
}