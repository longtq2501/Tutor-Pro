package com.tutor_management.backend.modules.finance.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request payload for updating an existing session record.
 * All fields are optional to support partial updates.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionRecordUpdateRequest {
    
    private String month;
    private Integer sessions;
    private Double hoursPerSession;
    private String sessionDate;
    private String notes;
    private Boolean completed;
    private String startTime;
    private String endTime;
    private String subject;
    private String status;
    private Integer version;

    private List<Long> documentIds;
    private List<Long> lessonIds;
}
