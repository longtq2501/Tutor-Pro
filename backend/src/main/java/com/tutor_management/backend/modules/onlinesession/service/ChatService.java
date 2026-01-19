package com.tutor_management.backend.modules.onlinesession.service;

import com.tutor_management.backend.modules.onlinesession.dto.request.ChatMessageRequest;
import com.tutor_management.backend.modules.onlinesession.dto.response.ChatMessageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service interface for managing chat messages.
 */
public interface ChatService {

    /**
     * Save a new chat message sent via WebSocket.
     * @param roomId The room ID
     * @param userId The ID of the sender
     * @param request The message content
     * @return The saved message response
     */
    ChatMessageResponse saveMessage(String roomId, Long userId, ChatMessageRequest request);

    /**
     * Retrieve paginated chat messages for a room.
     * @param roomId The room ID
     * @param pageable Pagination details
     * @return A page of chat messages
     */
    Page<ChatMessageResponse> getMessages(String roomId, Pageable pageable);

    @Transactional(readOnly = true)
    com.tutor_management.backend.modules.onlinesession.dto.response.TypingResponse createTypingResponse(Long userId, boolean isTyping);
}
