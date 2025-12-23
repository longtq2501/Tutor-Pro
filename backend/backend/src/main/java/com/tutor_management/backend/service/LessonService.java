package com.tutor_management.backend.service;

import com.tutor_management.backend.dto.response.LessonResponse;
import com.tutor_management.backend.dto.response.LessonStatsResponse;
import com.tutor_management.backend.entity.Lesson;
import com.tutor_management.backend.entity.LessonAssignment;
import com.tutor_management.backend.exception.ResourceNotFoundException;
import com.tutor_management.backend.repository.LessonAssignmentRepository;
import com.tutor_management.backend.repository.LessonRepository;
import com.tutor_management.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * LessonService for Student View
 *
 * ✅ UPDATED: Now works with Many-to-Many structure via LessonAssignment
 * All operations are student-specific and work through assignments
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class LessonService {

    private final LessonRepository lessonRepository;
    private final LessonAssignmentRepository assignmentRepository;
    private final StudentRepository studentRepository;

    /**
     * Get all lessons assigned to a student
     *
     * ✅ UPDATED: Fetches via LessonAssignment instead of direct Lesson query
     */
    @Cacheable(value = "lessons", key = "'student-' + #studentId")
    @Transactional(readOnly = true)
    public List<LessonResponse> getStudentLessons(Long studentId) {
        log.info("📚 Getting all lessons for student: {}", studentId);

        // Verify student exists
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with id: " + studentId);
        }

        // ✅ Get assignments (not lessons directly)
        List<LessonAssignment> assignments = assignmentRepository.findByStudentIdOrderByAssignedDateDesc(studentId);

        log.info("✅ Found {} assigned lessons for student {}", assignments.size(), studentId);

        // Initialize collections for each lesson
        assignments.forEach(assignment -> {
            Lesson lesson = assignment.getLesson();
            Hibernate.initialize(lesson.getImages());
            Hibernate.initialize(lesson.getResources());
        });

        // ✅ Map to response using assignment data
        return assignments.stream()
                .map(assignment -> LessonResponse.fromEntity(assignment.getLesson(), assignment))
                .collect(Collectors.toList());
    }

    /**
     * Get lesson by ID for a specific student
     *
     * ✅ UPDATED: Verifies student has access via assignment
     */
    @Cacheable(value = "lessons", key = "'lesson-' + #lessonId + '-student-' + #studentId")
    @Transactional(readOnly = true)
    public LessonResponse getLessonById(Long lessonId, Long studentId) {
        log.info("📖 Getting lesson {} for student {}", lessonId, studentId);

        // ✅ Find assignment (verifies student has access)
        LessonAssignment assignment = assignmentRepository.findByLessonIdAndStudentId(lessonId, studentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Lesson not found or not assigned to this student"
                ));

        Lesson lesson = assignment.getLesson();

        // Initialize collections
        Hibernate.initialize(lesson.getImages());
        Hibernate.initialize(lesson.getResources());

        return LessonResponse.fromEntity(lesson, assignment);
    }

    /**
     * Get lessons by month/year filter for a student
     *
     * ✅ UPDATED: Filters assignments by lesson date
     */
    @Transactional(readOnly = true)
    public List<LessonResponse> getLessonsByMonthYear(Long studentId, int year, int month) {
        log.info("📅 Getting lessons for student {} - {}/{}", studentId, month, year);

        // Get all assignments for student
        List<LessonAssignment> assignments = assignmentRepository.findByStudentIdOrderByAssignedDateDesc(studentId);

        // Filter by lesson date
        List<LessonAssignment> filtered = assignments.stream()
                .filter(assignment -> {
                    var lessonDate = assignment.getLesson().getLessonDate();
                    return lessonDate.getYear() == year && lessonDate.getMonthValue() == month;
                })
                .collect(Collectors.toList());

        // Initialize collections
        filtered.forEach(assignment -> {
            Lesson lesson = assignment.getLesson();
            Hibernate.initialize(lesson.getImages());
            Hibernate.initialize(lesson.getResources());
        });

        return filtered.stream()
                .map(assignment -> LessonResponse.fromEntity(assignment.getLesson(), assignment))
                .collect(Collectors.toList());
    }

    /**
     * Increment view count when student opens lesson
     *
     * ✅ UPDATED: Updates assignment record instead of lesson
     */
    public void incrementViewCount(Long lessonId, Long studentId) {
        LessonAssignment assignment = assignmentRepository.findByLessonIdAndStudentId(lessonId, studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        assignment.incrementViewCount();
        assignmentRepository.save(assignment);

        log.info("👁️ Incremented view count for lesson {} / student {}: {} views",
                lessonId, studentId, assignment.getViewCount());
    }

    /**
     * Mark lesson as completed for a student
     *
     * ✅ UPDATED: Updates assignment record
     */
    public LessonResponse markAsCompleted(Long lessonId, Long studentId) {
        LessonAssignment assignment = assignmentRepository.findByLessonIdAndStudentId(lessonId, studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        assignment.markAsCompleted();
        assignment = assignmentRepository.save(assignment);

        Lesson lesson = assignment.getLesson();
        Hibernate.initialize(lesson.getImages());
        Hibernate.initialize(lesson.getResources());

        log.info("✅ Marked lesson {} as completed for student {}", lessonId, studentId);

        return LessonResponse.fromEntity(lesson, assignment);
    }

    /**
     * Mark lesson as incomplete for a student
     *
     * ✅ UPDATED: Updates assignment record
     */
    public LessonResponse markAsIncomplete(Long lessonId, Long studentId) {
        LessonAssignment assignment = assignmentRepository.findByLessonIdAndStudentId(lessonId, studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        assignment.markAsIncomplete();
        assignment = assignmentRepository.save(assignment);

        Lesson lesson = assignment.getLesson();
        Hibernate.initialize(lesson.getImages());
        Hibernate.initialize(lesson.getResources());

        log.info("❌ Marked lesson {} as incomplete for student {}", lessonId, studentId);

        return LessonResponse.fromEntity(lesson, assignment);
    }

    /**
     * Get lesson statistics for a student
     *
     * ✅ UPDATED: Calculates from assignments
     */
    @Transactional(readOnly = true)
    public LessonStatsResponse getStudentStats(Long studentId) {
        // Count total assignments
        long totalLessons = assignmentRepository.findByStudentIdOrderByAssignedDateDesc(studentId).size();

        // Count completed assignments
        long completedLessons = assignmentRepository.countByStudentIdAndIsCompletedTrue(studentId);

        double completionRate = totalLessons > 0
                ? (completedLessons * 100.0 / totalLessons)
                : 0.0;

        return LessonStatsResponse.builder()
                .totalLessons(totalLessons)
                .completedLessons(completedLessons)
                .inProgressLessons(totalLessons - completedLessons)
                .completionRate(Math.round(completionRate * 10) / 10.0)
                .build();
    }
}