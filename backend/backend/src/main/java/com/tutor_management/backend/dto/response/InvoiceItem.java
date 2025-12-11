package com.tutor_management.backend.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceItem {
    private String date; // DD/MM/YYYY
    private String description; // "Buổi học tiếng Anh"
    private Integer sessions;
    private Integer hours;
    private Long pricePerHour;
    private Long amount;
}
