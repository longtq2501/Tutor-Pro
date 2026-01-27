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
 * Entity to persist whiteboard strokes for a session.
 * Allows rejoining users to recover the board state.
 */
@Entity
@Table(
    name = "whiteboard_strokes",
    indexes = {
        @Index(name = "idx_whiteboard_room", columnList = "room_id"),
        @Index(name = "idx_whiteboard_stroke_id", columnList = "stroke_id")
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class WhiteboardStroke {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Client-generated stroke ID (e.g., date-random).
     */
    @Column(name = "stroke_id", nullable = false, length = 100)
    private String strokeId;
    
    /**
     * The room the stroke belongs to.
     */
    @Column(name = "room_id", nullable = false, length = 100)
    private String roomId;
    
    /**
     * The user who made the stroke.
     */
    @Column(name = "user_id", length = 100)
    private String userId;
    
    /**
     * Serialized StrokeData JSON.
     */
    @Column(name = "data", columnDefinition = "LONGTEXT")
    private String data;
    
    /**
     * Client-side timestamp.
     */
    @Column(name = "timestamp")
    private Long timestamp;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
