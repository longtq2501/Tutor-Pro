package com.tutor_management.backend.modules.feedback;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

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

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SessionFeedbackService {

    private final SessionFeedbackRepository sessionFeedbackRepository;
    private final FeedbackScenarioRepository feedbackScenarioRepository;
    private final SessionRecordRepository sessionRecordRepository;
    private final StudentRepository studentRepository;

    @Transactional
    public Long createFeedback(SessionFeedbackRequest request) {
        SessionRecord sessionRecord = sessionRecordRepository.findById(request.getSessionRecordId())
                .orElseThrow(() -> new EntityNotFoundException("SessionRecord not found"));
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));

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
        SessionFeedback feedback = sessionFeedbackRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Feedback not found"));

        // Only update fields if they are provided (or overwrite them)
        // Here we overwrite all for simplicity as the form sends full state
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

    public SessionFeedbackResponse getFeedbackBySession(Long sessionId, Long studentId) {
        return sessionFeedbackRepository
                .findFirstBySessionRecordIdAndStudentIdOrderByUpdatedAtDesc(sessionId, studentId)
                .map(this::convertToResponse)
                .orElse(null);
    }

    public SessionFeedbackResponse getFeedbackById(Long id) {
        return sessionFeedbackRepository.findById(id)
                .map(this::convertToResponse)
                .orElseThrow(() -> new EntityNotFoundException("Feedback not found"));
    }

    public Page<SessionFeedbackResponse> getFeedbackHistory(Long studentId, Pageable pageable) {
        return sessionFeedbackRepository.findByStudentId(studentId, pageable)
                .map(this::convertToResponse);
    }

    // --- SMART GENERATOR LOGIC ---

    public GenerateCommentResponse generateComment(GenerateCommentRequest request) {
        String category = request.getCategory();
        String ratingLevel = request.getRatingLevel();
        List<String> keywords = request.getKeywords();
        String studentName = request.getStudentName() != null ? request.getStudentName() : "Con";

        // 1. Fetch all scenarios for this Category + Rating
        // (We fetch all matching rating/cat first to do in-memory random picking or
        // specific DB query)
        // For simple filtering, let's use the repo method with keyword logic

        List<FeedbackScenario> candidates = new ArrayList<>();
        List<Long> usedScenarioIds = new ArrayList<>();

        // Strategy:
        // If keywords provided -> Try to find scenarios matching keywords
        // If not found or no keywords -> Fallback to "GENERAL" keyword scenarios

        if (keywords != null && !keywords.isEmpty()) {
            for (String keyword : keywords) {
                List<FeedbackScenario> matched = feedbackScenarioRepository.findScenarios(category, ratingLevel,
                        keyword);
                if (!matched.isEmpty()) {
                    // Pick 1 random from this keyword group
                    candidates.add(matched.get(new Random().nextInt(matched.size())));
                } else {
                    // Fallback to GENERAL if specific keyword not found
                    List<FeedbackScenario> general = feedbackScenarioRepository.findScenarios(category, ratingLevel,
                            "GENERAL");
                    if (!general.isEmpty())
                        candidates.add(general.get(new Random().nextInt(general.size())));
                }
            }
        } else {
            // No keywords: Pick 1-2 GENERAL scenarios
            List<FeedbackScenario> general = feedbackScenarioRepository.findScenarios(category, ratingLevel, "GENERAL");
            if (general.size() >= 2) {
                Collections.shuffle(general);
                candidates.add(general.get(0));
                candidates.add(general.get(1));
            } else if (!general.isEmpty()) {
                candidates.add(general.get(0));
            }
        }

        // Deduplicate
        candidates = candidates.stream().distinct().collect(Collectors.toList());

        if (candidates.isEmpty()) {
            return GenerateCommentResponse.builder()
                    .generatedComment("")
                    .usedScenarioIds(Collections.emptyList())
                    .build();
        }

        StringBuilder commentBuilder = new StringBuilder();
        for (FeedbackScenario scenario : candidates) {
            String text = scenario.getTemplateText();
            // Replace placeholders
            text = text.replace("{Student}", studentName);
            // Replace {Student} if it appears again or ensure capitalization if at start

            commentBuilder.append(text).append(" ");
            usedScenarioIds.add(scenario.getId());
        }

        return GenerateCommentResponse.builder()
                .generatedComment(commentBuilder.toString().trim())
                .usedScenarioIds(usedScenarioIds)
                .build();
    }

    public List<String> getAvailableKeywords(String category, String ratingLevel) {
        return feedbackScenarioRepository.findKeywordsByCategoryAndRating(category, ratingLevel);
    }

    public String getClipboardContent(Long id) {
        SessionFeedback feedback = sessionFeedbackRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Feedback not found"));

        StringBuilder sb = new StringBuilder();
        sb.append("Học sinh: ").append(feedback.getStudent().getName()).append("\n");
        sb.append("Ngày: ").append(feedback.getSessionRecord().getSessionDate()).append("\n\n");

        sb.append("NỘI DUNG BÀI HỌC:\n").append(feedback.getLessonContent()).append("\n\n");

        sb.append("THÁI ĐỘ HỌC (").append(feedback.getAttitudeRating()).append("):\n")
                .append(feedback.getAttitudeComment()).append("\n\n");

        sb.append("KHẢ NĂNG TẬP TRUNG/TIẾP THU (").append(feedback.getAbsorptionRating()).append("):\n")
                .append(feedback.getAbsorptionComment()).append("\n\n");

        sb.append("KIẾN THỨC CHƯA NẮM VỮNG:\n").append(feedback.getKnowledgeGaps()).append("\n\n");

        sb.append("LÝ DO/GIẢI PHÁP:\n").append(feedback.getSolutions()).append("\n");

        return sb.toString();
    }

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

    private SessionFeedbackResponse convertToResponse(SessionFeedback feedback) {
        return SessionFeedbackResponse.builder()
                .id(feedback.getId())
                .sessionRecordId(feedback.getSessionRecord().getId())
                .studentId(feedback.getStudent().getId())
                .studentName(feedback.getStudent().getName())
                .sessionDate(feedback.getSessionRecord().getSessionDate())
                .lessonContent(feedback.getLessonContent())
                .attitudeRating(feedback.getAttitudeRating())
                .attitudeComment(feedback.getAttitudeComment())
                .absorptionRating(feedback.getAbsorptionRating())
                .absorptionComment(feedback.getAbsorptionComment())
                .knowledgeGaps(feedback.getKnowledgeGaps())
                .solutions(feedback.getSolutions())
                .status(feedback.getStatus())
                .createdAt(feedback.getCreatedAt())
                .updatedAt(feedback.getUpdatedAt())
                .build();
    }
}
