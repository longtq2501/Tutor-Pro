package com.tutor_management.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParentResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String notes;
    private Integer studentCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}