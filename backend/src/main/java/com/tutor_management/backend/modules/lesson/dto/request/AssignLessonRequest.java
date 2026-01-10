package com.tutor_management.backend.modules.lesson.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Payload for assigning a library lesson to one or more students.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignLessonRequest {
    @NotEmpty(message = "Vui lòng chọn ít nhất một học sinh")
    private List<Long> studentIds;
}
