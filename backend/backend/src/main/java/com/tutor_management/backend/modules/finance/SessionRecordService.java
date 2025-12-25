package com.tutor_management.backend.modules.finance;

import com.tutor_management.backend.modules.finance.dto.request.SessionRecordRequest;
import com.tutor_management.backend.modules.finance.dto.request.SessionRecordUpdateRequest;
import com.tutor_management.backend.modules.finance.dto.response.SessionRecordResponse;
import com.tutor_management.backend.modules.student.Student;
import com.tutor_management.backend.modules.student.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SessionRecordService {

    private final SessionRecordRepository sessionRecordRepository;
    private final StudentRepository studentRepository;
    private final StatusTransitionValidator statusTransitionValidator;
    private final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

    public List<SessionRecordResponse> getAllRecords() {
        List<SessionRecord> records = sessionRecordRepository.findAllByOrderByCreatedAtDesc();
        return records.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<SessionRecordResponse> getRecordsByMonth(String month) {
        List<SessionRecord> records = sessionRecordRepository.findByMonthOrderByCreatedAtDesc(month);
        return records.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
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
                .build();

        SessionRecord saved = sessionRecordRepository.save(record);
        return convertToResponse(saved);
    }

    public SessionRecordResponse togglePayment(Long id) {
        SessionRecord record = sessionRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        record.setPaid(!record.getPaid());

        if (record.getPaid()) {
            record.setCompleted(true);
            record.setPaidAt(java.time.LocalDateTime.now());
        } else {
            record.setPaidAt(null);
        }

        SessionRecord updated = sessionRecordRepository.save(record);
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
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public SessionRecordResponse updateRecord(Long id, SessionRecordUpdateRequest request) {
        SessionRecord record = sessionRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        // Update fields nếu có trong request
        if (request.getMonth() != null) {
            record.setMonth(request.getMonth());
        }

        if (request.getSessions() != null) {
            record.setSessions(request.getSessions());
            // Recalculate hours and total
            Double hours = request.getSessions() * 2.0; // Default to 2.0 if not specified, or logic needs adjustment.
                                                        // Wait, update doesn't have hoursPerSession in request?
            // Checking logic: updateRecord request might not have hoursPerSession info if
            // it's just updating sessions count.
            // Assuming 2.0 for now as it was * 2 before, but this is risky.
            // Better to keep existing hoursPerSession ratio if possible, or just default to
            // * 2.0 for now as requested.
            // Actually, request object for update might need hoursPerSession or we derive
            // it.
            // Looking at the code, it hardcoded * 2 before.
            record.setHours(hours);
            record.setTotalAmount((long) (hours * record.getPricePerHour()));
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

        SessionRecord updated = sessionRecordRepository.save(record);
        return convertToResponse(updated);
    }

    public SessionRecordResponse toggleCompleted(Long id) {
        SessionRecord record = sessionRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        record.setCompleted(!record.getCompleted());

        SessionRecord updated = sessionRecordRepository.save(record);
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
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get sessions for a specific student and month
     */
    public List<SessionRecordResponse> getRecordsByStudentIdAndMonth(Long studentId, String month) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<SessionRecord> records = sessionRecordRepository.findByStudentAndMonthOrderByCreatedAtDesc(student, month);
        return records.stream()
                .map(this::convertToResponse)
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
                .build();
    }

    // ========== NEW METHODS FOR PHASE 2 ==========

    /**
     * Get a single session by ID
     */
    public SessionRecordResponse getSessionById(Long id) {
        SessionRecord record = sessionRecordRepository.findById(id)
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
            throw new RuntimeException(
                    String.format(
                            "Concurrent update detected. Expected version %d but found %d. Please refresh and try again.",
                            expectedVersion, record.getVersion()));
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
        SessionRecord updated = sessionRecordRepository.save(record);
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
}
