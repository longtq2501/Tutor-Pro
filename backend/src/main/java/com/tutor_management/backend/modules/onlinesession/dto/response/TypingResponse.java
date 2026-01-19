package com.tutor_management.backend.modules.onlinesession.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Broadcast payload for typing status notification.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TypingResponse {
    private Long userId;
    private String userName;
    private boolean typing;
}
