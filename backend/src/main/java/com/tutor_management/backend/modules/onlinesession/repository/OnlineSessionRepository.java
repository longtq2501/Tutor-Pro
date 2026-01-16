package com.tutor_management.backend.modules.onlinesession.repository;

import com.tutor_management.backend.modules.onlinesession.entity.OnlineSession;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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
}
