package com.tutor_management.backend.modules.exercise.service;

import com.tutor_management.backend.exception.ResourceNotFoundException;
import com.tutor_management.backend.modules.auth.UserRepository;
import com.tutor_management.backend.modules.exercise.domain.*;
import com.tutor_management.backend.modules.exercise.dto.request.CreateExerciseRequest;
import com.tutor_management.backend.modules.exercise.dto.request.ImportExerciseRequest;
import com.tutor_management.backend.modules.exercise.dto.request.OptionRequest;
import com.tutor_management.backend.modules.exercise.dto.request.QuestionRequest;
import com.tutor_management.backend.modules.exercise.dto.response.ExerciseListItemResponse;
import com.tutor_management.backend.modules.exercise.dto.response.ExerciseResponse;
import com.tutor_management.backend.modules.exercise.dto.response.ImportPreviewResponse;
import com.tutor_management.backend.modules.exercise.dto.response.OptionResponse;
import com.tutor_management.backend.modules.exercise.dto.response.QuestionResponse;
import com.tutor_management.backend.modules.exercise.dto.response.TutorStudentSummaryResponse;
import com.tutor_management.backend.modules.exercise.repository.ExerciseAssignmentRepository;
import com.tutor_management.backend.modules.exercise.repository.ExerciseRepository;
import com.tutor_management.backend.modules.exercise.repository.OptionRepository;
import com.tutor_management.backend.modules.exercise.repository.QuestionRepository;
import com.tutor_management.backend.modules.student.StudentRepository;
import com.tutor_management.backend.modules.notification.event.ExerciseAssignedEvent;
import com.tutor_management.backend.modules.notification.event.ExerciseUpdatedEvent;
import com.tutor_management.backend.modules.submission.domain.Submission;
import com.tutor_management.backend.modules.submission.domain.SubmissionStatus;
import com.tutor_management.backend.modules.submission.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Standard implementation of {@link ExerciseService}.
 * Handles persistence, complex nested entity updates, and transactional safety.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ExerciseServiceImpl implements ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final QuestionRepository questionRepository;
    private final OptionRepository optionRepository;
    private final ExerciseParserService parserService;
    private final ExerciseAssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public ImportPreviewResponse previewImport(ImportExerciseRequest request) {
        log.info("Requesting preview for ingested text (length: {})", request.getContent().length());
        return parserService.parseFromText(request.getContent());
    }

    @Override
    @Transactional
    public ExerciseResponse createExercise(CreateExerciseRequest request, String teacherId) {
        log.info("Starting creation of exercise '{}' by teacher {}", request.getTitle(), teacherId);
        log.info("Received {} questions in request", request.getQuestions() != null ? request.getQuestions().size() : 0);

        Exercise exercise = Exercise.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .timeLimit(request.getTimeLimit())
                .totalPoints(request.getTotalPoints())
                .deadline(request.getDeadline())
                .status(request.getStatus() != null ? request.getStatus() : ExerciseStatus.DRAFT)
                .classId(request.getClassId())
                .createdBy(teacherId)
                .questions(new LinkedHashSet<>())
                .build();

        processQuestionsFromRequest(request.getQuestions(), exercise);
        log.info("After processing, exercise has {} questions", exercise.getQuestions().size());

        Exercise savedExercise = exerciseRepository.save(exercise);
        log.info("Exercise created successfully. Generated UUID: {}, Final question count: {}", savedExercise.getId(), savedExercise.getQuestions().size());
        
        return mapToExerciseResponse(savedExercise);
    }

    @Override
    @Transactional
    public ExerciseResponse updateExercise(String id, CreateExerciseRequest request, String teacherId) {
        log.info("Processing update for exercise {} by teacher {}", id, teacherId);

        Exercise exercise = exerciseRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài tập với ID: " + id));

        verifyExerciseOwnership(exercise, teacherId);

        updateBasicMetadata(exercise, request);

        // Reconstruct the question graph
        exercise.getQuestions().clear();
        processQuestionsFromRequest(request.getQuestions(), exercise);

        Exercise updatedExercise = exerciseRepository.save(exercise);
        notifyStudentsOfUpdate(updatedExercise, teacherId);

        log.info("Exercise update committed: {}", id);
        return mapToExerciseResponse(updatedExercise);
    }

    @Override
    @Transactional(readOnly = true)
    public ExerciseResponse getExercise(String id) {
        log.debug("Fetching exercise details for ID: {}", id);
        
        Exercise exercise = exerciseRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài tập với ID: " + id));

        return mapToExerciseResponse(exercise);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ExerciseListItemResponse> listExercises(String classId, ExerciseStatus status, String search, Pageable pageable) {
        log.debug("Listing exercises (Filter: class={}, status={}, search={}, page={})", classId, status, search, pageable.getPageNumber());
        return exerciseRepository.findByFiltersOptimized(classId, status, search, pageable);
    }

    @Override
    @Transactional
    public void deleteExercise(String id, String teacherId) {
        log.warn("Initiating destructive deletion of exercise {} by tutor {}", id, teacherId);

        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài tập với ID: " + id));

        verifyExerciseOwnership(exercise, teacherId);

        performCascadedRemoval(id);
        
        exerciseRepository.delete(exercise);
        log.info("Exercise and all associated history successfully deleted: {}", id);
    }

    @Override
    @Transactional
    public void assignToStudent(String exerciseId, String studentId, String tutorId, LocalDateTime deadline) {
        log.info("Assigning exercise {} to student {}", exerciseId, studentId);
        
        Exercise sourceExercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài tập gốc"));

        ExerciseAssignment assignment = assignmentRepository
                .findByExerciseIdAndStudentId(exerciseId, studentId)
                .orElseGet(() -> ExerciseAssignment.builder()
                        .exerciseId(exerciseId)
                        .studentId(studentId)
                        .assignedBy(tutorId)
                        .status(AssignmentStatus.PENDING)
                        .build());

        // Update or set the specific deadline for this student
        assignment.setDeadline(deadline != null ? deadline : sourceExercise.getDeadline());
        
        assignmentRepository.save(assignment);
        
        // Ensure a submission record exists with PENDING status
        submissionRepository.findByExerciseIdAndStudentId(exerciseId, studentId)
                .orElseGet(() -> submissionRepository.save(Submission.builder()
                        .exerciseId(exerciseId)
                        .studentId(studentId)
                        .status(SubmissionStatus.PENDING)
                        .build()));

        notifyStudentOfAssignment(sourceExercise, studentId, tutorId);
        
        log.info("Assignment record and pending submission committed for student {}", studentId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ExerciseListItemResponse> listAssignedExercises(String studentId, Pageable pageable) {
        log.debug("Synthesizing assigned exercises view for student {} (page: {})", studentId, pageable.getPageNumber());
        
        Page<ExerciseAssignment> assignmentsPage = assignmentRepository.findByStudentId(studentId, pageable);
        if (assignmentsPage.isEmpty()) return Page.empty();

        List<ExerciseAssignment> assignments = assignmentsPage.getContent();
        List<String> exerciseIds = assignments.stream()
                .map(ExerciseAssignment::getExerciseId)
                .collect(Collectors.toList());

        List<ExerciseListItemResponse> responses = exerciseRepository.findAllByIdOptimized(exerciseIds);
        
        // Match order of assignmentsPage
        Map<String, ExerciseListItemResponse> respMap = responses.stream()
                .collect(Collectors.toMap(ExerciseListItemResponse::getId, r -> r));
        
        List<ExerciseListItemResponse> orderedResponses = assignments.stream()
                .map(a -> respMap.get(a.getExerciseId()))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        enrichWithStudentProgress(orderedResponses, studentId, assignments);

        return new PageImpl<>(orderedResponses, pageable, assignmentsPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TutorStudentSummaryResponse> getStudentSummaries(Pageable pageable) {
        log.info("Aggregating student performance summaries for tutor dashboard (page: {})", pageable.getPageNumber());
        
        var studentsPage = studentRepository.findByActiveTrueWithParent(pageable);
        if (studentsPage.isEmpty()) return Page.empty();

        List<String> studentIds = studentsPage.getContent().stream()
                .map(s -> s.getId().toString())
                .collect(Collectors.toList());

        var rawStats = submissionRepository.countByStudentIdInAndStatus(studentIds);
        
        // Map stats by studentId
        Map<String, Map<SubmissionStatus, Integer>> statsMap = new HashMap<>();
        for (Object[] row : rawStats) {
            String studentId = (String) row[0];
            SubmissionStatus status = (SubmissionStatus) row[1];
            Integer count = ((Long) row[2]).intValue();
            
            statsMap.computeIfAbsent(studentId, k -> new HashMap<>()).put(status, count);
        }
        
        List<TutorStudentSummaryResponse> content = studentsPage.getContent().stream().map(student -> {
            String sId = student.getId().toString();
            var counts = statsMap.getOrDefault(sId, Collections.emptyMap());
            
            int pending = counts.getOrDefault(SubmissionStatus.PENDING, 0);
            int submitted = counts.getOrDefault(SubmissionStatus.SUBMITTED, 0) + 
                            counts.getOrDefault(SubmissionStatus.DRAFT, 0);
            int graded = counts.getOrDefault(SubmissionStatus.GRADED, 0);
            int total = pending + submitted + graded;
            
            return TutorStudentSummaryResponse.builder()
                    .studentId(sId)
                    .studentName(student.getName())
                    .grade("N/A") 
                    .pendingCount(pending)
                    .submittedCount(submitted)
                    .gradedCount(graded)
                    .totalAssigned(total)
                    .build();
        }).collect(Collectors.toList());

        return new PageImpl<>(content, pageable, studentsPage.getTotalElements());
    }

    // --- Private Business Helpers ---

    private void verifyExerciseOwnership(Exercise exercise, String teacherId) {
        if (!exercise.getCreatedBy().equals(teacherId)) {
            log.error("Security violation: Teacher {} attempted to modify exercise owned by {}", teacherId, exercise.getCreatedBy());
            throw new SecurityException("Bạn không có quyền thực hiện thao tác này trên bài tập này");
        }
    }

    private void updateBasicMetadata(Exercise exercise, CreateExerciseRequest request) {
        exercise.setTitle(request.getTitle());
        exercise.setDescription(request.getDescription());
        exercise.setTimeLimit(request.getTimeLimit());
        exercise.setTotalPoints(request.getTotalPoints());
        exercise.setDeadline(request.getDeadline());
        exercise.setClassId(request.getClassId());
        if (request.getStatus() != null) {
            exercise.setStatus(request.getStatus());
        }
    }

    private void processQuestionsFromRequest(List<QuestionRequest> questionRequests, Exercise exercise) {
        if (questionRequests == null) {
            log.warn("Question requests list is null");
            return;
        }
        
        log.info("Processing {} question requests", questionRequests.size());
        
        for (QuestionRequest qReq : questionRequests) {
            log.debug("Processing question at index {}: type={}, text={}", qReq.getOrderIndex(), qReq.getType(), qReq.getQuestionText().substring(0, Math.min(50, qReq.getQuestionText().length())));
            
            Question question = Question.builder()
                    .exercise(exercise)
                    .type(qReq.getType())
                    .questionText(qReq.getQuestionText())
                    .points(qReq.getPoints())
                    .orderIndex(qReq.getOrderIndex())
                    .rubric(qReq.getRubric())
                    .options(new LinkedHashSet<>())
                    .build();

            if (qReq.getType() == QuestionType.MCQ && qReq.getOptions() != null) {
                processOptionsForQuestion(qReq, question);
            }
            
            exercise.addQuestion(question);
        }
        
        log.info("Finished processing questions. Total added to exercise: {}", exercise.getQuestions().size());
    }

    private void processOptionsForQuestion(QuestionRequest qReq, Question question) {
        for (OptionRequest oReq : qReq.getOptions()) {
            Option option = Option.builder()
                    .question(question)
                    .label(oReq.getLabel())
                    .optionText(oReq.getOptionText())
                    .isCorrect(oReq.getLabel().equals(qReq.getCorrectAnswer()))
                    .build();
            question.addOption(option);
        }
    }

    private void performCascadedRemoval(String exerciseId) {
        // Clear student interaction data
        submissionRepository.deleteAnswersByExerciseId(exerciseId);
        submissionRepository.deleteSubmissionsByExerciseId(exerciseId);
        assignmentRepository.deleteByExerciseId(exerciseId);

        // Clear resource structure
        optionRepository.deleteByExerciseId(exerciseId);
        questionRepository.deleteByExerciseId(exerciseId);
    }

    private void enrichWithStudentProgress(List<ExerciseListItemResponse> responses, String studentId, List<ExerciseAssignment> assignments) {
        List<String> ids = responses.stream().map(ExerciseListItemResponse::getId).collect(Collectors.toList());
        
        var submissions = submissionRepository.findByStudentIdAndExerciseIdIn(studentId, ids);
        log.info("Enriching {} exercises for student {}. Found {} submissions in DB.", responses.size(), studentId, submissions.size());

        var subMap = submissions.stream()
                .collect(Collectors.toMap(com.tutor_management.backend.modules.submission.domain.Submission::getExerciseId, s -> s, (s1, s2) -> s1));

        var deadlineMap = assignments.stream()
                .collect(Collectors.toMap(ExerciseAssignment::getExerciseId, 
                        a -> a.getDeadline() != null ? a.getDeadline() : LocalDateTime.now(), (d1, d2) -> d1));

        responses.forEach(resp -> {
            resp.setDeadline(deadlineMap.get(resp.getId()));
            
            var sub = subMap.get(resp.getId());
            if (sub != null) {
                log.info("Matched submission {} (status: {}) for exercise {}", sub.getId(), sub.getStatus(), resp.getId());
                resp.setSubmissionId(sub.getId());
                
                // Add Overdue logic
                String internalStatus = sub.getStatus().name();
                if (sub.getStatus() == SubmissionStatus.PENDING && resp.getDeadline() != null && resp.getDeadline().isBefore(LocalDateTime.now())) {
                    internalStatus = "OVERDUE";
                }
                
                resp.setSubmissionStatus(internalStatus);
                resp.setStudentTotalScore(sub.getTotalScore());
            } else {
                log.info("No matching submission found for exercise {}. Defaulting to PENDING.", resp.getId());
                resp.setSubmissionStatus("PENDING");
            }
        });
    }

    // --- Events & Notifications ---

    private void notifyStudentsOfUpdate(Exercise exercise, String teacherId) {
        try {
            String tutorName = fetchTeacherName(teacherId);
            eventPublisher.publishEvent(ExerciseUpdatedEvent.builder()
                    .exerciseId(exercise.getId())
                    .exerciseTitle(exercise.getTitle())
                    .tutorName(tutorName)
                    .build());
        } catch (Exception e) {
            log.error("Critical error while dispatching exercise update notification", e);
        }
    }

    private void notifyStudentOfAssignment(Exercise exercise, String studentId, String tutorId) {
        try {
            String tutorName = fetchTeacherName(tutorId);
            eventPublisher.publishEvent(ExerciseAssignedEvent.builder()
                    .exerciseId(exercise.getId())
                    .exerciseTitle(exercise.getTitle())
                    .studentId(studentId)
                    .tutorName(tutorName)
                    .build());
        } catch (Exception e) {
            log.error("Critical error while dispatching exercise assignment notification", e);
        }
    }

    private String fetchTeacherName(String teacherId) {
        try {
            return userRepository.findById(Long.parseLong(teacherId))
                    .map(u -> u.getFullName())
                    .orElse("Giáo viên");
        } catch (Exception e) {
            return "Giáo viên";
        }
    }

    // --- Standard Domain Mappers ---

    private ExerciseResponse mapToExerciseResponse(Exercise exercise) {
        return ExerciseResponse.builder()
                .id(exercise.getId())
                .title(exercise.getTitle())
                .description(exercise.getDescription())
                .timeLimit(exercise.getTimeLimit())
                .totalPoints(exercise.getTotalPoints())
                .deadline(exercise.getDeadline())
                .status(exercise.getStatus())
                .classId(exercise.getClassId())
                .createdBy(exercise.getCreatedBy())
                .createdAt(exercise.getCreatedAt())
                .updatedAt(exercise.getUpdatedAt())
                .questions(exercise.getQuestions().stream().map(this::mapToQuestionResponse).collect(Collectors.toList()))
                .build();
    }

    private QuestionResponse mapToQuestionResponse(Question question) {
        return QuestionResponse.builder()
                .id(question.getId())
                .type(question.getType())
                .questionText(question.getQuestionText())
                .points(question.getPoints())
                .orderIndex(question.getOrderIndex())
                .rubric(question.getRubric())
                .options(question.getOptions().stream().map(this::mapToOptionResponse).collect(Collectors.toList()))
                .build();
    }

    private OptionResponse mapToOptionResponse(Option option) {
        return OptionResponse.builder()
                .id(option.getId())
                .label(option.getLabel())
                .optionText(option.getOptionText())
                .isCorrect(option.getIsCorrect())
                .build();
    }
}
