package com.tutor_management.backend.controller;

import com.tutor_management.backend.dto.request.InvoiceRequest;
import com.tutor_management.backend.dto.response.InvoiceResponse;
import com.tutor_management.backend.entity.Parent;
import com.tutor_management.backend.entity.Student;
import com.tutor_management.backend.repository.StudentRepository;
import com.tutor_management.backend.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final PDFGeneratorService pdfGeneratorService;
    private final EmailService emailService;
    private final StudentRepository studentRepository;

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PostMapping("/generate")
    public ResponseEntity<InvoiceResponse> generateInvoice(@RequestBody InvoiceRequest request) {
        InvoiceResponse invoice = invoiceService.generateInvoice(request);
        return ResponseEntity.ok(invoice);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PostMapping("/download-pdf")
    public ResponseEntity<byte[]> downloadInvoicePDF(@RequestBody InvoiceRequest request) {
        try {
            InvoiceResponse invoice = invoiceService.generateInvoice(request);
            byte[] pdfBytes = pdfGeneratorService.generateInvoicePDF(invoice);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);

            String filename = Boolean.TRUE.equals(request.getAllStudents())
                    ? "Bao-Gia-Tong-" + request.getMonth() + ".pdf"
                    : "Bao-Gia-" + invoice.getInvoiceNumber() + ".pdf";

            headers.setContentDisposition(
                    ContentDisposition.builder("attachment")
                            .filename(filename)
                            .build()
            );

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PostMapping("/download-monthly-pdf")
    public ResponseEntity<byte[]> downloadMonthlyInvoicePDF(@RequestParam String month) {
        try {
            InvoiceRequest request = InvoiceRequest.builder()
                    .month(month)
                    .allStudents(true)
                    .build();

            InvoiceResponse invoice = invoiceService.generateInvoice(request);
            byte[] pdfBytes = pdfGeneratorService.generateInvoicePDF(invoice);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(
                    ContentDisposition.builder("attachment")
                            .filename("Bao-Gia-Tong-" + month + ".pdf")
                            .build()
            );

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    // ============ EMAIL ENDPOINTS ============

    /**
     * Gửi invoice qua email cho một học sinh cụ thể
     * POST /api/invoices/send-email
     * Body: { "studentId": 1, "month": "2025-12" }
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PostMapping("/send-email")
    public ResponseEntity<?> sendInvoiceViaEmail(@RequestBody InvoiceRequest request) {
        try {
            // Validate
            if (request.getStudentId() == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Vui lòng chỉ định studentId"));
            }

            // ✅ FIX: Dùng findByIdWithParent() để fetch parent cùng lúc
            Student student = studentRepository.findByIdWithParent(request.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy học sinh"));

            // Debug log
            System.out.println("=== DEBUG SINGLE EMAIL ===");
            System.out.println("Student: " + student.getName() + " (ID: " + student.getId() + ")");
            System.out.println("Parent: " + (student.getParent() != null ? student.getParent().getName() : "NULL"));
            System.out.println("Parent Email: " + (student.getParent() != null ? student.getParent().getEmail() : "NULL"));
            System.out.println("========================");

            Parent parent = student.getParent();
            if (parent == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Học sinh chưa có thông tin phụ huynh"));
            }

            if (parent.getEmail() == null || parent.getEmail().isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Phụ huynh chưa có email"));
            }

            // 2. Generate invoice
            InvoiceResponse invoice = invoiceService.generateInvoice(request);

            // 3. Generate PDF
            byte[] pdfData = pdfGeneratorService.generateInvoicePDF(invoice);

            // 4. Send email
            emailService.sendInvoiceEmail(
                    parent.getEmail(),
                    parent.getName(),
                    student.getName(),
                    request.getMonth(),
                    pdfData,
                    invoice.getInvoiceNumber()
            );

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Đã gửi email thành công",
                    "recipient", parent.getEmail(),
                    "parentName", parent.getName(),
                    "studentName", student.getName()
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "error", "Lỗi khi gửi email: " + e.getMessage()
                    ));
        }
    }

    /**
     * Gửi invoice cho nhiều học sinh đã chọn (batch sending)
     * POST /api/invoices/send-email-batch
     * Body: { "selectedStudentIds": [1, 2, 3], "month": "2025-12" }
     */
    /**
     * ✅ GỬI 1 EMAIL DUY NHẤT cho nhiều học sinh (cùng phụ huynh)
     * Tạo 1 PDF chứa tất cả học sinh và gửi 1 email
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PostMapping("/send-email-batch")
    public ResponseEntity<?> sendInvoiceBatch(@RequestBody InvoiceRequest request) {
        try {
            List<Long> studentIds = request.getSelectedStudentIds();
            List<Long> sessionRecordIds = request.getSessionRecordIds(); // Lấy session IDs từ request

            if ((studentIds == null || studentIds.isEmpty()) &&
                    (sessionRecordIds == null || sessionRecordIds.isEmpty())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Vui lòng chọn ít nhất 1 học sinh hoặc buổi học"));
            }

            // Fetch students with parent
            List<Student> students;
            if (studentIds != null && !studentIds.isEmpty()) {
                students = studentRepository.findByIdInWithParent(studentIds);
            } else {
                // Nếu có sessionRecordIds, lấy học sinh từ đó
                students = new ArrayList<>();
                // Cần query để lấy unique students từ session records
            }

            System.out.println("=== DEBUG BATCH EMAIL (COMBINED) ===");
            System.out.println("Requested " + (studentIds != null ? studentIds.size() : 0) + " students");
            System.out.println("Found " + students.size() + " students in DB");

            // Kiểm tra tất cả học sinh có cùng parent không
            Parent firstParent = null;
            boolean sameParent = true;
            List<String> studentNames = new ArrayList<>();

            for (Student student : students) {
                studentNames.add(student.getName());

                if (student.getParent() == null) {
                    return ResponseEntity.badRequest()
                            .body(Map.of(
                                    "success", false,
                                    "error", "Học sinh " + student.getName() + " chưa có thông tin phụ huynh"
                            ));
                }

                if (firstParent == null) {
                    firstParent = student.getParent();
                } else if (!firstParent.getId().equals(student.getParent().getId())) {
                    sameParent = false;
                    break;
                }
            }

            if (firstParent == null || firstParent.getEmail() == null || firstParent.getEmail().isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "success", false,
                                "error", "Phụ huynh chưa có email"
                        ));
            }

            if (!sameParent) {
                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "success", false,
                                "error", "Các học sinh đã chọn không cùng phụ huynh. Vui lòng chọn các học sinh cùng phụ huynh để gửi 1 email chung."
                        ));
            }

            // ✅ SỬA QUAN TRỌNG: Tạo request với sessionRecordIds (cho nhiều tháng)
            InvoiceRequest combinedRequest;

            if (sessionRecordIds != null && !sessionRecordIds.isEmpty()) {
                // Ưu tiên dùng sessionRecordIds để lấy đúng các buổi học từ nhiều tháng
                combinedRequest = InvoiceRequest.builder()
                        .sessionRecordIds(sessionRecordIds) // ← QUAN TRỌNG: truyền session IDs
                        .multipleStudents(true)
                        .selectedStudentIds(studentIds)
                        // KHÔNG truyền month vì đã có sessionRecordIds
                        .build();
            } else {
                // Fallback: dùng studentIds và month (cho 1 tháng)
                combinedRequest = InvoiceRequest.builder()
                        .studentId(studentIds.get(0))
                        .month(request.getMonth())
                        .multipleStudents(true)
                        .selectedStudentIds(studentIds)
                        .build();
            }

            // Tạo invoice với sessionRecordIds
            InvoiceResponse invoice = invoiceService.generateInvoice(combinedRequest);
            byte[] pdfData = pdfGeneratorService.generateInvoicePDF(invoice);

            // ✅ GỬI 1 EMAIL DUY NHẤT
            String allStudentNames = String.join(", ", studentNames);
            emailService.sendInvoiceEmail(
                    firstParent.getEmail(),
                    firstParent.getName(),
                    allStudentNames,  // Tên tất cả học sinh
                    invoice.getMonth(), // Dùng month từ invoice response (có thể là "Tháng 12/2024 và 01/2025")
                    pdfData,
                    invoice.getInvoiceNumber()
            );

            System.out.println("✓ Combined email sent successfully");
            System.out.println("To: " + firstParent.getEmail());
            System.out.println("Students: " + allStudentNames);
            System.out.println("Month in invoice: " + invoice.getMonth());
            System.out.println("Session IDs used: " +
                    (sessionRecordIds != null ? sessionRecordIds.size() : 0));
            System.out.println("========================");

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "summary", Map.of(
                            "total", students.size(),
                            "sent", 1,  // Chỉ gửi 1 email
                            "failed", 0
                    ),
                    "successDetails", List.of(Map.of(
                            "student", allStudentNames,
                            "parent", firstParent.getName(),
                            "email", firstParent.getEmail()
                    )),
                    "errors", new ArrayList<>()
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "error", "Lỗi hệ thống: " + e.getMessage()
                    ));
        }
    }

    /**
     * Gửi email cho tất cả học sinh trong tháng
     * POST /api/invoices/send-email-all
     * Body: { "month": "2025-12", "allStudents": true }
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PostMapping("/send-email-all")
    public ResponseEntity<?> sendInvoiceToAll(@RequestBody InvoiceRequest request) {
        try {
            if (!Boolean.TRUE.equals(request.getAllStudents())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "allStudents phải là true"));
            }

            // ✅ FIX: Dùng findByActiveTrueWithParent() để fetch parent cho tất cả active students
            List<Student> allStudents = studentRepository.findByActiveTrueWithParent();

            if (allStudents.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Không có học sinh nào đang active"));
            }

            int successCount = 0;
            int failCount = 0;
            int skipCount = 0;
            List<String> errors = new ArrayList<>();
            List<Map<String, String>> successDetails = new ArrayList<>();

            System.out.println("=== DEBUG SEND ALL ===");
            System.out.println("Total active students: " + allStudents.size());

            for (Student student : allStudents) {
                try {
                    Parent parent = student.getParent();

                    System.out.println("---");
                    System.out.println("Processing: " + student.getName());

                    // Skip nếu không có parent hoặc email
                    if (parent == null || parent.getEmail() == null || parent.getEmail().isBlank()) {
                        skipCount++;
                        String reason = parent == null ? "thiếu phụ huynh" : "thiếu email";
                        errors.add("⚠ " + student.getName() + ": Bỏ qua (" + reason + ")");
                        System.out.println("⚠ Skipped: " + reason);
                        continue;
                    }

                    // Generate invoice
                    InvoiceRequest singleRequest = InvoiceRequest.builder()
                            .studentId(student.getId())
                            .month(request.getMonth())
                            .allStudents(false)
                            .build();

                    InvoiceResponse invoice = invoiceService.generateInvoice(singleRequest);

                    // Skip nếu không có session nào trong tháng
                    if (invoice.getItems() == null || invoice.getItems().isEmpty()) {
                        skipCount++;
                        errors.add("⚠ " + student.getName() + ": Bỏ qua (không có buổi học trong tháng)");
                        System.out.println("⚠ Skipped: no sessions");
                        continue;
                    }

                    byte[] pdfData = pdfGeneratorService.generateInvoicePDF(invoice);

                    // Send email
                    emailService.sendInvoiceEmail(
                            parent.getEmail(),
                            parent.getName(),
                            student.getName(),
                            request.getMonth(),
                            pdfData,
                            invoice.getInvoiceNumber()
                    );

                    successCount++;
                    successDetails.add(Map.of(
                            "student", student.getName(),
                            "parent", parent.getName(),
                            "email", parent.getEmail()
                    ));

                    System.out.println("✓ Sent successfully");

                } catch (Exception e) {
                    failCount++;
                    errors.add("❌ " + student.getName() + ": " + e.getMessage());
                    System.out.println("✗ Failed: " + e.getMessage());
                    e.printStackTrace();
                }
            }

            System.out.println("========================");

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "summary", Map.of(
                            "total", allStudents.size(),
                            "sent", successCount,
                            "skipped", skipCount,
                            "failed", failCount
                    ),
                    "successDetails", successDetails,
                    "errors", errors
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "error", "Lỗi hệ thống: " + e.getMessage()
                    ));
        }
    }
}