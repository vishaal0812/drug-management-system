package com.drug_management.controller;

import com.drug_management.modal.Customer;
import com.drug_management.modal.Drug;
import com.drug_management.modal.Manufacturer;
import com.drug_management.modal.Order;
import com.drug_management.repository.CustomerRepository;
import com.drug_management.repository.DrugRepository;
import com.drug_management.repository.ManufacturerRepository;
import com.drug_management.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping
@CrossOrigin("*")
public class ApplicationController {

    @Autowired
    ManufacturerRepository manufacturerRepository;

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    DrugRepository drugRepository;

    @Autowired
    OrderRepository orderRepository;

    @PostMapping("/globalSearch")
    public Map<String, Object> globalSearch(@RequestBody()Map<String, Object> body) {
        Map<String, Object> searchResult = new HashMap<>();
        String text = "%" + body.get("text").toString().toLowerCase() + "%";
        List<Manufacturer> manufacturers = manufacturerRepository.searchManufacturerByText(text);
        List<Customer> customers = customerRepository.searchCustomerByText(text);
        List<Drug> drugs = drugRepository.searchDrugByText(text);
        List<Order> orders = orderRepository.searchOrderByText(text);
        if (!manufacturers.isEmpty()) searchResult.put("manufacturers", manufacturers);
        if (!customers.isEmpty()) searchResult.put("customers", customers);
        if (!drugs.isEmpty()) searchResult.put("drugs", drugs);
        if (!orders.isEmpty()) searchResult.put("orders", orders);
       return searchResult;
    }
}
