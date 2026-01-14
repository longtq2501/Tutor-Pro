package com.tutor_management.backend.modules.student.dto.request;

import com.tutor_management.backend.modules.student.entity.Student;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload for creating or updating a {@link Student} record.
 * Includes optional fields for parent association and automated account creation.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentRequest {
    
    @NotBlank(message = "Tên học sinh không được để trống")
    private String name;

    private String phone;

    @NotBlank(message = "Lịch học không được để trống")
    private String schedule;

    @NotNull(message = "Học phí mỗi giờ không được để trống")
    @Min(value = 0, message = "Học phí phải là số dương")
    private Long pricePerHour;

    private String notes;

    private Boolean active;

    /**
     * Enrollment month in YYYY-MM format.
     */
    private String startMonth;

    /**
     * ID of the associated parent record.
     */
    private Long parentId;

    /**
     * Flag to trigger automated user account creation.
     */
    private Boolean createAccount;

    /**
     * Preferred login email if createAccount is true.
     */
    private String email;

    /**
     * Preferred password if createAccount is true.
     */
    private String password;
}
