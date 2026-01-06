package com.tutor_management.backend.modules.document;

public enum DocumentCategory {
    GRAMMAR("Ngữ pháp"),
    VOCABULARY("Từ vựng"),
    READING("Đọc hiểu"),
    LISTENING("Nghe hiểu"),
    SPEAKING("Nói"),
    WRITING("Viết"),
    EXERCISES("Bài tập"),
    EXAM("Đề thi"),
    PET("PET (B1)"),
    FCE("FCE (B2)"),
    IELTS("IELTS"),
    TOEIC("TOEIC"),
    TICH_HOP("Tích hợp"),
    FLYERS("Flyers"),
    OTHER("Khác");

    private final String displayName;

    DocumentCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
