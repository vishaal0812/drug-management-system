package com.drug_management.modal;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;

    private String middleName;

    private String lastName;

    private String fullName;

    private int age;

    private String email;

    private String contactNumber;

    private String gender;

    private Boolean isDeleted = false;

    @OneToOne
    private Address address;
}
