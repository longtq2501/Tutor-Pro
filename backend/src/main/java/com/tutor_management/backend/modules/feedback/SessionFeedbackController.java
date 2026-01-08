package com.tutor_management.backend.modules.feedback;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tutor_management.backend.modules.feedback.dto.GenerateCommentRequest;
import com.tutor_management.backend.modules.feedback.dto.GenerateCommentResponse;
import com.tutor_management.backend.modules.feedback.dto.SessionFeedbackRequest;
import com.tutor_management.backend.modules.feedback.dto.SessionFeedbackResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/feedbacks")
@RequiredArgsConstructor
public class SessionFeedbackController {

    private final SessionFeedbackService sessionFeedbackService;

    @PostMapping
    public ResponseEntity<Long> createFeedback(@RequestBody SessionFeedbackRequest request) {
        return ResponseEntity.ok(sessionFeedbackService.createFeedback(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateFeedback(@PathVariable Long id, @RequestBody SessionFeedbackRequest request) {
        return ResponseEntity.ok(sessionFeedbackService.updateFeedback(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SessionFeedbackResponse> getFeedbackById(@PathVariable Long id) {
        return ResponseEntity.ok(sessionFeedbackService.getFeedbackById(id));
    }

    @GetMapping("/session/{sessionId}/student/{studentId}")
    public ResponseEntity<SessionFeedbackResponse> getFeedbackBySession(
            @PathVariable Long sessionId,
            @PathVariable Long studentId) {
        return ResponseEntity.ok(sessionFeedbackService.getFeedbackBySession(sessionId, studentId));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<Page<SessionFeedbackResponse>> getFeedbackHistory(
            @PathVariable Long studentId,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(sessionFeedbackService.getFeedbackHistory(studentId, pageable));
    }

    // --- Smart Generator Endpoints ---

    @PostMapping("/generate")
    public ResponseEntity<GenerateCommentResponse> generateComment(@RequestBody GenerateCommentRequest request) {
        return ResponseEntity.ok(sessionFeedbackService.generateComment(request));
    }

    @GetMapping("/keywords")
    public ResponseEntity<List<String>> getAvailableKeywords(
            @RequestParam String category,
            @RequestParam String ratingLevel) {
        return ResponseEntity.ok(sessionFeedbackService.getAvailableKeywords(category, ratingLevel));
    }

    @GetMapping("/{id}/clipboard")
    public ResponseEntity<String> getClipboardContent(@PathVariable Long id) {
        return ResponseEntity.ok(sessionFeedbackService.getClipboardContent(id));
    }

    @GetMapping("/export/student/{studentId}")
    public void exportFeedbacksToExcel(@PathVariable Long studentId, jakarta.servlet.http.HttpServletResponse response)
            throws java.io.IOException {
        sessionFeedbackService.exportFeedbacksToExcel(studentId, response);
    }
}
