package com.tutor_management.backend.service;

import com.tutor_management.backend.dto.request.HomeworkRequest;
import com.tutor_management.backend.dto.response.HomeworkResponse;
import com.tutor_management.backend.dto.response.HomeworkStatsResponse;
import com.tutor_management.backend.entity.*;
import com.tutor_management.backend.entity.Homework.HomeworkStatus;
import com.tutor_management.backend.exception.ResourceNotFoundException;
import com.tutor_management.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class HomeworkService {

    private final HomeworkRepository homeworkRepository;
    private final StudentRepository studentRepository;
    private final SessionRecordRepository sessionRecordRepository;
    private final CloudinaryService cloudinaryService;
    // EmailService là optional - nếu có thì uncomment
    // private final EmailService emailService;

    // Create homework (by tutor)
    public HomeworkResponse createHomework(HomeworkRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + request.getStudentId()));

        SessionRecord sessionRecord = null;
        if (request.getSessionRecordId() != null) {
            sessionRecord = sessionRecordRepository.findById(request.getSessionRecordId())
                    .orElseThrow(() -> new ResourceNotFoundException("Session record not found with id: " + request.getSessionRecordId()));
        }

        String attachmentUrls = request.getAttachmentUrls() != null && !request.getAttachmentUrls().isEmpty()
                ? String.join(",", request.getAttachmentUrls())
                : null;

        Homework homework = Homework.builder()
                .student(student)
                .sessionRecord(sessionRecord)
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .priority(request.getPriority() != null ? request.getPriority() : Homework.HomeworkPriority.MEDIUM)
                .tutorNotes(request.getTutorNotes())
                .attachmentUrls(attachmentUrls)
                .status(HomeworkStatus.ASSIGNED)
                .build();

        homework = homeworkRepository.save(homework);
        log.info("Created new homework: {} for student: {}", homework.getId(), student.getName());

        // Send email notification to student/parent (optional)
        try {
            sendHomeworkNotification(homework, "NEW");
        } catch (Exception e) {
            log.error("Failed to send homework notification", e);
        }

        return HomeworkResponse.fromEntity(homework);
    }

    // Get all homeworks for a student
    @Transactional(readOnly = true)
    public List<HomeworkResponse> getStudentHomeworks(Long studentId) {
        // Verify student exists
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with id: " + studentId);
        }

        List<Homework> homeworks = homeworkRepository.findByStudentIdOrderByDueDateDesc(studentId);
        return homeworks.stream()
                .map(HomeworkResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // Get homework by ID
    @Transactional(readOnly = true)
    public HomeworkResponse getHomeworkById(Long id) {
        Homework homework = homeworkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Homework not found with id: " + id));
        return HomeworkResponse.fromEntity(homework);
    }

    // Get homework by status
    @Transactional(readOnly = true)
    public List<HomeworkResponse> getHomeworksByStatus(Long studentId, HomeworkStatus status) {
        List<Homework> homeworks = homeworkRepository.findByStudentIdAndStatusOrderByDueDateDesc(studentId, status);
        return homeworks.stream()
                .map(HomeworkResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // Get upcoming homeworks (due within X days)
    @Transactional(readOnly = true)
    public List<HomeworkResponse> getUpcomingHomeworks(Long studentId, Integer days) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime endDate = now.plusDays(days != null ? days : 7);

        List<Homework> homeworks = homeworkRepository.findUpcomingHomeworks(studentId, now, endDate);
        return homeworks.stream()
                .map(HomeworkResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // Get overdue homeworks
    @Transactional(readOnly = true)
    public List<HomeworkResponse> getOverdueHomeworks(Long studentId) {
        List<Homework> homeworks = homeworkRepository.findOverdueHomeworks(studentId);
        return homeworks.stream()
                .map(HomeworkResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // Update homework status (student can mark as IN_PROGRESS)
    public HomeworkResponse updateHomeworkStatus(Long homeworkId, HomeworkStatus status, Long studentId) {
        Homework homework = homeworkRepository.findById(homeworkId)
                .orElseThrow(() -> new ResourceNotFoundException("Homework not found with id: " + homeworkId));

        // Verify ownership
        if (!homework.getStudent().getId().equals(studentId)) {
            throw new IllegalArgumentException("You don't have permission to update this homework");
        }

        // Only allow certain status transitions for students
        if (status != HomeworkStatus.IN_PROGRESS && status != HomeworkStatus.ASSIGNED) {
            throw new IllegalArgumentException("Students can only mark homework as IN_PROGRESS");
        }

        homework.setStatus(status);
        homework = homeworkRepository.save(homework);
        log.info("Updated homework {} status to: {}", homeworkId, status);

        return HomeworkResponse.fromEntity(homework);
    }

    // Submit homework (student)
    public HomeworkResponse submitHomework(Long homeworkId, String submissionNotes,
                                           List<String> submissionUrls, Long studentId) {
        Homework homework = homeworkRepository.findById(homeworkId)
                .orElseThrow(() -> new ResourceNotFoundException("Homework not found with id: " + homeworkId));

        // Verify ownership
        if (!homework.getStudent().getId().equals(studentId)) {
            throw new IllegalArgumentException("You don't have permission to submit this homework");
        }

        // Check if already submitted
        if (homework.getStatus() == HomeworkStatus.SUBMITTED || homework.getStatus() == HomeworkStatus.GRADED) {
            throw new IllegalArgumentException("This homework has already been submitted");
        }

        homework.setSubmissionNotes(submissionNotes);
        homework.setSubmissionUrls(submissionUrls != null && !submissionUrls.isEmpty()
                ? String.join(",", submissionUrls)
                : null);
        homework.setSubmittedAt(LocalDateTime.now());
        homework.setStatus(HomeworkStatus.SUBMITTED);

        homework = homeworkRepository.save(homework);
        log.info("Student {} submitted homework {}", studentId, homeworkId);

        // Send notification to tutor
        try {
            sendHomeworkNotification(homework, "SUBMITTED");
        } catch (Exception e) {
            log.error("Failed to send submission notification", e);
        }

        return HomeworkResponse.fromEntity(homework);
    }

    public String uploadHomeworkFile(MultipartFile file) {
        // ✅ ADD DETAILED LOGGING
        log.info("=== uploadHomeworkFile called ===");
        log.info("File parameter: {}", file);

        if (file == null) {
            log.error("File parameter is NULL!");
            throw new IllegalArgumentException("File is null");
        }

        log.info("File name: {}", file.getOriginalFilename());
        log.info("File size: {}", file.getSize());
        log.info("File content type: {}", file.getContentType());

        if (file.isEmpty()) {
            log.error("File is empty!");
            throw new IllegalArgumentException("File is empty");
        }

        try {
            log.info("Calling cloudinaryService.uploadFile...");
            String url = cloudinaryService.uploadFile(file, "homework");
            log.info("Cloudinary upload SUCCESS! URL: {}", url);
            return url;
        } catch (Exception e) {
            log.error("❌ Cloudinary upload FAILED!", e);
            log.error("Exception type: {}", e.getClass().getName());
            log.error("Exception message: {}", e.getMessage());
            throw new RuntimeException("Failed to upload to Cloudinary: " + e.getMessage(), e);
        }
    }

    // Grade homework (tutor)
    public HomeworkResponse gradeHomework(Long homeworkId, Integer score, String feedback) {
        Homework homework = homeworkRepository.findById(homeworkId)
                .orElseThrow(() -> new ResourceNotFoundException("Homework not found with id: " + homeworkId));

        // Check if homework has been submitted
        if (homework.getStatus() != HomeworkStatus.SUBMITTED) {
            throw new IllegalArgumentException("Cannot grade homework that hasn't been submitted");
        }

        if (score < 0 || score > 100) {
            throw new IllegalArgumentException("Score must be between 0 and 100");
        }

        homework.setScore(score);
        homework.setFeedback(feedback);
        homework.setGradedAt(LocalDateTime.now());
        homework.setStatus(HomeworkStatus.GRADED);

        homework = homeworkRepository.save(homework);
        log.info("Graded homework {} with score: {}", homeworkId, score);

        // Send notification to student
        try {
            sendHomeworkNotification(homework, "GRADED");
        } catch (Exception e) {
            log.error("Failed to send grading notification", e);
        }

        return HomeworkResponse.fromEntity(homework);
    }

    // Update homework (tutor can edit)
    public HomeworkResponse updateHomework(Long homeworkId, HomeworkRequest request) {
        Homework homework = homeworkRepository.findById(homeworkId)
                .orElseThrow(() -> new ResourceNotFoundException("Homework not found with id: " + homeworkId));

        // Update fields
        if (request.getTitle() != null) {
            homework.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            homework.setDescription(request.getDescription());
        }
        if (request.getDueDate() != null) {
            homework.setDueDate(request.getDueDate());
        }
        if (request.getPriority() != null) {
            homework.setPriority(request.getPriority());
        }
        if (request.getTutorNotes() != null) {
            homework.setTutorNotes(request.getTutorNotes());
        }
        if (request.getAttachmentUrls() != null) {
            homework.setAttachmentUrls(String.join(",", request.getAttachmentUrls()));
        }

        homework = homeworkRepository.save(homework);
        log.info("Updated homework: {}", homeworkId);

        return HomeworkResponse.fromEntity(homework);
    }

    // Get homework statistics
    @Transactional(readOnly = true)
    public HomeworkStatsResponse getHomeworkStats(Long studentId) {
        // Verify student exists
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with id: " + studentId);
        }

        List<Homework> allHomeworks = homeworkRepository.findByStudentIdOrderByDueDateDesc(studentId);

        long total = allHomeworks.size();
        long assigned = allHomeworks.stream().filter(h -> h.getStatus() == HomeworkStatus.ASSIGNED).count();
        long inProgress = allHomeworks.stream().filter(h -> h.getStatus() == HomeworkStatus.IN_PROGRESS).count();
        long submitted = allHomeworks.stream().filter(h -> h.getStatus() == HomeworkStatus.SUBMITTED).count();
        long graded = allHomeworks.stream().filter(h -> h.getStatus() == HomeworkStatus.GRADED).count();
        long overdue = allHomeworks.stream().filter(h -> h.getStatus() == HomeworkStatus.OVERDUE).count();

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sevenDaysLater = now.plusDays(7);
        long upcoming = allHomeworks.stream()
                .filter(h -> h.getDueDate() != null && h.getDueDate().isAfter(now) && h.getDueDate().isBefore(sevenDaysLater))
                .filter(h -> h.getStatus() == HomeworkStatus.ASSIGNED || h.getStatus() == HomeworkStatus.IN_PROGRESS)
                .count();

        Double avgScore = allHomeworks.stream()
                .filter(h -> h.getScore() != null)
                .mapToInt(Homework::getScore)
                .average()
                .orElse(0.0);

        return HomeworkStatsResponse.builder()
                .totalHomeworks(total)
                .assignedCount(assigned)
                .inProgressCount(inProgress)
                .submittedCount(submitted)
                .gradedCount(graded)
                .overdueCount(overdue)
                .upcomingCount(upcoming)
                .averageScore(Math.round(avgScore * 10.0) / 10.0) // Round to 1 decimal
                .build();
    }

    // Delete homework
    public void deleteHomework(Long homeworkId) {
        if (!homeworkRepository.existsById(homeworkId)) {
            throw new ResourceNotFoundException("Homework not found with id: " + homeworkId);
        }
        homeworkRepository.deleteById(homeworkId);
        log.info("Deleted homework: {}", homeworkId);
    }

    // Search homeworks
    @Transactional(readOnly = true)
    public List<HomeworkResponse> searchHomeworks(Long studentId, String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getStudentHomeworks(studentId);
        }

        List<Homework> homeworks = homeworkRepository.searchHomeworks(studentId, keyword.trim());
        return homeworks.stream()
                .map(HomeworkResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // Send email notification (placeholder - implement based on your EmailService)
    private void sendHomeworkNotification(Homework homework, String type) {
        // Uncomment and implement when EmailService is available
        /*
        String subject = "";
        String message = "";

        switch (type) {
            case "NEW":
                subject = "Bài tập mới: " + homework.getTitle();
                message = "Bạn có bài tập mới cần hoàn thành trước " + homework.getDueDate();
                break;
            case "SUBMITTED":
                subject = "Bài tập đã nộp: " + homework.getTitle();
                message = homework.getStudent().getName() + " đã nộp bài tập";
                break;
            case "GRADED":
                subject = "Bài tập đã được chấm điểm: " + homework.getTitle();
                message = "Điểm số: " + homework.getScore() + "/100";
                break;
        }

        // Send to student email if available
        if (homework.getStudent().getParent() != null && homework.getStudent().getParent().getEmail() != null) {
            emailService.sendEmail(homework.getStudent().getParent().getEmail(), subject, message);
        }
        */

        log.info("Notification [{}] for homework: {}", type, homework.getTitle());
    }
}