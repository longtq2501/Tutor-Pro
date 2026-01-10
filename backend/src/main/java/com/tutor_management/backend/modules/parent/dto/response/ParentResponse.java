package com.tutor_management.backend.modules.parent.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data response object for {@link com.tutor_management.backend.modules.parent.Parent} information.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParentResponse {
    
    private Long id;
    
    /**
     * Full name of the parent.
     */
    private String name;

    /**
     * Contact email.
     */
    private String email;

    /**
     * Contact phone number.
     */
    private String phone;

    /**
     * Internal notes.
     */
    private String notes;

    /**
     * Total number of students linked to this parent.
     */
    private Integer studentCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
