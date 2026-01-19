package com.tutor_management.backend.modules.onlinesession.entity;

import com.tutor_management.backend.modules.onlinesession.enums.RoomStatus;
import com.tutor_management.backend.modules.tutor.entity.Tutor;
import com.tutor_management.backend.modules.student.entity.Student;
import com.tutor_management.backend.modules.finance.entity.SessionRecord;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity representing an online live teaching session.
 * Stores room metadata, participant details, and recording information.
 */
@Entity
@Table(
    name = "online_sessions",
    indexes = {
        @Index(name = "idx_room_id", columnList = "room_id", unique = true),
        @Index(name = "idx_room_status", columnList = "room_status"),
        @Index(name = "idx_tutor_id", columnList = "tutor_id"),
        @Index(name = "idx_student_id", columnList = "student_id"),
        @Index(name = "idx_tutor_student", columnList = "tutor_id, student_id"),
        @Index(name = "idx_scheduled_start", columnList = "scheduled_start"),
        @Index(name = "idx_last_activity_at", columnList = "last_activity_at")
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class OnlineSession {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Unique room identifier used by the frontend and signaling server.
     */
    @Column(name = "room_id", nullable = false, unique = true, length = 100)
    private String roomId;
    
    /**
     * Current status of the room: WAITING, ACTIVE, ENDED.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "room_status", nullable = false, length = 20)
    @Builder.Default
    private RoomStatus roomStatus = RoomStatus.WAITING;
    
    /**
     * Expected start time for the session.
     */
    @Column(name = "scheduled_start", nullable = false)
    private LocalDateTime scheduledStart;
    
    /**
     * Expected end time for the session.
     */
    @Column(name = "scheduled_end", nullable = false)
    private LocalDateTime scheduledEnd;
    
    /**
     * Actual time the session started.
     */
    @Column(name = "actual_start")
    private LocalDateTime actualStart;
    
    /**
     * Actual time the session ended.
     */
    @Column(name = "actual_end")
    private LocalDateTime actualEnd;
    
    /**
     * The tutor participating in the session.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tutor_id", nullable = false, foreignKey = @ForeignKey(name = "fk_online_sessions_tutor"))
    private Tutor tutor;
    
    /**
     * The student participating in the session.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false, foreignKey = @ForeignKey(name = "fk_online_sessions_student"))
    private Student student;
    
    /**
     * Exact timestamp when the tutor joined the room.
     */
    @Column(name = "tutor_joined_at")
    private LocalDateTime tutorJoinedAt;
    
    /**
     * Exact timestamp when the student joined the room.
     */
    @Column(name = "student_joined_at")
    private LocalDateTime studentJoinedAt;
    
    /**
     * Exact timestamp when the tutor left the room.
     */
    @Column(name = "tutor_left_at")
    private LocalDateTime tutorLeftAt;
    
    /**
     * Exact timestamp when the student left the room.
     */
    @Column(name = "student_left_at")
    private LocalDateTime studentLeftAt;
    
    /**
     * Total billable duration in minutes.
     */
    @Column(name = "total_duration_minutes")
    @Builder.Default
    private Integer totalDurationMinutes = 0;
    
    /**
     * Serialized whiteboard data (Phase 5).
     */
    @Column(name = "whiteboard_data", columnDefinition = "TEXT")
    @Builder.Default
    private String whiteboardData = "[]";
    
    /**
     * Serialized chat history (Phase 5).
     */
    /**
     * @deprecated Use separate ChatMessage entity and online_session_chat_messages table for paginated chat.
     */
    @Deprecated
    @Column(name = "chat_history", columnDefinition = "TEXT")
    @Builder.Default
    private String chatHistory = "[]";
    
    /**
     * Whether recording is enabled for this session (Phase 5.3).
     */
    @Column(name = "recording_enabled")
    @Builder.Default
    private Boolean recordingEnabled = false;
    
    @Column(name = "recording_started_at")
    private LocalDateTime recordingStartedAt;
    
    @Column(name = "recording_stopped_at")
    private LocalDateTime recordingStoppedAt;
    
    @Column(name = "recording_duration_minutes")
    private Integer recordingDurationMinutes;
    
    @Column(name = "recording_file_size_mb", precision = 6, scale = 2)
    private BigDecimal recordingFileSizeMb;
    
    @Column(name = "recording_downloaded")
    @Builder.Default
    private Boolean recordingDownloaded = false;
    
    /**
     * Linked session record for billing and historical tracking.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_record_id", foreignKey = @ForeignKey(name = "fk_online_sessions_session_record"))
    private SessionRecord sessionRecord;
    
    /**
     * Last detected activity from any participant (heartbeat).
     */
    @Column(name = "last_activity_at")
    private LocalDateTime lastActivityAt;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
