package com.tutor_management.backend.modules.finance.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request payload for creating a new session record.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionRecordRequest {
    
    @NotNull(message = "ID học sinh không được để trống")
    private Long studentId;

    @NotBlank(message = "Tháng không được để trống")
    @Pattern(regexp = "\\d{4}-\\d{2}", message = "Tháng phải có định dạng YYYY-MM")
    private String month;

    @NotNull(message = "Số buổi học không được để trống")
    @Min(value = 1, message = "Số buổi học phải ít nhất là 1")
    private Integer sessions;

    @NotNull(message = "Số giờ học mỗi buổi không được để trống")
    @DecimalMin(value = "0.5", message = "Số giờ học mỗi buổi phải ít nhất là 0.5")
    private Double hoursPerSession;

    @NotBlank(message = "Ngày học không được để trống")
    private String sessionDate;

    private String notes;

    private String startTime;
    private String endTime;
    private String subject;
    private String status;

    private List<Long> documentIds;
    private List<Long> lessonIds;
}
