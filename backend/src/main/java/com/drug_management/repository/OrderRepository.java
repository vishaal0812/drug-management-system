package com.drug_management.repository;

import com.drug_management.modal.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query(nativeQuery = true, value = "SELECT * FROM ORDERS o WHERE " +
            "(CAST(o.net_amount AS varchar) LIKE :text " +
            "OR CAST(o.tax AS varchar) LIKE :text " +
            "OR CAST(o.total_amount AS varchar) LIKE :text) " +
            "AND o.is_deleted=false")
    List<Order> searchOrderByText(@Param("text") String text);
}
