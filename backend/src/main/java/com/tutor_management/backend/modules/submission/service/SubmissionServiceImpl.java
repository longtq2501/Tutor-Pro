package com.tutor_management.backend.modules.submission.service;

import com.tutor_management.backend.exception.ResourceNotFoundException;
import com.tutor_management.backend.modules.exercise.domain.Question;
import com.tutor_management.backend.modules.exercise.domain.QuestionType;
import com.tutor_management.backend.modules.submission.domain.StudentAnswer;
import com.tutor_management.backend.modules.submission.domain.Submission;
import com.tutor_management.backend.modules.submission.domain.SubmissionStatus;
import com.tutor_management.backend.modules.submission.dto.request.AnswerRequest;
import com.tutor_management.backend.modules.submission.dto.request.CreateSubmissionRequest;
import com.tutor_management.backend.modules.submission.dto.request.EssayGradeRequest;
import com.tutor_management.backend.modules.submission.dto.request.GradeSubmissionRequest;
import com.tutor_management.backend.modules.submission.dto.response.StudentAnswerResponse;
import com.tutor_management.backend.modules.submission.dto.response.SubmissionListItemResponse;
import com.tutor_management.backend.modules.submission.dto.response.SubmissionResponse;
import com.tutor_management.backend.modules.submission.repository.SubmissionRepository;
import com.tutor_management.backend.modules.exercise.repository.ExerciseRepository;
import com.tutor_management.backend.modules.exercise.repository.QuestionRepository;
import com.tutor_management.backend.modules.exercise.domain.Exercise;
import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation of SubmissionService
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SubmissionServiceImpl implements SubmissionService {
    
    private final SubmissionRepository submissionRepository;
    private final AutoGradingService autoGradingService;
    private final UserRepository userRepository;
    private final ExerciseRepository exerciseRepository;
    private final QuestionRepository questionRepository;
    
    @Override
    @Transactional
    public SubmissionResponse saveDraft(CreateSubmissionRequest request, String studentId) {
        log.info("Saving draft for exercise: {} by student: {}", request.getExerciseId(), studentId);
        
        // Check if submission already exists
        Submission submission = submissionRepository
            .findByExerciseIdAndStudentId(request.getExerciseId(), studentId)
            .orElse(null);
        
        if (submission == null) {
            // Create new submission
            submission = Submission.builder()
                .id(UUID.randomUUID().toString())
                .exerciseId(request.getExerciseId())
                .studentId(studentId)
                .status(SubmissionStatus.DRAFT)
                .answers(new ArrayList<>())
                .build();
        } else {
            // Clear existing answers
            submission.getAnswers().clear();
        }
        
        // Add answers
        for (AnswerRequest answerReq : request.getAnswers()) {
            StudentAnswer answer = StudentAnswer.builder()
                .id(UUID.randomUUID().toString())
                .submission(submission)
                .questionId(answerReq.getQuestionId())
                .selectedOption(answerReq.getSelectedOption())
                .essayText(answerReq.getEssayText())
                .build();
            submission.addAnswer(answer);
        }
        
        Submission savedSubmission = saveDraftEntity(request, studentId);
        log.info("Draft saved successfully: {}", savedSubmission.getId());
        
        return mapToSubmissionResponse(savedSubmission);
    }

    /**
     * Internal version of saveDraft that returns the entity instead of DTO
     */
    private Submission saveDraftEntity(CreateSubmissionRequest request, String studentId) {
        log.info("Saving draft entity for exercise: {} by student: {}", request.getExerciseId(), studentId);
        
        // Check if submission already exists
        Submission submission = submissionRepository
            .findByExerciseIdAndStudentId(request.getExerciseId(), studentId)
            .orElse(null);
        
        if (submission == null) {
            // Create new submission
            submission = Submission.builder()
                .id(UUID.randomUUID().toString())
                .exerciseId(request.getExerciseId())
                .studentId(studentId)
                .status(SubmissionStatus.DRAFT)
                .answers(new ArrayList<>())
                .build();
        } else {
            // Clear existing answers
            submission.getAnswers().clear();
        }
        
        // Add answers
        for (AnswerRequest answerReq : request.getAnswers()) {
            StudentAnswer answer = StudentAnswer.builder()
                .id(UUID.randomUUID().toString())
                .submission(submission)
                .questionId(answerReq.getQuestionId())
                .selectedOption(answerReq.getSelectedOption())
                .essayText(answerReq.getEssayText())
                .build();
            submission.addAnswer(answer);
        }
        
        return submissionRepository.save(submission);
    }
    
    @Override
    @Transactional
    public SubmissionResponse submit(CreateSubmissionRequest request, String studentId) {
        log.info("Submitting exercise: {} by student: {}", request.getExerciseId(), studentId);
        
        // 1. Prepare the submission entity (in-memory update)
        Submission submission = saveDraftEntity(request, studentId);
        
        // 2. Update status and timestamp
        submission.setStatus(SubmissionStatus.SUBMITTED);
        submission.setSubmittedAt(LocalDateTime.now());
        
        // 3. Auto-grade MCQ questions using the in-memory submission object
        // AutoGradingService.gradeSubmission(submission) will update the submission fields
        autoGradingService.gradeSubmission(submission);
        
        // 4. Save once (this will perform batched updates for answers and 1 update for submission)
        Submission submittedSubmission = submissionRepository.save(submission);
        log.info("Submission completed: {}", submittedSubmission.getId());
        
        return mapToSubmissionResponse(submittedSubmission);
    }
    
    @Override
    @Transactional(readOnly = true)
    public SubmissionResponse getSubmission(String id) {
        log.info("Fetching submission: {}", id);
        
        // OPTIMIZATION: Fetch with answers eagerly for details view
        Submission submission = submissionRepository.findByIdWithAnswers(id)
            .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id: " + id));
        
        return mapToSubmissionResponse(submission);
    }
    
    @Override
    @Transactional(readOnly = true)
    public SubmissionResponse getSubmissionByExerciseAndStudent(String exerciseId, String studentId) {
        log.info("Fetching submission for exercise: {} and student: {}", exerciseId, studentId);
        
        Submission submission = submissionRepository
            .findByExerciseIdAndStudentId(exerciseId, studentId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Submission not found for exercise: " + exerciseId + " and student: " + studentId));
        
        return mapToSubmissionResponse(submission);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<SubmissionListItemResponse> listSubmissionsByExercise(String exerciseId) {
        log.info("Listing submissions for exercise: {}", exerciseId);
        
        List<Submission> submissions = submissionRepository.findByExerciseId(exerciseId);
        
        if (submissions.isEmpty()) {
            return List.of();
        }

        // OPTIMIZATION: Batch fetch users to avoid N+1
        List<Long> studentIds = submissions.stream()
            .filter(s -> s.getStudentId() != null)
            .map(s -> {
                try {
                     return Long.parseLong(s.getStudentId());
                } catch (NumberFormatException e) {
                    log.warn("Invalid student ID format: {}", s.getStudentId());
                    return null;
                }
            })
            .filter(java.util.Objects::nonNull)
            .distinct()
            .collect(Collectors.toList());

        Map<Long, User> userMap = userRepository.findAllById(studentIds).stream()
            .collect(Collectors.toMap(User::getId, u -> u, (u1, u2) -> u1));
        
        return submissions.stream()
            .map(s -> mapToListItemResponse(s, userMap))
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<SubmissionResponse> listSubmissionsByStudent(String studentId) {
        log.info("Listing submissions for student: {}", studentId);
        
        List<Submission> submissions = submissionRepository.findByStudentId(studentId);
        
        return submissions.stream()
            .map(this::mapToSubmissionResponse)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public SubmissionResponse gradeSubmission(String submissionId, GradeSubmissionRequest request) {
        log.info("Grading submission: {}", submissionId);
        
        // OPTIMIZATION: Fetch with answers eagerly to avoid N+1 during grading
        Submission submission = submissionRepository.findByIdWithAnswers(submissionId)
            .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id: " + submissionId));
        
        // Update pointed answers from request
        if (request.getEssayGrades() != null) {
            for (EssayGradeRequest gradeReq : request.getEssayGrades()) {
                StudentAnswer answer = submission.getAnswers().stream()
                    .filter(a -> a.getQuestionId().equals(gradeReq.getQuestionId()))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException(
                        "Answer not found for question: " + gradeReq.getQuestionId()));
                
                answer.setPoints(gradeReq.getPoints());
                answer.setFeedback(gradeReq.getFeedback());
            }
        }

        // Recalculate scores from all answers to ensure consistency
        List<Question> questions = questionRepository.findByExerciseIdOrderByOrderIndex(submission.getExerciseId());
        Map<String, QuestionType> questionTypes = questions.stream()
            .collect(Collectors.toMap(Question::getId, Question::getType));

        int mcqScore = 0;
        int essayScore = 0;

        for (StudentAnswer answer : submission.getAnswers()) {
            QuestionType type = questionTypes.get(answer.getQuestionId());
            if (type == QuestionType.MCQ) {
                mcqScore += (answer.getPoints() != null ? answer.getPoints() : 0);
            } else if (type == QuestionType.ESSAY) {
                essayScore += (answer.getPoints() != null ? answer.getPoints() : 0);
            }
        }
        
        submission.setMcqScore(mcqScore);
        submission.setEssayScore(essayScore);
        submission.setTeacherComment(request.getTeacherComment());
        submission.setStatus(SubmissionStatus.GRADED);
        submission.setGradedAt(LocalDateTime.now());
        
        // Final total score calculation and capping
        submission.calculateTotalScore();
        exerciseRepository.findById(submission.getExerciseId()).ifPresent(ex -> {
            if (submission.getTotalScore() > ex.getTotalPoints()) {
                log.warn("Submission {} total score ({}) exceeds exercise max points ({}), capping...", 
                        submissionId, submission.getTotalScore(), ex.getTotalPoints());
                submission.setTotalScore(ex.getTotalPoints());
            }
        });
        
        Submission gradedSubmission = submissionRepository.save(submission);
        log.info("Submission graded successfully. MCQ: {}, Essay: {}, Total: {}", 
                mcqScore, essayScore, gradedSubmission.getTotalScore());
        
        return mapToSubmissionResponse(gradedSubmission);
    }
    
    /**
     * Map Submission entity to SubmissionResponse DTO
     */
    private SubmissionResponse mapToSubmissionResponse(Submission submission) {
        List<StudentAnswerResponse> answerResponses = submission.getAnswers().stream()
            .map(this::mapToAnswerResponse)
            .collect(Collectors.toList());
        
        // OPTIMIZATION: Check if studentId is available and fetch name once
        String studentName = null;
        if (submission.getStudentId() != null) {
            try {
                // If this is a student making their own submission, we could potentially avoid this call 
                // if we had the user context, but for consistency we check the repo.
                // However, findById is usually fast/cached.
                studentName = userRepository.findById(Long.parseLong(submission.getStudentId()))
                    .map(User::getFullName)
                    .orElse("Unknown Student");
            } catch (NumberFormatException ignored) {}
        }

        return SubmissionResponse.builder()
            .id(submission.getId())
            .exerciseId(submission.getExerciseId())
            .studentId(submission.getStudentId())
            .studentName(studentName)
            .status(submission.getStatus())
            .mcqScore(submission.getMcqScore())
            .essayScore(submission.getEssayScore())
            .totalScore(submission.getTotalScore())
            .submittedAt(submission.getSubmittedAt())
            .gradedAt(submission.getGradedAt())
            .teacherComment(submission.getTeacherComment())
            .createdAt(submission.getCreatedAt())
            .updatedAt(submission.getUpdatedAt())
            .answers(answerResponses)
            .build();
    }
    
    /**
     * Map StudentAnswer entity to StudentAnswerResponse DTO
     */
    private StudentAnswerResponse mapToAnswerResponse(StudentAnswer answer) {
        return StudentAnswerResponse.builder()
            .id(answer.getId())
            .questionId(answer.getQuestionId())
            .selectedOption(answer.getSelectedOption())
            .essayText(answer.getEssayText())
            .isCorrect(answer.getIsCorrect())
            .points(answer.getPoints())
            .feedback(answer.getFeedback())
            .build();
    }
    
    /**
     * Map Submission entity to SubmissionListItemResponse DTO
     */
    private SubmissionListItemResponse mapToListItemResponse(Submission submission, Map<Long, User> userMap) {
        String studentName = "Unknown Student";
        if (submission.getStudentId() != null) {
            try {
                Long studentId = Long.parseLong(submission.getStudentId());
                User user = userMap.get(studentId);
                if (user != null) {
                    studentName = user.getFullName();
                }
            } catch (NumberFormatException ignored) {}
        }

        return SubmissionListItemResponse.builder()
            .id(submission.getId())
            .studentId(submission.getStudentId())
            .studentName(studentName)
            .status(submission.getStatus())
            .mcqScore(submission.getMcqScore())
            .essayScore(submission.getEssayScore())
            .totalScore(submission.getTotalScore())
            .submittedAt(submission.getSubmittedAt())
            .gradedAt(submission.getGradedAt())
            .build();
    }

    /**
     * Map Submission entity to SubmissionListItemResponse DTO (Legacy/Single use fallback)
     */
    private SubmissionListItemResponse mapToListItemResponse(Submission submission) {
         // Fallback to fetch single user if map not provided (though avoid usage in loops)
         String studentName = "Unknown Student";
         if (submission.getStudentId() != null) {
             studentName = userRepository.findById(Long.parseLong(submission.getStudentId()))
                     .map(User::getFullName)
                     .orElse("Unknown Student");
         }
         
         return SubmissionListItemResponse.builder()
             .id(submission.getId())
             .studentId(submission.getStudentId())
             .studentName(studentName)
             .status(submission.getStatus())
             .mcqScore(submission.getMcqScore())
             .essayScore(submission.getEssayScore())
             .totalScore(submission.getTotalScore())
             .submittedAt(submission.getSubmittedAt())
             .gradedAt(submission.getGradedAt())
             .build();
    }
}
