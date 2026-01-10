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

/**
 * Diagnostic service that bootstraps the {@link FeedbackScenario} database from a CSV template.
 * Executes on application startup based on configuration flags.
 */
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
            log.info("📊 Duyệt CSV: Đã bị vô hiệu hóa trong cấu hình.");
            return;
        }

        long count = feedbackScenarioRepository.count();

        if (count > 0 && skipIfExists && !forceReimport) {
            log.info("📊 Dữ liệu kịch bản feedback đã tồn tại ({} bản ghi). Bỏ qua quá trình nhập.", count);
            return;
        }

        if (forceReimport && count > 0) {
            log.warn("⚠️ Đang thực hiện nhập lại dữ liệu! Xóa {} bản ghi hiện có...", count);
            feedbackScenarioRepository.deleteAll();
            log.info("✅ Đã làm sạch dữ liệu cũ.");
        }

        log.info("🚀 Bắt đầu nhập dữ liệu từ: {}", csvFilePath);
        
        try {
            List<FeedbackScenario> scenarios = loadFromCsv();
            if (scenarios.isEmpty()) {
                log.warn("⚠️ Không tìm thấy kịch bản nào trong file CSV!");
                return;
            }

            performBatchInsert(scenarios);
            showStatistics();

        } catch (Exception e) {
            log.error("❌ Lỗi nghiêm trọng khi nhập dữ liệu CSV: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Orchestrates the batch insertion of scenario records to optimize DB performance.
     */
    private void performBatchInsert(List<FeedbackScenario> scenarios) {
        int totalBatches = (int) Math.ceil((double) scenarios.size() / batchSize);
        log.info("📦 Đang chèn {} kịch bản theo {} lô...", scenarios.size(), totalBatches);

        long startTime = System.currentTimeMillis();

        for (int i = 0; i < scenarios.size(); i += batchSize) {
            int end = Math.min(i + batchSize, scenarios.size());
            List<FeedbackScenario> batch = scenarios.subList(i, end);
            feedbackScenarioRepository.saveAll(batch);

            int batchNum = (i / batchSize) + 1;
            log.debug("✅ Hoàn thành lô {}/{} ({} bản ghi)", batchNum, totalBatches, batch.size());
        }

        double duration = (System.currentTimeMillis() - startTime) / 1000.0;
        log.info("🎉 Đã nhập thành công {} kịch bản trong {:.2f} giây!", scenarios.size(), duration);
    }

    private List<FeedbackScenario> loadFromCsv() throws Exception {
        List<FeedbackScenario> scenarios = new ArrayList<>();
        ClassPathResource resource = new ClassPathResource(csvFilePath);

        try (InputStream inputStream = resource.getInputStream();
                BufferedReader reader = new BufferedReader(
                        new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {

            String headerLine = reader.readLine();
            if (headerLine == null) {
                log.warn("File CSV trống!");
                return scenarios;
            }

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
                    log.warn("⚠️ Lỗi phân tích dòng {}: {} - {}", lineNumber, line, e.getMessage());
                    if (errorCount > 10) {
                        throw new RuntimeException("Quá nhiều lỗi phân tích CSV. Dừng nhập.");
                    }
                }
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
            throw new IllegalArgumentException(String.format("Yêu cầu ít nhất 4 trường nhưng tìm thấy %d", fields.size()));
        }

        String category = fields.get(0).trim();
        String ratingLevel = fields.get(1).trim();
        String keyword = fields.get(2).trim();
        String templateText = fields.get(3).trim();
        String variationGroupStr = fields.size() > 4 ? fields.get(4).trim() : "1";

        if (category.isEmpty() || templateText.isEmpty()) {
            throw new IllegalArgumentException("Category và template_text là bắt buộc");
        }

        Integer variationGroup = 1;
        try {
            variationGroup = Integer.parseInt(variationGroupStr);
        } catch (NumberFormatException ignored) {}

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
        log.info("📊 === THỐNG KÊ KỊCH BẢN FEEDBACK ===");
        log.info("   ATTITUDE:   {}", feedbackScenarioRepository.countByCategory("ATTITUDE"));
        log.info("   ABSORPTION: {}", feedbackScenarioRepository.countByCategory("ABSORPTION"));
        log.info("   GAPS:       {}", feedbackScenarioRepository.countByCategory("GAPS"));
        log.info("   SOLUTIONS:  {}", feedbackScenarioRepository.countByCategory("SOLUTIONS"));
        log.info("=====================================\n");
    }
}