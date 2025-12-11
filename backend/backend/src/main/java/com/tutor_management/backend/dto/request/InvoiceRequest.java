package com.tutor_management.backend.dto.request;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceRequest {
    private Long studentId;
    private String month; // YYYY-MM
    private List<Long> sessionRecordIds; // Chọn các buổi học để tạo invoice
}
