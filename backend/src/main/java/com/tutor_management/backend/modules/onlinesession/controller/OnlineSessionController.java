package com.tutor_management.backend.modules.onlinesession.controller;

import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.onlinesession.dto.request.CreateOnlineSessionRequest;
import com.tutor_management.backend.modules.onlinesession.dto.response.OnlineSessionResponse;
import com.tutor_management.backend.modules.onlinesession.service.OnlineSessionService;
import com.tutor_management.backend.modules.shared.dto.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for managing online live teaching sessions.
 */
@RestController
@RequestMapping("/api/online-sessions")
@RequiredArgsConstructor
public class OnlineSessionController {

    private final OnlineSessionService onlineSessionService;

    /**
     * Endpoint to create a new online session.
     * Accessible by TUTOR and ADMIN roles.
     * 
     * @param request The session creation details.
     * @param user The currently authenticated user.
     * @return ResponseEntity containing the created session details.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('TUTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<OnlineSessionResponse>> createSession(
            @Valid @RequestBody CreateOnlineSessionRequest request,
            @AuthenticationPrincipal User user) {
        
        OnlineSessionResponse response = onlineSessionService.createSession(request, user.getId());
        
        return ResponseEntity.ok(ApiResponse.success(
                "Online session created successfully and notifications dispatched.", 
                response
        ));
    }

    /**
     * Endpoint to end an online session manually.
     * Accessible by direct participants (TUTOR/STUDENT) or ADMIN.
     * 
     * @param roomId The unique room ID.
     * @param user The currently authenticated user.
     * @return ResponseEntity with updated session details.
     */
    @PostMapping("/{roomId}/end")
    @PreAuthorize("hasAnyRole('TUTOR', 'ADMIN') or @roomAccessValidator.validateAccess(#roomId, #user.id)")
    public ResponseEntity<ApiResponse<OnlineSessionResponse>> endSession(
            @PathVariable String roomId,
            @AuthenticationPrincipal User user) {
        
        OnlineSessionResponse response = onlineSessionService.endSession(roomId, user.getId());
        
        return ResponseEntity.ok(ApiResponse.success(
                "Online session ended successfully. Summary notification sent.", 
                response
        ));
    }
}
