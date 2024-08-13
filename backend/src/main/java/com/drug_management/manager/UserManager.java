package com.drug_management.manager;

import com.drug_management.modal.User;
import com.drug_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class UserManager {

    @Autowired
    UserRepository userRepository;

    public Map<String, Object> getCurrentUser() {
        List<User> users = userRepository.findByActive(true);
        User user;
        if (!users.isEmpty()) {
            user = users.getFirst();
            Map<String, Object> result = new HashMap<>();
            result.put("id", user.getId());
            result.put("userName", user.getUserName());
            result.put("password", user.getPassword());
            result.put("email", user.getEmail());
            result.put("profile", Base64.getEncoder().encodeToString(user.getProfile()));
            return result;
        }
        return new HashMap<>();
    }
}
