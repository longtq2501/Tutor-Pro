package com.tutor_management.backend.modules.shared.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Standardized wrapper for all REST API responses.
 * Ensures consistent structure for both successful data retrieval and error reporting.
 *
 * @param <T> The type of the data payload.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

    /**
     * Indicates if the operation was successful.
     */
    private Boolean success;

    /**
     * Descriptive message about the operation result.
     * Often used for localized notifications in the frontend.
     */
    private String message;

    /**
     * The actual data returned by the API.
     */
    private T data;

    /**
     * Timestamp of when the response was generated.
     */
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    /**
     * Creates a successful response with a default message.
     *
     * @param data The payload to include.
     * @return An {@link ApiResponse} instance representing success.
     */
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message("Thành công")
                .data(data)
                .build();
    }

    /**
     * Creates a successful response with a custom message.
     *
     * @param message Localized success message.
     * @param data The payload to include.
     * @return An {@link ApiResponse} instance representing success.
     */
    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
    }

    /**
     * Creates an error response.
     *
     * @param message Localized error description.
     * @return An {@link ApiResponse} instance representing an error.
     */
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .build();
    }
}
