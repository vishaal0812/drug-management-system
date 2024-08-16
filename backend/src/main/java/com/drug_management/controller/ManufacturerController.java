package com.drug_management.controller;

import com.drug_management.manager.AddressManager;
import com.drug_management.modal.Address;
import com.drug_management.modal.Manufacturer;
import com.drug_management.repository.ManufacturerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping
public class ManufacturerController {

    @Autowired
    ManufacturerRepository manufacturerRepository;

    @Autowired
    AddressManager addressManager;

    @GetMapping("/getAllManufacturers")
    public List<Manufacturer> getAllManufacturers() {

        List<Manufacturer> list = manufacturerRepository.searchManufacturerByText("kumar");
        for (Manufacturer manufacturer : list) {
            System.out.println("RESULT : " + manufacturer);
        }

        return manufacturerRepository.getManufacturersByIsDeleted(false);
    }

    @GetMapping("/findAllManufacturers")
    public List<Manufacturer> findAllManufacturers() {
        return manufacturerRepository.findAll();
    }

    @PostMapping("/createAndUpdateManufacturer")
    public boolean createManufacturer(@RequestBody Map<String, Object> body) {
        Manufacturer manufacturer = new Manufacturer();
        if (body.containsKey("id"))
            manufacturer = manufacturerRepository.findById(Long.valueOf(body.get("id").toString())).orElse(new Manufacturer());
        manufacturer.setFirstName(body.get("firstName").toString());
        manufacturer.setMiddleName(body.containsKey("middleName") ?
                body.get("middleName").toString() : "");
        manufacturer.setLastName(body.get("lastName").toString());
        manufacturer.setEmail(body.get("email").toString());
        manufacturer.setCompanyName(body.get("companyName").toString());
        manufacturer.setTinNumber(Integer.parseInt(body.get("tinNumber").toString()));
        Address address = body.containsKey("id") ? manufacturer.getAddress() : new Address();
        Address manufacturerAddress = addressManager.createAddress(address, body);
        manufacturer.setAddress(manufacturerAddress);
        manufacturer.setFullName(manufacturer.getFirstName() + " " +
                manufacturer.getMiddleName() + " " + manufacturer.getLastName());
        manufacturerRepository.save(manufacturer);
        return true;
    }

    @GetMapping("/getManufacturers/{manufacturerId}")
    public Map<String, Object> getManufacturer(@PathVariable String manufacturerId) {
        Map<String, Object> result = new HashMap<>();
        Manufacturer manufacturer = manufacturerRepository.findById(Long.valueOf(manufacturerId)).orElse(null);
        if (manufacturer != null) {
            result.put("firstName", manufacturer.getFirstName());
            result.put("middleName", manufacturer.getMiddleName());
            result.put("lastName", manufacturer.getLastName());
            result.put("fullName", manufacturer.getFullName());
            result.put("email", manufacturer.getEmail());
            result.put("companyName", manufacturer.getCompanyName());
            result.put("tinNumber", manufacturer.getTinNumber());
            result.put("addressLine1", manufacturer.getAddress().getAddressLine1());
            result.put("addressLine2", manufacturer.getAddress().getAddressLine2());
            result.put("city", manufacturer.getAddress().getCity());
            result.put("state", manufacturer.getAddress().getState());
            result.put("pinCode", manufacturer.getAddress().getPinCode());
        }
        return result;
    }

    @PostMapping("/deleteManufacturer")
    public boolean deleteManufacturer(@RequestBody Map<String, Object> body) {
        List<Object> manufacturersIds = (List<Object>) body.get("ids");
        for (Object manufacturerId : manufacturersIds) {
            Manufacturer manufacturer = manufacturerRepository.findById(Long.valueOf(manufacturerId.toString())).orElse(null);
            if (manufacturer != null) {
                manufacturer.setIsDeleted(true);
                manufacturerRepository.save(manufacturer);
            }
        }
        return true;
    }
}
