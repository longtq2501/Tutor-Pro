package com.tutor_management.backend.service;

import com.tutor_management.backend.dto.response.LessonResponse;
import com.tutor_management.backend.dto.response.LessonStatsResponse;
import com.tutor_management.backend.entity.Lesson;
import com.tutor_management.backend.exception.ResourceNotFoundException;
import com.tutor_management.backend.repository.LessonRepository;
import com.tutor_management.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class LessonService {

    private final LessonRepository lessonRepository;
    private final StudentRepository studentRepository;

    /**
     * Get all lessons for a student
     */
    @Cacheable(value = "lessons", key = "'student-' + #studentId")
    @Transactional(readOnly = true)
    public List<LessonResponse> getStudentLessons(Long studentId) {
        log.info("📚 Getting all lessons for student: {}", studentId);

        // Verify student exists
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with id: " + studentId);
        }

        List<Lesson> lessons = lessonRepository.findByStudentIdOrderByLessonDateDesc(studentId);

        log.info("✅ Found {} lessons for student {}", lessons.size(), studentId);

        return lessons.stream()
                .map(LessonResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get lesson by ID with details
     */
    @Cacheable(value = "lessons", key = "'lesson-' + #lessonId")
    @Transactional(readOnly = true)
    public LessonResponse getLessonById(Long lessonId) {
        log.info("📖 Getting lesson: {}", lessonId);

        Lesson lesson = lessonRepository.findByIdWithDetails(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        return LessonResponse.fromEntity(lesson);
    }

    /**
     * Get lessons by month/year filter
     */
    @Transactional(readOnly = true)
    public List<LessonResponse> getLessonsByMonthYear(Long studentId, int year, int month) {
        log.info("📅 Getting lessons for student {} - {}/{}", studentId, month, year);

        List<Lesson> lessons = lessonRepository.findByStudentIdAndYearMonth(studentId, year, month);

        return lessons.stream()
                .map(LessonResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Increment view count when student opens lesson
     */
    public void incrementViewCount(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));

        lesson.incrementViewCount();
        lessonRepository.save(lesson);

        log.info("👁️ Incremented view count for lesson {}: {} views", lessonId, lesson.getViewCount());
    }

    /**
     * Mark lesson as completed
     */
    public LessonResponse markAsCompleted(Long lessonId, Long studentId) {
        Lesson lesson = lessonRepository.findByIdWithDetails(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));

        // Verify ownership
        if (!lesson.getStudent().getId().equals(studentId)) {
            throw new IllegalArgumentException("You don't have permission to modify this lesson");
        }

        lesson.markAsCompleted();
        lesson = lessonRepository.save(lesson);

        log.info("✅ Marked lesson {} as completed by student {}", lessonId, studentId);

        return LessonResponse.fromEntity(lesson);
    }

    /**
     * Mark lesson as incomplete
     */
    public LessonResponse markAsIncomplete(Long lessonId, Long studentId) {
        Lesson lesson = lessonRepository.findByIdWithDetails(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));

        // Verify ownership
        if (!lesson.getStudent().getId().equals(studentId)) {
            throw new IllegalArgumentException("You don't have permission to modify this lesson");
        }

        lesson.markAsIncomplete();
        lesson = lessonRepository.save(lesson);

        log.info("❌ Marked lesson {} as incomplete by student {}", lessonId, studentId);

        return LessonResponse.fromEntity(lesson);
    }

    /**
     * Get lesson statistics
     */
    @Transactional(readOnly = true)
    public LessonStatsResponse getStudentStats(Long studentId) {
        long totalLessons = lessonRepository.countByStudentId(studentId);
        long completedLessons = lessonRepository.countByStudentIdAndIsCompletedTrue(studentId);

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