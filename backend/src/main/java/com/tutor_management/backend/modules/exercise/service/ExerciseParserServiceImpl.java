package com.tutor_management.backend.modules.exercise.service;

import com.tutor_management.backend.modules.exercise.domain.QuestionType;
import com.tutor_management.backend.modules.exercise.dto.response.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Implementation of ExerciseParserService
 * Parses structured text format into exercise data
 */
@Service
@Slf4j
public class ExerciseParserServiceImpl implements ExerciseParserService {
    
    // Regex patterns for parsing
    private static final Pattern METADATA_SECTION_PATTERN = 
        Pattern.compile("===\\s*THÔNG TIN BÀI TẬP\\s*===(.*?)(?====|$)", Pattern.DOTALL);
    
    private static final Pattern MCQ_SECTION_PATTERN = 
        Pattern.compile("===\\s*PHẦN 1:\\s*TRẮC NGHIỆM\\s*===(.*?)(?====|$)", Pattern.DOTALL);
    
    private static final Pattern ESSAY_SECTION_PATTERN = 
        Pattern.compile("===\\s*PHẦN 2:\\s*TỰ LUẬN\\s*===(.*?)$", Pattern.DOTALL);
    
    private static final Pattern TITLE_PATTERN = 
        Pattern.compile("Tiêu đề:\\s*(.+?)(?=Mô tả:|Thời gian:|Tổng điểm:|===|$)", Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
    
    private static final Pattern DESCRIPTION_PATTERN = 
        Pattern.compile("Mô tả:\\s*(.+?)(?=Thời gian:|Tổng điểm:|===|$)", Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
    
    private static final Pattern TIME_LIMIT_PATTERN = 
        Pattern.compile("Thời gian:\\s*(\\d+)", Pattern.CASE_INSENSITIVE);
    
    private static final Pattern TOTAL_POINTS_PATTERN = 
        Pattern.compile("Tổng điểm:\\s*(\\d+)", Pattern.CASE_INSENSITIVE);
    
    private static final Pattern MCQ_QUESTION_PATTERN = 
        Pattern.compile("\\[MCQ-(\\d+)\\]\\s*(.+?)(?=A\\.)", Pattern.DOTALL);
    
    private static final Pattern OPTION_PATTERN = 
        Pattern.compile("([A-D])\\.\\s*(.+?)(?=[A-D]\\.|ANSWER:|POINTS:|\\[|$)", Pattern.DOTALL);
    
    private static final Pattern ANSWER_PATTERN = 
        Pattern.compile("ANSWER:\\s*([A-D])", Pattern.CASE_INSENSITIVE);
    
    private static final Pattern POINTS_PATTERN = 
        Pattern.compile("POINTS:\\s*(\\d+)", Pattern.CASE_INSENSITIVE);
    
    private static final Pattern ESSAY_QUESTION_PATTERN = 
        Pattern.compile("\\[ESSAY-(\\d+)\\]\\s*(.+?)(?=POINTS:)", Pattern.DOTALL);
    
    private static final Pattern RUBRIC_PATTERN = 
        Pattern.compile("RUBRIC:\\s*(.+?)(?=\\[|$)", Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
    
    @Override
    public ImportPreviewResponse parseFromText(String content) {
        log.info("Starting to parse exercise content");
        
        List<String> validationErrors = new ArrayList<>();
        ImportPreviewResponse response = ImportPreviewResponse.builder()
            .validationErrors(validationErrors)
            .build();
        
        try {
            // 1. Extract and parse metadata
            ExerciseMetadata metadata = extractMetadata(content, validationErrors);
            response.setMetadata(metadata);
            
            // 2. Extract and parse MCQ questions
            List<QuestionPreview> questions = new ArrayList<>();
            int orderIndex = 0;
            
            String mcqSection = extractSection(content, MCQ_SECTION_PATTERN);
            if (StringUtils.hasText(mcqSection)) {
                List<QuestionPreview> mcqQuestions = parseMCQQuestions(mcqSection, orderIndex, validationErrors);
                questions.addAll(mcqQuestions);
                orderIndex += mcqQuestions.size();
            }
            
            // 3. Extract and parse Essay questions
            String essaySection = extractSection(content, ESSAY_SECTION_PATTERN);
            if (StringUtils.hasText(essaySection)) {
                List<QuestionPreview> essayQuestions = parseEssayQuestions(essaySection, orderIndex, validationErrors);
                questions.addAll(essayQuestions);
            }
            
            response.setQuestions(questions);
            
            // 4. Validate overall structure
            validateExercise(metadata, questions, validationErrors);
            
            // 5. Set validity flag
            response.setIsValid(validationErrors.isEmpty());
            
            log.info("Parsing completed. Valid: {}, Errors: {}", response.getIsValid(), validationErrors.size());
            
        } catch (Exception e) {
            log.error("Error parsing exercise content", e);
            validationErrors.add("Unexpected error during parsing: " + e.getMessage());
            response.setIsValid(false);
        }
        
        return response;
    }
    
    /**
     * Extract metadata section from content
     */
    private ExerciseMetadata extractMetadata(String content, List<String> errors) {
        String metadataSection = extractSection(content, METADATA_SECTION_PATTERN);
        
        if (!StringUtils.hasText(metadataSection)) {
            errors.add("Metadata section (=== THÔNG TIN BÀI TẬP ===) not found");
            return ExerciseMetadata.builder().build();
        }
        
        String title = extractField(metadataSection, TITLE_PATTERN);
        String description = extractField(metadataSection, DESCRIPTION_PATTERN);
        Integer timeLimit = extractIntField(metadataSection, TIME_LIMIT_PATTERN);
        Integer totalPoints = extractIntField(metadataSection, TOTAL_POINTS_PATTERN);
        
        // Validate required fields
        if (!StringUtils.hasText(title)) {
            errors.add("Title (Tiêu đề) is required in metadata section");
        }
        if (totalPoints == null || totalPoints <= 0) {
            errors.add("Total points (Tổng điểm) must be a positive number");
        }
        
        return ExerciseMetadata.builder()
            .title(title)
            .description(description)
            .timeLimit(timeLimit)
            .totalPoints(totalPoints)
            .build();
    }
    
    /**
     * Parse MCQ questions from section
     */
    private List<QuestionPreview> parseMCQQuestions(String section, int startIndex, List<String> errors) {
        List<QuestionPreview> questions = new ArrayList<>();
        
        // Split by [MCQ-X] markers
        String[] questionBlocks = section.split("(?=\\[MCQ-\\d+\\])");
        
        for (String block : questionBlocks) {
            if (!block.trim().isEmpty() && block.contains("[MCQ-")) {
                QuestionPreview question = parseSingleMCQ(block, startIndex + questions.size(), errors);
                if (question != null) {
                    questions.add(question);
                }
            }
        }
        
        return questions;
    }
    
    /**
     * Parse a single MCQ question
     */
    private QuestionPreview parseSingleMCQ(String block, int orderIndex, List<String> errors) {
        // Extract question number and text
        Matcher questionMatcher = MCQ_QUESTION_PATTERN.matcher(block);
        if (!questionMatcher.find()) {
            errors.add("Invalid MCQ format at position " + orderIndex);
            return null;
        }
        
        String questionNumber = questionMatcher.group(1);
        String questionText = questionMatcher.group(2).trim();
        
        // Extract options
        List<OptionPreview> options = new ArrayList<>();
        Matcher optionMatcher = OPTION_PATTERN.matcher(block);
        
        while (optionMatcher.find()) {
            String label = optionMatcher.group(1);
            String optionText = optionMatcher.group(2).trim();
            
            options.add(OptionPreview.builder()
                .label(label)
                .optionText(optionText)
                .isCorrect(false) // Will be set based on ANSWER
                .build());
        }
        
        // Extract correct answer
        String correctAnswer = extractField(block, ANSWER_PATTERN);
        if (!StringUtils.hasText(correctAnswer)) {
            errors.add("MCQ-" + questionNumber + ": Missing ANSWER field");
        } else {
            // Mark correct option
            boolean foundCorrect = false;
            for (OptionPreview option : options) {
                if (option.getLabel().equals(correctAnswer)) {
                    option.setIsCorrect(true);
                    foundCorrect = true;
                    break;
                }
            }
            if (!foundCorrect) {
                errors.add("MCQ-" + questionNumber + ": Correct answer " + correctAnswer + " not found in options");
            }
        }
        
        // Extract points
        Integer points = extractIntField(block, POINTS_PATTERN);
        if (points == null || points <= 0) {
            errors.add("MCQ-" + questionNumber + ": Points must be a positive number");
            points = 0;
        }
        
        // Validate options count
        if (options.size() != 4) {
            errors.add("MCQ-" + questionNumber + ": Must have exactly 4 options (A, B, C, D), found " + options.size());
        }
        
        return QuestionPreview.builder()
            .type(QuestionType.MCQ)
            .questionText(questionText)
            .points(points)
            .orderIndex(orderIndex)
            .options(options)
            .correctAnswer(correctAnswer)
            .build();
    }
    
    /**
     * Parse Essay questions from section
     */
    private List<QuestionPreview> parseEssayQuestions(String section, int startIndex, List<String> errors) {
        List<QuestionPreview> questions = new ArrayList<>();
        
        // Split by [ESSAY-X] markers
        String[] questionBlocks = section.split("(?=\\[ESSAY-\\d+\\])");
        
        for (String block : questionBlocks) {
            if (!block.trim().isEmpty() && block.contains("[ESSAY-")) {
                QuestionPreview question = parseSingleEssay(block, startIndex + questions.size(), errors);
                if (question != null) {
                    questions.add(question);
                }
            }
        }
        
        return questions;
    }
    
    /**
     * Parse a single Essay question
     */
    private QuestionPreview parseSingleEssay(String block, int orderIndex, List<String> errors) {
        // Extract question number and text
        Matcher questionMatcher = ESSAY_QUESTION_PATTERN.matcher(block);
        if (!questionMatcher.find()) {
            errors.add("Invalid ESSAY format at position " + orderIndex);
            return null;
        }
        
        String questionNumber = questionMatcher.group(1);
        String questionText = questionMatcher.group(2).trim();
        
        // Extract points
        Integer points = extractIntField(block, POINTS_PATTERN);
        if (points == null || points <= 0) {
            errors.add("ESSAY-" + questionNumber + ": Points must be a positive number");
            points = 0;
        }
        
        // Extract rubric (optional)
        String rubric = extractField(block, RUBRIC_PATTERN);
        if (StringUtils.hasText(rubric)) {
            rubric = rubric.trim();
        }
        
        return QuestionPreview.builder()
            .type(QuestionType.ESSAY)
            .questionText(questionText)
            .points(points)
            .orderIndex(orderIndex)
            .rubric(rubric)
            .build();
    }
    
    /**
     * Validate the complete exercise
     */
    private void validateExercise(ExerciseMetadata metadata, List<QuestionPreview> questions, List<String> errors) {
        // Check if there's at least one question
        if (questions.isEmpty()) {
            errors.add("Exercise must have at least one question");
            return;
        }
        
        // Calculate total points from questions
        int calculatedTotal = questions.stream()
            .mapToInt(q -> q.getPoints() != null ? q.getPoints() : 0)
            .sum();
        
        // Verify total points match
        if (metadata.getTotalPoints() != null && calculatedTotal != metadata.getTotalPoints()) {
            errors.add("Total points mismatch: metadata says " + metadata.getTotalPoints() + 
                      " but sum of question points is " + calculatedTotal);
        }
    }
    
    /**
     * Extract a section using pattern
     */
    private String extractSection(String content, Pattern pattern) {
        Matcher matcher = pattern.matcher(content);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }
    
    /**
     * Extract a text field using pattern
     */
    private String extractField(String content, Pattern pattern) {
        Matcher matcher = pattern.matcher(content);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return null;
    }
    
    /**
     * Extract an integer field using pattern
     */
    private Integer extractIntField(String content, Pattern pattern) {
        String value = extractField(content, pattern);
        if (StringUtils.hasText(value)) {
            try {
                return Integer.parseInt(value);
            } catch (NumberFormatException e) {
                log.warn("Failed to parse integer from: {}", value);
            }
        }
        return null;
    }
}
