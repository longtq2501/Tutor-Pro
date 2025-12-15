package com.tutor_management.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.mail.from-name}")
    private String fromName;

    public void sendInvoiceEmail(String toEmail, String parentName,
                                 String studentName, String month,
                                 byte[] pdfData, String invoiceNumber) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // Sender
            helper.setFrom(fromEmail, fromName);

            // Recipient
            helper.setTo(toEmail);

            // Subject
            helper.setSubject("Hóa đơn học phí tháng " + month + " - " + studentName);

            // Email body (HTML)
            String htmlContent = buildEmailContent(parentName, studentName, month, invoiceNumber);
            helper.setText(htmlContent, true);

            // Attach PDF
            String fileName = "Hoa-don-" + invoiceNumber + ".pdf";
            helper.addAttachment(fileName, new ByteArrayResource(pdfData));

            // Send
            mailSender.send(message);

            System.out.println("Email sent successfully to: " + toEmail);

        } catch (Exception e) {
            throw new RuntimeException("Failed to send email to: " + toEmail, e);
        }
    }

    private String buildEmailContent(String parentName, String studentName,
                                     String month, String invoiceNumber) {
        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <style>\n" +
                "        body {\n" +
                "            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n" +
                "            line-height: 1.6;\n" +
                "            color: #333;\n" +
                "            max-width: 600px;\n" +
                "            margin: 0 auto;\n" +
                "            padding: 20px;\n" +
                "        }\n" +
                "        .header {\n" +
                "            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n" +
                "            color: white;\n" +
                "            padding: 30px;\n" +
                "            border-radius: 10px 10px 0 0;\n" +
                "            text-align: center;\n" +
                "        }\n" +
                "        .content {\n" +
                "            background: #f9fafb;\n" +
                "            padding: 30px;\n" +
                "            border-radius: 0 0 10px 10px;\n" +
                "        }\n" +
                "        .invoice-info {\n" +
                "            background: white;\n" +
                "            padding: 20px;\n" +
                "            border-radius: 8px;\n" +
                "            margin: 20px 0;\n" +
                "            border-left: 4px solid #667eea;\n" +
                "        }\n" +
                "        .info-row {\n" +
                "            display: flex;\n" +
                "            justify-content: space-between;\n" +
                "            padding: 8px 0;\n" +
                "            border-bottom: 1px solid #e5e7eb;\n" +
                "        }\n" +
                "        .info-row:last-child {\n" +
                "            border-bottom: none;\n" +
                "        }\n" +
                "        .label {\n" +
                "            font-weight: bold;\n" +
                "            color: #6b7280;\n" +
                "        }\n" +
                "        .value {\n" +
                "            color: #111827;\n" +
                "        }\n" +
                "        .footer {\n" +
                "            text-align: center;\n" +
                "            margin-top: 30px;\n" +
                "            padding-top: 20px;\n" +
                "            border-top: 2px solid #e5e7eb;\n" +
                "            color: #6b7280;\n" +
                "            font-size: 14px;\n" +
                "        }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"header\">\n" +
                "        <h1>📄 HÓA ĐƠN HỌC PHÍ</h1>\n" +
                "        <p>ENGLISH TUTORING</p>\n" +
                "    </div>\n" +
                "    \n" +
                "    <div class=\"content\">\n" +
                "        <p>Kính gửi Quý phụ huynh <strong>" + parentName + "</strong>,</p>\n" +
                "        \n" +
                "        <p>Chúng tôi xin gửi đến Quý phụ huynh hóa đơn học phí cho học sinh <strong>" + studentName + "</strong>.</p>\n" +
                "        \n" +
                "        <div class=\"invoice-info\">\n" +
                "            <div class=\"info-row\">\n" +
                "                <span class=\"label\">Số hóa đơn:</span>\n" +
                "                <span class=\"value\">" + invoiceNumber + "</span>\n" +
                "            </div>\n" +
                "            <div class=\"info-row\">\n" +
                "                <span class=\"label\">Tháng:</span>\n" +
                "                <span class=\"value\">" + month + "</span>\n" +
                "            </div>\n" +
                "            <div class=\"info-row\">\n" +
                "                <span class=\"label\">Học sinh:</span>\n" +
                "                <span class=\"value\">" + studentName + "</span>\n" +
                "            </div>\n" +
                "        </div>\n" +
                "        \n" +
                "        <p>📎 <strong>Hóa đơn chi tiết đính kèm trong file PDF.</strong></p>\n" +
                "        \n" +
                "        <p style=\"margin-top: 30px;\">Quý phụ huynh vui lòng kiểm tra và thanh toán theo thông tin trong hóa đơn.</p>\n" +
                "        \n" +
                "        <p>Nếu có bất kỳ thắc mắc nào, xin vui lòng liên hệ với chúng tôi.</p>\n" +
                "        \n" +
                "        <div class=\"footer\">\n" +
                "            <p><strong>English Tutoring</strong></p>\n" +
                "            <p>Cảm ơn Quý phụ huynh đã tin tưởng! 🙏</p>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";
    }
}