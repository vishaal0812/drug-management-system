package com.drug_management.modal;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.util.List;

@Entity
@Setter
@Getter
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Date dateOfPurchase;

    private Double netAmount;

    private Double tax;

    private String totalAmount;

    private String prescription;

    private String paymentStatus;

    private String paymentMode;

    private String cardNumber;

    private Date ExpiryDate;

    private int cvv;

    private Boolean isDeleted = false;

    @ManyToOne
    private Customer customer;

    @OneToMany
    @JoinColumn(name = "order_id")
    private List<OrderDrug> orderDrugs;
}
