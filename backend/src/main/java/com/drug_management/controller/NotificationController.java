package com.drug_management.controller;

import com.drug_management.modal.Notification;
import com.drug_management.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @PostMapping("/setMarkAsRead")
    public Boolean setMarkAsReadOfNotifications(@RequestBody() Map<String, Object> body) {
        List<Notification> notifications = notificationRepository.findAllById((List<Long>) body.get("ids"));
        Boolean markType = (Boolean) body.get("markType");
        for (Notification notification : notifications) {
            notification.setIsRead(markType);
            notificationRepository.save(notification);
        }
        return true;
    }

    @PostMapping("/deleteNotifications")
    public Boolean deleteNotification(@RequestBody Map<String, Object> body) {
        List<Long> notificationIds = (List<Long>) body.get("ids");
        notificationRepository.deleteAllById(notificationIds);
        return true;
    }
}
