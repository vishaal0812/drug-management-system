package com.drug_management.controller;

import com.drug_management.manager.UserManager;
import com.drug_management.modal.User;
import com.drug_management.repository.UserRepository;
import com.drug_management.service.EmailSender;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RequestMapping
@CrossOrigin("*")
@RestController
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    EmailSender emailSender;

    @Autowired
    UserManager userManager;

    @GetMapping("/getCurrentUser")
    private Map<String, Object> getCurrentUser() {
        return userManager.getCurrentUser();
    }

    @PostMapping("/userLogin")
    private Boolean checkLogin(@RequestBody Map<String, Object> body) {
        String userName = body.get("userName").toString();
        String password = body.get("password").toString();
        List<User> users;
        if (body.containsKey("newPassword")) {
            users = userRepository.findByUserNameAndEmail(userName, body.get("email").toString());
        }else users = userRepository.findByUserNameAndPassword(userName, password);
        if (!users.isEmpty()) {
            User user = users.getFirst();
            user.setPassword(password);
            user.setActive(true);
            userRepository.save(user);
        }
        return !users.isEmpty();
    }

    @PostMapping("/logout")
    private void logout() {
        User user = userRepository.findByActive(true).getFirst();
        user.setActive(false);
        userRepository.save(user);
    }

    @PostMapping("/createAndUpdateUser")
    private Map<String, Object> createUser(@RequestParam(value = "profile", required = false) MultipartFile profile,
                              @RequestParam Map<String, Object> body) throws IOException {
        User user = new User();
        if (body.containsKey("id")) {
            user = userRepository.findById(Long.valueOf(body.get("id").toString())).orElse(null);
        }else {
            List<User> existingUsers = userRepository.findByEmail(body.get("email").toString());
            if (!existingUsers.isEmpty())
                return Map.of("error", "User Email " + body.get("email") + " Already Exist");
            existingUsers = userRepository.findByUserName(body.get("userName").toString());
            if (!existingUsers.isEmpty())
                return Map.of("error", "User Name " + body.get("userName") + " Already Exist");
            Path path = Paths.get(body.get("profile").toString());
            user.setProfile(Files.readAllBytes(path));
        }
        assert user != null;
        if (profile != null && !profile.isEmpty())
            user.setProfile(profile.getBytes());
        user.setUserName(body.get("userName").toString());
        user.setEmail(body.get("email").toString());
        user.setPassword(body.get("password").toString());
        userRepository.save(user);
        return userManager.getCurrentUser();
    }

    @PostMapping("/sendEmailForResetPassword")
    private Boolean sendEmailForResetPassword(@RequestBody Map<String, Object> body) throws MessagingException {
        String toEmail = body.get("email").toString();
        List<User> users = userRepository.findByEmail(toEmail);
        if (!users.isEmpty()) {
            String subject = "Reset Password for Drug Management";
            String emailBody = "Resetting password for drug management login\n" +
                    "\nUser Name : " + users.getFirst().getUserName() +
                    "\nUse this password : " + body.get("password");
            emailSender.sendEmail(toEmail, subject, emailBody);
            return true;
        }else return false;
    }
}
