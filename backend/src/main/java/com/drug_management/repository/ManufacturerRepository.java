package com.drug_management.repository;

import com.drug_management.modal.Manufacturer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ManufacturerRepository extends JpaRepository<Manufacturer, Long> {

    List<Manufacturer> getManufacturersByIsDeleted(Boolean isDeleted);
}
