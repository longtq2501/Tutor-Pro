package com.tutor_management.backend.modules.finance.dto.response;

import lombok.*;

/**
 * Individual line item within an invoice.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceItem {
    private String date;
    private String description;
    private Integer sessions;
    private Double hours;
    private Long pricePerHour;
    private Long amount;
}
