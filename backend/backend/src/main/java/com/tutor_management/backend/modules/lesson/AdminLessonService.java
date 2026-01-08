package com.tutor_management.backend.modules.lesson;

import com.tutor_management.backend.modules.lesson.dto.request.CreateLessonRequest;
import com.tutor_management.backend.modules.lesson.dto.response.AdminLessonResponse;
import com.tutor_management.backend.exception.ResourceNotFoundException;
import com.tutor_management.backend.modules.finance.SessionRecordRepository;
import com.tutor_management.backend.modules.student.Student;
import com.tutor_management.backend.modules.student.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AdminLessonService {

    private final LessonRepository lessonRepository;
    private final LessonAssignmentRepository assignmentRepository;
    private final StudentRepository studentRepository;
    private final LessonCategoryRepository categoryRepository;
    private final SessionRecordRepository sessionRecordRepository;

    /**
     * Create a lesson in library and optionally assign to students
     * <p>
     * NEW WORKFLOW:
     * 1. Create ONE central lesson in library
     * 2. If studentIds provided, create LessonAssignment records
     * 3. Return the created lesson
     */
    @CacheEvict(value = "lessons", allEntries = true)
    public List<AdminLessonResponse> createLessonForStudents(CreateLessonRequest request) {
        log.info("📝 Creating library lesson '{}' for {} students",
                request.getTitle(),
                request.getStudentIds() != null ? request.getStudentIds().size() : 0);

        // ===== STEP 1: Create central library lesson =====
        Lesson lesson = Lesson.builder()
                .tutorName(request.getTutorName() != null ? request.getTutorName() : "Thầy Quỳnh Long")
                .title(request.getTitle())
                .summary(request.getSummary())
                .content(request.getContent())
                .lessonDate(request.getLessonDate())
                .videoUrl(request.getVideoUrl())
                .thumbnailUrl(request.getThumbnailUrl())
                .isPublished(request.getIsPublished() != null ? request.getIsPublished() : false)
                .isLibrary(request.getStudentIds() == null || request.getStudentIds().isEmpty())
                .category(request.getCategoryId() != null
                        ? categoryRepository.findById(request.getCategoryId()).orElse(null)
                        : null)
                .allowLateSubmission(request.getAllowLateSubmission() != null ? request.getAllowLateSubmission() : true)
                .averageRating(request.getAverageRating() != null ? request.getAverageRating() : 0.0)
                .reviewCount(request.getReviewCount() != null ? request.getReviewCount() : 0)
                .latePenaltyPercent(request.getLatePenaltyPercent() != null ? request.getLatePenaltyPercent() : 0.0)
                .points(request.getPoints() != null ? request.getPoints() : 100)
                .passScore(request.getPassScore() != null ? request.getPassScore() : 50)
                .totalFeedbacks(request.getTotalFeedbacks() != null ? request.getTotalFeedbacks() : 0)
                .totalEnrollments(request.getTotalEnrollments() != null ? request.getTotalEnrollments() : 0)
                .difficultyLevel(request.getDifficultyLevel() != null ? request.getDifficultyLevel() : "All Levels")
                .durationMinutes(request.getDurationMinutes() != null ? request.getDurationMinutes() : 0)
                .build();

        // ===== Add Images =====
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            List<LessonImage> images = request.getImages().stream()
                    .map(imgDto -> LessonImage.builder()
                            .lesson(lesson)
                            .imageUrl(imgDto.getImageUrl())
                            .caption(imgDto.getCaption())
                            .displayOrder(imgDto.getDisplayOrder())
                            .build())
                    .toList();
            lesson.getImages().addAll(images);
        }

        // ===== Add Resources =====
        if (request.getResources() != null && !request.getResources().isEmpty()) {
            List<LessonResource> resources = request.getResources().stream()
                    .map(resDto -> LessonResource.builder()
                            .lesson(lesson)
                            .title(resDto.getTitle())
                            .description(resDto.getDescription())
                            .resourceUrl(resDto.getResourceUrl())
                            .resourceType(LessonResource.ResourceType.valueOf(resDto.getResourceType()))
                            .fileSize(resDto.getFileSize())
                            .displayOrder(resDto.getDisplayOrder())
                            .build())
                    .toList();
            lesson.getResources().addAll(resources);
        }

        // ===== Publish if requested =====
        if (request.getIsPublished() != null && request.getIsPublished()) {
            lesson.publish();
        }

        // ===== STEP 2: Save lesson first to get ID =====
        Lesson savedLesson = lessonRepository.save(lesson);

        // ===== STEP 3: Create assignments for students =====
        if (request.getStudentIds() != null && !request.getStudentIds().isEmpty()) {

            // Mark as assigned (no longer pure library)
            savedLesson.markAsAssigned();

            // Create assignment records
            List<LessonAssignment> assignments = new ArrayList<>();

            for (Long studentId : request.getStudentIds()) {
                Student student = studentRepository.findById(studentId)
                        .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));

                // Create assignment
                LessonAssignment assignment = LessonAssignment.builder()
                        .lesson(savedLesson)
                        .student(student)
                        .assignedDate(LocalDate.now())
                        .assignedBy("Thầy Quỳnh Long")
                        .isCompleted(false)
                        .viewCount(0)
                        .build();

                assignments.add(assignment);
            }

            // Save all assignments at once
            assignmentRepository.saveAll(assignments);

            // Update lesson's isLibrary flag
            savedLesson = lessonRepository.save(savedLesson);
        }

        // ===== STEP 4: Return response =====
        AdminLessonResponse response = AdminLessonResponse.fromEntity(savedLesson);
        return List.of(response);
    }

    /**
     * Get all lessons (library view)
     */
    @Transactional(readOnly = true)
    public List<AdminLessonResponse> getAllLessons() {
        // Use query with JOIN FETCH
        List<Lesson> lessons = lessonRepository.findAllWithAssignments();
        return lessons.stream()
                .map(AdminLessonResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get lesson by ID
     */
    @Transactional(readOnly = true)
    public AdminLessonResponse getLessonById(Long id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found: " + id));
        return AdminLessonResponse.fromEntity(lesson);
    }

    /**
     * Update lesson (affects all assigned students)
     * Fixed: MultipleBagFetchException by using findById instead of Join Fetch
     */
    @CacheEvict(value = "lessons", allEntries = true)
    public AdminLessonResponse updateLesson(Long id, CreateLessonRequest request) {

        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài giảng ID: " + id));

        // Cập nhật các trường thông tin cơ bản (Basic fields)
        if (request.getTutorName() != null)
            lesson.setTutorName(request.getTutorName());
        if (request.getTitle() != null)
            lesson.setTitle(request.getTitle());
        if (request.getSummary() != null)
            lesson.setSummary(request.getSummary());
        if (request.getContent() != null)
            lesson.setContent(request.getContent());
        if (request.getLessonDate() != null)
            lesson.setLessonDate(request.getLessonDate());
        if (request.getVideoUrl() != null)
            lesson.setVideoUrl(request.getVideoUrl());
        if (request.getThumbnailUrl() != null)
            lesson.setThumbnailUrl(request.getThumbnailUrl());
        if (request.getAllowLateSubmission() != null)
            lesson.setAllowLateSubmission(request.getAllowLateSubmission());
        if (request.getAverageRating() != null)
            lesson.setAverageRating(request.getAverageRating());
        if (request.getReviewCount() != null)
            lesson.setReviewCount(request.getReviewCount());
        if (request.getLatePenaltyPercent() != null)
            lesson.setLatePenaltyPercent(request.getLatePenaltyPercent());
        if (request.getPoints() != null)
            lesson.setPoints(request.getPoints());
        if (request.getPassScore() != null)
            lesson.setPassScore(request.getPassScore());
        if (request.getTotalFeedbacks() != null)
            lesson.setTotalFeedbacks(request.getTotalFeedbacks());
        if (request.getTotalEnrollments() != null)
            lesson.setTotalEnrollments(request.getTotalEnrollments());
        if (request.getDifficultyLevel() != null)
            lesson.setDifficultyLevel(request.getDifficultyLevel());
        if (request.getDurationMinutes() != null)
            lesson.setDurationMinutes(request.getDurationMinutes());

        // Cập nhật danh mục
        if (request.getCategoryId() != null) {
            lesson.setCategory(categoryRepository.findById(request.getCategoryId()).orElse(null));
        } else {
            lesson.setCategory(null);
        }

        // Cập nhật danh sách Images (Cần orphanRemoval = true trong Entity)
        if (request.getImages() != null) {
            // Xóa danh sách cũ (Hibernate sẽ tự động delete các bản ghi mồ côi)
            lesson.getImages().clear();

            // Thêm danh sách mới
            request.getImages().forEach(imgDto -> {
                LessonImage image = LessonImage.builder()
                        .lesson(lesson)
                        .imageUrl(imgDto.getImageUrl())
                        .caption(imgDto.getCaption())
                        .displayOrder(imgDto.getDisplayOrder())
                        .build();
                lesson.getImages().add(image);
            });
        }

        // Cập nhật danh sách Resources
        if (request.getResources() != null) {
            lesson.getResources().clear();

            request.getResources().forEach(resDto -> {
                LessonResource resource = LessonResource.builder()
                        .lesson(lesson)
                        .title(resDto.getTitle())
                        .description(resDto.getDescription())
                        .resourceUrl(resDto.getResourceUrl())
                        .resourceType(LessonResource.ResourceType.valueOf(resDto.getResourceType()))
                        .fileSize(resDto.getFileSize())
                        .displayOrder(resDto.getDisplayOrder())
                        .build();
                lesson.getResources().add(resource);
            });
        }

        // Lưu lại thay đổi
        Lesson updatedLesson = lessonRepository.save(lesson);

        return AdminLessonResponse.fromEntity(updatedLesson);
    }

    /**
     * Delete lesson from library (cascades to all assignments)
     */
    @CacheEvict(value = "lessons", allEntries = true)
    public void deleteLesson(Long id) {

        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found: " + id));

        int assignmentCount = lesson.getAssignedStudentCount();
        
        // 1. Clear references in session_lessons (Join Table)
        sessionRecordRepository.deleteLessonReferences(id);

        // 2. Delete lesson (cascade will handle assignments)
        lessonRepository.delete(lesson);

        log.info("✅ Deleted lesson {} and {} assignments", id, assignmentCount);
    }

    /**
     * Toggle publish status
     *
     * @param id Lesson ID
     * @return Updated lesson response
     */
    @CacheEvict(value = "lessons", allEntries = true)
    public AdminLessonResponse togglePublishStatus(Long id) {

        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found: " + id));

        // Toggle logic
        if (lesson.getIsPublished()) {
            lesson.unpublish();
        } else {
            lesson.publish();
        }

        Lesson updatedLesson = lessonRepository.save(lesson);

        return AdminLessonResponse.fromEntity(updatedLesson);
    }

    /**
     * Toggle publish status
     */
    @CacheEvict(value = "lessons", allEntries = true)
    public AdminLessonResponse togglePublish(Long id) {

        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found: " + id));

        if (lesson.getIsPublished()) {
            lesson.unpublish();
        } else {
            lesson.publish();
        }

        Lesson updatedLesson = lessonRepository.save(lesson);

        return AdminLessonResponse.fromEntity(updatedLesson);
    }

    /**
     * Get lessons by student (for admin view)
     */
    @Transactional(readOnly = true)
    public List<AdminLessonResponse> getLessonsByStudent(Long studentId) {

        // Verify student exists
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found: " + studentId);
        }

        // Get all assignments for this student
        List<LessonAssignment> assignments = assignmentRepository.findByStudentIdOrderByAssignedDateDesc(studentId);

        return assignments.stream()
                .map(assignment -> AdminLessonResponse.fromEntity(assignment.getLesson()))
                .collect(Collectors.toList());
    }
}
