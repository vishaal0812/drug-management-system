package com.drug_management.controller;

import com.drug_management.modal.Drug;
import com.drug_management.modal.OrderDrug;
import com.drug_management.repository.DrugRepository;
import com.drug_management.repository.OrderDrugRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping
@CrossOrigin("*")
public class DashBoardController {

    @Autowired
    OrderDrugRepository orderDrugRepository;

    @Autowired
    DrugRepository drugRepository;

    @GetMapping("/getDrugsSalesReport")
    public Map<String, List<String>> getDrugsSalesReport() {
        Map<String, List<String>> resultMap = new HashMap<>();
        List<String> drugNames = new ArrayList<>();
        List<String> soldCount = new ArrayList<>();
        List<OrderDrug> orderDrugs = orderDrugRepository.findAll();
        Map<String, String> map = new HashMap<>();
        drugRepository.findAll().stream().forEach((drug) -> {
            map.put(drug.getDrugName(), "0");
        });
        orderDrugs.stream().collect(Collectors.groupingBy(OrderDrug::getDrug)).forEach((drug, details) -> {
            map.put(drug.getDrugName(), String.valueOf(details.stream().mapToInt(OrderDrug::getQuantity).sum()));
        });
        for (Map.Entry<String, String> entry : map.entrySet()) {
            drugNames.add(entry.getKey());
            soldCount.add(entry.getValue());
        }
        resultMap.put("drugs", drugNames);
        resultMap.put("soldCount", soldCount);
        return resultMap;
    }

    @GetMapping("/getDrugAvailability")
    public Map<String, List<String>> getDrugAvailability() {
        Map<String, List<String>> resultMap = new HashMap<>();
        List<String> drugList = new ArrayList<>();
        List<String> stockCounts = new ArrayList<>();
        for (Drug drug : drugRepository.findAll()) {
            drugList.add(drug.getDrugName());
            stockCounts.add(String.valueOf(drug.getQuantityInStock()));
        }
        resultMap.put("drugs", drugList);
        resultMap.put("stocks", stockCounts);
        return resultMap;
    }
}
