package com.tutor_management.backend.modules.onlinesession.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request payload for typing status notification.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TypingRequest {
    private boolean typing;
}
