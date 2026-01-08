package com.tutor_management.backend.modules.feedback.dto;

import java.util.List;

import lombok.Data;

@Data
public class GenerateCommentRequest {
    private String category; // "ATTITUDE", "ABSORPTION", "GAPS", "SOLUTIONS"
    private String ratingLevel; // "XUAT_SAC", "GIOI", "KHA", "TRUNG_BINH", "TE"
    private List<String> keywords; // e.g., ["HOMEWORK", "ACTIVE"]
    private String studentName; // Optional, defaults to "Student"
}
