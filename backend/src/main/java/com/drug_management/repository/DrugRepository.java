package com.drug_management.repository;

import com.drug_management.modal.Customer;
import com.drug_management.modal.Drug;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DrugRepository extends JpaRepository<Drug, Long> {

    List<Drug> getDrugsByIsDeleted(Boolean isDeleted);
}
