package com.tutor_management.backend.modules.onlinesession.controller;

import com.tutor_management.backend.infrastructure.security.RateLimiter;
import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.onlinesession.dto.request.CreateOnlineSessionRequest;
import com.tutor_management.backend.modules.onlinesession.dto.response.GlobalStatsResponse;
import com.tutor_management.backend.modules.onlinesession.dto.response.JoinRoomResponse;
import com.tutor_management.backend.modules.onlinesession.dto.response.OnlineSessionResponse;
import com.tutor_management.backend.modules.onlinesession.dto.response.RoomStatsResponse;
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
     * Rate limited to 10 sessions per hour per tutor.
     * 
     * @param request The session creation details.
     * @param user The currently authenticated user.
     * @return ResponseEntity containing the created session details.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('TUTOR', 'ADMIN')")
    @RateLimiter(limit = 10, period = 3600)
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
     * Endpoint to join an online session.
     * @return ResponseEntity containing the join room details.
     */
    @PostMapping("/{roomId}/join")
    @PreAuthorize("hasRole('ADMIN') or @roomAccessValidator.canJoin(#roomId, #user.id)")
    public ResponseEntity<ApiResponse<JoinRoomResponse>> joinRoom(
            @PathVariable String roomId,
            @AuthenticationPrincipal User user) {
        
        JoinRoomResponse response = onlineSessionService.joinRoom(roomId, user.getId());
        
        return ResponseEntity.ok(ApiResponse.success(
                "Đã lấy token tham gia phòng thành công.", 
                response
        ));
    }

    /**
     * Endpoint to retrieve statistics for a specific session.
     * Accessible by admins or the assigned tutor.
     * 
     * @param roomId The unique room identifier.
     * @param user The currently authenticated user.
     * @return ResponseEntity containing the room statistics.
     */
    @GetMapping("/{roomId}/stats")
    @PreAuthorize("hasRole('ADMIN') or @roomAccessValidator.hasAccess(#roomId, #user.id)")
    public ResponseEntity<ApiResponse<RoomStatsResponse>> getRoomStats(
            @PathVariable String roomId,
            @AuthenticationPrincipal User user) {
        
        RoomStatsResponse response = onlineSessionService.getRoomStats(roomId, user.getId());
        
        return ResponseEntity.ok(ApiResponse.success(
                "Đã lấy thống kê phòng thành công.", 
                response
        ));
    }

    /**
     * Endpoint to retrieve global statistics across all sessions.
     * Accessible by ADMIN role only.
     * 
     * @return ResponseEntity containing global statistics.
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<GlobalStatsResponse>> getGlobalStats() {
        GlobalStatsResponse response = onlineSessionService.getGlobalStats();
        
        return ResponseEntity.ok(ApiResponse.success(
                "Đã lấy thống kê tổng quát thành công.", 
                response
        ));
    }

    /**
     * Endpoint to retrieve the current active/upcoming session for the user.
     * 
     * @param user The currently authenticated user.
     * @return ResponseEntity containing the current session details.
     */
    @GetMapping("/current")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<OnlineSessionResponse>> getActiveSession(
            @AuthenticationPrincipal User user) {
        
        OnlineSessionResponse response = onlineSessionService.getCurrentSession(user.getId());
        
        if (response == null) {
            return ResponseEntity.ok(ApiResponse.success("No active session found.", null));
        }

        return ResponseEntity.ok(ApiResponse.success(
                "Current session retrieved successfully.", 
                response
        ));
    }

    /**
     * Endpoint to retrieve all active/upcoming sessions for the user (Lobby).
     * 
     * @param user The currently authenticated user.
     * @return ResponseEntity containing the list of online sessions.
     */
    @GetMapping("/my-sessions")
    @PreAuthorize("isAuthenticated()")
    @RateLimiter(limit = 60, period = 60)
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Window<OnlineSessionResponse>>> getMySessions(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String cursor,
            @RequestParam(defaultValue = "10") @jakarta.validation.constraints.Min(1) @jakarta.validation.constraints.Max(100) int size) {
        
        org.springframework.data.domain.Window<OnlineSessionResponse> response = onlineSessionService.getMySessions(user.getId(), cursor, size);
        
        return ResponseEntity.ok(ApiResponse.success(
                "Đã lấy danh sách buổi học trực tuyến thành công.", 
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
    @PreAuthorize("hasRole('ADMIN') or @roomAccessValidator.hasAccess(#roomId, #user.id)")
    public ResponseEntity<ApiResponse<OnlineSessionResponse>> endSession(
            @PathVariable String roomId,
            @AuthenticationPrincipal User user) {
        
        OnlineSessionResponse response = onlineSessionService.endSession(roomId, user.getId());
        
        return ResponseEntity.ok(ApiResponse.success(
                "Online session ended successfully. Summary notification sent.", 
                response
        ));
    }

    /**
     * Endpoint to update recording metadata after download.
     * 
     * @param roomId The unique room ID.
     * @param request The recording metadata details.
     * @return ResponseEntity with updated session details.
     */
    @PostMapping("/{roomId}/recording-metadata")
    @PreAuthorize("hasRole('ADMIN') or @roomAccessValidator.hasAccess(#roomId, #user.id)")
    public ResponseEntity<ApiResponse<OnlineSessionResponse>> updateRecordingMetadata(
            @PathVariable String roomId,
            @Valid @RequestBody com.tutor_management.backend.modules.onlinesession.dto.request.UpdateRecordingMetadataRequest request) {
        
        OnlineSessionResponse response = onlineSessionService.updateRecordingMetadata(roomId, request);
        
        return ResponseEntity.ok(ApiResponse.success(
                "Recording metadata updated successfully.", 
                response
        ));
    }
}
