package com.tutor_management.backend.modules.finance.dto.response;

import lombok.*;

/**
 * Static banking information for payment instruction displays.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BankInfo {
    
    private String bankName;
    private String accountNumber;
    private String accountName;
    private String swiftCode;

    /**
     * Provides fallback banking configuration.
     */
    public static BankInfo getDefault() {
        return BankInfo.builder()
                .bankName("Vietcombank")
                .accountNumber("1041819355")
                .accountName("TON QUYNH LONG")
                .swiftCode("BFTVVNVX")
                .build();
    }
}
