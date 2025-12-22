package com.tutor_management.backend.service;

import com.tutor_management.backend.dto.request.CreateLessonRequest;
import com.tutor_management.backend.dto.request.UpdateLessonRequest;
import com.tutor_management.backend.dto.response.AdminLessonResponse;
import com.tutor_management.backend.entity.*;
import com.tutor_management.backend.exception.ResourceNotFoundException;
import com.tutor_management.backend.repository.LessonRepository;
import com.tutor_management.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AdminLessonService {

    private final LessonRepository lessonRepository;
    private final StudentRepository studentRepository;

    /**
     * Create lesson for multiple students
     */
    @CacheEvict(value = "lessons", allEntries = true)
    public List<AdminLessonResponse> createLessonForStudents(CreateLessonRequest request) {
        log.info("📝 Creating lesson '{}' for {} students", request.getTitle(), request.getStudentIds().size());

        List<Lesson> createdLessons = new ArrayList<>();

        for (Long studentId : request.getStudentIds()) {
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));

            // Create lesson instance for this student
            Lesson lesson = Lesson.builder()
                    .student(student)
                    .tutorName(request.getTutorName() != null ? request.getTutorName() : "Thầy Quỳnh Long")
                    .title(request.getTitle())
                    .summary(request.getSummary())
                    .content(request.getContent())
                    .lessonDate(request.getLessonDate())
                    .videoUrl(request.getVideoUrl())
                    .thumbnailUrl(request.getThumbnailUrl())
                    .isPublished(request.getIsPublished() != null ? request.getIsPublished() : false)
                    .build();

            // Add images
            if (request.getImages() != null) {
                request.getImages().forEach(imgReq -> {
                    LessonImage image = LessonImage.builder()
                            .lesson(lesson)
                            .imageUrl(imgReq.getImageUrl())
                            .caption(imgReq.getCaption())
                            .displayOrder(imgReq.getDisplayOrder() != null ? imgReq.getDisplayOrder() : 0)
                            .build();
                    lesson.getImages().add(image);
                });
            }

            // Add resources
            if (request.getResources() != null) {
                request.getResources().forEach(resReq -> {
                    LessonResource resource = LessonResource.builder()
                            .lesson(lesson)
                            .title(resReq.getTitle())
                            .description(resReq.getDescription())
                            .resourceUrl(resReq.getResourceUrl())
                            .resourceType(LessonResource.ResourceType.valueOf(resReq.getResourceType()))
                            .fileSize(resReq.getFileSize())
                            .displayOrder(resReq.getDisplayOrder() != null ? resReq.getDisplayOrder() : 0)
                            .build();
                    lesson.getResources().add(resource);
                });
            }

            if (request.getIsPublished() != null && request.getIsPublished()) {
                lesson.publish();
            }

            createdLessons.add(lessonRepository.save(lesson));
        }

        log.info("✅ Created {} lessons successfully", createdLessons.size());

        return createdLessons.stream()
                .map(AdminLessonResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Update existing lesson
     */
    @CacheEvict(value = "lessons", allEntries = true)
    public AdminLessonResponse updateLesson(Long lessonId, UpdateLessonRequest request) {
        log.info("📝 Updating lesson: {}", lessonId);

        Lesson lesson = lessonRepository.findByIdWithDetails(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found: " + lessonId));

        // Update basic fields
        if (request.getTutorName() != null) lesson.setTutorName(request.getTutorName());
        if (request.getTitle() != null) lesson.setTitle(request.getTitle());
        if (request.getSummary() != null) lesson.setSummary(request.getSummary());
        if (request.getContent() != null) lesson.setContent(request.getContent());
        if (request.getLessonDate() != null) lesson.setLessonDate(request.getLessonDate());
        if (request.getVideoUrl() != null) lesson.setVideoUrl(request.getVideoUrl());
        if (request.getThumbnailUrl() != null) lesson.setThumbnailUrl(request.getThumbnailUrl());

        // Update images (replace all)
        if (request.getImages() != null) {
            lesson.getImages().clear();
            Lesson finalLesson = lesson;
            request.getImages().forEach(imgReq -> {
                LessonImage image = LessonImage.builder()
                        .lesson(finalLesson)
                        .imageUrl(imgReq.getImageUrl())
                        .caption(imgReq.getCaption())
                        .displayOrder(imgReq.getDisplayOrder() != null ? imgReq.getDisplayOrder() : 0)
                        .build();
                finalLesson.getImages().add(image);
            });
        }

        // Update resources (replace all)
        if (request.getResources() != null) {
            lesson.getResources().clear();
            Lesson finalLesson1 = lesson;
            request.getResources().forEach(resReq -> {
                LessonResource resource = LessonResource.builder()
                        .lesson(finalLesson1)
                        .title(resReq.getTitle())
                        .description(resReq.getDescription())
                        .resourceUrl(resReq.getResourceUrl())
                        .resourceType(LessonResource.ResourceType.valueOf(resReq.getResourceType()))
                        .fileSize(resReq.getFileSize())
                        .displayOrder(resReq.getDisplayOrder() != null ? resReq.getDisplayOrder() : 0)
                        .build();
                finalLesson1.getResources().add(resource);
            });
        }

        // Handle publish status
        if (request.getIsPublished() != null) {
            if (request.getIsPublished() && !lesson.getIsPublished()) {
                lesson.publish();
            } else if (!request.getIsPublished() && lesson.getIsPublished()) {
                lesson.unpublish();
            }
        }

        lesson = lessonRepository.save(lesson);
        log.info("✅ Updated lesson: {}", lessonId);

        return AdminLessonResponse.fromEntity(lesson);
    }

    /**
     * Get all lessons (admin view - includes drafts)
     */
    @Transactional(readOnly = true)
    public List<AdminLessonResponse> getAllLessons() {
        log.info("📚 Getting all lessons (admin view)");
        List<Lesson> lessons = lessonRepository.findAll();
        return lessons.stream()
                .map(AdminLessonResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get lesson by ID (admin view)
     */
    @Transactional(readOnly = true)
    public AdminLessonResponse getLessonById(Long lessonId) {
        Lesson lesson = lessonRepository.findByIdWithDetails(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found: " + lessonId));
        return AdminLessonResponse.fromEntity(lesson);
    }

    /**
     * Delete lesson
     */
    @CacheEvict(value = "lessons", allEntries = true)
    public void deleteLesson(Long lessonId) {
        log.info("🗑️ Deleting lesson: {}", lessonId);

        if (!lessonRepository.existsById(lessonId)) {
            throw new ResourceNotFoundException("Lesson not found: " + lessonId);
        }

        lessonRepository.deleteById(lessonId);
        log.info("✅ Deleted lesson: {}", lessonId);
    }

    /**
     * Toggle publish status
     */
    @CacheEvict(value = "lessons", allEntries = true)
    public AdminLessonResponse togglePublishStatus(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found: " + lessonId));

        if (lesson.getIsPublished()) {
            lesson.unpublish();
            log.info("📝 Unpublished lesson: {}", lessonId);
        } else {
            lesson.publish();
            log.info("📢 Published lesson: {}", lessonId);
        }

        lesson = lessonRepository.save(lesson);
        return AdminLessonResponse.fromEntity(lesson);
    }

    /**
     * Get lessons by student (admin view)
     */
    @Transactional(readOnly = true)
    public List<AdminLessonResponse> getLessonsByStudent(Long studentId) {
        List<Lesson> lessons = lessonRepository.findByStudentIdOrderByLessonDateDesc(studentId);
        return lessons.stream()
                .map(AdminLessonResponse::fromEntity)
                .collect(Collectors.toList());
    }
}