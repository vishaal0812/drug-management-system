package com.drug_management.repository;

import com.drug_management.modal.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findByActive(Boolean active);

    List<User> findByUserNameAndPassword(String userName, String password);

    List<User> findByUserNameAndEmail(String userName, String email);

    List<User> findByEmail(String email);

    List<User> findByUserName(String userName);
}
