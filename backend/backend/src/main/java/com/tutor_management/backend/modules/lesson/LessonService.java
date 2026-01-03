package com.tutor_management.backend.modules.lesson;

import java.util.List;
import java.util.stream.Collectors;

import org.hibernate.Hibernate;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tutor_management.backend.exception.ResourceNotFoundException;
import com.tutor_management.backend.modules.course.CourseAssignmentService;
import com.tutor_management.backend.modules.lesson.dto.response.LessonResponse;
import com.tutor_management.backend.modules.lesson.dto.response.LessonStatsResponse;
import com.tutor_management.backend.modules.student.StudentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class LessonService {

    private final LessonRepository lessonRepository;
    private final LessonAssignmentRepository assignmentRepository;
    private final StudentRepository studentRepository;
    private final CourseAssignmentService courseAssignmentService;

    // ✅ OPTIMIZED: Use @EntityGraph method to prevent N+1 queries
    @Cacheable(value = "lessons", key = "'student-' + #studentId")
    @Transactional(readOnly = true)
    public List<LessonResponse> getStudentLessons(Long studentId) {

        // Verify student exists
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with id: " + studentId);
        }

        // ✅ Use optimized method with @EntityGraph
        List<LessonAssignment> assignments = assignmentRepository.findByStudentIdWithDetails(studentId);

        // Initialize collections for each lesson
        return getLessonResponses(assignments);
    }

    private List<LessonResponse> getLessonResponses(List<LessonAssignment> assignments) {
        assignments.forEach(assignment -> {
            Lesson lesson = assignment.getLesson();
            Hibernate.initialize(lesson.getImages());
            Hibernate.initialize(lesson.getResources());
        });

        return assignments.stream()
                .map(assignment -> LessonResponse.fromEntity(assignment.getLesson(), assignment))
                .collect(Collectors.toList());
    }

    @Cacheable(value = "lessons", key = "'lesson-' + #lessonId + '-student-' + #studentId")
    @Transactional(readOnly = true)
    public LessonResponse getLessonById(Long lessonId, Long studentId) {

        // Find assignment (verifies student has access)
        LessonAssignment assignment = assignmentRepository.findByLessonIdAndStudentId(lessonId, studentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Lesson not found or not assigned to this student"));

        Lesson lesson = assignment.getLesson();

        // Initialize collections
        Hibernate.initialize(lesson.getImages());
        Hibernate.initialize(lesson.getResources());

        return LessonResponse.fromEntity(lesson, assignment);
    }

    @Transactional(readOnly = true)
    public List<LessonResponse> getLessonsByMonthYear(Long studentId, int year, int month) {

        // ✅ Use optimized method with @EntityGraph
        List<LessonAssignment> assignments = assignmentRepository.findByStudentIdWithDetails(studentId);

        // Filter by lesson date
        List<LessonAssignment> filtered = assignments.stream()
                .filter(assignment -> {
                    var lessonDate = assignment.getLesson().getLessonDate();
                    return lessonDate.getYear() == year && lessonDate.getMonthValue() == month;
                })
                .collect(Collectors.toList());

        // Initialize collections
        return getLessonResponses(filtered);
    }

    public void incrementViewCount(Long lessonId, Long studentId) {
        LessonAssignment assignment = assignmentRepository.findByLessonIdAndStudentId(lessonId, studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        assignment.incrementViewCount();
        assignmentRepository.save(assignment);
    }

    @CacheEvict(value = "lessons", allEntries = true)
    public LessonResponse markAsCompleted(Long lessonId, Long studentId) {
        LessonAssignment assignment = assignmentRepository.findByLessonIdAndStudentId(lessonId, studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        assignment.markAsCompleted();
        assignment = assignmentRepository.save(assignment);

        // Update course progress
        courseAssignmentService.updateProgressOnLessonCompletion(studentId, lessonId, true);

        Lesson lesson = assignment.getLesson();
        Hibernate.initialize(lesson.getImages());
        Hibernate.initialize(lesson.getResources());

        return LessonResponse.fromEntity(lesson, assignment);
    }

    @CacheEvict(value = "lessons", allEntries = true)
    public LessonResponse markAsIncomplete(Long lessonId, Long studentId) {
        LessonAssignment assignment = assignmentRepository.findByLessonIdAndStudentId(lessonId, studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        assignment.markAsIncomplete();
        assignment = assignmentRepository.save(assignment);

        // Update course progress
        courseAssignmentService.updateProgressOnLessonCompletion(studentId, lessonId, false);

        Lesson lesson = assignment.getLesson();
        Hibernate.initialize(lesson.getImages());
        Hibernate.initialize(lesson.getResources());

        return LessonResponse.fromEntity(lesson, assignment);
    }

    @Transactional(readOnly = true)
    public LessonStatsResponse getStudentStats(Long studentId) {
        // ✅ OPTIMIZED: Use COUNT query instead of loading full list
        long totalLessons = assignmentRepository.countByStudentId(studentId);

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
