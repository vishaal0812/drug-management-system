package com.drug_management.repository;

import com.drug_management.modal.Manufacturer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ManufacturerRepository extends JpaRepository<Manufacturer, Long> {

    List<Manufacturer> getManufacturersByIsDeleted(Boolean isDeleted);

    @Query(nativeQuery = true, value = "SELECT * FROM MANUFACTURER m WHERE " +
            "(LOWER(m.full_name) LIKE :text " +
            "OR LOWER(m.email) LIKE :text " +
            "OR CAST(m.tin_number AS varchar) LIKE :text " +
            "OR LOWER(m.company_name) LIKE :text) " +
            "AND m.is_deleted=false")
    List<Manufacturer> searchManufacturerByText(@Param("text") String text);
}
