package com.tutor_management.backend.modules.document;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DocumentCategoryDataInitializer implements CommandLineRunner {

    private final DocumentCategoryRepository categoryRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            System.out.println("🚀 Initializing Document Categories...");
            int order = 1;
            for (DocumentCategoryType type : DocumentCategoryType.values()) {
                DocumentCategory category = DocumentCategory.builder()
                        .code(type.name())
                        .name(type.getDisplayName())
                        .description(type.getDisplayName())
                        .active(true)
                        .displayOrder(order++)
                        .build();
                categoryRepository.save(category);
            }
            System.out.println("✅ Document Categories initialized.");
        }
    }
}
