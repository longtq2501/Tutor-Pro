package com.tutor_management.backend.modules.document;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DocumentCategoryDataInitializer implements CommandLineRunner {

    private final DocumentCategoryRepository categoryRepository;
    private final DocumentRepository documentRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            System.out.println("🚀 Initializing Document Categories...");
            int order = 1;
            for (DocumentCategoryType type : DocumentCategoryType.values()) {
                String color = "#3b82f6"; // Default blue
                String icon = "📁";
                
                // Assign specific colors/icons based on type if needed
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

                DocumentCategory category = DocumentCategory.builder()
                        .code(type.name())
                        .name(type.getDisplayName())
                        .description(type.getDisplayName())
                        .active(true)
                        .displayOrder(order++)
                        .color(color)
                        .icon(icon)
                        .build();
                categoryRepository.save(category);
            }
            System.out.println("✅ Document Categories initialized.");
        }

        // 🚀 Migration: Link existing documents to dynamic categories
        migrateDocuments();
        
        // 🚀 Migration: Add colors and icons to existing categories
        migrateCategories();
    }

    private void migrateCategories() {
        System.out.println("🔄 Migrating legacy categories (color/icon)...");
        java.util.List<DocumentCategory> categories = categoryRepository.findAll();
        for (DocumentCategory cat : categories) {
            boolean updated = false;
            if (cat.getColor() == null) {
                cat.setColor("#3b82f6");
                updated = true;
            }
            if (cat.getIcon() == null) {
                cat.setIcon("📁");
                updated = true;
            }
            if (updated) {
                categoryRepository.save(cat);
            }
        }
        System.out.println("✅ Category migration finished.");
    }

    private void migrateDocuments() {
        System.out.println("🔄 Migrating legacy documents to dynamic categories...");
        java.util.List<Document> documents = documentRepository.findAll();
        long migratedCount = 0;

        for (Document doc : documents) {
            // If new category relationship is missing but legacy enum is present
            if (doc.getCategory() == null && doc.getCategoryType() != null) {
                categoryRepository.findByCode(doc.getCategoryType().name()).ifPresent(category -> {
                    doc.setCategory(category);
                    documentRepository.save(doc);
                });
                migratedCount++;
            }
        }

        if (migratedCount > 0) {
            System.out.println("✅ Migrated " + migratedCount + " documents to dynamic categories.");
        } else {
            System.out.println("ℹ️ No documents needed migration.");
        }
    }
}
