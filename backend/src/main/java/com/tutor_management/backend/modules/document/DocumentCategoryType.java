package com.tutor_management.backend.modules.document;

/**
 * Enum defining the predefined types of document categories.
 * Maps back to legacy classification or localized display names.
 */
public enum DocumentCategoryType {
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

    DocumentCategoryType(String displayName) {
        this.displayName = displayName;
    }

    /**
     * Retrieves the Vietnamese display name for the category type.
     */
    public String getDisplayName() {
        return displayName;
    }
}
