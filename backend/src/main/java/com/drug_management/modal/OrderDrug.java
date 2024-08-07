package com.drug_management.modal;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
public class OrderDrug {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int quantity;

    private Double amount;

    private Boolean isDeleted = false;

    @ManyToOne
    private Drug drug;
}
