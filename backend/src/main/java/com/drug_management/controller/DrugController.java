package com.drug_management.controller;

import com.drug_management.manager.NotificationManager;
import com.drug_management.modal.Drug;
import com.drug_management.modal.Manufacturer;
import com.drug_management.modal.OrderDrug;
import com.drug_management.repository.DrugRepository;
import com.drug_management.repository.ManufacturerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping
public class DrugController {

    @Autowired
    DrugRepository drugRepository;

    @Autowired
    ManufacturerRepository manufacturerRepository;

    @Autowired
    NotificationManager notificationManager;

    @GetMapping("/getAllDrugs")
    public List<Drug> getAllDrugs() {
        return drugRepository.getDrugsByIsDeleted(false);
    }

    @PostMapping("/createAndUpdateDrug")
    public boolean createDrug(@RequestBody Map<String, Object> body) {
        Drug drug = new Drug();
        if (body.containsKey("id"))
            drug = drugRepository.findById(Long.valueOf(body.get("id").toString())).orElse(new Drug());
        Manufacturer manufacturer = manufacturerRepository
                .findById(Long.valueOf(body.get("manufacturer").toString())).orElse(null);
        drug.setManufacturer(manufacturer);
        drug.setDrugName(body.get("drugName").toString());
        drug.setManufacturedDate(Date.valueOf(body.get("manufacturedDate").toString()));
        drug.setExpiryDate(Date.valueOf(body.get("expiryDate").toString()));
        drug.setWeight(Float.parseFloat(body.get("weight").toString()));
        drug.setQuantityInStock(Integer.parseInt(body.get("quantityInStock").toString()));
        drug.setPrice(Double.valueOf(body.get("price").toString()));
        drug.setUsageOfDrug(body.get("usageOfDrug").toString());
        if (body.containsKey("benefitsOfDrug") && body.get("benefitsOfDrug") != null)
            drug.setBenefitsOfDrug(body.get("benefitsOfDrug").toString());
        if (body.containsKey("sideEffects") && body.get("sideEffects") != null)
            drug.setSideEffectsOfDrug(body.get("sideEffects").toString());
        if (body.containsKey("prescriptionNeed") && body.get("prescriptionNeed") != null)
            drug.setPrescription(body.get("prescriptionNeed").toString());
        drugRepository.save(drug);
        notificationManager.createNotification(drug.getDrugName() + " Created Successfully",
                drug.getDrugName() + " created successfully with stock of " + drug.getQuantityInStock());
        return true;
    }

    @GetMapping("/getDrug/{drugId}")
    public Map<String, Object> getDrug(@PathVariable String drugId) {
        Drug drug = drugRepository.findById(Long.valueOf(drugId)).orElse(null);
        Map<String, Object> result = new HashMap<>();
        if (drug != null) {
            result.put("drugName", drug.getDrugName());
            result.put("manufacturer", drug.getManufacturer().getId());
            result.put("manufacturedDate", drug.getManufacturedDate());
            result.put("expiryDate", drug.getExpiryDate());
            result.put("weight", drug.getWeight());
            result.put("quantityInStock", drug.getQuantityInStock());
            result.put("price", drug.getPrice());
            result.put("usageOfDrug", drug.getUsageOfDrug());
            result.put("benefitsOfDrug", drug.getBenefitsOfDrug());
            result.put("sideEffects", drug.getSideEffectsOfDrug());
            result.put("prescriptionNeed", drug.getPrescription());
        }
        return result;
    }

    @PostMapping("/deleteDrug")
    public Boolean deleteDrug(Map<String, Object> body) {
        List<Object> drugIds = (List<Object>) body.get("ids");
        for (Object drugId : drugIds) {
            Drug drug = drugRepository.findById(Long.parseLong(drugId.toString())).orElse(null);
            if (drug != null) {
                drug.setIsDeleted(true);
                drugRepository.save(drug);
            }
        }
        return true;
    }
}
