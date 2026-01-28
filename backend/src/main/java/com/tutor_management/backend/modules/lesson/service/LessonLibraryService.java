package com.tutor_management.backend.modules.lesson.service;

import com.tutor_management.backend.modules.lesson.dto.request.CreateLessonRequest;
import com.tutor_management.backend.modules.lesson.dto.response.LibraryLessonResponse;
import com.tutor_management.backend.modules.lesson.entity.Lesson;
import com.tutor_management.backend.modules.lesson.entity.LessonAssignment;
import com.tutor_management.backend.modules.lesson.repository.LessonAssignmentRepository;
import com.tutor_management.backend.modules.lesson.repository.LessonCategoryRepository;
import com.tutor_management.backend.modules.lesson.repository.LessonRepository;
import com.tutor_management.backend.modules.student.entity.Student;
import com.tutor_management.backend.exception.ResourceNotFoundException;
import com.tutor_management.backend.modules.student.repository.StudentRepository;
import com.tutor_management.backend.modules.tutor.entity.Tutor;
import com.tutor_management.backend.modules.tutor.repository.TutorRepository;
import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service for managing the lesson library and student assignments.
 * Handles bulk assigning and listing of re-usable content.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class LessonLibraryService {

    private final LessonRepository lessonRepository;
    private final LessonAssignmentRepository assignmentRepository;
    private final StudentRepository studentRepository;
    private final LessonCategoryRepository categoryRepository;
    private final TutorRepository tutorRepository;
    private final UserRepository userRepository;

    /**
     * Resolves the current tutor ID from the security context.
     * Returns NULL for ADMIN users (they see all lessons).
     * 
     * @return Tutor ID or NULL for admin access
     */
    private Long getCurrentTutorId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof User user)) {
            return null;
        }
        if ("ADMIN".equals(user.getRole())) {
            return null; // Admin sees all lessons
        }
        return tutorRepository.findByUserId(user.getId())
                .map(Tutor::getId)
                .orElse(null);
    }

    /**
     * Retrieves all lessons in the library, including assignment metrics.
     */
    /**
     * Retrieves all lessons in the library, including assignment metrics.
     * Filtered by tutor to ensure data isolation.
     */
    @Transactional(readOnly = true)
    public Page<LibraryLessonResponse> getAllLibraryLessons(Pageable pageable) {
        Long tutorId = getCurrentTutorId();
        return lessonRepository.findAllWithAssignments(tutorId, pageable)
                .map(LibraryLessonResponse::fromEntity);
    }

    /**
     * Retrieves only lessons that have not been assigned to any students (pure library items).
     * Filtered by current tutor for multi-tenancy isolation.
     */
    @Transactional(readOnly = true)
    public Page<LibraryLessonResponse> getUnassignedLessons(Pageable pageable) {
        Long tutorId = getCurrentTutorId();
        return lessonRepository.findByIsLibraryTrueOrderByCreatedAtDesc(tutorId, pageable)
                .map(LibraryLessonResponse::fromEntity);
    }

    /**
     * Creates a new lesson record directly into the library.
     */
    @CacheEvict(value = "lessons", allEntries = true)
    public LibraryLessonResponse createLibraryLesson(CreateLessonRequest request) {
        // Resolve current tutor
        Long currentTutorId = getCurrentTutorId();
        Tutor currentTutor = null;
        if (currentTutorId != null) {
            currentTutor = tutorRepository.findById(currentTutorId)
                    .orElseThrow(() -> new ResourceNotFoundException("Tutor profile not found"));
        }

        Lesson lesson = Lesson.builder()
                .tutor(currentTutor) // ✅ Auto-assign tutor
                .tutorName(request.getTutorName()).title(request.getTitle())
                .summary(request.getSummary()).content(request.getContent())
                .lessonDate(request.getLessonDate()).videoUrl(request.getVideoUrl())
                .thumbnailUrl(request.getThumbnailUrl()).isLibrary(true)
                .isPublished(request.getIsPublished())
                .category(request.getCategoryId() != null ? categoryRepository.findById(request.getCategoryId()).orElse(null) : null)
                .build();

        return LibraryLessonResponse.fromEntity(lessonRepository.save(lesson));
    }

    /**
     * Assigns an existing library lesson to a list of students.
     * Prevents duplicate assignments.
     */
    @CacheEvict(value = "lessons", allEntries = true)
    public void assignLessonToStudents(Long lessonId, List<Long> studentIds, String assignedBy) {
        Lesson lesson = lessonRepository.findByIdWithDetails(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài giảng."));

        List<Student> students = studentRepository.findAllById(studentIds);
        if (students.size() != studentIds.size()) {
            throw new ResourceNotFoundException("Một số học sinh được chọn không tồn tại.");
        }

        List<LessonAssignment> assignments = students.stream()
                .filter(s -> !assignmentRepository.existsByLessonIdAndStudentId(lessonId, s.getId()))
                .map(s -> LessonAssignment.builder().lesson(lesson).student(s)
                        .assignedDate(LocalDate.now()).assignedBy(assignedBy).build())
                .collect(Collectors.toList());

        if (!assignments.isEmpty()) {
            assignmentRepository.saveAll(assignments);
            if (lesson.getIsLibrary()) {
                lesson.markAsAssigned();
                lessonRepository.save(lesson);
            }
        }
    }

    /**
     * Revokes lesson access from specific students.
     * Reverts lesson to 'Library' status if no students remain assigned.
     */
    @CacheEvict(value = "lessons", allEntries = true)
    public void unassignLessonFromStudents(Long lessonId, List<Long> studentIds) {
        for (Long id : studentIds) {
            assignmentRepository.deleteByLessonIdAndStudentId(lessonId, id);
        }

        if (assignmentRepository.countByLessonId(lessonId) == 0) {
            Lesson lesson = lessonRepository.findByIdWithDetails(lessonId).orElse(null);
            if (lesson != null) {
                lesson.markAsLibrary();
                lessonRepository.save(lesson);
            }
        }
    }

    /**
     * Fetches students officially assigned to a specific lesson.
     */
    @Transactional(readOnly = true)
    public List<Student> getAssignedStudents(Long lessonId) {
        return assignmentRepository.findByLessonIdWithDetails(lessonId).stream()
                .map(LessonAssignment::getStudent)
                .collect(Collectors.toList());
    }

    /**
     * Deletes a lesson from the library and all its historical assignments.
     */
    @CacheEvict(value = "lessons", allEntries = true)
    public void deleteLibraryLesson(Long lessonId) {
        Lesson lesson = lessonRepository.findByIdWithDetails(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài giảng."));
        lessonRepository.delete(lesson);
    }
}
