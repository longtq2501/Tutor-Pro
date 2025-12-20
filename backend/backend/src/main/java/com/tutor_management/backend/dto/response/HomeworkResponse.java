package com.tutor_management.backend.dto.response;

import com.tutor_management.backend.entity.Homework;
import com.tutor_management.backend.entity.Homework.HomeworkPriority;
import com.tutor_management.backend.entity.Homework.HomeworkStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomeworkResponse {

    private Long id;
    private Long studentId;
    private String studentName;
    private Long sessionRecordId;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private HomeworkStatus status;
    private HomeworkPriority priority;
    private List<String> attachmentUrls;
    private String tutorNotes;

    // Submission info
    private LocalDateTime submittedAt;
    private List<String> submissionUrls;
    private String submissionNotes;

    // Grading info
    private Integer score;
    private String feedback;
    private LocalDateTime gradedAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Additional computed fields
    private Boolean isOverdue;
    private Long daysUntilDue;

    public static HomeworkResponse fromEntity(Homework homework) {
        List<String> attachments = homework.getAttachmentUrls() != null && !homework.getAttachmentUrls().isEmpty()
                ? Arrays.asList(homework.getAttachmentUrls().split(","))
                : Collections.emptyList();

        List<String> submissions = homework.getSubmissionUrls() != null && !homework.getSubmissionUrls().isEmpty()
                ? Arrays.asList(homework.getSubmissionUrls().split(","))
                : Collections.emptyList();

        LocalDateTime now = LocalDateTime.now();
        boolean isOverdue = homework.getDueDate() != null
                && now.isAfter(homework.getDueDate())
                && homework.getStatus() != HomeworkStatus.SUBMITTED
                && homework.getStatus() != HomeworkStatus.GRADED;

        Long daysUntilDue = null;
        if (homework.getDueDate() != null && now.isBefore(homework.getDueDate())) {
            daysUntilDue = java.time.Duration.between(now, homework.getDueDate()).toDays();
        }

        return HomeworkResponse.builder()
                .id(homework.getId())
                .studentId(homework.getStudent().getId())
                .studentName(homework.getStudent().getName())
                .sessionRecordId(homework.getSessionRecord() != null ? homework.getSessionRecord().getId() : null)
                .title(homework.getTitle())
                .description(homework.getDescription())
                .dueDate(homework.getDueDate())
                .status(homework.getStatus())
                .priority(homework.getPriority())
                .attachmentUrls(attachments)
                .tutorNotes(homework.getTutorNotes())
                .submittedAt(homework.getSubmittedAt())
                .submissionUrls(submissions)
                .submissionNotes(homework.getSubmissionNotes())
                .score(homework.getScore())
                .feedback(homework.getFeedback())
                .gradedAt(homework.getGradedAt())
                .createdAt(homework.getCreatedAt())
                .updatedAt(homework.getUpdatedAt())
                .isOverdue(isOverdue)
                .daysUntilDue(daysUntilDue)
                .build();
    }
}

