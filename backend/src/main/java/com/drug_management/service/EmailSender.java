package com.drug_management.service;

import com.drug_management.modal.Drug;
import com.drug_management.modal.Order;
import com.drug_management.modal.OrderDrug;
import com.drug_management.repository.DrugRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class EmailSender {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) throws MessagingException {

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
        helper.setTo("vishaal0812@gmail.com");
        helper.setSubject(subject);
        helper.setText(body);
        mailSender.send(mimeMessage);
    }

    public void sendBillByEmail(Order order, List<Map<String, Object>> orderedDrugs) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
        String htmlContent = "<html>" +
            "<head>" +
                "<style>" +
                    "table {width: 80%;border-collapse: collapse;}" +
                    "th, td {padding: 8px;text-align: left;border-bottom: 1px solid #ddd;}" +
                    "th {background-color: #f2f2f2;}" +
                "</style>" +
            "</head>" +
            "<body>" +
                "<table>" +
                    "<tr><th>#</th><th>DRUG NAME</th><th>QUANTITY</th><th>DRUG PRICE</th><th>AMOUNT</th></tr>" +
                    getTableWithOrderDetails(orderedDrugs) +
                "</table>" +
            "</body>" +
        "</html>";
        mimeMessage.setContent(htmlContent, "text/html");
        helper.setText(htmlContent, true);
        helper.setTo("vishaal0812@gmail.com");
        helper.setSubject("Drug Order " + (order.getId() != null ? "Updated" : "Placed")  + " Successfully");
        mailSender.send(mimeMessage);
    }
    public String getTableWithOrderDetails(List<Map<String, Object>>  orderedDrugs) {
        String details = "";

        for (int index = 0; index < orderedDrugs.size(); index++) {
            Map<String, Object> orderedDrug = orderedDrugs.get(index);
            Map<String, Object> drug = (Map<String, Object>) orderedDrug.get("drug");
            if (drug != null) {
                details += "<tr>" +
                        "<td>" + (index + 1) + "</td>" +
                        "<td>" + drug.get("drugName") + "</td>" +
                        "<td>" + orderedDrug.get("quantity") + "</td>" +
                        "<td>" + drug.get("price") + "</td>" +
                        "<td>" + orderedDrug.get("amount") + "</td>" +
                        "</tr>";
            }
        }
        return details;
    }
}
