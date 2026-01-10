package com.tutor_management.backend.modules.finance;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tutor_management.backend.modules.finance.dto.request.SessionRecordRequest;
import com.tutor_management.backend.modules.finance.dto.request.SessionRecordUpdateRequest;
import com.tutor_management.backend.modules.finance.dto.response.SessionRecordResponse;
import com.tutor_management.backend.modules.student.Student;
import com.tutor_management.backend.modules.student.StudentRepository;
import com.tutor_management.backend.modules.notification.event.SessionCreatedEvent;
import com.tutor_management.backend.modules.notification.event.SessionRescheduledEvent;
import org.springframework.context.ApplicationEventPublisher;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SessionRecordService {

    private final SessionRecordRepository sessionRecordRepository;
    private final StudentRepository studentRepository;
    private final com.tutor_management.backend.modules.document.DocumentRepository documentRepository;
    private final com.tutor_management.backend.modules.lesson.LessonRepository lessonRepository;
    private final StatusTransitionValidator statusTransitionValidator;
    private final ApplicationEventPublisher eventPublisher;
    private final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

    public List<SessionRecordResponse> getAllRecords() {
        List<SessionRecord> records = sessionRecordRepository.findAllByOrderByCreatedAtDesc();
        return records.stream()
                .map(this::convertToListResponse)
                .collect(Collectors.toList());
    }

    public List<SessionRecordResponse> getRecordsByMonth(String month) {
        List<SessionRecord> records = sessionRecordRepository.findByMonthOrderByCreatedAtDesc(month);
        return records.stream()
                .map(this::convertToListResponse)
                .collect(Collectors.toList());
    }
    
    // ... items in between ...



    /**
     * Lightweight converter for lists - avoids fetching attachments
     */
    private SessionRecordResponse convertToListResponse(SessionRecord record) {
        return SessionRecordResponse.builder()
                .id(record.getId())
                .studentId(record.getStudent().getId())
                .studentName(record.getStudent().getName())
                .month(record.getMonth())
                .sessions(record.getSessions())
                .hours(record.getHours())
                .pricePerHour(record.getPricePerHour())
                .totalAmount(record.getTotalAmount())
                .paid(record.getPaid())
                .paidAt(record.getPaidAt() != null ? record.getPaidAt().format(formatter) : null)
                .notes(record.getNotes())
                .sessionDate(record.getSessionDate().toString())
                .createdAt(record.getCreatedAt().format(formatter))
                .completed(record.getCompleted())
                .startTime(record.getStartTime() != null
                        ? record.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm"))
                        : null)
                .endTime(record.getEndTime() != null ? record.getEndTime().format(DateTimeFormatter.ofPattern("HH:mm"))
                        : null)
                .subject(record.getSubject())
                .status(record.getStatus() != null ? record.getStatus().name() : null)
                .version(record.getVersion())
                // Empty attachments for list view to avoid N+1
                .documents(java.util.Collections.emptyList())
                .lessons(java.util.Collections.emptyList())
                .build();
    }

    public SessionRecordResponse createRecord(SessionRecordRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Double hours = request.getHoursPerSession() * request.getSessions();
        long totalAmount = (long) (hours * student.getPricePerHour()); // Cast result of multiplication

        SessionRecord record = SessionRecord.builder()
                .student(student)
                .month(request.getMonth())
                .sessions(request.getSessions())
                .hours(hours)
                .pricePerHour(student.getPricePerHour())
                .totalAmount(totalAmount)
                .paid(false)
                .notes(request.getNotes())
                .sessionDate(LocalDate.parse(request.getSessionDate()))
                .startTime(request.getStartTime() != null && !request.getStartTime().isEmpty()
                        ? java.time.LocalTime.parse(request.getStartTime())
                        : null)
                .endTime(request.getEndTime() != null && !request.getEndTime().isEmpty()
                        ? java.time.LocalTime.parse(request.getEndTime())
                        : null)
                .subject(request.getSubject() != null && !request.getSubject().isEmpty() ? request.getSubject() : null)
                .status(request.getStatus() != null ? LessonStatus.valueOf(request.getStatus())
                        : LessonStatus.SCHEDULED)
                .build();

        // 🆕 Attachments
        if (request.getDocumentIds() != null && !request.getDocumentIds().isEmpty()) {
            List<com.tutor_management.backend.modules.document.Document> docs = documentRepository
                    .findAllById(request.getDocumentIds());
            record.setDocuments(new java.util.HashSet<>(docs));
        }
        if (request.getLessonIds() != null && !request.getLessonIds().isEmpty()) {
            List<com.tutor_management.backend.modules.lesson.Lesson> lessons = lessonRepository
                    .findAllById(request.getLessonIds());
            record.setLessons(new java.util.HashSet<>(lessons));
        }

        SessionRecord saved = sessionRecordRepository.save(record);
        
        // Notify student
        try {
            eventPublisher.publishEvent(SessionCreatedEvent.builder()
                    .sessionId(saved.getId())
                    .studentId(saved.getStudent().getId())
                    .tutorName("Giáo viên")
                    .subject(saved.getSubject())
                    .sessionDate(saved.getSessionDate())
                    .startTime(saved.getStartTime())
                    .build());
        } catch (Exception e) {
            log.error("Failed to publish SessionCreatedEvent", e);
        }

        return convertToResponse(saved);
    }

    public SessionRecordResponse togglePayment(Long id, Integer version) {
        SessionRecord record = sessionRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        if (version != null && !record.getVersion().equals(version)) {
            String errorMsg = String.format(
                    "Concurrent update detected for Session %d. Expected version %d, but DB has %d",
                    id, version, record.getVersion());
            log.error(errorMsg);
            throw new RuntimeException(errorMsg + ". Please refresh and try again.");
        }

        record.setPaid(!record.getPaid());

        if (record.getPaid()) {
            record.setCompleted(true);
            record.setPaidAt(java.time.LocalDateTime.now());
            record.setStatus(LessonStatus.PAID);
        } else {
            record.setPaidAt(null);
            record.setStatus(LessonStatus.COMPLETED);
        }

        SessionRecord updated = sessionRecordRepository.saveAndFlush(record);
        return convertToResponse(updated);
    }

    public void deleteRecord(Long id) {
        SessionRecord record = sessionRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));
        sessionRecordRepository.delete(record);
    }

    public List<SessionRecordResponse> getAllUnpaidSessions() {
        List<SessionRecord> unpaidRecords = sessionRecordRepository.findByPaidFalseOrderBySessionDateDesc();
        return unpaidRecords.stream()
                .map(this::convertToListResponse)
                .collect(Collectors.toList());
    }

    public SessionRecordResponse updateRecord(Long id, SessionRecordUpdateRequest request) {
        SessionRecord record = sessionRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        // Optimistic locking
        if (request.getVersion() != null && !record.getVersion().equals(request.getVersion())) {
            String errorMsg = String.format(
                    "Concurrent update detected for Session %d. Expected version %d, but DB has %d",
                    id, request.getVersion(), record.getVersion());
            log.error(errorMsg);
            throw new RuntimeException(errorMsg + ". Please refresh and try again.");
        }

        // Update fields if present in request
        if (request.getMonth() != null) {
            record.setMonth(request.getMonth());
        }

        if (request.getSessions() != null) {
            record.setSessions(request.getSessions());
            // Maintain hours based on new sessions count if hoursPerSession is provided or
            // use existing ratio
            double ratio = request.getHoursPerSession() != null ? request.getHoursPerSession()
                    : (record.getHours() / record.getSessions());
            record.setHours(request.getSessions() * ratio);
            record.setTotalAmount((long) (record.getHours() * record.getPricePerHour()));
        }

        if (request.getSessionDate() != null) {
            record.setSessionDate(LocalDate.parse(request.getSessionDate()));
        }

        if (request.getNotes() != null) {
            record.setNotes(request.getNotes());
        }

        if (request.getCompleted() != null) {
            record.setCompleted(request.getCompleted());
        }

        // New Calendar Fields
        if (request.getStartTime() != null) {
            record.setStartTime(
                    request.getStartTime().isEmpty() ? null : java.time.LocalTime.parse(request.getStartTime()));
        }
        if (request.getEndTime() != null) {
            record.setEndTime(request.getEndTime().isEmpty() ? null : java.time.LocalTime.parse(request.getEndTime()));
        }

        // Auto-recalculate hours based on time if both provided/available
        if (record.getStartTime() != null && record.getEndTime() != null) {
            java.time.Duration duration = java.time.Duration.between(record.getStartTime(), record.getEndTime());
            if (duration.isNegative())
                duration = duration.plusDays(1); // Handle overnight
            double newHours = duration.toMinutes() / 60.0;
            if (newHours > 0) {
                record.setHours(newHours);
                record.setTotalAmount((long) (newHours * record.getPricePerHour()));
            }
        }

        if (request.getSubject() != null) {
            record.setSubject(request.getSubject().isEmpty() ? null : request.getSubject());
        }
        if (request.getStatus() != null) {
            LessonStatus newStatus = LessonStatus.valueOf(request.getStatus());
            // Optional: validate transition if needed
            // statusTransitionValidator.validate(record.getStatus(), newStatus);
            record.setStatus(newStatus);

            // Sync legacy fields
            if (newStatus == LessonStatus.PAID) {
                record.setPaid(true);
                record.setCompleted(true);
                if (record.getPaidAt() == null)
                    record.setPaidAt(java.time.LocalDateTime.now());
            } else if (newStatus == LessonStatus.COMPLETED) {
                record.setCompleted(true);
            }
        }

        // 🆕 Update Attachments
        if (request.getDocumentIds() != null) {
            List<com.tutor_management.backend.modules.document.Document> docs = documentRepository
                    .findAllById(request.getDocumentIds());
            record.setDocuments(new java.util.HashSet<>(docs));
        }
        if (request.getLessonIds() != null) {
            List<com.tutor_management.backend.modules.lesson.Lesson> lessons = lessonRepository
                    .findAllById(request.getLessonIds());
            record.setLessons(new java.util.HashSet<>(lessons));
        }

        SessionRecord updated = sessionRecordRepository.saveAndFlush(record);

        // Notify student
        try {
            eventPublisher.publishEvent(SessionRescheduledEvent.builder()
                    .sessionId(updated.getId())
                    .studentId(updated.getStudent().getId())
                    .tutorName("Giáo viên")
                    .subject(updated.getSubject())
                    .newDate(updated.getSessionDate())
                    .newStartTime(updated.getStartTime())
                    .build());
        } catch (Exception e) {
            log.error("Failed to publish SessionRescheduledEvent", e);
        }

        return convertToResponse(updated);
    }

    public SessionRecordResponse toggleCompleted(Long id, Integer version) {
        SessionRecord record = sessionRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        if (version != null && !record.getVersion().equals(version)) {
            String errorMsg = String.format(
                    "Concurrent update detected for Session %d. Expected version %d, but DB has %d",
                    id, version, record.getVersion());
            log.error(errorMsg);
            throw new RuntimeException(errorMsg + ". Please refresh and try again.");
        }

        boolean newCompleted = !record.getCompleted();
        record.setCompleted(newCompleted);

        if (newCompleted) {
            record.setStatus(LessonStatus.COMPLETED);
        } else {
            record.setStatus(LessonStatus.SCHEDULED);
            record.setPaid(false);
            record.setPaidAt(null);
        }

        SessionRecord updated = sessionRecordRepository.saveAndFlush(record);
        return convertToResponse(updated);
    }

    /**
     * Get all sessions for a specific student
     */
    public List<SessionRecordResponse> getRecordsByStudentId(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<SessionRecord> records = sessionRecordRepository.findByStudentOrderByCreatedAtDesc(student);
        return records.stream()
                .map(this::convertToListResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get sessions for a specific student and month
     */
    public List<SessionRecordResponse> getRecordsByStudentIdAndMonth(Long studentId, String month) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<SessionRecord> records = sessionRecordRepository.findByStudentAndMonthFilteredOrderByDateAsc(student,
                month);
        return records.stream()
                .map(this::convertToListResponse)
                .collect(Collectors.toList());
    }

    public List<String> getDistinctMonths() {
        return sessionRecordRepository.findDistinctMonths();
    }

    private SessionRecordResponse convertToResponse(SessionRecord record) {
        return SessionRecordResponse.builder()
                .id(record.getId())
                .studentId(record.getStudent().getId())
                .studentName(record.getStudent().getName())
                .month(record.getMonth())
                .sessions(record.getSessions())
                .hours(record.getHours())
                .pricePerHour(record.getPricePerHour())
                .totalAmount(record.getTotalAmount())
                .paid(record.getPaid())
                .paidAt(record.getPaidAt() != null ? record.getPaidAt().format(formatter) : null)
                .notes(record.getNotes())
                .sessionDate(record.getSessionDate().toString()) // Format YYYY-MM-DD
                .createdAt(record.getCreatedAt().format(formatter))
                .completed(record.getCompleted())
                // New calendar optimization fields
                .startTime(record.getStartTime() != null
                        ? record.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm"))
                        : null)
                .endTime(record.getEndTime() != null ? record.getEndTime().format(DateTimeFormatter.ofPattern("HH:mm"))
                        : null)
                .subject(record.getSubject())
                .status(record.getStatus() != null ? record.getStatus().name() : null)
                .version(record.getVersion())
                // 🆕 Attachments mapping
                .documents(record.getDocuments().stream()
                        .map(doc -> SessionRecordResponse.DocumentDTO.builder()
                                .id(doc.getId())
                                .title(doc.getTitle())
                                .fileName(doc.getFileName())
                                .fileType(doc.getFileType())
                                .fileSize(doc.getFileSize())
                                .filePath(doc.getFilePath())
                                .build())
                        .collect(Collectors.toList()))
                .lessons(record.getLessons().stream()
                        .map(lesson -> SessionRecordResponse.LessonDTO.builder()
                                .id(lesson.getId())
                                .title(lesson.getTitle())
                                .summary(lesson.getSummary())
                                .thumbnailUrl(lesson.getThumbnailUrl())
                                .durationMinutes(lesson.getDurationMinutes())
                                .isPublished(lesson.getIsPublished())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }

    // ========== NEW METHODS FOR PHASE 2 ==========

    /**
     * Get a single session by ID
     */
    public SessionRecordResponse getSessionById(Long id) {
        SessionRecord record = sessionRecordRepository.findByIdWithAttachments(id)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + id));
        return convertToResponse(record);
    }

    /**
     * Update session status with optimistic locking
     * 
     * @param id              Session ID
     * @param newStatus       Target status
     * @param expectedVersion Expected version for optimistic locking
     * @return Updated session
     * @throws RuntimeException                 if version mismatch (concurrent
     *                                          update detected)
     * @throws InvalidStatusTransitionException if transition is not allowed
     */
    public SessionRecordResponse updateStatus(Long id, LessonStatus newStatus, Integer expectedVersion) {
        SessionRecord record = sessionRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + id));

        // Optimistic locking check
        if (!record.getVersion().equals(expectedVersion)) {
            String errorMsg = String.format(
                    "Concurrent update detected for Session %d. Expected version %d, but DB has %d",
                    id, expectedVersion, record.getVersion());
            log.error(errorMsg);
            throw new RuntimeException(errorMsg + ". Please refresh and try again.");
        }

        // Validate status transition
        LessonStatus currentStatus = record.getStatus();
        statusTransitionValidator.validate(currentStatus, newStatus);

        // Update status
        record.setStatus(newStatus);

        // Auto-update legacy fields for backward compatibility
        if (newStatus == LessonStatus.COMPLETED || newStatus == LessonStatus.PENDING_PAYMENT) {
            record.setCompleted(true);
        }
        if (newStatus == LessonStatus.PAID) {
            record.setCompleted(true);
            record.setPaid(true);
            if (record.getPaidAt() == null) {
                record.setPaidAt(java.time.LocalDateTime.now());
            }
        }

        // Version will auto-increment due to @Version annotation
        SessionRecord updated = sessionRecordRepository.saveAndFlush(record);

        // Notify student if status changed to something relevant for them or date/time updated
        try {
            eventPublisher.publishEvent(SessionRescheduledEvent.builder()
                    .sessionId(updated.getId())
                    .studentId(updated.getStudent().getId())
                    .tutorName("Giáo viên")
                    .subject(updated.getSubject())
                    .newDate(updated.getSessionDate())
                    .newStartTime(updated.getStartTime())
                    .build());
        } catch (Exception e) {
            log.error("Failed to publish SessionRescheduledEvent from updateStatus", e);
        }

        return convertToResponse(updated);
    }

    /**
     * Duplicate a session
     * Creates a copy with SCHEDULED status and incremented date
     */
    public SessionRecordResponse duplicateSession(Long id) {
        SessionRecord original = sessionRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + id));

        // Create duplicate with SCHEDULED status
        SessionRecord duplicate = SessionRecord.builder()
                .student(original.getStudent())
                .month(original.getMonth())
                .sessions(original.getSessions())
                .hours(original.getHours())
                .pricePerHour(original.getPricePerHour())
                .totalAmount(original.getTotalAmount())
                .paid(false)
                .completed(false)
                .notes(original.getNotes())
                .sessionDate(original.getSessionDate().plusDays(7)) // Next week by default
                .startTime(original.getStartTime())
                .endTime(original.getEndTime())
                .subject(original.getSubject())
                .status(LessonStatus.SCHEDULED)
                .build();

        SessionRecord saved = sessionRecordRepository.save(duplicate);
        return convertToResponse(saved);
    }

    public void deleteSessionsByMonth(String month) {
        sessionRecordRepository.deleteByMonth(month);
    }
}
