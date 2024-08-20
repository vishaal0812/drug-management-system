package com.drug_management.controller;

import com.drug_management.manager.AddressManager;
import com.drug_management.manager.OrderManager;
import com.drug_management.modal.Address;
import com.drug_management.modal.Customer;
import com.drug_management.modal.Order;
import com.drug_management.repository.CustomerRepository;
import com.drug_management.repository.OrderRepository;
import com.drug_management.service.EmailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping()
public class CustomerController {

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderManager orderManager;

    @Autowired
    AddressManager addressManager;

    @Autowired
    EmailSender emailSender;

    @GetMapping("/getAllCustomers")
    public List<Customer> getAllCustomers() {
        List<Customer> customers = customerRepository.getCustomersByIsDeleted(false);
        return customers;
    }

    @GetMapping("/findAllCustomers")
    public List<Customer> findAllCustomers() {
        return customerRepository.findAll();
    }

    @GetMapping("getCustomer/{customerId}")
    public Map<String, Object> getCustomer(@PathVariable("customerId") String customerId) {
        Map<String, Object> result = new HashMap<>();
        Customer customer = customerRepository.findById(Long.valueOf(customerId)).orElse(null);
        if (customer != null) {
            result.put("firstName", customer.getFirstName());
            if (customer.getMiddleName() != null)
                result.put("middleName", customer.getMiddleName());
            result.put("lastName", customer.getLastName());
            result.put("fullName", customer.getFullName());
            result.put("age", customer.getAge());
            result.put("email", customer.getEmail());
            result.put("contactNumber", customer.getContactNumber());
            result.put("gender", customer.getGender());
            result.put("addressLine1", customer.getAddress().getAddressLine1());
            result.put("addressLine2", customer.getAddress().getAddressLine2());
            result.put("city", customer.getAddress().getCity());
            result.put("state", customer.getAddress().getState());
            result.put("pinCode", customer.getAddress().getPinCode());
        }
        return result;
    }

    @PostMapping("/getCustomerOrders/{customerId}")
    public List<Order> getCustomerOrders(@PathVariable()Long customerId) {
        List<Order> customerOrders = orderRepository.findByCustomerId(customerId);
        return !customerOrders.isEmpty() ? customerOrders : null;
    }

    @PostMapping("/createAndUpdateCustomer")
    public boolean createCustomer(@RequestBody Map<String, Object> body) {
        Customer customer = new Customer();
        if (body.containsKey("id"))
            customer = customerRepository.findById(Long.valueOf(body.get("id").toString())).orElse(new Customer());
        customer.setFirstName(body.get("firstName").toString());
        if (body.containsKey("middleName"))
            customer.setMiddleName(body.get("middleName").toString());
        customer.setLastName(body.get("lastName").toString());
        customer.setFullName(customer.getFirstName() + " " +
                (customer.getMiddleName() != null ? customer.getMiddleName() + " " : "") + customer.getLastName());
        customer.setAge(Integer.parseInt(body.get("age").toString()));
        customer.setEmail(body.get("email").toString());
        customer.setContactNumber(body.get("contactNumber").toString());
        customer.setGender(body.get("gender").toString());
        Address address = body.containsKey("id") ? customer.getAddress() : new Address();
        Address customerAddress = addressManager.createAddress(address, body);
        customer.setAddress(customerAddress);
        customerRepository.save(customer);
        return true;
    }

    @PostMapping("/deleteCustomer")
    public boolean deleteCustomer(@RequestBody Map<String, Object> body) {
        List<Object> customerIds = (List<Object>) body.get("ids");
        for (Object customerId : customerIds) {
            Customer customer = customerRepository.findById(Long.valueOf(customerId.toString())).orElse(null);
            if (customer != null) {
                customer.setIsDeleted(true);
                customerRepository.save(customer);
            }
        }
        return true;
    }
}
