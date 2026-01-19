package com.tutor_management.backend.modules.onlinesession.repository;

import com.tutor_management.backend.modules.onlinesession.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for managing ChatMessage entities.
 */
@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    /**
     * Find messages for a specific room, ordered by timestamp descending for pagination.
     * @param roomId The room identifier
     * @param pageable Pagination details
     * @return A page of chat messages
     */
    Page<ChatMessage> findByRoomIdOrderByTimestampDesc(String roomId, Pageable pageable);
}
