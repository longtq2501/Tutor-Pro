package com.tutor_management.backend.dto.request;

import com.tutor_management.backend.entity.Homework.HomeworkStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomeworkStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private HomeworkStatus status;
}