package com.tutor_management.backend.modules.document;

import com.tutor_management.backend.modules.document.entity.Document;
import com.tutor_management.backend.modules.document.entity.DocumentCategory;
import com.tutor_management.backend.modules.document.repository.DocumentCategoryRepository;
import com.tutor_management.backend.modules.document.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Startup component to ensure the document library has its core categories initialized.
 * Also handles data migrations for legacy documents and category metadata.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DocumentCategoryDataInitializer implements CommandLineRunner {

    private final DocumentCategoryRepository categoryRepository;
    private final DocumentRepository documentRepository;

    @Override
    @Transactional
    public void run(String... args) {
        initializeCategories();
        migrateDocuments();
        migrateCategories();
    }

    private void initializeCategories() {
        if (categoryRepository.count() > 0) return;

        log.info("Initializing baseline document categories...");
        int order = 1;
        for (DocumentCategoryType type : DocumentCategoryType.values()) {
            DocumentCategory category = createCategoryFromType(type, order++);
            categoryRepository.save(category);
        }
    }

    private DocumentCategory createCategoryFromType(DocumentCategoryType type, int order) {
        String color = "#3b82f6";
        String icon = "📁";
        
        switch (type) {
            case GRAMMAR: color = "#60a5fa"; icon = "📚"; break;
            case VOCABULARY: color = "#4ade80"; icon = "📖"; break;
            case EXERCISES: color = "#22d3ee"; icon = "📝"; break;
            case TICH_HOP: color = "#c084fc"; icon = "📋"; break;
            case IELTS: color = "#6366f1"; icon = "🌐"; break;
            case FLYERS: color = "#fb7185"; icon = "📄"; break;
            case READING: color = "#fbbf24"; icon = "📖"; break;
            case LISTENING: color = "#f472b6"; icon = "🎧"; break;
            case SPEAKING: color = "#fb923c"; icon = "🗣️"; break;
            case WRITING: color = "#94a3b8"; icon = "✍️"; break;
        }

        return DocumentCategory.builder()
                .code(type.name())
                .name(type.getDisplayName())
                .description(type.getDisplayName())
                .active(true)
                .displayOrder(order)
                .color(color)
                .icon(icon)
                .build();
    }

    /**
     * Attaches colors and icons to categories that were created before these fields were added.
     */
    private void migrateCategories() {
        List<DocumentCategory> categories = categoryRepository.findAll();
        long updatedCount = categories.stream()
                .filter(cat -> cat.getColor() == null || cat.getIcon() == null)
                .peek(cat -> {
                    if (cat.getColor() == null) cat.setColor("#3b82f6");
                    if (cat.getIcon() == null) cat.setIcon("📁");
                    categoryRepository.save(cat);
                })
                .count();

        if (updatedCount > 0) {
            log.info("Migrated {} categories with missing UI metadata.", updatedCount);
        }
    }

    /**
     * Bridges legacy documents (using Enum category) to the dynamic category system.
     */
    private void migrateDocuments() {
        List<Document> documents = documentRepository.findAll();
        long migratedCount = documents.stream()
                .filter(doc -> doc.getCategory() == null && doc.getCategoryType() != null)
                .peek(doc -> categoryRepository.findByCode(doc.getCategoryType().name()).ifPresent(category -> {
                    doc.setCategory(category);
                    documentRepository.save(doc);
                }))
                .count();

        if (migratedCount > 0) {
            log.info("Migrated {} documents to dynamic categories.", migratedCount);
        }
    }
}
