package com.tutor_management.backend.modules.course.dto.response;

import com.tutor_management.backend.modules.course.enums.DifficultyLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentCourseDetailResponse {
    private Long id;
    private String title;
    private String description;
    private String thumbnailUrl;
    private DifficultyLevel difficultyLevel;
    private Integer estimatedHours;
    private String tutorName;
    private String status;
    private Integer progressPercentage;
    private LocalDateTime assignedDate;
    private LocalDateTime deadline;
    private LocalDateTime completedAt;
    private List<StudentCourseLessonDTO> lessons;
}
