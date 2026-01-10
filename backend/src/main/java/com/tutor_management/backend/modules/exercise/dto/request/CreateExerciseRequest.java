package com.tutor_management.backend.modules.exercise.dto.request;

import com.tutor_management.backend.modules.exercise.domain.ExerciseStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Payload for declaring or updating an entire exercise structure, including metadata and questions.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateExerciseRequest {
    
    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(max = 500, message = "Tiêu đề không được vượt quá 500 ký tự")
    private String title;
    
    /**
     * Summary or instructional preamble for the exercise.
     */
    private String description;
    
    /**
     * Maximum minutes allowed for completion.
     */
    @Min(value = 1, message = "Thời gian làm bài tối thiểu là 1 phút")
    private Integer timeLimit;
    
    /**
     * Sum of points across all included questions.
     */
    @NotNull(message = "Tổng điểm không được để trống")
    @Min(value = 1, message = "Tổng điểm tối thiểu là 1")
    private Integer totalPoints;
    
    /**
     * Default cutoff time for all associated assignments.
     */
    private LocalDateTime deadline;
    
    /**
     * UUID of the class/grouping this exercise is categorized under.
     */
    private String classId;
    
    /**
     * Initial lifecycle state (defaults to DRAFT if omitted).
     */
    @Builder.Default
    private ExerciseStatus status = ExerciseStatus.DRAFT;
    
    /**
     * List of assessment tasks defining the exercise content.
     */
    @NotNull(message = "Danh sách câu hỏi không được để trống")
    @Size(min = 1, message = "Cần ít nhất một câu hỏi")
    @Valid
    private List<QuestionRequest> questions;
}
