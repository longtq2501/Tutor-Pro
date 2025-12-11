package com.tutor_management.backend.service;

import com.tutor_management.backend.dto.request.StudentRequest;
import com.tutor_management.backend.dto.response.StudentResponse;
import com.tutor_management.backend.entity.*;
import com.tutor_management.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentService {

    private final StudentRepository studentRepository;
    private final SessionRecordRepository sessionRecordRepository;
    private final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

    public List<StudentResponse> getAllStudents() {
        List<Student> students = studentRepository.findAllByOrderByCreatedAtDesc();
        return students.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return convertToResponse(student);
    }

    public StudentResponse createStudent(StudentRequest request) {
        Student student = Student.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .schedule(request.getSchedule())
                .pricePerHour(request.getPricePerHour())
                .notes(request.getNotes())
                .active(request.getActive() != null ? request.getActive() : true)
                .startMonth(request.getStartMonth() != null ? request.getStartMonth() :
                        YearMonth.now().toString())
                .build();

        Student saved = studentRepository.save(student);
        return convertToResponse(saved);
    }

    public StudentResponse updateStudent(Long id, StudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setName(request.getName());
        student.setPhone(request.getPhone());
        student.setSchedule(request.getSchedule());
        student.setPricePerHour(request.getPricePerHour());
        student.setNotes(request.getNotes());

        if (request.getActive() != null) {
            student.setActive(request.getActive());
        }
        if (request.getStartMonth() != null) {
            student.setStartMonth(request.getStartMonth());
        }

        Student updated = studentRepository.save(student);
        return convertToResponse(updated);
    }

    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Delete all session records for this student
        List<SessionRecord> records = sessionRecordRepository.findByStudentIdOrderByCreatedAtDesc(id);
        sessionRecordRepository.deleteAll(records);

        studentRepository.delete(student);
    }

    public StudentResponse convertToResponse(Student student) {
        List<SessionRecord> records = sessionRecordRepository.findByStudentIdOrderByCreatedAtDesc(student.getId());

        Long totalPaid = records.stream()
                .filter(SessionRecord::getPaid)
                .mapToLong(SessionRecord::getTotalAmount)
                .sum();

        Long totalUnpaid = records.stream()
                .filter(r -> !r.getPaid())
                .mapToLong(SessionRecord::getTotalAmount)
                .sum();

        // Tính toán lastActiveMonth
        String lastActiveMonth = null;
        if (!records.isEmpty()) {
            lastActiveMonth = records.stream()
                    .map(SessionRecord::getMonth)
                    .max(String::compareTo)
                    .orElse(null);

            // Cập nhật lastActiveMonth nếu thay đổi
            if (lastActiveMonth != null && !lastActiveMonth.equals(student.getLastActiveMonth())) {
                student.setLastActiveMonth(lastActiveMonth);
                studentRepository.save(student);
            }
        }

        // Tính monthsLearned
        Integer monthsLearned = calculateMonthsLearned(student.getStartMonth(), lastActiveMonth);

        // Tạo learningDuration text
        String learningDuration = buildLearningDuration(student.getStartMonth(), monthsLearned);

        return StudentResponse.builder()
                .id(student.getId())
                .name(student.getName())
                .phone(student.getPhone())
                .schedule(student.getSchedule())
                .pricePerHour(student.getPricePerHour())
                .notes(student.getNotes())
                .active(student.getActive())
                .startMonth(student.getStartMonth())
                .lastActiveMonth(lastActiveMonth)
                .monthsLearned(monthsLearned)
                .learningDuration(learningDuration)
                .createdAt(student.getCreatedAt().format(formatter))
                .totalPaid(totalPaid)
                .totalUnpaid(totalUnpaid)
                .build();
    }

    private Integer calculateMonthsLearned(String startMonth, String lastActiveMonth) {
        if (startMonth == null || lastActiveMonth == null) return 0;

        try {
            YearMonth start = YearMonth.parse(startMonth);
            YearMonth end = YearMonth.parse(lastActiveMonth);
            return (int) java.time.temporal.ChronoUnit.MONTHS.between(start, end) + 1;
        } catch (Exception e) {
            return 0;
        }
    }

    private String buildLearningDuration(String startMonth, Integer monthsLearned) {
        if (startMonth == null) return "";

        try {
            String[] parts = startMonth.split("-");
            String displayMonth = parts[1] + "/" + parts[0]; // MM/YYYY

            if (monthsLearned != null && monthsLearned > 0) {
                return "Bắt đầu: " + displayMonth + " • " + monthsLearned + " tháng";
            } else {
                return "Bắt đầu: " + displayMonth;
            }
        } catch (Exception e) {
            return startMonth;
        }
    }
}