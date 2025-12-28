package com.tutor_management.backend.modules.course;

import com.tutor_management.backend.exception.ResourceNotFoundException;
import com.tutor_management.backend.modules.course.dto.request.AssignCourseRequest;
import com.tutor_management.backend.modules.course.dto.response.CourseAssignmentResponse;
import com.tutor_management.backend.modules.course.dto.response.StudentCourseDetailResponse;
import com.tutor_management.backend.modules.course.dto.response.StudentCourseLessonDTO;
import com.tutor_management.backend.modules.course.enums.AssignmentStatus;
import com.tutor_management.backend.modules.lesson.LessonAssignment;
import com.tutor_management.backend.modules.lesson.LessonAssignmentRepository;
import com.tutor_management.backend.modules.student.Student;
import com.tutor_management.backend.modules.student.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CourseAssignmentService {

        private final CourseAssignmentRepository courseAssignmentRepository;
        private final CourseRepository courseRepository;
        private final StudentRepository studentRepository;
        private final LessonAssignmentRepository lessonAssignmentRepository;
        private final LessonProgressRepository lessonProgressRepository;

        public List<CourseAssignmentResponse> assignCourseToStudents(Long courseId, AssignCourseRequest request,
                        String assignedBy) {
                Course course = courseRepository.findById(courseId)
                                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseId));

                List<CourseAssignmentResponse> responses = new ArrayList<>();

                for (Long studentId : request.getStudentIds()) {
                        Student student = studentRepository.findById(studentId)
                                        .orElseThrow(() -> new ResourceNotFoundException(
                                                        "Student not found: " + studentId));

                        // 1. Create Course Assignment record if not exists
                        CourseAssignment assignment = courseAssignmentRepository
                                        .findByCourseIdAndStudentId(courseId, studentId)
                                        .orElseGet(() -> CourseAssignment.builder()
                                                        .course(course)
                                                        .student(student)
                                                        .status(AssignmentStatus.NOT_STARTED)
                                                        .progressPercentage(0)
                                                        .build());

                        assignment.setDeadline(request.getDeadline());
                        CourseAssignment savedAssignment = courseAssignmentRepository.save(assignment);

                        // 2. Create Lesson Assignments for all lessons in course
                        for (CourseLesson courseLesson : course.getCourseLessons()) {
                                boolean exists = lessonAssignmentRepository.existsByLessonIdAndStudentId(
                                                courseLesson.getLesson().getId(), studentId);

                                if (!exists) {
                                        LessonAssignment lessonAssignment = LessonAssignment.builder()
                                                        .lesson(courseLesson.getLesson())
                                                        .student(student)
                                                        .assignedDate(LocalDate.now())
                                                        .assignedBy(assignedBy)
                                                        .isCompleted(false)
                                                        .viewCount(0)
                                                        .build();
                                        lessonAssignmentRepository.save(lessonAssignment);
                                }

                                // 3. Initialize Lesson Progress
                                boolean progressExists = lessonProgressRepository.existsByStudentIdAndLessonId(
                                                studentId, courseLesson.getLesson().getId());

                                if (!progressExists) {
                                        LessonProgress progress = LessonProgress.builder()
                                                        .lesson(courseLesson.getLesson())
                                                        .student(student)
                                                        .isCompleted(false)
                                                        .build();
                                        lessonProgressRepository.save(progress);
                                }
                        }

                        responses.add(CourseAssignmentResponse.fromEntity(savedAssignment));
                }

                return responses;
        }

        public List<CourseAssignmentResponse> getCourseAssignments(Long courseId) {
                return courseAssignmentRepository.findByCourseId(courseId).stream()
                                .map(CourseAssignmentResponse::fromEntity)
                                .collect(Collectors.toList());
        }

        public List<CourseAssignmentResponse> getStudentCourses(Long studentId) {
                return courseAssignmentRepository.findByStudentId(studentId).stream()
                                .map(CourseAssignmentResponse::fromEntity)
                                .collect(Collectors.toList());
        }

        public StudentCourseDetailResponse getStudentCourseDetail(Long courseId, Long studentId) {
                CourseAssignment assignment = courseAssignmentRepository.findByCourseIdAndStudentId(courseId, studentId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Course assignment not found for student " + studentId + " and course "
                                                                + courseId));

                Course course = assignment.getCourse();

                List<StudentCourseLessonDTO> lessons = course.getCourseLessons().stream()
                                .map(cl -> {
                                        Optional<LessonProgress> progress = lessonProgressRepository
                                                        .findByStudentIdAndLessonId(studentId,
                                                                        cl.getLesson().getId());
                                        return StudentCourseLessonDTO.builder()
                                                        .id(cl.getId())
                                                        .lessonId(cl.getLesson().getId())
                                                        .title(cl.getLesson().getTitle())
                                                        .summary(cl.getLesson().getSummary())
                                                        .lessonOrder(cl.getLessonOrder())
                                                        .isRequired(cl.getIsRequired())
                                                        .isCompleted(progress.map(LessonProgress::getIsCompleted)
                                                                        .orElse(false))
                                                        .completedAt(progress.map(LessonProgress::getCompletedAt)
                                                                        .orElse(null))
                                                        .build();
                                })
                                .collect(Collectors.toList());

                return StudentCourseDetailResponse.builder()
                                .id(course.getId())
                                .title(course.getTitle())
                                .description(course.getDescription())
                                .thumbnailUrl(course.getThumbnailUrl())
                                .difficultyLevel(course.getDifficultyLevel())
                                .estimatedHours(course.getEstimatedHours())
                                .tutorName(course.getTutor() != null ? course.getTutor().getFullName() : "Unknown")
                                .status(assignment.getStatus().name())
                                .progressPercentage(assignment.getProgressPercentage())
                                .assignedDate(assignment.getAssignedDate())
                                .deadline(assignment.getDeadline())
                                .completedAt(assignment.getCompletedAt())
                                .lessons(lessons)
                                .build();
        }

        public void removeStudentFromCourse(Long courseId, Long studentId) {
                courseAssignmentRepository.findAll().stream()
                                .filter(a -> a.getCourse().getId().equals(courseId)
                                                && a.getStudent().getId().equals(studentId))
                                .findFirst()
                                .ifPresent(courseAssignmentRepository::delete);

                // Note: Usually we don't automatically delete lesson assignments as they might
                // be independent
        }

        /**
         * Cập nhật tiến độ của một bài giảng trong các khóa học của học sinh.
         * Thường được gọi khi học sinh đánh dấu hoàn thành bài giảng.
         */
        public void updateProgressOnLessonCompletion(Long studentId, Long lessonId, boolean completed) {
                lessonProgressRepository.findByStudentIdAndLessonId(studentId, lessonId)
                                .ifPresent(progress -> {
                                        progress.setIsCompleted(completed);
                                        progress.setCompletedAt(completed ? LocalDateTime.now() : null);
                                        lessonProgressRepository.save(progress);
                                        log.info("Updated LessonProgress for student {} lesson {}: {}", studentId,
                                                        lessonId, completed);
                                });

                // Tìm tất cả khóa học của học sinh này
                List<CourseAssignment> assignments = courseAssignmentRepository.findByStudentId(studentId);

                for (CourseAssignment assignment : assignments) {
                        // Kiểm tra xem bài giảng này có trong khóa học này không
                        boolean isInCourse = assignment.getCourse().getCourseLessons().stream()
                                        .anyMatch(cl -> cl.getLesson().getId().equals(lessonId));

                        if (isInCourse) {
                                recalculateCourseProgress(assignment);
                        }
                }
        }

        private void recalculateCourseProgress(CourseAssignment assignment) {
                List<CourseLesson> courseLessons = assignment.getCourse().getCourseLessons();
                if (courseLessons.isEmpty())
                        return;

                long completedCount = 0;
                for (CourseLesson cl : courseLessons) {
                        Optional<LessonProgress> progress = lessonProgressRepository
                                        .findByStudentIdAndLessonId(assignment.getStudent().getId(),
                                                        cl.getLesson().getId());

                        if (progress.isPresent() && progress.get().getIsCompleted()) {
                                completedCount++;
                        }
                }

                int percentage = (int) ((completedCount * 100.0) / courseLessons.size());
                assignment.setProgressPercentage(percentage);

                // Cập nhật trạng thái dựa trên %
                if (percentage == 100) {
                        assignment.setStatus(AssignmentStatus.COMPLETED);
                        assignment.setCompletedAt(LocalDateTime.now());
                } else if (percentage > 0) {
                        assignment.setStatus(AssignmentStatus.IN_PROGRESS);
                        assignment.setCompletedAt(null);
                } else {
                        assignment.setStatus(AssignmentStatus.NOT_STARTED);
                        assignment.setCompletedAt(null);
                }

                courseAssignmentRepository.save(assignment);
                log.info("Recalculated progress for course {} student {}: {}%",
                                assignment.getCourse().getId(), assignment.getStudent().getId(), percentage);
        }
}
