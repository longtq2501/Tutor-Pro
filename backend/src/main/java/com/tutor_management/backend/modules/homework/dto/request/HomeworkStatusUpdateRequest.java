package com.tutor_management.backend.modules.homework.dto.request;

import com.tutor_management.backend.modules.homework.Homework.HomeworkStatus;
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
