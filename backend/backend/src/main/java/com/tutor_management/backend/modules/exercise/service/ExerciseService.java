package com.tutor_management.backend.modules.exercise.service;

import com.tutor_management.backend.modules.exercise.domain.ExerciseStatus;
import com.tutor_management.backend.modules.exercise.dto.request.CreateExerciseRequest;
import com.tutor_management.backend.modules.exercise.dto.request.ImportExerciseRequest;
import com.tutor_management.backend.modules.exercise.dto.response.ExerciseListItemResponse;
import com.tutor_management.backend.modules.exercise.dto.response.ExerciseResponse;
import com.tutor_management.backend.modules.exercise.dto.response.ImportPreviewResponse;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service interface for exercise management
 */
public interface ExerciseService {
    
    /**
     * Preview import from text content
     */
    ImportPreviewResponse previewImport(ImportExerciseRequest request);
    
    /**
     * Create a new exercise
     */
    ExerciseResponse createExercise(CreateExerciseRequest request, String teacherId);
    
    /**
     * Update an existing exercise
     */
    ExerciseResponse updateExercise(String id, CreateExerciseRequest request, String teacherId);
    
    /**
     * Get exercise by ID
     */
    ExerciseResponse getExercise(String id);
    
    /**
     * List exercises with optional filters
     */
    List<ExerciseListItemResponse> listExercises(String classId, ExerciseStatus status);
    
    /**
     * Delete an exercise
     */
    void deleteExercise(String id, String teacherId);

    /**
     * Assign exercise to a specific student
     */
    void assignToStudent(String exerciseId, String studentId, String tutorId, LocalDateTime deadline);

    /**
     * List exercises assigned to a specific student
     */
    List<ExerciseListItemResponse> listAssignedExercises(String studentId);
}
