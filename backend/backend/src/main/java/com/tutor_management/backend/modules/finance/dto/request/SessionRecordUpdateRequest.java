package com.tutor_management.backend.modules.finance.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
