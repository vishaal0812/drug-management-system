package com.drug_management.repository;

import com.drug_management.modal.Customer;
import com.drug_management.modal.Drug;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DrugRepository extends JpaRepository<Drug, Long> {

    List<Drug> getDrugsByIsDeleted(Boolean isDeleted);

    @Query(nativeQuery = true, value = "SELECT * FROM DRUG d WHERE " +
            "(LOWER(d.drug_name) LIKE :text " +
            "OR LOWER(d.benefits_of_drug) LIKE :text " +
            "OR LOWER(d.side_effects_of_drug) LIKE :text " +
            "OR LOWER(d.usage_of_drug) LIKE :text) " +
            "AND d.is_deleted=false")
    List<Drug> searchDrugByText(@Param("text") String text);
}