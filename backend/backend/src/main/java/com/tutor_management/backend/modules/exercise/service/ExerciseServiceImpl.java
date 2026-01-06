package com.tutor_management.backend.modules.exercise.service;

import com.tutor_management.backend.exception.ResourceNotFoundException;
import com.tutor_management.backend.modules.exercise.domain.*;
import com.tutor_management.backend.modules.exercise.dto.request.CreateExerciseRequest;
import com.tutor_management.backend.modules.exercise.dto.request.ImportExerciseRequest;
import com.tutor_management.backend.modules.exercise.dto.request.OptionRequest;
import com.tutor_management.backend.modules.exercise.dto.request.QuestionRequest;
import com.tutor_management.backend.modules.exercise.dto.response.*;
import com.tutor_management.backend.modules.exercise.repository.ExerciseAssignmentRepository;
import com.tutor_management.backend.modules.exercise.repository.ExerciseRepository;
import com.tutor_management.backend.modules.exercise.repository.OptionRepository;
import com.tutor_management.backend.modules.exercise.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation of ExerciseService
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
    private final com.tutor_management.backend.modules.submission.repository.SubmissionRepository submissionRepository;

    @Override
    public ImportPreviewResponse previewImport(ImportExerciseRequest request) {
        log.info("Previewing import for content length: {}", request.getContent().length());
        return parserService.parseFromText(request.getContent());
    }

    @Override
    @Transactional
    public ExerciseResponse createExercise(CreateExerciseRequest request, String teacherId) {
        log.info("Creating exercise: {} by teacher: {}", request.getTitle(), teacherId);

        // Create exercise entity
        Exercise exercise = Exercise.builder()
                .id(UUID.randomUUID().toString())
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

        // Create questions
        for (QuestionRequest questionReq : request.getQuestions()) {
            Question question = createQuestionFromRequest(questionReq, exercise);
            exercise.addQuestion(question);
        }

        // Save exercise (cascade will save questions and options)
        Exercise savedExercise = exerciseRepository.save(exercise);

        log.info("Exercise created successfully with ID: {}", savedExercise.getId());
        return mapToExerciseResponse(savedExercise);
    }

    @Override
    @Transactional
    public ExerciseResponse updateExercise(String id, CreateExerciseRequest request, String teacherId) {
        log.info("Updating exercise: {} by teacher: {}", id, teacherId);

        // Find existing exercise
        // Find existing exercise - OPTIMIZATION: fetch details to properly handle collections
        Exercise exercise = exerciseRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found with id: " + id));

        // Verify ownership
        if (!exercise.getCreatedBy().equals(teacherId)) {
            throw new SecurityException("You don't have permission to update this exercise");
        }

        // Update basic fields
        exercise.setTitle(request.getTitle());
        exercise.setDescription(request.getDescription());
        exercise.setTimeLimit(request.getTimeLimit());
        exercise.setTotalPoints(request.getTotalPoints());
        exercise.setDeadline(request.getDeadline());
        if (request.getStatus() != null) {
            exercise.setStatus(request.getStatus());
        }
        exercise.setClassId(request.getClassId());

        // Remove old questions
        exercise.getQuestions().clear();

        // Add new questions
        for (QuestionRequest questionReq : request.getQuestions()) {
            Question question = createQuestionFromRequest(questionReq, exercise);
            exercise.addQuestion(question);
        }

        // Save updated exercise
        Exercise updatedExercise = exerciseRepository.save(exercise);

        log.info("Exercise updated successfully: {}", id);
        return mapToExerciseResponse(updatedExercise);
    }

    @Override
    @Transactional(readOnly = true)
    public ExerciseResponse getExercise(String id) {
        log.info("Fetching exercise: {}", id);

        // OPTIMIZATION: Fetch exercise with questions and options eagerly
        Exercise exercise = exerciseRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found with id: " + id));

        return mapToExerciseResponse(exercise);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExerciseListItemResponse> listExercises(String classId, ExerciseStatus status) {
        log.info("Listing exercises - classId: {}, status: {}", classId, status);

        if (classId != null && status != null) {
            return exerciseRepository.findByClassIdAndStatusOptimized(classId, status);
        } else if (classId != null) {
            return exerciseRepository.findByClassIdOptimized(classId);
        } else {
            return exerciseRepository.findAllOptimized();
        }
    }

    @Override
    @Transactional
    public void deleteExercise(String id, String teacherId) {
        log.info("Deleting exercise: {} by teacher: {}", id, teacherId);

        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found with id: " + id));

        // Verify ownership
        if (!exercise.getCreatedBy().equals(teacherId)) {
            throw new SecurityException("You don't have permission to delete this exercise");
        }

        // 1. Bulk delete Submissions and Answers
        submissionRepository.deleteAnswersByExerciseId(id);
        submissionRepository.deleteSubmissionsByExerciseId(id);

        // 2. Bulk delete Assignments
        assignmentRepository.deleteByExerciseId(id);

        // 3. Bulk delete Options and Questions
        optionRepository.deleteByExerciseId(id);
        questionRepository.deleteByExerciseId(id);

        // 4. Finally delete the Exercise itself
        exerciseRepository.delete(exercise);
        log.info("Exercise deleted successfully: {}", id);
    }

    @Override
    @Transactional
    public void assignToStudent(String exerciseId, String studentId, String tutorId, LocalDateTime deadline) {
        log.info("Assigning exercise {} to student {} by tutor {}", exerciseId, studentId, tutorId);
        
        Exercise assignmentExercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found"));

        ExerciseAssignment assignment = assignmentRepository
                .findByExerciseIdAndStudentId(exerciseId, studentId)
                .orElse(null);

        if (assignment == null) {
            assignment = ExerciseAssignment.builder()
                    .exerciseId(exerciseId)
                    .studentId(studentId)
                    .assignedBy(tutorId)
                    .deadline(deadline != null ? deadline : assignmentExercise.getDeadline())
                    .status(AssignmentStatus.ASSIGNED)
                    .build();
        } else {
            assignment.setDeadline(deadline != null ? deadline : assignmentExercise.getDeadline());
        }

        assignmentRepository.save(assignment);
        log.info("Exercise assigned successfully");
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExerciseListItemResponse> listAssignedExercises(String studentId) {
        log.info("Listing exercises for student {}", studentId);
        
        List<ExerciseAssignment> assignments = assignmentRepository.findByStudentId(studentId);
        List<String> exerciseIds = assignments.stream()
                .map(ExerciseAssignment::getExerciseId)
                .collect(Collectors.toList());

        if (exerciseIds.isEmpty()) {
            return List.of();
        }

        // OPTIMIZATION: Use optimized DTO query to avoid N+1 lazy loading
        List<ExerciseListItemResponse> exercises = exerciseRepository.findAllByIdOptimized(exerciseIds);
        
        // OPTIMIZATION: Fetch submissions ONLY for these exercises to avoid loading entire history
        var submissions = submissionRepository.findByStudentIdAndExerciseIdIn(studentId, exerciseIds);
        Map<String, com.tutor_management.backend.modules.submission.domain.Submission> submissionMap = submissions.stream()
                .collect(Collectors.toMap(com.tutor_management.backend.modules.submission.domain.Submission::getExerciseId, s -> s, (s1, s2) -> s1));

        // Create a map for quick lookup of deadlines
        var deadlineMap = assignments.stream()
                .collect(Collectors.toMap(ExerciseAssignment::getExerciseId, 
                        a -> a.getDeadline() != null ? a.getDeadline() : LocalDateTime.now()));

        return exercises.stream()
                .map(resp -> {
                    // Override exercise deadline with assignment deadline if available
                    if (deadlineMap.containsKey(resp.getId())) {
                        resp.setDeadline(deadlineMap.get(resp.getId()));
                    }
                    
                    // Attach submission info
                    if (submissionMap.containsKey(resp.getId())) {
                        var sub = submissionMap.get(resp.getId());
                        resp.setSubmissionId(sub.getId());
                        resp.setSubmissionStatus(sub.getStatus().name());
                        resp.setStudentTotalScore(sub.getTotalScore());
                    }
                    
                    return resp;
                })
                .collect(Collectors.toList());
    }

    /**
     * Create Question entity from request
     */
    private Question createQuestionFromRequest(QuestionRequest request, Exercise exercise) {
        Question question = Question.builder()
                .id(UUID.randomUUID().toString())
                .exercise(exercise)
                .type(request.getType())
                .questionText(request.getQuestionText())
                .points(request.getPoints())
                .orderIndex(request.getOrderIndex())
                .rubric(request.getRubric())
                .options(new LinkedHashSet<>())
                .build();

        // Add options for MCQ questions
        if (request.getType() == QuestionType.MCQ && request.getOptions() != null) {
            for (OptionRequest optionReq : request.getOptions()) {
                Option option = Option.builder()
                        .id(UUID.randomUUID().toString())
                        .question(question)
                        .label(optionReq.getLabel())
                        .optionText(optionReq.getOptionText())
                        .isCorrect(optionReq.getLabel().equals(request.getCorrectAnswer()))
                        .build();
                question.addOption(option);
            }
        }

        return question;
    }

    /**
     * Map Exercise entity to ExerciseResponse DTO
     */
    private ExerciseResponse mapToExerciseResponse(Exercise exercise) {
        List<QuestionResponse> questionResponses = exercise.getQuestions().stream()
                .map(this::mapToQuestionResponse)
                .collect(Collectors.toList());

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
                .questions(questionResponses)
                .build();
    }

    /**
     * Map Question entity to QuestionResponse DTO
     */
    private QuestionResponse mapToQuestionResponse(Question question) {
        List<OptionResponse> optionResponses = null;

        if (question.getType() == QuestionType.MCQ && question.getOptions() != null) {
            optionResponses = question.getOptions().stream()
                    .map(this::mapToOptionResponse)
                    .collect(Collectors.toList());
        }

        return QuestionResponse.builder()
                .id(question.getId())
                .type(question.getType())
                .questionText(question.getQuestionText())
                .points(question.getPoints())
                .orderIndex(question.getOrderIndex())
                .rubric(question.getRubric())
                .options(optionResponses)
                .build();
    }

    /**
     * Map Option entity to OptionResponse DTO
     */
    private OptionResponse mapToOptionResponse(Option option) {
        return OptionResponse.builder()
                .id(option.getId())
                .label(option.getLabel())
                .optionText(option.getOptionText())
                .isCorrect(option.getIsCorrect())
                .build();
    }

    /**
     * Map Exercise entity to ExerciseListItemResponse DTO
     */
    private ExerciseListItemResponse mapToListItemResponse(Exercise exercise) {
        return ExerciseListItemResponse.builder()
                .id(exercise.getId())
                .title(exercise.getTitle())
                .description(exercise.getDescription())
                .totalPoints(exercise.getTotalPoints())
                .timeLimit(exercise.getTimeLimit())
                .deadline(exercise.getDeadline())
                .status(exercise.getStatus())
                .questionCount(exercise.getQuestions() != null ? exercise.getQuestions().size() : 0)
                .submissionCount(0) // TODO: Will be populated when submission module is implemented
                .createdAt(exercise.getCreatedAt())
                .build();
    }
}
