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

/**
 * Service for Administrative lesson management.
 * Handles mass lesson creation, cross-student updates, and deletion workflows.
 */
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

    private static final String DEFAULT_TUTOR = "Thầy Quỳnh Long";

    /**
     * Creates a central library lesson and optionally task it to multiple students.
     * 
     * @param request Creation parameters including optional student assignments.
     * @return List containing the created lesson details.
     */
    @CacheEvict(value = "lessons", allEntries = true)
    public List<AdminLessonResponse> createLessonForStudents(CreateLessonRequest request) {
        log.info("📝 Creating library lesson '{}' for {} students", request.getTitle(), 
                request.getStudentIds() != null ? request.getStudentIds().size() : 0);

        Lesson lesson = buildLessonFromRequest(request);
         lesson = lessonRepository.save(lesson);

        if (request.getStudentIds() != null && !request.getStudentIds().isEmpty()) {
            lesson.markAsAssigned();
            List<LessonAssignment> assignments = createAssignments(lesson, request.getStudentIds());
            assignmentRepository.saveAll(assignments);
            lesson = lessonRepository.save(lesson);
        }

        return List.of(AdminLessonResponse.fromEntity(lesson));
    }

    /**
     * Lists all lessons in the system with their assignment metrics.
     */
    @Transactional(readOnly = true)
    public List<AdminLessonResponse> getAllLessons() {
        return lessonRepository.findAllWithAssignments().stream()
                .map(AdminLessonResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Fetches details for a single lesson record.
     */
    @Transactional(readOnly = true)
    public AdminLessonResponse getLessonById(Long id) {
        return lessonRepository.findById(id)
                .map(AdminLessonResponse::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài giảng với ID: " + id));
    }

    /**
     * Updates a lesson's metadata and nested assets.
     * Propagates changes to all assigned students simultaneously.
     */
    @CacheEvict(value = "lessons", allEntries = true)
    @Transactional
    public AdminLessonResponse updateLesson(Long id, CreateLessonRequest request) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài giảng ID: " + id));

        applyUpdateToLesson(lesson, request);
        return AdminLessonResponse.fromEntity(lessonRepository.save(lesson));
    }

    /**
     * Permanently removes a lesson and its student progress records.
     * Also cleans up references in financial session records.
     */
    @CacheEvict(value = "lessons", allEntries = true)
    @Transactional
    public void deleteLesson(Long id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài giảng với ID: " + id));

        int count = lesson.getAssignedStudentCount();
        sessionRecordRepository.deleteLessonReferences(id);
        lessonRepository.delete(lesson);
        
        log.info("✅ Deleted lesson {} and removed {} student assignments", id, count);
    }

    /**
     * Visibility toggle for lesson records.
     */
    @CacheEvict(value = "lessons", allEntries = true)
    @Transactional
    public AdminLessonResponse togglePublish(Long id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài giảng với ID: " + id));

        if (lesson.getIsPublished()) lesson.unpublish();
        else lesson.publish();

        return AdminLessonResponse.fromEntity(lessonRepository.save(lesson));
    }

    /**
     * Retrieves all lessons currently tasked to a specific student.
     */
    @Transactional(readOnly = true)
    public List<AdminLessonResponse> getLessonsByStudent(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Không tìm thấy học sinh với ID: " + studentId);
        }

        return assignmentRepository.findByStudentIdOrderByAssignedDateDesc(studentId).stream()
                .map(a -> AdminLessonResponse.fromEntity(a.getLesson()))
                .collect(Collectors.toList());
    }

    // --- Private Logic ---

    private Lesson buildLessonFromRequest(CreateLessonRequest r) {
        Lesson lesson = Lesson.builder()
                .tutorName(r.getTutorName() != null ? r.getTutorName() : DEFAULT_TUTOR)
                .title(r.getTitle()).summary(r.getSummary()).content(r.getContent())
                .lessonDate(r.getLessonDate()).videoUrl(r.getVideoUrl()).thumbnailUrl(r.getThumbnailUrl())
                .isPublished(r.getIsPublished() != null ? r.getIsPublished() : false)
                .isLibrary(r.getStudentIds() == null || r.getStudentIds().isEmpty())
                .category(r.getCategoryId() != null ? categoryRepository.findById(r.getCategoryId()).orElse(null) : null)
                .allowLateSubmission(r.getAllowLateSubmission() != null ? r.getAllowLateSubmission() : true)
                .latePenaltyPercent(r.getLatePenaltyPercent() != null ? r.getLatePenaltyPercent() : 0.0)
                .points(r.getPoints() != null ? r.getPoints() : 100)
                .passScore(r.getPassScore() != null ? r.getPassScore() : 50)
                .difficultyLevel(r.getDifficultyLevel() != null ? r.getDifficultyLevel() : "All Levels")
                .durationMinutes(r.getDurationMinutes() != null ? r.getDurationMinutes() : 0)
                .build();

        if (r.getImages() != null) {
            r.getImages().forEach(img -> lesson.getImages().add(LessonImage.builder()
                    .lesson(lesson).imageUrl(img.getImageUrl()).caption(img.getCaption())
                    .displayOrder(img.getDisplayOrder()).build()));
        }

        if (r.getResources() != null) {
            r.getResources().forEach(res -> lesson.getResources().add(LessonResource.builder()
                    .lesson(lesson).title(res.getTitle()).description(res.getDescription())
                    .resourceUrl(res.getResourceUrl()).resourceType(LessonResource.ResourceType.valueOf(res.getResourceType()))
                    .fileSize(res.getFileSize()).displayOrder(res.getDisplayOrder()).build()));
        }

        if (Boolean.TRUE.equals(r.getIsPublished())) lesson.publish();
        return lesson;
    }

    private void applyUpdateToLesson(Lesson l, CreateLessonRequest r) {
        if (r.getTutorName() != null) l.setTutorName(r.getTutorName());
        if (r.getTitle() != null) l.setTitle(r.getTitle());
        if (r.getSummary() != null) l.setSummary(r.getSummary());
        if (r.getContent() != null) l.setContent(r.getContent());
        if (r.getLessonDate() != null) l.setLessonDate(r.getLessonDate());
        if (r.getVideoUrl() != null) l.setVideoUrl(r.getVideoUrl());
        if (r.getThumbnailUrl() != null) l.setThumbnailUrl(r.getThumbnailUrl());
        l.setCategory(r.getCategoryId() != null ? categoryRepository.findById(r.getCategoryId()).orElse(null) : null);

        if (r.getImages() != null) {
            l.getImages().clear();
            r.getImages().forEach(dto -> l.getImages().add(LessonImage.builder()
                    .lesson(l).imageUrl(dto.getImageUrl()).caption(dto.getCaption()).displayOrder(dto.getDisplayOrder()).build()));
        }

        if (r.getResources() != null) {
            l.getResources().clear();
            r.getResources().forEach(dto -> l.getResources().add(LessonResource.builder()
                    .lesson(l).title(dto.getTitle()).description(dto.getDescription()).resourceUrl(dto.getResourceUrl())
                    .resourceType(LessonResource.ResourceType.valueOf(dto.getResourceType())).fileSize(dto.getFileSize())
                    .displayOrder(dto.getDisplayOrder()).build()));
        }
    }

    private List<LessonAssignment> createAssignments(Lesson lesson, List<Long> studentIds) {
        List<LessonAssignment> assignments = new ArrayList<>();
        for (Long id : studentIds) {
            Student student = studentRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy học sinh với ID: " + id));
            assignments.add(LessonAssignment.builder().lesson(lesson).student(student)
                    .assignedDate(LocalDate.now()).assignedBy(DEFAULT_TUTOR).build());
        }
        return assignments;
    }
}
