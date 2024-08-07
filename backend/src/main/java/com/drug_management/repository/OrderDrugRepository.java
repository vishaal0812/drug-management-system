package com.drug_management.repository;

import com.drug_management.modal.OrderDrug;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderDrugRepository extends JpaRepository<OrderDrug, Long> {
}
