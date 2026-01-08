package com.tutor_management.backend.modules.finance;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tutor_management.backend.modules.finance.dto.request.InvoiceRequest;
import com.tutor_management.backend.modules.finance.dto.response.BankInfo;
import com.tutor_management.backend.modules.finance.dto.response.InvoiceItem;
import com.tutor_management.backend.modules.finance.dto.response.InvoiceResponse;
import com.tutor_management.backend.modules.student.Student;
import com.tutor_management.backend.modules.student.StudentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InvoiceService {

        private final SessionRecordRepository sessionRecordRepository;
        private final StudentRepository studentRepository;

        public InvoiceResponse generateInvoice(InvoiceRequest request) {
                // FIX: Ưu tiên sessionRecordIds nếu có (cho case nhiều tháng)
                if (request.getSessionRecordIds() != null && !request.getSessionRecordIds().isEmpty()) {
                        return generateInvoiceFromSessionIds(request);
                }

                // Kiểm tra nếu là nhiều học sinh
                if (Boolean.TRUE.equals(request.getMultipleStudents()) &&
                                request.getSelectedStudentIds() != null &&
                                !request.getSelectedStudentIds().isEmpty()) {
                        return generateInvoiceForMultipleStudents(request);
                }

                // Nếu allStudents = true → Báo giá tổng tháng
                if (Boolean.TRUE.equals(request.getAllStudents())) {
                        return generateMonthlyInvoiceForAll(request.getMonth());
                }

                // Logic cũ: Báo giá cho 1 học sinh trong 1 tháng
                return generateInvoiceForSingleStudent(request);
        }

        // METHOD MỚI: Tạo invoice từ danh sách session IDs (hỗ trợ nhiều tháng)
        private InvoiceResponse generateInvoiceFromSessionIds(InvoiceRequest request) {
                List<SessionRecord> records = sessionRecordRepository
                                .findAllByIdWithStudent(request.getSessionRecordIds());

                if (records.isEmpty()) {
                        throw new RuntimeException("No sessions found for invoice");
                }

                // Lấy danh sách các tháng
                Set<String> months = records.stream()
                                .map(SessionRecord::getMonth)
                                .collect(Collectors.toSet());

                // Lấy danh sách học sinh
                Map<Student, List<SessionRecord>> groupedByStudent = records.stream()
                                .collect(Collectors.groupingBy(SessionRecord::getStudent));

                boolean isMultipleStudents = groupedByStudent.size() > 1;
                boolean isMultipleMonths = months.size() > 1;

                // Tính tổng
                int totalSessions = records.stream().mapToInt(SessionRecord::getSessions).sum();
                double totalHours = records.stream().mapToDouble(SessionRecord::getHours).sum();
                long totalAmount = records.stream().mapToLong(SessionRecord::getTotalAmount).sum();

                // Tạo items
                List<InvoiceItem> items;
                String studentName;

                if (isMultipleStudents) {
                        // Nhiều học sinh - mỗi học sinh 1 dòng
                        items = groupedByStudent.entrySet().stream()
                                        .map(entry -> {
                                                Student student = entry.getKey();
                                                List<SessionRecord> studentRecords = entry.getValue();

                                                int studentSessions = studentRecords.stream()
                                                                .mapToInt(SessionRecord::getSessions).sum();
                                                double studentHours = studentRecords.stream()
                                                                .mapToDouble(SessionRecord::getHours).sum();
                                                long studentAmount = studentRecords.stream()
                                                                .mapToLong(SessionRecord::getTotalAmount).sum();

                                                // Group months for this student
                                                Set<String> studentMonths = studentRecords.stream()
                                                                .map(SessionRecord::getMonth)
                                                                .collect(Collectors.toSet());

                                                String monthsText = formatMultipleMonths(studentMonths);

                                                return InvoiceItem.builder()
                                                                .date(monthsText)
                                                                .description(student.getName() + " - Học phí")
                                                                .sessions(studentSessions)
                                                                .hours(studentHours)
                                                                .pricePerHour(studentRecords.getFirst()
                                                                                .getPricePerHour())
                                                                .amount(studentAmount)
                                                                .build();
                                        })
                                        .sorted((a, b) -> a.getDescription().compareTo(b.getDescription()))
                                        .collect(Collectors.toList());

                        // Tạo tên học sinh
                        List<String> studentNames = groupedByStudent.keySet().stream()
                                        .map(Student::getName)
                                        .sorted()
                                        .collect(Collectors.toList());

                        if (studentNames.size() <= 2) {
                                studentName = String.join(" và ", studentNames);
                        } else {
                                studentName = studentNames.getFirst() + " và " + (studentNames.size() - 1)
                                                + " học sinh khác";
                        }

                } else {
                        // 1 học sinh - chi tiết từng ngày
                        Student student = groupedByStudent.keySet().iterator().next();
                        studentName = student.getName();

                        items = records.stream()
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
                }

                // Tạo month text
                String monthText = isMultipleMonths
                                ? formatMultipleMonths(months)
                                : formatMonth(months.iterator().next());

                // Generate invoice number
                String baseMonth = months.stream().sorted().findFirst()
                                .orElse(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM")));
                String invoiceNumber = generateInvoiceNumber(baseMonth);
                if (isMultipleMonths) {
                        invoiceNumber += "-MULTI";
                }
                if (isMultipleStudents) {
                        invoiceNumber += "-STUDENTS";
                }

                // Generate QR code
                String qrContent = generateQRContent(totalAmount, invoiceNumber);

                return InvoiceResponse.builder()
                                .invoiceNumber(invoiceNumber)
                                .studentName(studentName)
                                .month(monthText)
                                .totalSessions(totalSessions)
                                .totalHours(totalHours)
                                .totalAmount(totalAmount)
                                .items(items)
                                .bankInfo(BankInfo.getDefault())
                                .qrCodeUrl(qrContent)
                                .createdDate(LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                                .build();
        }

        // Logic cũ cho 1 học sinh 1 tháng
        private InvoiceResponse generateInvoiceForSingleStudent(InvoiceRequest request) {
                Student student = studentRepository.findById(request.getStudentId())
                                .orElseThrow(() -> new RuntimeException("Student not found"));

                // Get all unpaid sessions for the month
                List<SessionRecord> records = sessionRecordRepository
                                .findByStudentIdOrderByCreatedAtDesc(request.getStudentId())
                                .stream()
                                .filter(r -> r.getMonth().equals(request.getMonth()) && !r.getPaid())
                                .toList();

                if (records.isEmpty()) {
                        throw new RuntimeException("No sessions found for invoice");
                }

                // Calculate totals
                int totalSessions = records.stream().mapToInt(SessionRecord::getSessions).sum();
                double totalHours = records.stream().mapToDouble(SessionRecord::getHours).sum();
                long totalAmount = records.stream().mapToLong(SessionRecord::getTotalAmount).sum();

                // Build invoice items - CHI TIẾT TỪNG NGÀY
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

        private InvoiceResponse generateInvoiceForMultipleStudents(InvoiceRequest request) {
                // Lấy tất cả session records của các học sinh được chọn trong tháng
                List<SessionRecord> allRecords = sessionRecordRepository.findByMonthAndStudentIdIn(request.getMonth(),
                                request.getSelectedStudentIds());

                if (allRecords.isEmpty()) {
                        throw new RuntimeException("No sessions found for selected students");
                }

                // Tính tổng
                int totalSessions = allRecords.stream().mapToInt(SessionRecord::getSessions).sum();
                double totalHours = allRecords.stream().mapToDouble(SessionRecord::getHours).sum();
                long totalAmount = allRecords.stream().mapToLong(SessionRecord::getTotalAmount).sum();

                // Nhóm theo học sinh
                Map<Student, List<SessionRecord>> groupedByStudent = allRecords.stream()
                                .collect(Collectors.groupingBy(SessionRecord::getStudent));

                // Tạo items - mỗi học sinh một dòng
                List<InvoiceItem> items = groupedByStudent.entrySet().stream()
                                .map(entry -> {
                                        Student student = entry.getKey();
                                        List<SessionRecord> studentRecords = entry.getValue();

                                        int studentSessions = studentRecords.stream()
                                                        .mapToInt(SessionRecord::getSessions).sum();
                                        double studentHours = studentRecords.stream()
                                                        .mapToDouble(SessionRecord::getHours).sum();
                                        long studentAmount = studentRecords.stream()
                                                        .mapToLong(SessionRecord::getTotalAmount).sum();

                                        return InvoiceItem.builder()
                                                        .date(formatMonth(request.getMonth()))
                                                        .description(student.getName() + " - Học phí tháng")
                                                        .sessions(studentSessions)
                                                        .hours(studentHours)
                                                        .pricePerHour(studentRecords.getFirst().getPricePerHour())
                                                        .amount(studentAmount)
                                                        .build();
                                })
                                .sorted((a, b) -> a.getDescription().compareTo(b.getDescription()))
                                .collect(Collectors.toList());

                // Tạo tên học sinh cho invoice
                List<String> studentNames = groupedByStudent.keySet().stream()
                                .map(Student::getName)
                                .sorted()
                                .collect(Collectors.toList());

                String studentNameForInvoice;
                if (studentNames.size() <= 2) {
                        studentNameForInvoice = String.join(" và ", studentNames);
                } else {
                        studentNameForInvoice = studentNames.getFirst() + " và " + (studentNames.size() - 1)
                                        + " học sinh khác";
                }

                // Generate invoice number
                String invoiceNumber = generateInvoiceNumber(request.getMonth()) + "-MULTI";

                // Generate QR code
                String qrContent = generateQRContent(totalAmount, invoiceNumber);

                return InvoiceResponse.builder()
                                .invoiceNumber(invoiceNumber)
                                .studentName(studentNameForInvoice)
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

        private InvoiceResponse generateMonthlyInvoiceForAll(String month) {
                List<SessionRecord> allRecords = sessionRecordRepository.findByMonth(month);

                if (allRecords.isEmpty()) {
                        throw new RuntimeException("No sessions found for this month");
                }

                // Tính tổng
                int totalSessions = allRecords.stream().mapToInt(SessionRecord::getSessions).sum();
                double totalHours = allRecords.stream().mapToDouble(SessionRecord::getHours).sum();
                long totalAmount = allRecords.stream().mapToLong(SessionRecord::getTotalAmount).sum();

                // Nhóm theo StudentId
                Map<Long, List<SessionRecord>> groupedByStudent = allRecords.stream()
                                .collect(Collectors.groupingBy(record -> record.getStudent().getId()));

                // Tạo items - MỖI HỌC SINH 1 DÒNG
                List<InvoiceItem> items = groupedByStudent.values().stream()
                                .map(studentRecords -> {
                                        SessionRecord firstRecord = studentRecords.getFirst();

                                        int studentSessions = studentRecords.stream()
                                                        .mapToInt(SessionRecord::getSessions).sum();
                                        double studentHours = studentRecords.stream()
                                                        .mapToDouble(SessionRecord::getHours).sum();
                                        long studentAmount = studentRecords.stream()
                                                        .mapToLong(SessionRecord::getTotalAmount).sum();

                                        return InvoiceItem.builder()
                                                        .date(formatMonth(month))
                                                        .description(firstRecord.getStudent().getName()
                                                                        + " - Học phí tháng")
                                                        .sessions(studentSessions)
                                                        .hours(studentHours)
                                                        .pricePerHour(firstRecord.getPricePerHour())
                                                        .amount(studentAmount)
                                                        .build();
                                })
                                .sorted((a, b) -> a.getDescription().compareTo(b.getDescription()))
                                .collect(Collectors.toList());

                // Generate invoice number
                String invoiceNumber = generateInvoiceNumber(month) + "-ALL";

                // Generate QR code
                String qrContent = generateQRContent(totalAmount, invoiceNumber);

                return InvoiceResponse.builder()
                                .invoiceNumber(invoiceNumber)
                                .studentName("TẤT CẢ HỌC SINH")
                                .month(formatMonth(month))
                                .totalSessions(totalSessions)
                                .totalHours(totalHours)
                                .totalAmount(totalAmount)
                                .items(items)
                                .bankInfo(BankInfo.getDefault())
                                .qrCodeUrl(qrContent)
                                .createdDate(LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                                .build();
        }

        // METHOD MỚI: Format nhiều tháng
        private String formatMultipleMonths(Set<String> months) {
                List<String> sortedMonths = months.stream()
                                .sorted()
                                .map(this::formatMonth)
                                .toList();

                if (sortedMonths.size() == 1) {
                        return sortedMonths.getFirst();
                } else if (sortedMonths.size() == 2) {
                        return sortedMonths.get(0) + " và " + sortedMonths.get(1);
                } else {
                        // Extract just month numbers for compact display
                        String monthNumbers = months.stream()
                                        .sorted()
                                        .map(m -> {
                                                if (m != null && m.contains("-")) {
                                                        String[] parts = m.split("-");
                                                        return parts.length > 1 ? parts[1] : m;
                                                }
                                                return m != null ? m : "??";
                                        })
                                        .collect(Collectors.joining(", "));

                        String year = months.stream().sorted().findFirst().orElse("2024-01").split("-")[0];
                        return "Tháng " + monthNumbers + "/" + year;
                }
        }

        private String generateInvoiceNumber(String month) {
                String[] parts = (month != null && month.contains("-")) ? month.split("-")
                                : new String[] { "0000", "00" };
                long count = sessionRecordRepository.count();
                String year = parts[0];
                String monthNum = parts.length > 1 ? parts[1] : "00";
                return String.format("INV-%s-%s-%03d", year, monthNum, count + 1);
        }

        private String formatDate(LocalDate date) {
                return date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        }

        private String formatMonth(String month) {
                if (month == null || !month.contains("-"))
                        return "N/A";
                String[] parts = month.split("-");
                if (parts.length < 2)
                        return month;
                return String.format("Tháng %s/%s", parts[1], parts[0]);
        }

        private String generateQRContent(long amount, String invoiceNumber) {
                String bankCode = "970436"; // Vietcombank
                String accountNumber = "1041819355";
                String template = "compact2";
                String description = invoiceNumber.replace("-", "");

                return String.format(
                                "https://img.vietqr.io/image/%s-%s-%s.png?amount=%d&addInfo=%s",
                                bankCode, accountNumber, template, amount, description);
        }
}
