package com.tutor_management.backend.modules.submission.service;

import com.tutor_management.backend.modules.submission.dto.request.CreateSubmissionRequest;
import com.tutor_management.backend.modules.submission.dto.request.GradeSubmissionRequest;
import com.tutor_management.backend.modules.submission.dto.response.SubmissionListItemResponse;
import com.tutor_management.backend.modules.submission.dto.response.SubmissionResponse;

import java.util.List;

/**
 * Service interface for submission management
 */
public interface SubmissionService {
    
    /**
     * Create or update a draft submission
     */
    SubmissionResponse saveDraft(CreateSubmissionRequest request, String studentId);
    
    /**
     * Submit an exercise
     */
    SubmissionResponse submit(CreateSubmissionRequest request, String studentId);
    
    /**
     * Get submission by ID
     */
    SubmissionResponse getSubmission(String id);
    
    /**
     * Get submission by exercise and student
     */
    SubmissionResponse getSubmissionByExerciseAndStudent(String exerciseId, String studentId);
    
    /**
     * List submissions for an exercise
     */
    List<SubmissionListItemResponse> listSubmissionsByExercise(String exerciseId);
    
    /**
     * List submissions by student
     */
    List<SubmissionResponse> listSubmissionsByStudent(String studentId);
    
    /**
     * Grade essay questions in a submission
     */
    SubmissionResponse gradeSubmission(String submissionId, GradeSubmissionRequest request);
}
