package com.tutor_management.backend.modules.student;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

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

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentService {

    private final StudentRepository studentRepository;
    private final SessionRecordRepository sessionRecordRepository;
    private final ParentRepository parentRepository; // ✅ THÊM
    private final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ✅ OPTIMIZED: Batch load session records to prevent N+1 query
    public List<StudentResponse> getAllStudents() {
        // Step 1: Load all students with parent (1 query)
        List<Student> students = studentRepository.findAllWithParentOrderByCreatedAtDesc();

        if (students.isEmpty()) {
            return new ArrayList<>();
        }

        // Step 2: Extract student IDs
        List<Long> studentIds = students.stream()
                .map(Student::getId)
                .collect(Collectors.toList());

        // Step 3: Batch load session records ONLY for these students (1 query instead
        // of N)
        List<SessionRecord> allRecords = sessionRecordRepository.findByStudentIdIn(studentIds);

        // Step 4: Group session records by student ID (no filter needed - already
        // filtered)
        Map<Long, List<SessionRecord>> recordsByStudentId = allRecords.stream()
                .collect(Collectors.groupingBy(record -> record.getStudent().getId()));

        // Step 5: Batch load user accounts ONLY for these students (1 query instead of
        // N)
        List<User> allUsers = userRepository.findByStudentIdIn(studentIds);
        Map<Long, User> usersByStudentId = allUsers.stream()
                .collect(Collectors.toMap(User::getStudentId, user -> user, (u1, u2) -> u1));

        // Step 6: Convert to response using pre-loaded data
        return students.stream()
                .map(student -> convertToResponseOptimized(
                        student,
                        recordsByStudentId.getOrDefault(student.getId(), new ArrayList<>()),
                        usersByStudentId.get(student.getId())))
                .collect(Collectors.toList());
    }

    // ✅ NEW: Optimized version that doesn't query database
    private StudentResponse convertToResponseOptimized(Student student, List<SessionRecord> records, User user) {
        Long totalPaid = records.stream()
                .filter(SessionRecord::getPaid)
                .mapToLong(SessionRecord::getTotalAmount)
                .sum();

        Long totalUnpaid = records.stream()
                .filter(r -> !r.getPaid())
                .mapToLong(SessionRecord::getTotalAmount)
                .sum();

        // Calculate lastActiveMonth
        String lastActiveMonth = null;
        if (!records.isEmpty()) {
            lastActiveMonth = records.stream()
                    .map(SessionRecord::getMonth)
                    .max(String::compareTo)
                    .orElse(null);
        }

        Integer monthsLearned = calculateMonthsLearned(student.getStartMonth(), lastActiveMonth);
        String learningDuration = buildLearningDuration(student.getStartMonth(), monthsLearned);

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
                .learningDuration(learningDuration)
                .createdAt(student.getCreatedAt().format(formatter))
                .totalPaid(totalPaid)
                .totalUnpaid(totalUnpaid)
                .build();

        // Add parent info (already loaded via JOIN FETCH)
        if (student.getParent() != null) {
            Parent parent = student.getParent();
            response.setParentId(parent.getId());
            response.setParentName(parent.getName());
            response.setParentEmail(parent.getEmail());
            response.setParentPhone(parent.getPhone());
        }

        // Add account info (already loaded in batch)
        if (user != null) {
            response.setAccountEmail(user.getEmail());
            response.setAccountId(user.getId().toString());
        }

        return response;
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
                .startMonth(request.getStartMonth() != null ? request.getStartMonth() : YearMonth.now().toString())
                .build();

        if (request.getParentId() != null) {
            Parent parent = parentRepository.findById(request.getParentId())
                    .orElseThrow(
                            () -> new RuntimeException("Không tìm thấy phụ huynh với ID: " + request.getParentId()));
            student.setParent(parent);
        }

        Student saved = studentRepository.save(student);

        // ✅ CREATE ACCOUNT IF REQUESTED
        if (Boolean.TRUE.equals(request.getCreateAccount())) {
            try {
                if (request.getEmail() != null && request.getPassword() != null) {
                    createExplicitUserAccount(saved, request.getEmail(), request.getPassword());
                } else {
                    createUserAccountForStudent(saved);
                }
            } catch (Exception e) {
                System.err.println("Failed to create user account: " + e.getMessage());
            }
        }

        return convertToResponse(saved);
    }

    // ✅ UPDATE: Thêm xử lý parent
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

        // ✅ Cập nhật parent
        if (request.getParentId() != null) {
            Parent parent = parentRepository.findById(request.getParentId())
                    .orElseThrow(
                            () -> new RuntimeException("Không tìm thấy phụ huynh với ID: " + request.getParentId()));
            student.setParent(parent);
        } else {
            // Nếu parentId = null, xóa liên kết
            student.setParent(null);
        }

        // ✅ Cập nhật account info
        List<User> users = userRepository.findByStudentId(id);
        if (!users.isEmpty()) {
            User user = users.get(0);
            if (request.getEmail() != null && !request.getEmail().isEmpty()) {
                // Check if email already used by ANOTHER user
                userRepository.findByEmail(request.getEmail()).ifPresent(existing -> {
                    if (!existing.getId().equals(user.getId())) {
                        throw new RuntimeException("Email đã được sử dụng bởi người dùng khác: " + request.getEmail());
                    }
                });
                user.setEmail(request.getEmail());
            }
            if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(request.getPassword()));
            }
            userRepository.save(user);
        } else if (Boolean.TRUE.equals(request.getCreateAccount())) {
            // Create account if requested but didn't exist
            if (request.getEmail() != null && request.getPassword() != null) {
                createExplicitUserAccount(student, request.getEmail(), request.getPassword());
            } else {
                createUserAccountForStudent(student);
            }
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

        // ✅ Delete associated user accounts
        List<User> users = userRepository.findByStudentId(id);
        userRepository.deleteAll(users);

        studentRepository.delete(student);
    }

    // ✅ UPDATE: Thêm parent info vào response
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
                .learningDuration(learningDuration)
                .createdAt(student.getCreatedAt().format(formatter))
                .totalPaid(totalPaid)
                .totalUnpaid(totalUnpaid)
                .build();

        // ✅ Thêm parent info
        if (student.getParent() != null) {
            Parent parent = student.getParent();
            response.setParentId(parent.getId());
            response.setParentName(parent.getName());
            response.setParentEmail(parent.getEmail());
            response.setParentPhone(parent.getPhone());
        }

        // ✅ Thêm account info
        List<User> users = userRepository.findByStudentId(student.getId());
        if (!users.isEmpty()) {
            response.setAccountEmail(users.get(0).getEmail());
            response.setAccountId(users.get(0).getId().toString());
        }

        return response;
    }

    private Integer calculateMonthsLearned(String startMonth, String lastActiveMonth) {
        if (startMonth == null || lastActiveMonth == null)
            return 0;

        try {
            YearMonth start = YearMonth.parse(startMonth);
            YearMonth end = YearMonth.parse(lastActiveMonth);
            return (int) java.time.temporal.ChronoUnit.MONTHS.between(start, end) + 1;
        } catch (Exception e) {
            return 0;
        }
    }

    private String buildLearningDuration(String startMonth, Integer monthsLearned) {
        if (startMonth == null)
            return "";

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

    /**
     * Generate user account for existing student (one-time)
     */
    public Map<String, Object> generateUserAccountForStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Check if account already exists
        List<User> existingUsers = userRepository.findByStudentId(studentId);
        if (!existingUsers.isEmpty()) {
            throw new RuntimeException("Tài khoản đã tồn tại cho học sinh này");
        }

        String email = generateEmailFromName(student.getName());

        // Check email collision
        if (userRepository.existsByEmail(email)) {
            email = generateEmailFromName(student.getName()) + student.getId() + "@students.tutormanagement.com";
        }

        String password = "student123"; // Or use: generateRandomPassword();

        User user = User.builder()
                .fullName(student.getName())
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(Role.STUDENT)
                .enabled(true)
                .accountNonLocked(true)
                .studentId(student.getId())
                .build();

        userRepository.save(user);

        System.out.println("✅ Created account: " + email + " | Password: " + password);

        return Map.of(
                "success", true,
                "studentName", student.getName(),
                "email", email,
                "password", password,
                "message", "Tài khoản đã được tạo thành công");
    }

    /**
     * Generate accounts for ALL students without accounts
     */
    public Map<String, Object> generateAccountsForAllStudents() {
        List<Student> allStudents = studentRepository.findAll();
        List<Map<String, String>> created = new ArrayList<>();
        List<String> skipped = new ArrayList<>();

        for (Student student : allStudents) {
            try {
                // Skip if already has account
                List<User> existing = userRepository.findByStudentId(student.getId());
                if (!existing.isEmpty()) {
                    skipped.add(student.getName() + " (đã có tài khoản)");
                    continue;
                }

                String email = generateEmailFromName(student.getName());

                if (userRepository.existsByEmail(email)) {
                    email = generateEmailFromName(student.getName()) + student.getId()
                            + "@students.tutormanagement.com";
                }

                String password = "student123";

                User user = User.builder()
                        .fullName(student.getName())
                        .email(email)
                        .password(passwordEncoder.encode(password))
                        .role(Role.STUDENT)
                        .enabled(true)
                        .accountNonLocked(true)
                        .studentId(student.getId())
                        .build();

                userRepository.save(user);

                created.add(Map.of(
                        "name", student.getName(),
                        "email", email,
                        "password", password));

            } catch (Exception e) {
                skipped.add(student.getName() + " (lỗi)");
            }
        }

        return Map.of(
                "success", true,
                "total", allStudents.size(),
                "created", created.size(),
                "skipped", skipped.size(),
                "accounts", created,
                "skippedList", skipped);
    }

    /**
     * Create account with provided email and password
     */
    private void createExplicitUserAccount(Student student, String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists: " + email);
        }

        User user = User.builder()
                .fullName(student.getName())
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(Role.STUDENT)
                .enabled(true)
                .accountNonLocked(true)
                .studentId(student.getId())
                .build();

        userRepository.save(user);
        System.out.println("✅ Created explicit account for: " + student.getName() + " | Email: " + email);
    }

    /**
     * Auto-create account when creating new student
     */
    private void createUserAccountForStudent(Student student) {
        try {
            String email = generateEmailFromName(student.getName());

            if (userRepository.existsByEmail(email)) {
                email = generateEmailFromName(student.getName()) + student.getId() + "@students.tutormanagement.com";
            }

            String password = "student123";

            User user = User.builder()
                    .fullName(student.getName())
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .role(Role.STUDENT)
                    .enabled(true)
                    .accountNonLocked(true)
                    .studentId(student.getId())
                    .build();

            userRepository.save(user);

            System.out.println("✅ Auto-created account for: " + student.getName() + " | Email: " + email
                    + " | Password: " + password);

        } catch (Exception e) {
            throw new RuntimeException("Failed to create user account: " + e.getMessage());
        }
    }

    /**
     * Generate email from Vietnamese name
     * Example: "Nguyễn Văn A" → "nguyenvana@students.tutormanagement.com"
     */
    private String generateEmailFromName(String name) {
        // Remove Vietnamese accents
        String normalized = java.text.Normalizer.normalize(name, java.text.Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");

        // Convert to lowercase, remove spaces and special chars
        String email = normalized.toLowerCase()
                .replaceAll("\\s+", "")
                .replaceAll("[^a-z0-9]", "");

        return email + "@students.tutormanagement.com";
    }

    /**
     * Generate random password (optional)
     */
    private String generateRandomPassword() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
        StringBuilder password = new StringBuilder();
        Random rnd = new Random();

        for (int i = 0; i < 8; i++) {
            password.append(chars.charAt(rnd.nextInt(chars.length())));
        }

        return password.toString();
    }
}
