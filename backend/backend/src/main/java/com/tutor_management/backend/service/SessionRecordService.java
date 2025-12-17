package com.tutor_management.backend.service;

import com.tutor_management.backend.dto.request.SessionRecordRequest;
import com.tutor_management.backend.dto.request.SessionRecordUpdateRequest;
import com.tutor_management.backend.dto.response.SessionRecordResponse;
import com.tutor_management.backend.entity.SessionRecord;
import com.tutor_management.backend.entity.Student;
import com.tutor_management.backend.repository.SessionRecordRepository;
import com.tutor_management.backend.repository.StudentRepository;
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

        int hours = request.getSessions() * 2;
        long totalAmount = hours * student.getPricePerHour();

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
            // ✅ Khi set paid = true → Auto set completed = true
            record.setCompleted(true);
            record.setPaidAt(java.time.LocalDateTime.now());
        } else {
            // Khi unpaid → Có thể giữ nguyên completed hoặc set false
            record.setPaidAt(null);
            // Optional: Uncomment nếu muốn unpaid → uncomplete
            // record.setCompleted(false);
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
            int hours = request.getSessions() * 2;
            record.setHours(hours);
            record.setTotalAmount(hours * record.getPricePerHour());
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

    // ✅ THÊM vào SessionRecordService.java

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
                .sessionDate(record.getSessionDate().toString()) // 🆕 Format YYYY-MM-DD
                .createdAt(record.getCreatedAt().format(formatter))
                .completed(record.getCompleted())
                .build();
    }
}