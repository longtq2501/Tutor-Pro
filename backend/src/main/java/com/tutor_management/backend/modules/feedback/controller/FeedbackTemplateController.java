package com.tutor_management.backend.modules.feedback.controller;

import com.tutor_management.backend.modules.feedback.dto.request.FeedbackTemplateRequest;
import com.tutor_management.backend.modules.feedback.dto.response.FeedbackTemplateResponse;
import com.tutor_management.backend.modules.feedback.service.FeedbackTemplateService;
import com.tutor_management.backend.modules.shared.dto.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/feedback-templates")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
public class FeedbackTemplateController {

    private final FeedbackTemplateService templateService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FeedbackTemplateResponse>>> getTemplates(
            @RequestParam(required = false) String category) {
        List<FeedbackTemplateResponse> templates = templateService.getAccessibleTemplates(category);
        return ResponseEntity.ok(ApiResponse.success(templates));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FeedbackTemplateResponse>> createTemplate(
            @Valid @RequestBody FeedbackTemplateRequest request) {
        FeedbackTemplateResponse response = templateService.createTemplate(request);
        return ResponseEntity.ok(ApiResponse.success("Đã lưu mẫu nhận xét thành công", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FeedbackTemplateResponse>> updateTemplate(
            @PathVariable Long id,
            @Valid @RequestBody FeedbackTemplateRequest request) {
        FeedbackTemplateResponse response = templateService.updateTemplate(id, request);
        return ResponseEntity.ok(ApiResponse.success("Đã cập nhật mẫu nhận xét thành công", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTemplate(@PathVariable Long id) {
        templateService.deleteTemplate(id);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa mẫu nhận xét", null));
    }
}
