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
        
        Submission savedSubmission = submissionRepository.save(submission);
        log.info("Draft saved successfully: {}", savedSubmission.getId());
        
        return mapToSubmissionResponse(savedSubmission);
    }
    
    @Override
    @Transactional
    public SubmissionResponse submit(CreateSubmissionRequest request, String studentId) {
        log.info("Submitting exercise: {} by student: {}", request.getExerciseId(), studentId);
        
        // Save or update the submission first
        SubmissionResponse draftResponse = saveDraft(request, studentId);
        
        // Fetch the submission
        Submission submission = submissionRepository.findById(draftResponse.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));
        
        // Update status to SUBMITTED
        submission.setStatus(SubmissionStatus.SUBMITTED);
        submission.setSubmittedAt(LocalDateTime.now());
        
        // Auto-grade MCQ questions
        int mcqScore = autoGradingService.gradeSubmission(submission.getId());
        log.info("Auto-grading completed. MCQ Score: {}", mcqScore);
        
        Submission submittedSubmission = submissionRepository.save(submission);
        log.info("Submission completed: {}", submittedSubmission.getId());
        
        return mapToSubmissionResponse(submittedSubmission);
    }
    
    @Override
    @Transactional(readOnly = true)
    public SubmissionResponse getSubmission(String id) {
        log.info("Fetching submission: {}", id);
        
        Submission submission = submissionRepository.findById(id)
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
        
        return submissions.stream()
            .map(this::mapToListItemResponse)
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
        
        Submission submission = submissionRepository.findById(submissionId)
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
        
        return SubmissionResponse.builder()
            .id(submission.getId())
            .exerciseId(submission.getExerciseId())
            .studentId(submission.getStudentId())
            .studentName(submission.getStudentId() != null ? 
                userRepository.findById(Long.parseLong(submission.getStudentId()))
                    .map(User::getFullName)
                    .orElse("Unknown Student") : null)
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
    private SubmissionListItemResponse mapToListItemResponse(Submission submission) {
        return SubmissionListItemResponse.builder()
            .id(submission.getId())
            .studentId(submission.getStudentId())
            .studentName(submission.getStudentId() != null ? 
                userRepository.findById(Long.parseLong(submission.getStudentId()))
                    .map(User::getFullName)
                    .orElse("Unknown Student") : null)
            .status(submission.getStatus())
            .mcqScore(submission.getMcqScore())
            .essayScore(submission.getEssayScore())
            .totalScore(submission.getTotalScore())
            .submittedAt(submission.getSubmittedAt())
            .gradedAt(submission.getGradedAt())
            .build();
    }
}
