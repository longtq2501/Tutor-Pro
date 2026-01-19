package com.tutor_management.backend.modules.onlinesession.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Entity representing an individual chat message within an online session.
 */
@Entity
@Table(
    name = "online_session_chat_messages",
    indexes = {
        @Index(name = "idx_chat_room_id", columnList = "room_id"),
        @Index(name = "idx_chat_timestamp", columnList = "timestamp")
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The unique room identifier this message belongs to.
     */
    @Column(name = "room_id", nullable = false, length = 100)
    private String roomId;

    /**
     * The ID of the user who sent the message.
     */
    @Column(name = "sender_id", nullable = false)
    private Long senderId;

    /**
     * The name shown for the sender at the time of sending.
     */
    @Column(name = "sender_name", nullable = false, length = 100)
    private String senderName;

    /**
     * The role of the sender (e.g., TUTOR, STUDENT).
     */
    @Column(name = "sender_role", nullable = false, length = 20)
    private String senderRole;

    /**
     * The actual content of the chat message.
     */
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    /**
     * Timestamp when the message was sent.
     */
    @CreatedDate
    @Column(name = "timestamp", nullable = false, updatable = false)
    private LocalDateTime timestamp;
}
