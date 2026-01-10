package com.tutor_management.backend.modules.finance.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request payload for generating an invoice.
 * Supports single student, multiple students, or all students in a billing month.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceRequest {
    
    /**
     * ID of the student the invoice is for. 
     * Nullable when generating for multiple or all students.
     */
    private Long studentId;
    
    /**
     * Billing month in YYYY-MM format.
     */
    private String month;
    
    /**
     * Specific session record IDs to include in this invoice.
     */
    private List<Long> sessionRecordIds;
    
    /**
     * Set to true to generate a summary invoice for all students in the month.
     */
    private Boolean allStudents;
    
    /**
     * Set to true to filter for a subset of students.
     */
    private Boolean multipleStudents;
    
    /**
     * Target student IDs when {@link #multipleStudents} is true.
     */
    private List<Long> selectedStudentIds;
}
