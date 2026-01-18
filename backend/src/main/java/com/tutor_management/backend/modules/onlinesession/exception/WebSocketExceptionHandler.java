package com.tutor_management.backend.modules.onlinesession.exception;

import com.tutor_management.backend.modules.shared.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.ControllerAdvice;

/**
 * Global exception handler for WebSocket message processing.
 * Intercepts exceptions thrown in @MessageMapping methods and returns structured ApiResponse.
 */
@ControllerAdvice
@Slf4j
public class WebSocketExceptionHandler {

    /**
     * Handles RoomNotFoundException and returns a user-friendly error message.
     */
    @MessageExceptionHandler(RoomNotFoundException.class)
    @SendToUser("/queue/errors")
    public ApiResponse<Void> handleRoomNotFoundException(RoomNotFoundException ex) {
        log.error("WebSocket RoomNotFoundException: {}", ex.getMessage());
        return ApiResponse.error(ex.getMessage());
    }

    /**
     * Handles RoomAccessDeniedException and returns a user-friendly error message.
     */
    @MessageExceptionHandler(RoomAccessDeniedException.class)
    @SendToUser("/queue/errors")
    public ApiResponse<Void> handleRoomAccessDeniedException(RoomAccessDeniedException ex) {
        log.error("WebSocket RoomAccessDeniedException: {}", ex.getMessage());
        return ApiResponse.error(ex.getMessage());
    }

    /**
     * Handles RoomAlreadyEndedException and returns a user-friendly error message.
     */
    @MessageExceptionHandler(RoomAlreadyEndedException.class)
    @SendToUser("/queue/errors")
    public ApiResponse<Void> handleRoomAlreadyEndedException(RoomAlreadyEndedException ex) {
        log.error("WebSocket RoomAlreadyEndedException: {}", ex.getMessage());
        return ApiResponse.error(ex.getMessage());
    }

    /**
     * Handles generic RuntimeException and returns a user-friendly error message.
     */
    @MessageExceptionHandler(RuntimeException.class)
    @SendToUser("/queue/errors")
    public ApiResponse<Void> handleRuntimeException(RuntimeException ex) {
        log.error("WebSocket RuntimeException: {}", ex.getMessage());
        return ApiResponse.error("Lỗi xử lý yêu cầu: " + ex.getMessage());
    }

    /**
     * Handles all other exceptions and returns a generic error message.
     */
    @MessageExceptionHandler(Exception.class)
    @SendToUser("/queue/errors")
    public ApiResponse<Void> handleException(Exception ex) {
        log.error("WebSocket Exception: {}", ex.getMessage(), ex);
        return ApiResponse.error("Đã xảy ra lỗi hệ thống khi xử lý tin nhắn.");
    }
}
