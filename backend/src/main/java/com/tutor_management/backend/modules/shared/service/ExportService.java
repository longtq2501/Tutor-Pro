package com.tutor_management.backend.modules.shared.service;

import com.tutor_management.backend.modules.finance.dto.response.SessionRecordResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

/**
 * Service for exporting system data to Microsoft Excel format.
 * Utilizes Apache POI for spreadsheet generation.
 */
@Service
public class ExportService {

    /**
     * Exports a list of session records to an Excel workbook.
     *
     * @param sessions The list of session responses to export.
     * @return A byte array representing the generated Excel file.
     * @throws IOException If there is an error during workbook generation or writing.
     */
    public byte[] exportSessionsToExcel(List<SessionRecordResponse> sessions) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Sessions");

            // Header Style: Professional dark blue background with white bold text
            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFillForegroundColor(IndexedColors.BLUE_GREY.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            Font font = workbook.createFont();
            font.setColor(IndexedColors.WHITE.getIndex());
            font.setBold(true);
            headerStyle.setFont(font);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setBorderBottom(BorderStyle.THIN);

            // Column Headers
            Row headerRow = sheet.createRow(0);
            String[] columns = { "ID", "Ngày", "Học sinh", "Môn học", "Số giờ", "Đơn giá", "Thành tiền", "Trạng thái", "Ghi chú" };
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            // Cell Styles for data types
            CellStyle dateStyle = createDateStyle(workbook);
            CellStyle currencyStyle = createCurrencyStyle(workbook);

            // Data Rows
            int rowIdx = 1;
            for (SessionRecordResponse session : sessions) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(session.getId());

                Cell dateCell = row.createCell(1);
                if (session.getSessionDate() != null) {
                    dateCell.setCellValue(session.getSessionDate());
                    dateCell.setCellStyle(dateStyle);
                }

                row.createCell(2).setCellValue(session.getStudentName() != null ? session.getStudentName() : "N/A");
                row.createCell(3).setCellValue(session.getSubject() != null ? session.getSubject() : "");
                row.createCell(4).setCellValue(session.getHours() != null ? session.getHours() : 0.0);

                Cell priceCell = row.createCell(5);
                priceCell.setCellValue(session.getPricePerHour() != null ? session.getPricePerHour() : 0);
                priceCell.setCellStyle(currencyStyle);

                Cell totalCell = row.createCell(6);
                totalCell.setCellValue(session.getTotalAmount() != null ? session.getTotalAmount() : 0);
                totalCell.setCellStyle(currencyStyle);

                row.createCell(7).setCellValue(session.getStatus() != null ? session.getStatus() : "SCHEDULED");
                row.createCell(8).setCellValue(session.getNotes() != null ? session.getNotes() : "");
            }

            // Auto-size columns for better readability
            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    private CellStyle createDateStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        CreationHelper createHelper = workbook.getCreationHelper();
        style.setDataFormat(createHelper.createDataFormat().getFormat("yyyy-mm-dd"));
        return style;
    }

    private CellStyle createCurrencyStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        CreationHelper createHelper = workbook.getCreationHelper();
        style.setDataFormat(createHelper.createDataFormat().getFormat("#,##0 \"₫\""));
        return style;
    }
}
