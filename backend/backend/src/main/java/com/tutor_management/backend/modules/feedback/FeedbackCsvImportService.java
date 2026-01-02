package com.tutor_management.backend.modules.feedback;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class FeedbackCsvImportService implements CommandLineRunner {

    private final FeedbackScenarioRepository feedbackScenarioRepository;

    @Value("${feedback.csv.enabled:true}")
    private boolean csvImportEnabled;

    @Value("${feedback.csv.file-path:data/feedback_scenarios.csv}")
    private String csvFilePath;

    @Value("${feedback.csv.batch-size:500}")
    private int batchSize;

    @Value("${feedback.csv.skip-if-exists:true}")
    private boolean skipIfExists;

    @Value("${feedback.force-reimport:false}")
    private boolean forceReimport;

    @Override
    public void run(String... args) throws Exception {
        if (!csvImportEnabled) {
            log.info("📊 CSV import is disabled in configuration");
            return;
        }

        long count = feedbackScenarioRepository.count();

        if (count > 0 && skipIfExists && !forceReimport) {
            log.info("📊 Feedback scenarios already exist in database ({}). Skipping import.", count);
            log.info("💡 To re-import, set 'feedback.force-reimport=true' in application.yml");
            return;
        }

        if (forceReimport && count > 0) {
            log.warn("⚠️ Force re-import enabled! Deleting {} existing records...", count);
            feedbackScenarioRepository.deleteAll();
            log.info("✅ Deleted old data");
        }

        log.info("🚀 Starting CSV import from: {}", csvFilePath);
        log.info("📦 Batch size: {}", batchSize);

        try {
            List<FeedbackScenario> scenarios = loadFromCsv();

            if (scenarios.isEmpty()) {
                log.warn("⚠️ No scenarios found in CSV file!");
                return;
            }

            int totalBatches = (int) Math.ceil((double) scenarios.size() / batchSize);

            log.info("📦 Inserting {} scenarios in {} batches...", scenarios.size(), totalBatches);

            long startTime = System.currentTimeMillis();

            for (int i = 0; i < scenarios.size(); i += batchSize) {
                int end = Math.min(i + batchSize, scenarios.size());
                List<FeedbackScenario> batch = scenarios.subList(i, end);
                feedbackScenarioRepository.saveAll(batch);

                int batchNum = (i / batchSize) + 1;
                log.info("✅ Batch {}/{} completed ({} records)", batchNum, totalBatches, batch.size());
            }

            long endTime = System.currentTimeMillis();
            double duration = (endTime - startTime) / 1000.0;

            log.info("🎉 Successfully imported {} Feedback Scenarios in {:.2f} seconds!",
                    scenarios.size(), duration);

            showStatistics();

        } catch (Exception e) {
            log.error("❌ Error importing CSV: {}", e.getMessage(), e);
            throw e;
        }
    }

    private List<FeedbackScenario> loadFromCsv() throws Exception {
        List<FeedbackScenario> scenarios = new ArrayList<>();

        ClassPathResource resource = new ClassPathResource(csvFilePath);

        try (InputStream inputStream = resource.getInputStream();
                BufferedReader reader = new BufferedReader(
                        new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {

            String headerLine = reader.readLine();
            if (headerLine == null) {
                log.warn("CSV file is empty!");
                return scenarios;
            }

            log.info("📄 CSV Header: {}", headerLine);

            String line;
            int lineNumber = 1;
            int errorCount = 0;

            while ((line = reader.readLine()) != null) {
                lineNumber++;

                try {
                    FeedbackScenario scenario = parseCsvLine(line, lineNumber);
                    if (scenario != null) {
                        scenarios.add(scenario);
                    }
                } catch (Exception e) {
                    errorCount++;
                    log.warn("⚠️ Error parsing line {}: {} - Error: {}", lineNumber, line, e.getMessage());

                    if (errorCount > 10) {
                        log.error("❌ Too many parsing errors ({}). Stopping import.", errorCount);
                        throw new RuntimeException("CSV parsing failed with too many errors");
                    }
                }
            }

            if (errorCount > 0) {
                log.warn("⚠️ Import completed with {} parsing errors", errorCount);
            }
        }

        return scenarios;
    }

    private FeedbackScenario parseCsvLine(String line, int lineNumber) {
        if (line == null || line.trim().isEmpty()) {
            return null;
        }

        List<String> fields = parseCsvLineWithQuotes(line);

        if (fields.size() < 4) {
            throw new IllegalArgumentException(
                    String.format("Expected at least 4 fields but got %d", fields.size()));
        }

        String category = fields.get(0).trim();
        String ratingLevel = fields.get(1).trim();
        String keyword = fields.get(2).trim();
        String templateText = fields.get(3).trim();

        String variationGroupStr = fields.size() > 4 ? fields.get(4).trim() : "1";

        if (category.isEmpty() || templateText.isEmpty()) {
            throw new IllegalArgumentException("category and template_text are required");
        }

        Integer variationGroup = 1;
        if (!variationGroupStr.isEmpty()) {
            try {
                variationGroup = Integer.parseInt(variationGroupStr);
            } catch (NumberFormatException e) {
                variationGroup = 1;
            }
        }

        return FeedbackScenario.builder()
                .category(category.toUpperCase())
                .ratingLevel(ratingLevel.isEmpty() ? "ANY" : ratingLevel.toUpperCase())
                .keyword(keyword.isEmpty() ? "GENERAL" : keyword.toUpperCase())
                .templateText(templateText)
                .variationGroup(variationGroup)
                .build();
    }

    private List<String> parseCsvLineWithQuotes(String line) {
        List<String> fields = new ArrayList<>();
        StringBuilder currentField = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);

            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                fields.add(currentField.toString());
                currentField = new StringBuilder();
            } else {
                currentField.append(c);
            }
        }

        fields.add(currentField.toString());

        return fields;
    }

    private void showStatistics() {
        log.info("📊 === FEEDBACK SCENARIOS STATISTICS ===");

        long attitudeCount = feedbackScenarioRepository.countByCategory("ATTITUDE");
        long absorptionCount = feedbackScenarioRepository.countByCategory("ABSORPTION");
        long gapsCount = feedbackScenarioRepository.countByCategory("GAPS");
        long solutionsCount = feedbackScenarioRepository.countByCategory("SOLUTIONS");

        log.info("   ATTITUDE: {}", attitudeCount);
        log.info("   ABSORPTION: {}", absorptionCount);
        log.info("   GAPS: {}", gapsCount);
        log.info("   SOLUTIONS: {}", solutionsCount);
        log.info("   TOTAL: {}", attitudeCount + absorptionCount + gapsCount + solutionsCount);

        log.info("\n📈 By Rating Level:");
        String[] ratings = { "TE", "TRUNG_BINH", "KHA", "GIOI", "XUAT_SAC" };
        for (String rating : ratings) {
            long count = feedbackScenarioRepository.countByRatingLevel(rating);
            log.info("   {}: {}", rating, count);
        }

        log.info("=====================================\n");
    }
}