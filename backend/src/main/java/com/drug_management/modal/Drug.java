package com.drug_management.modal;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.util.List;

@Entity
@Setter
@Getter
public class Drug {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String drugName;

    private Date manufacturedDate;

    private Date expiryDate;

    private float weight;

    private int quantityInStock;

    private Double price;

    private String usageOfDrug;

    private String benefitsOfDrug;

    private String sideEffectsOfDrug;

    private String prescription;

    private String imageOfDrug;

    private Boolean isDeleted = false;

    @ManyToOne
    private Manufacturer manufacturer;
}
