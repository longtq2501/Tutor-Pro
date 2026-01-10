package com.tutor_management.backend.modules.feedback;

import java.util.*;
import java.util.stream.Collectors;

import com.tutor_management.backend.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tutor_management.backend.modules.feedback.dto.GenerateCommentRequest;
import com.tutor_management.backend.modules.feedback.dto.GenerateCommentResponse;
import com.tutor_management.backend.modules.feedback.dto.SessionFeedbackRequest;
import com.tutor_management.backend.modules.feedback.dto.SessionFeedbackResponse;
import com.tutor_management.backend.modules.finance.SessionRecord;
import com.tutor_management.backend.modules.finance.SessionRecordRepository;
import com.tutor_management.backend.modules.student.Student;
import com.tutor_management.backend.modules.student.StudentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Standard implementation of the Feedback Management service.
 * Features a Smart Comment Generator that assembles narrative reports from thematic fragments.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SessionFeedbackService {

    private final SessionFeedbackRepository sessionFeedbackRepository;
    private final FeedbackScenarioRepository feedbackScenarioRepository;
    private final SessionRecordRepository sessionRecordRepository;
    private final StudentRepository studentRepository;

    @Transactional
    public Long createFeedback(SessionFeedbackRequest request) {
        log.info("Creating new feedback for session {} and student {}", request.getSessionRecordId(), request.getStudentId());
        
        SessionRecord sessionRecord = sessionRecordRepository.findById(request.getSessionRecordId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin buổi học"));
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin học sinh"));

        SessionFeedback feedback = SessionFeedback.builder()
                .sessionRecord(sessionRecord)
                .student(student)
                .lessonContent(request.getLessonContent())
                .attitudeRating(request.getAttitudeRating())
                .attitudeComment(request.getAttitudeComment())
                .absorptionRating(request.getAbsorptionRating())
                .absorptionComment(request.getAbsorptionComment())
                .knowledgeGaps(request.getKnowledgeGaps())
                .solutions(request.getSolutions())
                .status(request.getStatus() != null ? request.getStatus() : FeedbackStatus.DRAFT)
                .build();

        return sessionFeedbackRepository.save(feedback).getId();
    }

    @Transactional
    public Long updateFeedback(Long id, SessionFeedbackRequest request) {
        log.info("Updating feedback ID: {}", id);
        
        SessionFeedback feedback = sessionFeedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phản hồi buổi học"));

        feedback.setLessonContent(request.getLessonContent());
        feedback.setAttitudeRating(request.getAttitudeRating());
        feedback.setAttitudeComment(request.getAttitudeComment());
        feedback.setAbsorptionRating(request.getAbsorptionRating());
        feedback.setAbsorptionComment(request.getAbsorptionComment());
        feedback.setKnowledgeGaps(request.getKnowledgeGaps());
        feedback.setSolutions(request.getSolutions());
        feedback.setStatus(request.getStatus());

        return sessionFeedbackRepository.save(feedback).getId();
    }

    @Transactional(readOnly = true)
    public SessionFeedbackResponse getFeedbackBySession(Long sessionId, Long studentId) {
        return sessionFeedbackRepository
                .findFirstBySessionRecordIdAndStudentIdOrderByUpdatedAtDesc(sessionId, studentId)
                .map(this::convertToResponse)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public SessionFeedbackResponse getFeedbackById(Long id) {
        return sessionFeedbackRepository.findById(id)
                .map(this::convertToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phản hồi"));
    }

    @Transactional(readOnly = true)
    public Page<SessionFeedbackResponse> getFeedbackHistory(Long studentId, Pageable pageable) {
        return sessionFeedbackRepository.findByStudentId(studentId, pageable)
                .map(this::convertToResponse);
    }

    // --- SMART GENERATOR LOGIC ---

    /**
     * Assembles a natural-sounding Vietnamese comment based on ratings and selected keywords.
     */
    public GenerateCommentResponse generateComment(GenerateCommentRequest request) {
        log.debug("Generating smart comment for student {} [Category: {}]", request.getStudentName(), request.getCategory());
        
        String studentName = (request.getStudentName() != null && !request.getStudentName().isEmpty()) 
                ? request.getStudentName() : "Con";

        List<FeedbackScenario> candidates = selectScenarioCandidates(request);
        
        if (candidates.isEmpty()) {
            return generateEmptyResponse();
        }

        return assembleCommentFromScenarios(candidates, studentName);
    }

    /**
     * Strategy for selecting the best fragments based on keywords or general fallback.
     */
    private List<FeedbackScenario> selectScenarioCandidates(GenerateCommentRequest request) {
        List<FeedbackScenario> candidates = new ArrayList<>();
        List<String> keywords = request.getKeywords();

        if (keywords != null && !keywords.isEmpty()) {
            // Priority: Keyword-specific matching
            for (String kw : keywords) {
                findBestScenarioForKeyword(request.getCategory(), request.getRatingLevel(), kw)
                    .ifPresent(candidates::add);
            }
            // Ensure variety with general templates if needed
            if (candidates.size() < 2) {
                findBestScenarioForKeyword(request.getCategory(), request.getRatingLevel(), "GENERAL")
                    .ifPresent(candidates::add);
            }
        } else {
            // Fallback: Pick random general templates
            List<FeedbackScenario> general = feedbackScenarioRepository.findScenarios(request.getCategory(), request.getRatingLevel(), "GENERAL");
            if (!general.isEmpty()) {
                Collections.shuffle(general);
                candidates.add(general.get(0));
                if (general.size() >= 2) candidates.add(general.get(1));
            }
        }

        return deduplicateCandidates(candidates, keywords);
    }

    private Optional<FeedbackScenario> findBestScenarioForKeyword(String category, String rating, String keyword) {
        List<FeedbackScenario> matched = feedbackScenarioRepository.findScenarios(category, rating, keyword);
        if (matched.isEmpty()) {
            // Fallback to ANY rating for this keyword
            matched = feedbackScenarioRepository.findScenarios(category, "ANY", keyword);
        }
        
        if (matched.isEmpty()) return Optional.empty();
        return Optional.of(matched.get(new Random().nextInt(matched.size())));
    }

    private List<FeedbackScenario> deduplicateCandidates(List<FeedbackScenario> candidates, List<String> originalKeywords) {
        List<FeedbackScenario> filtered = candidates.stream()
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toCollection(ArrayList::new));

        // Logic to remove redundant GENERAL fragments if specialized ones exist
        if (originalKeywords != null && !originalKeywords.isEmpty() && filtered.size() > 1) {
            boolean hasSpecialized = filtered.stream().anyMatch(s -> !"GENERAL".equals(s.getKeyword()));
            if (hasSpecialized) {
                filtered.removeIf(s -> "GENERAL".equals(s.getKeyword()) && filtered.size() > 1);
            }
        }
        return filtered;
    }

    /**
     * Logic for joining fragments into a cohesive paragraph.
     */
    private GenerateCommentResponse assembleCommentFromScenarios(List<FeedbackScenario> scenarios, String studentName) {
        StringBuilder sb = new StringBuilder();
        List<Long> usedIds = new ArrayList<>();
        
        GenerationContext ctx = new GenerationContext(studentName);

        for (FeedbackScenario scenario : scenarios) {
            String text = processFragment(scenario.getTemplateText(), ctx);
            if (text.isEmpty()) continue;

            appendFragment(sb, text);
            usedIds.add(scenario.getId());
        }

        return GenerateCommentResponse.builder()
                .generatedComment(sb.toString().trim())
                .usedScenarioIds(usedIds)
                .build();
    }

    private String processFragment(String template, GenerationContext ctx) {
        String processed = template.trim();
        String lower = processed.toLowerCase();

        // 1. Deduplicate "Hôm nay" prefixes
        if (ctx.isTodayAlreadyUsed() && (lower.startsWith("hôm nay ") || lower.startsWith("hôm nay,"))) {
            int skip = lower.startsWith("hôm nay ") ? 8 : 9;
            processed = processed.substring(skip);
        } else if (lower.contains("hôm nay")) {
            ctx.setTodayAlreadyUsed(true);
        }

        // 2. Pronoun handling
        if (ctx.isNameAlreadyUsed()) {
            processed = processed.replace("{Student}", "con");
        } else if (processed.contains("{Student}")) {
            processed = processed.replace("{Student}", ctx.getStudentName());
            ctx.setNameAlreadyUsed(true);
        }

        return processed;
    }

    private void appendFragment(StringBuilder sb, String fragment) {
        String text = fragment;
        if (sb.length() > 0) {
            String current = sb.toString().trim();
            if (current.endsWith(".") || current.endsWith("!") || current.endsWith("?")) {
                text = text.substring(0, 1).toUpperCase() + text.substring(1);
                sb.append(" ");
            } else {
                sb.append(", ");
                text = text.substring(0, 1).toLowerCase() + text.substring(1);
            }
        } else {
            text = text.substring(0, 1).toUpperCase() + text.substring(1);
        }
        
        sb.append(text);
        if (!text.endsWith(".") && !text.endsWith("!") && !text.endsWith("?")) {
            sb.append(".");
        }
    }

    // --- Utility Methods ---

    @Transactional(readOnly = true)
    public String getClipboardContent(Long id) {
        SessionFeedback feedback = sessionFeedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phản hồi"));

        return String.format(
            "Học sinh: %s\nNgày: %s\n\nNỘI DUNG: %s\n\nTHÁI ĐỘ (%s):\n%s\n\nTIẾP THU (%s):\n%s\n\nKIẾN THỨC HỔNG:\n%s\n\nGIẢI PHÁP:\n%s",
            feedback.getStudent().getName(),
            feedback.getSessionRecord().getSessionDate(),
            feedback.getLessonContent(),
            feedback.getAttitudeRating(), feedback.getAttitudeComment(),
            feedback.getAbsorptionRating(), feedback.getAbsorptionComment(),
            feedback.getKnowledgeGaps(),
            feedback.getSolutions()
        );
    }

    @Transactional(readOnly = true)
    public void exportFeedbacksToExcel(Long studentId, jakarta.servlet.http.HttpServletResponse response)
            throws java.io.IOException {
        List<SessionFeedback> allFeedbacks = sessionFeedbackRepository.findLatestByStudent(studentId,
                Pageable.unpaged());

        // Deduplicate: Keep only the latest feedback per session
        java.util.Map<Long, SessionFeedback> uniqueMap = new java.util.HashMap<>();
        for (SessionFeedback fb : allFeedbacks) {
            uniqueMap.merge(fb.getSessionRecord().getId(), fb,
                    (existing, replacement) -> existing.getUpdatedAt().isAfter(replacement.getUpdatedAt()) ? existing
                            : replacement);
        }

        List<SessionFeedback> feedbacks = new ArrayList<>(uniqueMap.values());
        // Sort by Session Date (Desc)
        feedbacks
                .sort((a, b) -> b.getSessionRecord().getSessionDate().compareTo(a.getSessionRecord().getSessionDate()));

        try (org.apache.poi.xssf.usermodel.XSSFWorkbook workbook = new org.apache.poi.xssf.usermodel.XSSFWorkbook()) {
            org.apache.poi.ss.usermodel.Sheet sheet = workbook.createSheet("Student Feedback");

            // Header Row
            org.apache.poi.ss.usermodel.Row headerRow = sheet.createRow(0);
            String[] headers = { "STT", "Họ và Tên", "Ngày", "Nội dung bài học", "Thái độ học", "Khả năng tập trung",
                    "Kiến thức hổng", "Giải pháp" };

            org.apache.poi.ss.usermodel.CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            for (int i = 0; i < headers.length; i++) {
                org.apache.poi.ss.usermodel.Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data Rows
            int rowNum = 1;
            for (SessionFeedback feedback : feedbacks) {
                org.apache.poi.ss.usermodel.Row row = sheet.createRow(rowNum++);

                row.createCell(0).setCellValue(rowNum - 1);
                row.createCell(1).setCellValue(feedback.getStudent().getName());
                row.createCell(2).setCellValue(feedback.getSessionRecord().getSessionDate().toString());
                row.createCell(3).setCellValue(feedback.getLessonContent());

                // Combine Rating + Comment
                String attitude = String.format("[%s] %s", feedback.getAttitudeRating(), feedback.getAttitudeComment());
                row.createCell(4).setCellValue(attitude);

                String absorption = String.format("[%s] %s", feedback.getAbsorptionRating(),
                        feedback.getAbsorptionComment());
                row.createCell(5).setCellValue(absorption);

                row.createCell(6).setCellValue(feedback.getKnowledgeGaps());
                row.createCell(7).setCellValue(feedback.getSolutions());
            }

            // Auto size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename=feedback_" + studentId + ".xlsx");

            workbook.write(response.getOutputStream());
        }
    }

    public List<String> getAvailableKeywords(String category, String ratingLevel) {
        return feedbackScenarioRepository.findKeywordsByCategoryAndRating(category, ratingLevel);
    }

    private SessionFeedbackResponse convertToResponse(SessionFeedback fb) {
        return SessionFeedbackResponse.builder()
                .id(fb.getId())
                .sessionRecordId(fb.getSessionRecord().getId())
                .studentId(fb.getStudent().getId())
                .studentName(fb.getStudent().getName())
                .sessionDate(fb.getSessionRecord().getSessionDate())
                .lessonContent(fb.getLessonContent())
                .attitudeRating(fb.getAttitudeRating())
                .attitudeComment(fb.getAttitudeComment())
                .absorptionRating(fb.getAbsorptionRating())
                .absorptionComment(fb.getAbsorptionComment())
                .knowledgeGaps(fb.getKnowledgeGaps())
                .solutions(fb.getSolutions())
                .status(fb.getStatus())
                .createdAt(fb.getCreatedAt())
                .updatedAt(fb.getUpdatedAt())
                .build();
    }

    private GenerateCommentResponse generateEmptyResponse() {
        return GenerateCommentResponse.builder()
                .generatedComment("")
                .usedScenarioIds(Collections.emptyList())
                .build();
    }

    /**
     * Inner state container for tracking grammatical choices during comment generation.
     */
    private static class GenerationContext {
        private final String studentName;
        private boolean nameAlreadyUsed = false;
        private boolean todayAlreadyUsed = false;

        public GenerationContext(String studentName) { this.studentName = studentName; }
        public String getStudentName() { return studentName; }
        public boolean isNameAlreadyUsed() { return nameAlreadyUsed; }
        public void setNameAlreadyUsed(boolean val) { nameAlreadyUsed = val; }
        public boolean isTodayAlreadyUsed() { return todayAlreadyUsed; }
        public void setTodayAlreadyUsed(boolean val) { todayAlreadyUsed = val; }
    }
}
