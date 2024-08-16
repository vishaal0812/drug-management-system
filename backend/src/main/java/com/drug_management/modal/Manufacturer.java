package com.drug_management.modal;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Setter
@Getter
public class Manufacturer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;

    private String middleName;

    private String lastName;

    private String fullName;

    private String email;

    private String companyName;

    private int tinNumber;

    private Boolean isDeleted = false;

    @OneToOne
    private Address address;

    @Override
    public String toString() {
        return "Manufacturer{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", middleName='" + middleName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", companyName='" + companyName + '\'' +
                ", tinNumber=" + tinNumber +
                ", isDeleted=" + isDeleted +
                ", address=" + address +
                '}';
    }
}
