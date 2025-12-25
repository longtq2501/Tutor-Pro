package com.tutor_management.backend.modules.lesson;

import com.tutor_management.backend.modules.lesson.dto.request.CreateLessonRequest;
import com.tutor_management.backend.modules.lesson.dto.response.LibraryLessonResponse;
import com.tutor_management.backend.modules.student.Student;
import com.tutor_management.backend.exception.ResourceNotFoundException;
import com.tutor_management.backend.modules.student.StudentRepository;
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
        try {

            List<Lesson> lessons = lessonRepository.findAll();

            // Force initialize collections inside transaction
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

            return lessons.stream()
                    .map(LibraryLessonResponse::fromEntity)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error in getAllLibraryLessons: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get library lessons", e);
        }
    }

    /**
     * Get unassigned library lessons only
     */
    @Transactional(readOnly = true)
    public List<LibraryLessonResponse> getUnassignedLessons() {
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

        return lesson;
    }

    /**
     * Assign lesson to multiple students
     */
    @Transactional
    @CacheEvict(value = "lessons", allEntries = true)
    public void assignLessonToStudents(
            Long lessonId,
            List<Long> studentIds,
            String assignedBy
    ) {

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
    }

    /**
     * Unassign lesson from students
     */
    @Transactional
    @CacheEvict(value = "lessons", allEntries = true)
    public void unassignLessonFromStudents(Long lessonId, List<Long> studentIds) {

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
        }
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

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));

        if (lesson.getAssignments() != null) {
            lesson.getAssignments().clear();
        }
        if (lesson.getImages() != null) {
            lesson.getImages().clear();
        }
        if (lesson.getResources() != null) {
            lesson.getResources().clear();
        }

        lessonRepository.delete(lesson);
    }
}
