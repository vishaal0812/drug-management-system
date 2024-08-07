package com.drug_management.manager;

import com.drug_management.modal.Address;
import com.drug_management.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class AddressManager {

    @Autowired
    AddressRepository addressRepository;

    public Address createAddress(Address address, Map<String, Object> body) {
        address.setAddressLine1(body.get("addressLine1").toString());
        address.setAddressLine2(body.get("addressLine2").toString());
        address.setCity(body.get("city").toString());
        address.setState(body.get("state").toString());
        address.setPinCode(Integer.parseInt(body.get("pinCode").toString()));
        addressRepository.save(address);
        return address;
    }
}
