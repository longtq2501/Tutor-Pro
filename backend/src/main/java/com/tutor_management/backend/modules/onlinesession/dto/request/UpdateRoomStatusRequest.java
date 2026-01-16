package com.tutor_management.backend.modules.onlinesession.dto.request;

import com.tutor_management.backend.modules.onlinesession.enums.RoomStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for updating the status of an online room.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRoomStatusRequest {

    /**
     * Unique identifier for the room.
     */
    @NotBlank(message = "Room ID is required")
    private String roomId;

    /**
     * New status for the room (e.g., WAITING, ACTIVE, ENDED).
     */
    @NotNull(message = "Status is required")
    private RoomStatus status;
}
