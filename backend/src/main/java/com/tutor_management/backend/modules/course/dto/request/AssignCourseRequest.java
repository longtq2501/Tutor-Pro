package com.tutor_management.backend.modules.course.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotEmpty;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Request payload for assigning a course to one or more students.
 */
@Data
public class AssignCourseRequest {
    /**
     * List of student IDs to be enrolled in the course.
     */
    @NotEmpty(message = "Danh sách học sinh không được để trống")
    private List<Long> studentIds;

    /**
     * Optional completion deadline for the assigned students.
     */
    private LocalDateTime deadline;
}
