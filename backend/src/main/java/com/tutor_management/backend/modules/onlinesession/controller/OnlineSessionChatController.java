package com.tutor_management.backend.modules.onlinesession.controller;

import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.onlinesession.dto.response.ChatMessageResponse;
import com.tutor_management.backend.modules.onlinesession.service.ChatService;
import com.tutor_management.backend.modules.shared.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for chat-related operations in online sessions.
 */
@RestController
@RequestMapping("/api/online-sessions")
@RequiredArgsConstructor
public class OnlineSessionChatController {

    private final ChatService chatService;

    /**
     * Get paginated chat messages for a room.
     * Accessible by admins or participants.
     * 
     * @param roomId The unique room identifier.
     * @param pageable Pagination details (defaults to 50 messages per page).
     * @param user The currently authenticated user.
     * @return ResponseEntity containing a page of chat messages.
     */
    @GetMapping("/{roomId}/messages")
    @PreAuthorize("hasRole('ADMIN') or @roomAccessValidator.hasAccess(#roomId, #user.id)")
    public ResponseEntity<ApiResponse<Page<ChatMessageResponse>>> getMessages(
            @PathVariable String roomId,
            @PageableDefault(size = 50, sort = "timestamp", direction = Sort.Direction.DESC) Pageable pageable,
            @AuthenticationPrincipal User user) {
        
        Page<ChatMessageResponse> response = chatService.getMessages(roomId, pageable);
        
        return ResponseEntity.ok(ApiResponse.success(
                "Đã lấy lịch sử tin nhắn thành công.", 
                response
        ));
    }
}
