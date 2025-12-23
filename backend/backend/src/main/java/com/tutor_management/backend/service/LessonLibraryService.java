package com.tutor_management.backend.service;

import com.tutor_management.backend.dto.request.AssignLessonRequest;
import com.tutor_management.backend.dto.request.CreateLessonRequest;
import com.tutor_management.backend.dto.response.LibraryLessonResponse;
import com.tutor_management.backend.entity.Lesson;
import com.tutor_management.backend.entity.LessonAssignment;
import com.tutor_management.backend.entity.Student;
import com.tutor_management.backend.exception.ResourceNotFoundException;
import com.tutor_management.backend.repository.LessonRepository;
import com.tutor_management.backend.repository.LessonAssignmentRepository;
import com.tutor_management.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LessonLibraryService {

    private final LessonRepository lessonRepository;
    private final LessonAssignmentRepository assignmentRepository;
    private final StudentRepository studentRepository;

    /**
     * Get all library lessons (not assigned yet OR assigned)
     */
    @Transactional(readOnly = true)
    public List<LibraryLessonResponse> getAllLibraryLessons() {
        log.info("📚 Getting all library lessons");

        try {
            List<Lesson> lessons = lessonRepository.findAll();
            log.info("✅ Found {} lessons", lessons.size());

            // ✅ Force initialize collections inside transaction
            for (Lesson lesson : lessons) {
                try {
                    if (lesson.getAssignments() != null) {
                        int size = lesson.getAssignments().size();
                        log.debug("Lesson {} has {} assignments", lesson.getId(), size);
                    }
                } catch (Exception e) {
                    log.warn("Could not load assignments for lesson {}", lesson.getId());
                }
            }

            List<LibraryLessonResponse> responses = lessons.stream()
                    .map(LibraryLessonResponse::fromEntity)
                    .collect(Collectors.toList());

            log.info("✅ Returning {} responses", responses.size());
            return responses;

        } catch (Exception e) {
            log.error("❌ Error in getAllLibraryLessons: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get library lessons", e);
        }
    }

    /**
     * Get unassigned library lessons only
     */
    @Transactional(readOnly = true)
    public List<LibraryLessonResponse> getUnassignedLessons() {
        log.info("📚 Getting unassigned library lessons");
        List<Lesson> lessons = lessonRepository.findByIsLibraryTrueOrderByCreatedAtDesc();

        return lessons.stream()
                .map(LibraryLessonResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Create a lesson in library (without assignment)
     */
    @Transactional
    @CacheEvict(value = "lessons", allEntries = true)
    public Lesson createLibraryLesson(CreateLessonRequest request) {
        log.info("📝 Creating library lesson: {}", request.getTitle());

        Lesson lesson = Lesson.builder()
                .tutorName(request.getTutorName())
                .title(request.getTitle())
                .summary(request.getSummary())
                .content(request.getContent())
                .lessonDate(request.getLessonDate())
                .videoUrl(request.getVideoUrl())
                .thumbnailUrl(request.getThumbnailUrl())
                .isLibrary(true)  // ✅ Mark as library lesson
                .isPublished(request.getIsPublished())
                .build();

        lesson = lessonRepository.save(lesson);
        log.info("✅ Created library lesson with ID: {}", lesson.getId());

        return lesson;
    }

    /**
     * Assign lesson to multiple students
     */
    @Transactional
    @CacheEvict(value = "lessons", allEntries = true)
    public List<LessonAssignment> assignLessonToStudents(
            Long lessonId,
            List<Long> studentIds,
            String assignedBy
    ) {
        log.info("🎯 Assigning lesson {} to {} students", lessonId, studentIds.size());

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));

        List<Student> students = studentRepository.findAllById(studentIds);
        if (students.size() != studentIds.size()) {
            throw new ResourceNotFoundException("Some students not found");
        }

        List<LessonAssignment> assignments = students.stream()
                .filter(student -> !assignmentRepository.existsByLessonIdAndStudentId(lessonId, student.getId()))
                .map(student -> LessonAssignment.builder()
                        .lesson(lesson)
                        .student(student)
                        .assignedDate(LocalDate.now())
                        .assignedBy(assignedBy)
                        .build())
                .collect(Collectors.toList());

        assignments = assignmentRepository.saveAll(assignments);

        // Mark lesson as assigned
        if (lesson.getIsLibrary() && !assignments.isEmpty()) {
            lesson.markAsAssigned();
            lessonRepository.save(lesson);
        }

        log.info("✅ Created {} new assignments for lesson {}", assignments.size(), lessonId);
        return assignments;
    }

    /**
     * Unassign lesson from students
     */
    @Transactional
    @CacheEvict(value = "lessons", allEntries = true)
    public void unassignLessonFromStudents(Long lessonId, List<Long> studentIds) {
        log.info("🔄 Unassigning lesson {} from {} students", lessonId, studentIds.size());

        for (Long studentId : studentIds) {
            assignmentRepository.deleteByLessonIdAndStudentId(lessonId, studentId);
        }

        // Check if lesson still has assignments
        long remainingAssignments = assignmentRepository.countByLessonId(lessonId);
        if (remainingAssignments == 0) {
            Lesson lesson = lessonRepository.findById(lessonId)
                    .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
            lesson.markAsLibrary();
            lessonRepository.save(lesson);
            log.info("📚 Lesson {} moved back to library (no assignments)", lessonId);
        }

        log.info("✅ Unassigned lesson {} from students", lessonId);
    }

    /**
     * Get students assigned to a lesson
     */
    @Transactional(readOnly = true)
    public List<Student> getAssignedStudents(Long lessonId) {
        List<LessonAssignment> assignments = assignmentRepository.findByLessonIdOrderByAssignedDateDesc(lessonId);
        return assignments.stream()
                .map(LessonAssignment::getStudent)
                .collect(Collectors.toList());
    }

    @Transactional
    @CacheEvict(value = "lessons", allEntries = true)
    public void deleteLibraryLesson(Long lessonId) {
        log.info("🗑️ Deleting library lesson: {}", lessonId);

        // 1. Tìm lesson
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));

        // 2. QUAN TRỌNG: Ngắt quan hệ thủ công trước khi xóa để tránh ConcurrentModificationException
        // Xóa tất cả các assignments khỏi tập hợp để Hibernate không bị xung đột khi duyệt list
        if (lesson.getAssignments() != null) {
            lesson.getAssignments().clear();
        }
        if (lesson.getImages() != null) {
            lesson.getImages().clear();
        }
        if (lesson.getResources() != null) {
            lesson.getResources().clear();
        }

        // 3. Thực hiện xóa sau khi đã dọn dẹp quan hệ trong bộ nhớ
        lessonRepository.delete(lesson);

        log.info("✅ Deleted lesson {} and all its associated data", lessonId);
    }
}