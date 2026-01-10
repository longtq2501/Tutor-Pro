package com.tutor_management.backend.modules.notification.entity;

import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.notification.enums.NotificationType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entity representing a system notification sent to a specific user.
 * 
 * Supports different types of alerts (exams, schedules, etc.) and tracks
 * read status for UI synchronization.
 */
@Entity
@Table(name = "notifications",
       indexes = {
           @Index(name = "idx_recipient_read", columnList = "recipient_id, is_read"),
           @Index(name = "idx_created_at", columnList = "created_at")
       })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    /** Unique identifier for the notification */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The user who receives the notification */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

    /** Short title or summary of the alert */
    @Column(nullable = false)
    private String title;

    /** Detailed message body */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    /** Flag indicating if the user has viewed the notification */
    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private boolean isRead = false;

    /** Categorization of the notification for UI icon/color mapping */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private NotificationType type;

    /** Automatically populated timestamp when saved */
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /** Timestamp of the last update (e.g., when marked as read) */
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
