package com.drug_management.manager;

import com.drug_management.modal.Notification;
import com.drug_management.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class NotificationManager {

    @Autowired
    NotificationRepository notificationRepository;

    public void createNotification(String subject, String content) {
        Notification notification = new Notification();
        notification.setTime(new Date());
        notification.setSubject(subject);
        notification.setContent(content);
        notificationRepository.save(notification);
    }
}
