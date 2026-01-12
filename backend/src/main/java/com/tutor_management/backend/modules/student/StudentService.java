package com.tutor_management.backend.modules.student;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import com.tutor_management.backend.exception.ResourceNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tutor_management.backend.modules.auth.Role;
import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.auth.UserRepository;
import com.tutor_management.backend.modules.finance.SessionRecord;
import com.tutor_management.backend.modules.finance.SessionRecordRepository;
import com.tutor_management.backend.modules.parent.Parent;
import com.tutor_management.backend.modules.parent.ParentRepository;
import com.tutor_management.backend.modules.student.dto.request.StudentRequest;
import com.tutor_management.backend.modules.student.dto.response.StudentResponse;
import com.tutor_management.backend.modules.student.dto.response.StudentSummaryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for managing student lifecycle, academic records, and associated user accounts.
 * Implements optimized batch-loading strategies to maintain performance.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class StudentService {

    private final StudentRepository studentRepository;
    private final SessionRecordRepository sessionRecordRepository;
    private final ParentRepository parentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_DATE_TIME;
    private static final String DEFAULT_PASSWORD = "student123";

    /**
     * Retrieves all students with pre-calculated billing summaries and account links.
     * Uses batch queries to solve N+1 problems.
     */
    @Transactional(readOnly = true)
    public List<StudentResponse> getAllStudents() {
        List<Student> students = studentRepository.findAllWithParentOrderByCreatedAtDesc();
        if (students.isEmpty()) return Collections.emptyList();

        List<Long> studentIds = students.stream().map(Student::getId).toList();

        // Batch load dependencies
        Map<Long, List<SessionRecord>> recordsMap = sessionRecordRepository.findByStudentIdIn(studentIds)
                .stream().collect(Collectors.groupingBy(r -> r.getStudent().getId()));

        Map<Long, User> usersMap = userRepository.findByStudentIdIn(studentIds)
                .stream().collect(Collectors.toMap(User::getStudentId, u -> u, (u1, u2) -> u1));

        return students.stream()
                .map(s -> convertToResponseOptimized(s, recordsMap.getOrDefault(s.getId(), Collections.emptyList()), usersMap.get(s.getId())))
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a paginated list of students with optimized summary data.
     * Prevents loading full session histories for all students.
     * 
     * @param pageable Pagination configuration.
     * @return A page of student summaries.
     */
    @Transactional(readOnly = true)
    public Page<StudentSummaryResponse> getStudentsPaginated(Pageable pageable) {
        Page<Student> studentPage = studentRepository.findAllWithParent(pageable);
        if (studentPage.isEmpty()) return Page.empty();

        List<Long> studentIds = studentPage.getContent().stream().map(Student::getId).toList();

        // Optimized batch load for only totalUnpaid - avoid loading full SessionRecord Entities
        Map<Long, Long> unpaidMap = sessionRecordRepository.sumTotalUnpaidByStudentIdIn(studentIds)
                .stream().collect(Collectors.toMap(
                        row -> (Long) row[0],
                        row -> (Long) row[1]
                ));

        return studentPage.map(student -> convertToSummaryResponse(student, unpaidMap.getOrDefault(student.getId(), 0L)));
    }

    /**
     * Fetches a student's full profile by ID.
     */
    @Transactional(readOnly = true)
    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy học sinh với ID: " + id));
        return convertToResponse(student);
    }

    /**
     * Registers a new student and optionally provisions a user account.
     */
    @Transactional
    public StudentResponse createStudent(StudentRequest request) {
        log.info("Creating student: {}", request.getName());
        
        Student student = Student.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .schedule(request.getSchedule())
                .pricePerHour(request.getPricePerHour())
                .notes(request.getNotes())
                .active(request.getActive() != null ? request.getActive() : true)
                .startMonth(request.getStartMonth() != null ? request.getStartMonth() : YearMonth.now().toString())
                .build();

        associateParent(student, request.getParentId());
        Student saved = studentRepository.save(student);

        if (Boolean.TRUE.equals(request.getCreateAccount())) {
            provisionAccount(saved, request.getEmail(), request.getPassword());
        }

        return convertToResponse(saved);
    }

    /**
     * Updates student profile and credentials.
     */
    @Transactional
    public StudentResponse updateStudent(Long id, StudentRequest request) {
        log.info("Updating student ID: {}", id);
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy học sinh với ID: " + id));

        updateStudentFields(student, request);
        associateParent(student, request.getParentId());
        
        updateAssociatedAccount(id, request);

        return convertToResponse(studentRepository.save(student));
    }

    /**
     * Destroys a student record and all linked financial/account data.
     */
    @Transactional
    public void deleteStudent(Long id) {
        log.warn("Deleting student ID: {}", id);
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy học sinh với ID: " + id));

        sessionRecordRepository.deleteAll(sessionRecordRepository.findByStudentId(id));
        userRepository.deleteAll(userRepository.findByStudentId(id));
        studentRepository.delete(student);
    }

    // --- Account Provisioning Logic ---

    /**
     * Generates or link a user account for a specific student.
     */
    @Transactional
    public Map<String, Object> generateUserAccountForStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Học sinh không tồn tại"));

        if (!userRepository.findByStudentId(studentId).isEmpty()) {
            throw new IllegalStateException("Tài khoản đã tồn tại cho học sinh này");
        }

        String email = generateUniqueEmail(student);
        User user = createUserRecord(student, email, DEFAULT_PASSWORD);
        userRepository.save(user);

        return Map.of("success", true, "email", email, "password", DEFAULT_PASSWORD);
    }

    /**
     * Provision accounts for all students currently missing one.
     */
    @Transactional
    public Map<String, Object> generateAccountsForAllStudents() {
        List<Student> students = studentRepository.findAll();
        int createdCount = 0;

        for (Student student : students) {
            if (userRepository.findByStudentId(student.getId()).isEmpty()) {
                provisionAccount(student, null, null);
                createdCount++;
            }
        }
        return Map.of("success", true, "created", createdCount);
    }

    // --- Internal Helpers ---

    private void associateParent(Student student, Long parentId) {
        if (parentId != null) {
            Parent parent = parentRepository.findById(parentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phụ huynh"));
            student.setParent(parent);
        } else {
            student.setParent(null);
        }
    }

    private void provisionAccount(Student student, String email, String password) {
        String targetEmail = (email != null && !email.isBlank()) ? email : generateUniqueEmail(student);
        String targetPassword = (password != null && !password.isBlank()) ? password : DEFAULT_PASSWORD;

        if (userRepository.existsByEmail(targetEmail)) {
            if (email != null) throw new IllegalArgumentException("Email đã tồn tại: " + targetEmail);
            targetEmail = generateEmailFromName(student.getName()) + student.getId() + "@students.tutormanagement.com";
        }

        userRepository.save(createUserRecord(student, targetEmail, targetPassword));
    }

    private void updateAssociatedAccount(Long studentId, StudentRequest request) {
        List<User> users = userRepository.findByStudentId(studentId);
        if (users.isEmpty()) {
            if (Boolean.TRUE.equals(request.getCreateAccount())) {
                provisionAccount(studentRepository.getReferenceById(studentId), request.getEmail(), request.getPassword());
            }
            return;
        }

        User user = users.get(0);
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            userRepository.findByEmail(request.getEmail()).ifPresent(existing -> {
                if (!existing.getId().equals(user.getId())) throw new IllegalArgumentException("Email đã được sử dụng");
            });
            user.setEmail(request.getEmail());
        }
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        userRepository.save(user);
    }

    private void updateStudentFields(Student student, StudentRequest request) {
        student.setName(request.getName());
        student.setPhone(request.getPhone());
        student.setSchedule(request.getSchedule());
        student.setPricePerHour(request.getPricePerHour());
        student.setNotes(request.getNotes());
        if (request.getActive() != null) student.setActive(request.getActive());
        if (request.getStartMonth() != null) student.setStartMonth(request.getStartMonth());
    }

    private User createUserRecord(Student student, String email, String rawPassword) {
        return User.builder()
                .fullName(student.getName())
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .role(Role.STUDENT)
                .enabled(true)
                .accountNonLocked(true)
                .studentId(student.getId())
                .build();
    }

    private String generateUniqueEmail(Student student) {
        String email = generateEmailFromName(student.getName());
        return userRepository.existsByEmail(email) ? 
                generateEmailFromName(student.getName()) + student.getId() + "@students.tutormanagement.com" : email;
    }

    private String generateEmailFromName(String name) {
        String normalized = java.text.Normalizer.normalize(name, java.text.Normalizer.Form.NFD).replaceAll("\\p{M}", "");
        return normalized.toLowerCase().replaceAll("\\s+", "").replaceAll("[^a-z0-9]", "") + "@students.tutormanagement.com";
    }

    // --- Converters ---

    public StudentResponse convertToResponse(Student student) {
        List<SessionRecord> records = sessionRecordRepository.findByStudentId(student.getId());
        User user = userRepository.findByStudentId(student.getId()).stream().findFirst().orElse(null);
        return convertToResponseOptimized(student, records, user);
    }

    private StudentResponse convertToResponseOptimized(Student student, List<SessionRecord> records, User user) {
        long totalPaid = records.stream().filter(SessionRecord::getPaid).mapToLong(SessionRecord::getTotalAmount).sum();
        long totalUnpaid = records.stream().filter(r -> !r.getPaid()).mapToLong(SessionRecord::getTotalAmount).sum();

        String lastActiveMonth = records.stream().map(SessionRecord::getMonth).max(String::compareTo).orElse(null);
        Integer monthsLearned = calculateMonthsLearned(student.getStartMonth(), lastActiveMonth);

        StudentResponse response = StudentResponse.builder()
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
                .learningDuration(buildLearningDuration(student.getStartMonth(), monthsLearned))
                .createdAt(student.getCreatedAt().format(ISO_FORMATTER))
                .totalPaid(totalPaid)
                .totalUnpaid(totalUnpaid)
                .build();

        if (student.getParent() != null) {
            Parent p = student.getParent();
            response.setParentId(p.getId());
            response.setParentName(p.getName());
            response.setParentEmail(p.getEmail());
            response.setParentPhone(p.getPhone());
        }

        if (user != null) {
            response.setAccountEmail(user.getEmail());
            response.setAccountId(user.getId().toString());
        }

        return response;
    }

    private StudentSummaryResponse convertToSummaryResponse(Student student, Long totalUnpaid) {
        String lastActiveMonth = student.getLastActiveMonth();
        Integer monthsLearned = calculateMonthsLearned(student.getStartMonth(), lastActiveMonth);

        return StudentSummaryResponse.builder()
                .id(student.getId())
                .name(student.getName())
                .phone(student.getPhone())
                .schedule(student.getSchedule())
                .pricePerHour(student.getPricePerHour())
                .active(student.getActive())
                .totalUnpaid(totalUnpaid)
                .startMonth(student.getStartMonth())
                .learningDuration(buildLearningDuration(student.getStartMonth(), monthsLearned))
                .build();
    }

    private Integer calculateMonthsLearned(String start, String last) {
        if (start == null || last == null) return 0;
        try {
            return (int) ChronoUnit.MONTHS.between(YearMonth.parse(start), YearMonth.parse(last)) + 1;
        } catch (Exception e) { return 0; }
    }

    private String buildLearningDuration(String start, Integer months) {
        if (start == null) return "";
        try {
            String[] p = start.split("-");
            String display = p[1] + "/" + p[0];
            return (months != null && months > 0) ? "Bắt đầu: " + display + " • " + months + " tháng" : "Bắt đầu: " + display;
        } catch (Exception e) { return start; }
    }
}
