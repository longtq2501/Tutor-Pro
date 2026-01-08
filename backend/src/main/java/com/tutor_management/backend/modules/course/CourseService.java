package com.tutor_management.backend.modules.course;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tutor_management.backend.exception.ResourceNotFoundException;
import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.auth.UserRepository;
import com.tutor_management.backend.modules.course.dto.request.CourseRequest;
import com.tutor_management.backend.modules.course.dto.response.CourseDetailResponse;
import com.tutor_management.backend.modules.course.dto.response.CourseResponse;
import com.tutor_management.backend.modules.course.projection.CourseListProjection;
import com.tutor_management.backend.modules.lesson.Lesson;
import com.tutor_management.backend.modules.lesson.LessonRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseLessonRepository courseLessonRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;

    // ✅ PERFORMANCE: Cache course list for 5 minutes
    @org.springframework.cache.annotation.Cacheable(value = "courseList")
    @Transactional(readOnly = true)
    public List<CourseListProjection> getAllCourses() {
        return courseRepository.findAllCoursesProjection();
    }

    // ✅ PERFORMANCE: Cache individual course details
    @org.springframework.cache.annotation.Cacheable(value = "courseDetail", key = "#id")
    @Transactional(readOnly = true)
    public CourseDetailResponse getCourseById(Long id) {
        Course course = courseRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + id));
        return CourseDetailResponse.fromEntity(course);
    }

    // ✅ PERFORMANCE: Evict course caches when creating new course
    @org.springframework.cache.annotation.CacheEvict(value = {"courseList", "courseDetail"}, allEntries = true)
    public CourseResponse createCourse(CourseRequest request, User tutor) {
        Course course = Course.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .thumbnailUrl(request.getThumbnailUrl())
                .difficultyLevel(request.getDifficultyLevel())
                .estimatedHours(request.getEstimatedHours())
                .isPublished(request.getIsPublished() != null ? request.getIsPublished() : false)
                .tutor(tutor)
                .build();

        Course savedCourse = courseRepository.save(course);

        // Add initial lessons if provided
        if (request.getLessonIds() != null && !request.getLessonIds().isEmpty()) {
            addLessonsToCourse(savedCourse.getId(), request.getLessonIds());
        }

        return CourseResponse.fromEntity(savedCourse);
    }

    // ✅ PERFORMANCE: Evict caches when updating course
    @org.springframework.cache.annotation.CacheEvict(value = {"courseList", "courseDetail"}, allEntries = true)
    public CourseResponse updateCourse(Long id, CourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + id));

        if (request.getTitle() != null)
            course.setTitle(request.getTitle());
        if (request.getDescription() != null)
            course.setDescription(request.getDescription());
        if (request.getThumbnailUrl() != null)
            course.setThumbnailUrl(request.getThumbnailUrl());
        if (request.getDifficultyLevel() != null)
            course.setDifficultyLevel(request.getDifficultyLevel());
        if (request.getEstimatedHours() != null)
            course.setEstimatedHours(request.getEstimatedHours());
        if (request.getIsPublished() != null)
            course.setIsPublished(request.getIsPublished());

        // Update lesson list if provided
        if (request.getLessonIds() != null) {
            syncCourseLessons(course, request.getLessonIds());
        }

        return CourseResponse.fromEntity(courseRepository.save(course));
    }

    private void syncCourseLessons(Course course, List<Long> newLessonIds) {
        // Delete all existing course lessons from database
        courseLessonRepository.deleteAllByCourse(course);
        courseLessonRepository.flush();

        // Clear the collection
        course.getCourseLessons().clear();

        // Add new lessons in the specified order
        for (int i = 0; i < newLessonIds.size(); i++) {
            Long lessonId = newLessonIds.get(i);
            Lesson lesson = lessonRepository.findById(lessonId)
                    .orElseThrow(() -> new ResourceNotFoundException("Lesson not found: " + lessonId));

            CourseLesson courseLesson = CourseLesson.builder()
                    .course(course)
                    .lesson(lesson)
                    .lessonOrder(i + 1)
                    .isRequired(true)
                    .build();
            course.getCourseLessons().add(courseLesson);
        }
    }

    // ✅ PERFORMANCE: Evict caches when deleting course
    @org.springframework.cache.annotation.CacheEvict(value = {"courseList", "courseDetail"}, allEntries = true)
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Course not found: " + id);
        }
        courseRepository.deleteById(id);
    }

    public void addLessonsToCourse(Long courseId, List<Long> lessonIds) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        int currentCount = course.getCourseLessons().size();

        for (int i = 0; i < lessonIds.size(); i++) {
            Long lessonId = lessonIds.get(i);
            Lesson lesson = lessonRepository.findById(lessonId)
                    .orElseThrow(() -> new ResourceNotFoundException("Lesson not found: " + lessonId));

            // Check if already in course
            boolean exists = course.getCourseLessons().stream()
                    .anyMatch(cl -> cl.getLesson().getId().equals(lessonId));

            if (!exists) {
                CourseLesson courseLesson = CourseLesson.builder()
                        .course(course)
                        .lesson(lesson)
                        .lessonOrder(currentCount + i + 1)
                        .isRequired(true)
                        .build();
                course.getCourseLessons().add(courseLesson);
            }
        }

        courseRepository.save(course);
    }

    public void removeLessonFromCourse(Long courseId, Long lessonId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        course.getCourseLessons().removeIf(cl -> cl.getLesson().getId().equals(lessonId));

        // Re-order remaining lessons
        List<CourseLesson> lessons = course.getCourseLessons();
        for (int i = 0; i < lessons.size(); i++) {
            lessons.get(i).setLessonOrder(i + 1);
        }

        courseRepository.save(course);
    }
}
