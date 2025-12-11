package com.tutor_management.backend.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BankInfo {
    private String bankName;
    private String accountNumber;
    private String accountName;
    private String swiftCode;

    public static BankInfo getDefault() {
        return BankInfo.builder()
                .bankName("Vietcombank")
                .accountNumber("1234567890") // Thay bằng số TK thật
                .accountName("TON QUYNH LONG")
                .swiftCode("BFTVVNVX")
                .build();
    }
}
