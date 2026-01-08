package com.tutor_management.backend.modules.parent.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParentRequest {
    private String name;
    private String email;
    private String phone;
    private String notes;
}
