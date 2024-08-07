package com.drug_management.controller;

import com.drug_management.modal.Notification;
import com.drug_management.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping
public class NotificationController {

    @Autowired
    NotificationRepository notificationRepository;

    @GetMapping("/getAllNotifications")
    public List<Notification> getAllNotification() {
        return notificationRepository.getNotificationsByIsDeleted(false);
    }
}
