package com.tutor_management.backend.modules.submission.service;

import com.tutor_management.backend.exception.ResourceNotFoundException;
import com.tutor_management.backend.modules.exercise.domain.Option;
import com.tutor_management.backend.modules.exercise.domain.Question;
import com.tutor_management.backend.modules.exercise.domain.QuestionType;
import com.tutor_management.backend.modules.exercise.repository.QuestionRepository;
import com.tutor_management.backend.modules.submission.domain.StudentAnswer;
import com.tutor_management.backend.modules.submission.domain.Submission;
import com.tutor_management.backend.modules.submission.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Implementation of AutoGradingService
 * Automatically grades MCQ questions by comparing student answers with correct answers
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AutoGradingServiceImpl implements AutoGradingService {
    
    private final SubmissionRepository submissionRepository;
    private final QuestionRepository questionRepository;
    
    @Override
    @Transactional
    public int gradeSubmission(String submissionId) {
        log.info("Auto-grading submission: {}", submissionId);
        
        // Fetch submission
        Submission submission = submissionRepository.findById(submissionId)
            .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id: " + submissionId));
        
        return gradeSubmission(submission);
    }

    @Transactional
    @Override
    public int gradeSubmission(Submission submission) {
        log.info("Auto-grading submission object: {}", submission.getId());

        // Fetch all questions for this exercise with details (JOIN FETCH) to avoid N+1
        List<Question> questions = questionRepository.findByExerciseIdWithDetails(submission.getExerciseId());
        
        // Build a map of questionId -> correct answer for MCQ questions
        Map<String, String> correctAnswers = new HashMap<>();
        Map<String, Integer> questionPoints = new HashMap<>();
        
        for (Question question : questions) {
            if (question.getType() == QuestionType.MCQ) {
                // Find the correct option
                if (question.getOptions() != null) {
                    for (Option option : question.getOptions()) {
                        if (option.getIsCorrect()) {
                            correctAnswers.put(question.getId(), option.getLabel());
                            questionPoints.put(question.getId(), question.getPoints());
                            break;
                        }
                    }
                }
            }
        }
        
        // Grade each MCQ answer
        int mcqScore = 0;
        
        for (StudentAnswer answer : submission.getAnswers()) {
            String questionId = answer.getQuestionId();
            
            // Only grade MCQ answers
            if (correctAnswers.containsKey(questionId)) {
                String correctAnswer = correctAnswers.get(questionId);
                String studentAnswer = answer.getSelectedOption();
                
                if (correctAnswer != null && correctAnswer.trim().equalsIgnoreCase(studentAnswer != null ? studentAnswer.trim() : "")) {
                    // Correct answer
                    answer.setIsCorrect(true);
                    int points = questionPoints.get(questionId);
                    answer.setPoints(points);
                    mcqScore += points;
                } else {
                    // Incorrect answer
                    answer.setIsCorrect(false);
                    answer.setPoints(0);
                }
            }
        }
        
        // Update submission MCQ score
        submission.setMcqScore(mcqScore);
        submission.calculateTotalScore();
        
        // Optimization: We don't save here if we're called from SubmissionServiceImpl's submit() 
        // to avoid redundant updates if submit() is going to save anyway.
        // However, for safety and backward compatibility, we save if the transaction is already active.
        submissionRepository.save(submission);
        
        log.info("Auto-grading completed. MCQ Score: {}", mcqScore);
        return mcqScore;
    }
}
