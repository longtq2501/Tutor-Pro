package com.tutor_management.backend.modules.lesson.service;

import java.util.List;
import java.util.stream.Collectors;

import com.tutor_management.backend.modules.finance.repository.SessionRecordRepository;
import com.tutor_management.backend.modules.lesson.entity.Lesson;
import com.tutor_management.backend.modules.lesson.entity.LessonAssignment;
import com.tutor_management.backend.modules.lesson.repository.LessonAssignmentRepository;
import com.tutor_management.backend.modules.lesson.repository.LessonRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.hibernate.Hibernate;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tutor_management.backend.exception.ResourceNotFoundException;
import com.tutor_management.backend.modules.course.service.CourseAssignmentService;
import com.tutor_management.backend.modules.lesson.dto.response.LessonResponse;
import com.tutor_management.backend.modules.lesson.dto.response.LessonStatsResponse;
import com.tutor_management.backend.modules.lesson.dto.response.StudentLessonSummaryResponse;
import com.tutor_management.backend.modules.lesson.dto.response.LessonCategoryResponse;
import com.tutor_management.backend.modules.student.repository.StudentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for Student-facing lesson operations.
 * Handles lesson retrieval, view tracking, and completion status management.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class LessonService {

    private final LessonRepository lessonRepository;
    private final LessonAssignmentRepository assignmentRepository;
    private final StudentRepository studentRepository;
    private final CourseAssignmentService courseAssignmentService;
    private final SessionRecordRepository sessionRecordRepository;

    /**
     * Retrieves all lessons assigned to a specific student.
     * Uses optimized fetching and lightweight DTOs to minimize RAM usage.
     */
    @Transactional(readOnly = true)
    public Page<StudentLessonSummaryResponse> getStudentLessons(Long studentId, Pageable pageable) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Không tìm thấy học sinh với ID: " + studentId);
        }

        return assignmentRepository.findByStudentIdWithDetails(studentId, pageable)
                .map(this::mapToStudentSummary);
    }

    /**
     * Retrieves a single lesson assignment for a student.
     * Validates that the lesson is officially assigned to the student OR linked to a session.
     */
    @Cacheable(value = "lessons", key = "'lesson-' + #lessonId + '-student-' + #studentId")
    @Transactional(readOnly = true)
    public LessonResponse getLessonById(Long lessonId, Long studentId) {
        // 1. Try to find explicit homework assignment (Primary access)
        java.util.Optional<LessonAssignment> assignmentOpt = assignmentRepository.findByLessonIdAndStudentId(lessonId, studentId);
        
        if (assignmentOpt.isPresent()) {
            LessonAssignment assignment = assignmentOpt.get();
            initializeMedia(assignment.getLesson());
            return LessonResponse.fromEntity(assignment.getLesson(), assignment);
        }

        // 2. Fallback: Check if attached to a SessionRecord (Classwork access)
        if (sessionRecordRepository.existsByStudentIdAndLessonId(studentId, lessonId)) {
            Lesson lesson = lessonRepository.findById(lessonId)
                    .orElseThrow(() -> new ResourceNotFoundException("Bài học không tồn tại."));
            
            initializeMedia(lesson);
            // Return response with null assignment (Student sees lesson content but no homework status)
            return LessonResponse.fromEntity(lesson, null);
        }

        throw new ResourceNotFoundException("Bài học không tồn tại hoặc chưa được giao cho bạn.");
    }

    /**
     * Retrieves lessons assigned to a student within a specific month.
     */
    @Transactional(readOnly = true)
    public Page<StudentLessonSummaryResponse> getLessonsByMonthYear(Long studentId, int year, int month, Pageable pageable) {
        return assignmentRepository.findByStudentIdAndMonthYear(studentId, year, month, pageable)
                .map(this::mapToStudentSummary);
    }

    private StudentLessonSummaryResponse mapToStudentSummary(LessonAssignment a) {
        Lesson l = a.getLesson();
        return StudentLessonSummaryResponse.builder()
                .id(l.getId())
                .title(l.getTitle())
                .tutorName(l.getTutorName())
                .summary(l.getSummary())
                .lessonDate(l.getLessonDate())
                .thumbnailUrl(l.getThumbnailUrl())
                .isCompleted(a.getIsCompleted())
                .completedAt(a.getCompletedAt())
                .viewCount(a.getViewCount())
                .category(LessonCategoryResponse.fromEntity(l.getCategory()))
                .createdAt(l.getCreatedAt())
                .build();
    }

    /**
     * Records a view event for a lesson.
     */
    @Transactional
    public void incrementViewCount(Long lessonId, Long studentId) {
        LessonAssignment assignment = assignmentRepository.findByLessonIdAndStudentId(lessonId, studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bản ghi bài học của học sinh."));

        assignment.incrementViewCount();
        assignmentRepository.save(assignment);
        log.debug("Incremented view count for student {} on lesson {}", studentId, lessonId);
    }

    /**
     * Marks a lesson as completed for a student.
     * Triggers course progress updates.
     */
    @CacheEvict(value = "lessons", allEntries = true)
    @Transactional
    public LessonResponse markAsCompleted(Long lessonId, Long studentId) {
        LessonAssignment assignment = assignmentRepository.findByLessonIdAndStudentId(lessonId, studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bản ghi bài học của học sinh."));

        assignment.markAsCompleted();
        assignmentRepository.save(assignment);

        courseAssignmentService.updateProgressOnLessonCompletion(studentId, lessonId, true);
        log.info("Student {} marked lesson {} as completed", studentId, lessonId);

        initializeMedia(assignment.getLesson());
        return LessonResponse.fromEntity(assignment.getLesson(), assignment);
    }

    /**
     * Reverts a lesson to 'Incomplete' status for a student.
     */
    @CacheEvict(value = "lessons", allEntries = true)
    @Transactional
    public LessonResponse markAsIncomplete(Long lessonId, Long studentId) {
        LessonAssignment assignment = assignmentRepository.findByLessonIdAndStudentId(lessonId, studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bản ghi bài học của học sinh."));

        assignment.markAsIncomplete();
        assignmentRepository.save(assignment);

        courseAssignmentService.updateProgressOnLessonCompletion(studentId, lessonId, false);
        log.info("Student {} marked lesson {} as incomplete", studentId, lessonId);

        initializeMedia(assignment.getLesson());
        return LessonResponse.fromEntity(assignment.getLesson(), assignment);
    }

    /**
     * Aggregates learning statistics for a student.
     */
    @Transactional(readOnly = true)
    public LessonStatsResponse getStudentStats(Long studentId) {
        long total = assignmentRepository.countByStudentId(studentId);
        long completed = assignmentRepository.countByStudentIdAndIsCompletedTrue(studentId);

        double rate = total > 0 ? (completed * 100.0 / total) : 0.0;

        return LessonStatsResponse.builder()
                .totalLessons(total)
                .completedLessons(completed)
                .inProgressLessons(total - completed)
                .completionRate(Math.round(rate * 10) / 10.0)
                .build();
    }

    // --- Private Helpers ---

    private void initializeMedia(Lesson lesson) {
        Hibernate.initialize(lesson.getImages());
        Hibernate.initialize(lesson.getResources());
    }

    private List<LessonResponse> mapToResponses(List<LessonAssignment> assignments) {
        assignments.forEach(a -> initializeMedia(a.getLesson()));
        return assignments.stream()
                .map(a -> LessonResponse.fromEntity(a.getLesson(), a))
                .collect(Collectors.toList());
    }
}
