package com.tutor_management.backend.modules.shared;

import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.*;
import com.itextpdf.kernel.colors.*;
import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.io.image.ImageDataFactory;
import com.tutor_management.backend.modules.finance.dto.response.InvoiceItem;
import com.tutor_management.backend.modules.finance.dto.response.InvoiceResponse;
import com.tutor_management.backend.modules.finance.dto.response.MonthlyStats;
import com.tutor_management.backend.modules.dashboard.dto.response.DashboardStats;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.net.URL;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@lombok.extern.slf4j.Slf4j
public class PDFGeneratorService {

    private PdfFont vietnameseFont;
    private PdfFont vietnameseFontBold;

    public byte[] generateDashboardReportPDF(DashboardStats stats, List<MonthlyStats> monthlyStats) throws Exception {
        log.info("Starting dashboard report PDF generation");
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        loadVietnameseFonts();
        document.setMargins(30, 40, 30, 40);
        document.setFont(vietnameseFont);

        // Header
        addDashboardHeader(document);

        // Summary Cards Section
        addDashboardSummary(document, stats);

        // Spacing
        document.add(new Paragraph(" ").setFontSize(5));

        // Monthly Data Table
        addMonthlyStatsTable(document, monthlyStats);

        // Footer
        addDashboardFooter(document);

        document.close();
        return baos.toByteArray();
    }

    private void addDashboardHeader(Document document) {
        Paragraph title = new Paragraph("BÁO CÁO TỔNG QUAN HỆ THỐNG")
                .setFont(vietnameseFontBold)
                .setFontSize(24)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(5);
        document.add(title);

        Paragraph date = new Paragraph("Ngày xuất báo cáo: " + java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")))
                .setFont(vietnameseFont)
                .setFontSize(9)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(15)
                .setFontColor(new DeviceRgb(100, 100, 100));
        document.add(date);

        addHorizontalLine(document);
    }

    private void addDashboardSummary(Document document, DashboardStats stats) {
        Table table = new Table(4).useAllAvailableWidth();
        table.setMarginTop(10);

        table.addCell(createSummaryCell("HỌC SINH", String.valueOf(stats.getTotalStudents()), new DeviceRgb(59, 130, 246)));
        table.addCell(createSummaryCell("DOANH THU", stats.getCurrentMonthTotal(), new DeviceRgb(16, 185, 129)));
        table.addCell(createSummaryCell("ĐÃ THU", stats.getTotalPaidAllTime(), new DeviceRgb(34, 197, 94)));
        table.addCell(createSummaryCell("CHƯA THU", stats.getTotalUnpaidAllTime(), new DeviceRgb(239, 68, 68)));

        document.add(table);
    }

    private Cell createSummaryCell(String label, String value, Color color) {
        Cell cell = new Cell()
                .setBorder(new com.itextpdf.layout.borders.SolidBorder(new DeviceRgb(229, 231, 235), 1))
                .setPadding(8)
                .setMargin(2);

        Paragraph pLabel = new Paragraph(label)
                .setFont(vietnameseFontBold)
                .setFontSize(10)
                .setFontColor(new DeviceRgb(107, 114, 128))
                .setMarginBottom(5);
        
        Paragraph pValue = new Paragraph(value)
                .setFont(vietnameseFontBold)
                .setFontSize(14)
                .setFontColor(color);

        cell.add(pLabel).add(pValue);
        return cell;
    }

    private void addMonthlyStatsTable(Document document, List<MonthlyStats> monthlyStats) {
        Paragraph title = new Paragraph("CHI TIẾT DOANH THU THEO THÁNG")
                .setFont(vietnameseFontBold)
                .setFontSize(14)
                .setMarginBottom(10);
        document.add(title);

        Table table = new Table(new float[]{3, 3, 3, 2});
        table.useAllAvailableWidth();

        String[] headers = {"Tháng", "Đã Thu", "Chưa Thu", "Số Buổi"};
        for (String header : headers) {
            table.addHeaderCell(new Cell()
                    .add(new Paragraph(header).setFont(vietnameseFontBold).setFontSize(10).setFontColor(ColorConstants.WHITE))
                    .setBackgroundColor(new DeviceRgb(75, 85, 99))
                    .setTextAlignment(TextAlignment.CENTER)
                    .setPadding(8));
        }

        for (MonthlyStats ms : monthlyStats) {
            table.addCell(createTableCell(formatMonth(ms.getMonth())));
            table.addCell(createTableCellRight(formatCurrency(ms.getTotalPaid())));
            table.addCell(createTableCellRight(formatCurrency(ms.getTotalUnpaid())));
            table.addCell(createTableCellCenter(String.valueOf(ms.getTotalSessions())));
        }

        document.add(table);
    }

    private void addDashboardFooter(Document document) {
        Paragraph footer = new Paragraph("\nTutor Pro Management System - Báo cáo tự động")
                .setFont(vietnameseFont)
                .setFontSize(8)
                .setFontColor(new DeviceRgb(156, 163, 175))
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(15);
        document.add(footer);
    }

    public byte[] generateInvoicePDF(InvoiceResponse invoice) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        loadVietnameseFonts();
        document.setMargins(30, 40, 30, 40);
        document.setFont(vietnameseFont);

        addHeader(document, invoice);
        addInvoiceInfo(document, invoice);
        addDivider(document);
        addItemsTable(document, invoice);
        addBankInfo(document, invoice);
        addFooter(document);

        document.close();
        return baos.toByteArray();
    }

    private void loadVietnameseFonts() throws Exception {
        try {
            // Load font DejaVu Sans (hỗ trợ Unicode đầy đủ)
            ClassPathResource regularFont = new ClassPathResource("fonts/DejaVuSans.ttf");
            ClassPathResource boldFont = new ClassPathResource("fonts/DejaVuSans-Bold.ttf");

            if (regularFont.exists() && boldFont.exists()) {
                // Tạo font từ file
                vietnameseFont = PdfFontFactory.createFont(
                        regularFont.getInputStream().readAllBytes(),
                        PdfEncodings.IDENTITY_H);

                vietnameseFontBold = PdfFontFactory.createFont(
                        boldFont.getInputStream().readAllBytes(),
                        PdfEncodings.IDENTITY_H);
            } else {
                // Nếu không có font file, dùng StandardFonts
                vietnameseFont = PdfFontFactory.createFont(com.itextpdf.io.font.constants.StandardFonts.TIMES_ROMAN, com.itextpdf.io.font.PdfEncodings.WINANSI);
                vietnameseFontBold = PdfFontFactory.createFont(com.itextpdf.io.font.constants.StandardFonts.TIMES_BOLD, com.itextpdf.io.font.PdfEncodings.WINANSI);
            }

        } catch (Exception e) {
            log.error("Error loading fonts: {}", e.getMessage());

            // Fallback an toàn
            try {
                vietnameseFont = PdfFontFactory.createFont();
                vietnameseFontBold = PdfFontFactory.createFont();
            } catch (Exception ex) {
                throw new RuntimeException("Cannot create any font", ex);
            }
        }
    }

    private void addHeader(Document document, InvoiceResponse invoice) {
        // Main Title
        Paragraph title = new Paragraph("BÁO GIÁ HỌC PHÍ")
                .setFont(vietnameseFontBold)
                .setFontSize(28)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(5);
        document.add(title);

        // Subtitle
        Paragraph subtitle = new Paragraph("ENGLISH TUTORING")
                .setFont(vietnameseFont)
                .setFontSize(16)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(30)
                .setFontColor(new DeviceRgb(100, 100, 100));
        document.add(subtitle);

        // Invoice Info in two columns
        Table headerTable = new Table(2).useAllAvailableWidth();
        headerTable.setMarginBottom(20);

        // Left column - Empty
        Paragraph leftContent = new Paragraph();
        headerTable.addCell(new Cell()
                .add(leftContent)
                .setBorder(null)
                .setPadding(5));

        // Right column - Invoice number and date
        Paragraph invoiceInfo = new Paragraph()
                .setFont(vietnameseFont)
                .setTextAlignment(TextAlignment.RIGHT);

        invoiceInfo.add(new Text("Số: ").setFont(vietnameseFontBold));
        invoiceInfo.add(invoice.getInvoiceNumber() + "\n");
        invoiceInfo.add(new Text("Ngày: ").setFont(vietnameseFontBold));
        invoiceInfo.add(invoice.getCreatedDate());

        headerTable.addCell(new Cell()
                .add(invoiceInfo)
                .setBorder(null)
                .setPadding(5)
                .setTextAlignment(TextAlignment.RIGHT));

        document.add(headerTable);

        // Horizontal line
        addHorizontalLine(document);
    }

    private void addInvoiceInfo(Document document, InvoiceResponse invoice) {
        Table infoTable = new Table(2).useAllAvailableWidth();
        infoTable.setMarginBottom(10);

        // Student info
        Paragraph studentInfo = new Paragraph()
                .setFont(vietnameseFont)
                .add(new Text("Học sinh: ").setFont(vietnameseFontBold))
                .add(invoice.getStudentName() + "\n")
                .add(new Text("Thời gian: ").setFont(vietnameseFontBold))
                .add(invoice.getMonth());

        infoTable.addCell(new Cell()
                .add(studentInfo)
                .setBorder(null)
                .setPadding(3));

        // // Optional: Add contact info or other details
        // infoTable.addCell(new Cell()
        // .setBorder(null)
        // .setPadding(5));

        document.add(infoTable);
    }

    private void addItemsTable(Document document, InvoiceResponse invoice) {
        Table table = new Table(new float[] { 2, 4, 1.5f, 1.5f, 2, 2.5f });
        table.useAllAvailableWidth();
        table.setMarginBottom(10);

        // Header row with styling
        String[] headers = { "Ngày", "Nội dung", "Buổi", "Giờ", "Đơn giá", "Thành tiền" };
        for (String header : headers) {
            Cell headerCell = new Cell()
                    .add(new Paragraph(header)
                            .setFont(vietnameseFontBold)
                            .setFontSize(10))
                    .setBackgroundColor(new DeviceRgb(59, 130, 246))
                    .setFontColor(ColorConstants.WHITE)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setPadding(8);
            table.addHeaderCell(headerCell);
        }

        // Data rows
        for (InvoiceItem item : invoice.getItems()) {
            table.addCell(createTableCell(item.getDate()));
            table.addCell(createTableCell(item.getDescription()));
            table.addCell(createTableCellCenter(String.valueOf(item.getSessions())));
            table.addCell(createTableCellCenter(String.valueOf(item.getHours())));
            table.addCell(createTableCellRight(formatCurrency(item.getPricePerHour())));
            table.addCell(createTableCellRight(formatCurrency(item.getAmount())));
        }

        // Total row
        Cell totalLabelCell = new Cell(1, 5)
                .add(new Paragraph("TỔNG CỘNG")
                        .setFont(vietnameseFontBold)
                        .setFontSize(11))
                .setTextAlignment(TextAlignment.RIGHT)
                .setBackgroundColor(new DeviceRgb(243, 244, 246))
                .setPadding(10);
        table.addCell(totalLabelCell);

        Cell totalAmountCell = new Cell()
                .add(new Paragraph(formatCurrency(invoice.getTotalAmount()))
                        .setFont(vietnameseFontBold)
                        .setFontSize(11))
                .setBackgroundColor(new DeviceRgb(243, 244, 246))
                .setTextAlignment(TextAlignment.RIGHT)
                .setPadding(10);
        table.addCell(totalAmountCell);

        document.add(table);
    }

    private Cell createTableCell(String text) {
        return new Cell()
                .add(new Paragraph(text).setFont(vietnameseFont).setFontSize(10))
                .setPadding(4)
                .setTextAlignment(TextAlignment.LEFT);
    }

    private Cell createTableCellCenter(String text) {
        return new Cell()
                .add(new Paragraph(text).setFont(vietnameseFont).setFontSize(10))
                .setPadding(6)
                .setTextAlignment(TextAlignment.CENTER);
    }

    private Cell createTableCellRight(String text) {
        return new Cell()
                .add(new Paragraph(text).setFont(vietnameseFont).setFontSize(10))
                .setPadding(6)
                .setTextAlignment(TextAlignment.RIGHT);
    }

    private void addBankInfo(Document document, InvoiceResponse invoice) {
        int itemCount = invoice.getItems().size();
        boolean isCompact = itemCount > 3;

        Table bankTable;
        if (isCompact) {
            bankTable = new Table(1).useAllAvailableWidth();
        } else {
            // Tăng tỷ lệ phần QR
            bankTable = new Table(new float[] { 1f, 1.1f }).useAllAvailableWidth();
            // ^^^ tăng từ 1f lên 1.1f
        }

        bankTable.setMarginBottom(0);
        bankTable.setKeepTogether(false); // Cho phép ngắt dòng nếu quá dài

        // Bank info
        Paragraph bankTitle = new Paragraph("THÔNG TIN CHUYỂN KHOẢN")
                .setFont(vietnameseFontBold)
                .setFontSize(12)
                .setMarginBottom(3);

        Paragraph bankDetails = new Paragraph()
                .setFont(vietnameseFont)
                .setFontSize(10)
                .add("Ngân hàng: " + invoice.getBankInfo().getBankName() + "\n")
                .add("Số tài khoản: 1041819355\n")
                .add("Tên tài khoản: " + invoice.getBankInfo().getAccountName() + "\n")
                .add("Nội dung: " + invoice.getInvoiceNumber());

        Cell bankCell = new Cell()
                .add(bankTitle)
                .add(bankDetails)
                .setBorder(null)
                .setPadding(5);

        Cell qrCell = new Cell()
                .setBorder(null)
                .setPadding(0)
                .setTextAlignment(TextAlignment.RIGHT);

        try {
            Image qrImage = new Image(ImageDataFactory.create(new URL(invoice.getQrCodeUrl())));

            if (isCompact) {
                qrImage.setWidth(160);
                qrImage.setHeight(160);
            } else {
                qrImage.setWidth(211); // ← Tăng từ 200 lên 220
                qrImage.setHeight(243); // ← Tăng tỷ lệ tương ứng
            }

            qrImage.setHorizontalAlignment(HorizontalAlignment.RIGHT);
            qrImage.setMarginRight(0);
            qrCell.add(qrImage);
        } catch (Exception e) {
            qrCell.add(new Paragraph("QR Code không khả dụng")
                    .setFont(vietnameseFont)
                    .setFontSize(9));
        }

        if (isCompact) {
            Table innerTable = new Table(new float[] { 1f, 1.1f }).useAllAvailableWidth();
            innerTable.addCell(bankCell);
            innerTable.addCell(qrCell);
            bankTable.addCell(new Cell().add(innerTable).setBorder(null).setPadding(0));
        } else {
            bankTable.addCell(bankCell);
            bankTable.addCell(qrCell);
        }

        document.add(bankTable);
    }

    private void addFooter(Document document) {
        Paragraph note = new Paragraph("Lưu ý: Vui lòng chuyển khoản đúng nội dung để xác nhận thanh toán nhanh chóng.")
                .setFont(vietnameseFont)
                .setFontSize(9)
                .setFontColor(new DeviceRgb(107, 114, 128))
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(20);

        Paragraph thanks = new Paragraph("Cảm ơn quý phụ huynh đã tin tưởng!")
                .setFont(vietnameseFontBold)
                .setFontSize(11)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(5);

        document.add(note);
        document.add(thanks);
    }

    private void addHorizontalLine(Document document) {
        LineSeparator line = new LineSeparator(new SolidLine());
        line.setStrokeColor(new DeviceRgb(200, 200, 200));
        line.setMarginTop(10);
        line.setMarginBottom(10);
        document.add(line);
    }

    private void addDivider(Document document) {
        document.add(new Paragraph(" ").setMarginBottom(15));
    }

    private String formatCurrency(Long amount) {
        if (amount == null) return "0 đ";
        NumberFormat formatter = NumberFormat.getInstance(new Locale("vi", "VN"));
        return formatter.format(amount) + " đ";
    }

    private String formatMonth(String month) {
        if (month == null || !month.contains("-"))
            return "N/A";
        String[] parts = month.split("-");
        if (parts.length < 2)
            return month;
        return String.format("Tháng %s/%s", parts[1], parts[0]);
    }
}
