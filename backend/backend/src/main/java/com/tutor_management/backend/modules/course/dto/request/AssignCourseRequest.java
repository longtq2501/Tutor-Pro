package com.tutor_management.backend.modules.course.dto.request;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class AssignCourseRequest {
    private List<Long> studentIds;
    private LocalDateTime deadline;
}
