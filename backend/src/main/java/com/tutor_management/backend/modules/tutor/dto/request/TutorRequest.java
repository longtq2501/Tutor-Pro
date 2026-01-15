package com.tutor_management.backend.modules.tutor.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TutorRequest {

    private Long userId; // Optional: If linking to existing user (legacy/admin manual link)
    
    // New fields for Atomic User Creation
    private String password; // Required for new user creation


    @NotBlank(message = "Full name is required")
    private String fullName;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Subscription plan is required")
    private String subscriptionPlan;

    private String subscriptionStatus; // Optional, defaults to ACTIVE
}
