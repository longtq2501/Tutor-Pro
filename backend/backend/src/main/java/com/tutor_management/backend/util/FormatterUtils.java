package com.tutor_management.backend.util;

import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Locale;

public class FormatterUtils {
    public static String formatCurrency(Long amount) {
        if (amount == null || amount == 0) return "0 đ";

        // Thiết lập định dạng sử dụng dấu chấm cho phần nghìn
        DecimalFormatSymbols symbols = new DecimalFormatSymbols(Locale.getDefault());
        symbols.setGroupingSeparator('.');

        DecimalFormat df = new DecimalFormat("#,### đ", symbols);
        return df.format(amount);
    }
}