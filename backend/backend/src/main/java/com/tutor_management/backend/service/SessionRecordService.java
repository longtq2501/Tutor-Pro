package com.tutor_management.backend.service;

import com.tutor_management.backend.dto.request.SessionRecordRequest;
import com.tutor_management.backend.dto.response.SessionRecordResponse;
import com.tutor_management.backend.entity.SessionRecord;
import com.tutor_management.backend.entity.Student;
import com.tutor_management.backend.repository.SessionRecordRepository;
import com.tutor_management.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + request.getStudentId()));

        SessionRecord record = new SessionRecord();
        record.setStudent(student);
        record.setMonth(request.getMonth());
        record.setSessions(request.getSessions());

        // Sử dụng hoursPerSession từ request thay vì hardcode * 2
        Double hoursPerSession = request.getHoursPerSession() != null ? request.getHoursPerSession() : 2.0;
        record.setHours((int) (request.getSessions() * hoursPerSession));

        record.setPricePerHour(student.getPricePerHour());
        record.setTotalAmount(record.getHours() * student.getPricePerHour());
        record.setPaid(false);
        record.setNotes(request.getNotes());

        SessionRecord saved = sessionRecordRepository.save(record);
        return convertToResponse(saved);
    }

    public SessionRecordResponse togglePayment(Long id) {
        SessionRecord record = sessionRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        record.setPaid(!record.getPaid());
        if (record.getPaid()) {
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
                .createdAt(record.getCreatedAt().format(formatter))
                .build();
    }
}
