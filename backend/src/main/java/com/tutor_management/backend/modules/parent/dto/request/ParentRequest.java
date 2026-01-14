package com.tutor_management.backend.modules.parent.dto.request;

import com.tutor_management.backend.modules.parent.entity.Parent;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload for creating or updating a {@link Parent} record.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParentRequest {
    
    /**
     * Full name of the parent.
     */
    @NotBlank(message = "Tên phụ huynh không được để trống")
    private String name;

    /**
     * Contact email, must be a valid format.
     */
    @Email(message = "Email không đúng định dạng")
    private String email;

    /**
     * Contact phone number.
     */
    private String phone;

    /**
     * Optional notes about the parent.
     */
    private String notes;
}
