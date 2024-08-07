package com.drug_management.modal;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private byte[] profile;

    private String userName;

    private String email;

    private String password;

    private String role;

    private Boolean active = true;

    private Boolean isDeleted = false;
}
