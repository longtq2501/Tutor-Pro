package com.tutor_management.backend.service;

//import com.tutor_management.backend.dto.*;
import com.tutor_management.backend.dto.request.InvoiceRequest;
import com.tutor_management.backend.dto.response.BankInfo;
import com.tutor_management.backend.dto.response.InvoiceItem;
import com.tutor_management.backend.dto.response.InvoiceResponse;
import com.tutor_management.backend.entity.*;
import com.tutor_management.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final SessionRecordRepository sessionRecordRepository;
    private final StudentRepository studentRepository;

    public InvoiceResponse generateInvoice(InvoiceRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<SessionRecord> records;
        if (request.getSessionRecordIds() != null && !request.getSessionRecordIds().isEmpty()) {
            records = sessionRecordRepository.findAllById(request.getSessionRecordIds());
        } else {
            // Get all unpaid sessions for the month
            records = sessionRecordRepository.findByStudentIdOrderByCreatedAtDesc(request.getStudentId())
                    .stream()
                    .filter(r -> r.getMonth().equals(request.getMonth()) && !r.getPaid())
                    .collect(Collectors.toList());
        }

        if (records.isEmpty()) {
            throw new RuntimeException("No sessions found for invoice");
        }

        // Calculate totals
        int totalSessions = records.stream().mapToInt(SessionRecord::getSessions).sum();
        int totalHours = records.stream().mapToInt(SessionRecord::getHours).sum();
        long totalAmount = records.stream().mapToLong(SessionRecord::getTotalAmount).sum();

        // Build invoice items
        List<InvoiceItem> items = records.stream()
                .sorted((a, b) -> a.getSessionDate().compareTo(b.getSessionDate()))
                .map(record -> InvoiceItem.builder()
                        .date(formatDate(record.getSessionDate()))
                        .description("Buổi học tiếng Anh")
                        .sessions(record.getSessions())
                        .hours(record.getHours())
                        .pricePerHour(record.getPricePerHour())
                        .amount(record.getTotalAmount())
                        .build())
                .collect(Collectors.toList());

        // Generate invoice number
        String invoiceNumber = generateInvoiceNumber(request.getMonth());

        // Generate QR code content
        String qrContent = generateQRContent(totalAmount, invoiceNumber);

        return InvoiceResponse.builder()
                .invoiceNumber(invoiceNumber)
                .studentName(student.getName())
                .month(formatMonth(request.getMonth()))
                .totalSessions(totalSessions)
                .totalHours(totalHours)
                .totalAmount(totalAmount)
                .items(items)
                .bankInfo(BankInfo.getDefault())
                .qrCodeUrl(qrContent)
                .createdDate(LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                .build();
    }

    private String generateInvoiceNumber(String month) {
        String[] parts = month.split("-");
        long count = sessionRecordRepository.count(); // Simple counter
        return String.format("INV-%s-%s-%03d", parts[0], parts[1], count + 1);
    }

    private String formatDate(LocalDate date) {
        return date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }

    private String formatMonth(String month) {
        String[] parts = month.split("-");
        return String.format("Tháng %s/%s", parts[1], parts[0]);
    }

    private String generateQRContent(long amount, String invoiceNumber) {
        // VietQR format for Vietcombank
        String bankCode = "970436"; // Vietcombank
        String accountNumber = "1041819355"; // Replace with real account
        String template = "compact2";
        String description = invoiceNumber.replace("-", "");

        return String.format(
                "https://img.vietqr.io/image/%s-%s-%s.png?amount=%d&addInfo=%s",
                bankCode, accountNumber, template, amount, description
        );
    }
}