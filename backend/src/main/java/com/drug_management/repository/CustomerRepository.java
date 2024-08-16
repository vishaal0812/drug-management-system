package com.drug_management.repository;

import com.drug_management.modal.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    List<Customer> getCustomersByIsDeleted(Boolean isDeleted);

    @Query(nativeQuery = true, value = "SELECT * FROM CUSTOMER c WHERE " +
            "(LOWER(c.full_name) LIKE :text " +
            "OR LOWER(c.email) LIKE :text " +
            "OR LOWER(c.contact_number) LIKE :text " +
            "OR CAST(c.age AS varchar) LIKE :text) " +
            "AND c.is_deleted=false")
    List<Customer> searchCustomerByText(@Param("text") String text);
}
