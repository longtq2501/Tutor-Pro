package com.tutor_management.backend.modules.onlinesession.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserJoinedMessage {
    private Long userId;
    private String name;
    private String role;
    private String avatarUrl;
    private Instant joinedAt;
}
