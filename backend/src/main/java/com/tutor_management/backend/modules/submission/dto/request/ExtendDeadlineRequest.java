package com.tutor_management.backend.modules.submission.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Payload used by a tutor to grant a single student an extended deadline
 * after the automatic collection workflow already ran.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExtendDeadlineRequest {

    /**
     * New deadline for this specific student's assignment.
     */
    @NotNull(message = "Hạn nộp mới không được để trống")
    private LocalDateTime deadline;
}
