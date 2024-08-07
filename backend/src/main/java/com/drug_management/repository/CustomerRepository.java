package com.drug_management.repository;

import com.drug_management.modal.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    List<Customer> getCustomersByIsDeleted(Boolean isDeleted);
}
