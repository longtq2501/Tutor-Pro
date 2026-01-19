package com.tutor_management.backend.modules.onlinesession.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Request DTO to update recording metadata after a session recording is completed and downloaded.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRecordingMetadataRequest {
    @NotNull
    @Min(0)
    private Integer durationMinutes;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal fileSizeMb;

    @Builder.Default
    private Boolean downloaded = true;
}
