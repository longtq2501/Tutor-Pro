package com.tutor_management.backend.controller;

//import com.tutor_management.backend.dto.*;
import com.tutor_management.backend.dto.request.InvoiceRequest;
import com.tutor_management.backend.dto.response.InvoiceResponse;
import com.tutor_management.backend.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final PDFGeneratorService pdfGeneratorService;

    @PostMapping("/generate")
    public ResponseEntity<InvoiceResponse> generateInvoice(@RequestBody InvoiceRequest request) {
        InvoiceResponse invoice = invoiceService.generateInvoice(request);
        return ResponseEntity.ok(invoice);
    }

    @PostMapping("/download-pdf")
    public ResponseEntity<byte[]> downloadInvoicePDF(@RequestBody InvoiceRequest request) {
        try {
            InvoiceResponse invoice = invoiceService.generateInvoice(request);
            byte[] pdfBytes = pdfGeneratorService.generateInvoicePDF(invoice);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(
                    ContentDisposition.builder("attachment")
                            .filename("Bao-Gia-" + invoice.getInvoiceNumber() + ".pdf")
                            .build()
            );

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}