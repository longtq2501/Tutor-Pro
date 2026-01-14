package com.tutor_management.backend.modules.schedule.dto.request;

import com.tutor_management.backend.modules.schedule.entity.RecurringSchedule;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload for creating or updating a {@link RecurringSchedule}.
 * Defines a weekly learning plan for a specific student.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecurringScheduleRequest {

    /**
     * ID of the student this schedule belongs to.
     */
    @NotNull(message = "ID học sinh không được để trống")
    private Long studentId;

    /**
     * Array of active days (1=Monday, 7=Sunday).
     */
    @NotNull(message = "Ngày trong tuần không được để trống")
    @Size(min = 1, message = "Vui lòng chọn ít nhất một ngày trong tuần")
    private Integer[] daysOfWeek;

    /**
     * Start time in HH:mm format.
     */
    @NotBlank(message = "Giờ bắt đầu không được để trống")
    @Pattern(regexp = "^([01]?[0-9]|2[0-3]):[0-5][0-9]$", message = "Giờ bắt đầu không đúng định dạng HH:mm")
    private String startTime;

    /**
     * End time in HH:mm format.
     */
    @NotBlank(message = "Giờ kết thúc không được để trống")
    @Pattern(regexp = "^([01]?[0-9]|2[0-3]):[0-5][0-9]$", message = "Giờ kết thúc không đúng định dạng HH:mm")
    private String endTime;

    /**
     * Duration of each session in hours.
     */
    @NotNull(message = "Số giờ mỗi buổi không được để trống")
    @DecimalMin(value = "0.5", message = "Số giờ mỗi buổi tối thiểu là 0.5")
    private Double hoursPerSession;

    /**
     * Activation month (YYYY-MM).
     */
    @NotBlank(message = "Tháng bắt đầu không được để trống")
    @Pattern(regexp = "\\d{4}-\\d{2}", message = "Tháng bắt đầu phải có định dạng YYYY-MM")
    private String startMonth;

    /**
     * Expiration month (YYYY-MM). Optional.
     */
    @Pattern(regexp = "\\d{4}-\\d{2}", message = "Tháng kết thúc phải có định dạng YYYY-MM")
    private String endMonth;

    private Boolean active;

    private String notes;

    /**
     * Subject or course name.
     */
    private String subject;
}
