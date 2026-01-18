package com.tutor_management.backend.modules.onlinesession.repository;

import com.tutor_management.backend.modules.onlinesession.entity.OnlineSession;
import com.tutor_management.backend.modules.onlinesession.enums.RoomStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for OnlineSession data access.
 */
@Repository
public interface OnlineSessionRepository extends JpaRepository<OnlineSession, Long> {

    /**
     * Finds an online session by its unique room ID.
     * 
     * @param roomId The unique identifier for the room.
     * @return Optional containing the OnlineSession if found.
     */
    @EntityGraph(attributePaths = {"tutor", "student"})
    Optional<OnlineSession> findByRoomId(String roomId);

    @EntityGraph(attributePaths = {"tutor", "student"})
    List<OnlineSession> findByRoomStatus(RoomStatus status);

    long countByRoomStatus(RoomStatus status);

    @Query("SELECT SUM(s.totalDurationMinutes) FROM OnlineSession s WHERE s.totalDurationMinutes IS NOT NULL")
    Optional<Long> sumTotalDurationMinutes();

    long countByScheduledStartBetween(LocalDateTime start, LocalDateTime end);
}
