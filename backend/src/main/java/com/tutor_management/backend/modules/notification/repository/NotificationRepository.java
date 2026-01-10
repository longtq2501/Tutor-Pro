package com.tutor_management.backend.modules.notification.repository;

import com.tutor_management.backend.modules.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Data access layer for managing stored notifications.
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    /** Fetches all notifications for an owner, newest first */
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);
    
    /** Filters notifications by their read/unread status */
    List<Notification> findByRecipientIdAndIsReadOrderByCreatedAtDesc(Long recipientId, Boolean isRead);
    
    /** Counts total unread messages for a specific user */
    long countByRecipientIdAndIsReadFalse(Long recipientId);
}
