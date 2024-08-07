package com.drug_management.repository;

import com.drug_management.modal.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> getNotificationsByIsDeleted(boolean isDelete);
}
