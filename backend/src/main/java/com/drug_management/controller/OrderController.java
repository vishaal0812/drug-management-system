package com.drug_management.controller;

import com.drug_management.manager.OrderManager;
import com.drug_management.modal.Customer;
import com.drug_management.modal.Drug;
import com.drug_management.modal.Order;
import com.drug_management.modal.OrderDrug;
import com.drug_management.repository.CustomerRepository;
import com.drug_management.repository.DrugRepository;
import com.drug_management.repository.OrderDrugRepository;
import com.drug_management.repository.OrderRepository;
import com.drug_management.service.EmailSender;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.*;

@RestController
@CrossOrigin("*")
@RequestMapping
public class OrderController {

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderManager orderManager;

    @Autowired
    OrderDrugRepository orderDrugRepository;

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    DrugRepository drugRepository;

    @Autowired
    EmailSender emailSender;

    @GetMapping("/getAllOrders")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @PostMapping("/createAndUpdateOrder")
    public boolean createOrder(@RequestBody Map<String, Object> body) throws MessagingException {
        Order order = new Order();
        if (body.containsKey("id"))
            order = orderRepository.findById(Long.valueOf(body.get("id").toString())).orElse(new Order());
        Customer customer = customerRepository.findById(Long.valueOf(body.get("customer").toString())).orElse(null);
        order.setCustomer(customer);
        order.setDateOfPurchase(Date.valueOf(body.get("dateOfPurchase").toString()));
        order.setNetAmount(Double.valueOf(body.get("netAmount").toString()));
        order.setTax(Double.valueOf(body.get("tax").toString()));
        order.setTotalAmount(body.get("totalAmount").toString());
        if (body.containsKey("prescription"))
            order.setPrescription(body.get("prescription").toString());
        order.setPaymentMode(body.get("paymentMode").toString());
        order.setPaymentStatus(body.get("paymentStatus").toString());

        List<OrderDrug> orderDrugs = new ArrayList<>();
        List<Map<String, Object>>  orderedDrugs = (List<Map<String, Object>>) body.get("drugs");
        for (Map<String, Object> drugDetails : orderedDrugs) {
            Drug drug = drugRepository.findById(Long.valueOf(String.valueOf(drugDetails.get("drugId")))).orElse(null);
            OrderDrug orderDrug = new OrderDrug();
            if (order.getId() != null) {
                Optional<OrderDrug> optional = order.getOrderDrugs().stream()
                        .filter(d -> d.getDrug().getId().equals(drug.getId())).findFirst();
                if (optional.isPresent()) {
                    orderDrug = optional.get();
                    drug.setQuantityInStock(drug.getQuantityInStock() + orderDrug.getQuantity());
                }
            }
            int drugQuantity = Integer.parseInt(String.valueOf(drugDetails.get("quantity")));
            orderDrug.setQuantity(drugQuantity);
            orderDrug.setAmount(Double.valueOf(String.valueOf(drugDetails.get("amount"))));
            orderDrug.setDrug(drug);
            assert drug != null;
            drug.setQuantityInStock(drug.getQuantityInStock() - drugQuantity);
            drugRepository.save(drug);
            orderDrugRepository.save(orderDrug);
            orderDrugs.add(orderDrug);
        }
        order.setOrderDrugs(orderDrugs);
        emailSender.sendBillByEmail(order, orderedDrugs);
        orderRepository.save(order);
        return true;
    }

    @GetMapping("/getOrder/{orderId}")
    public Map<String, Object> getOrder(@PathVariable String orderId) {
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> drugs = new ArrayList<>();
        Order order = orderRepository.findById(Long.valueOf(orderId)).orElse(null);
        if (order != null) {
            result.put("id", order.getId());
            result.put("customer", order.getCustomer().getId());
            result.put("dateOfPurchase", order.getDateOfPurchase());
            result.put("netAmount", order.getNetAmount());
            result.put("tax", order.getTax());
            result.put("totalAmount", order.getTotalAmount());
            result.put("prescription", order.getPrescription());
            result.put("paymentStatus", order.getPaymentStatus());
            result.put("paymentMode", order.getPaymentMode());
            result.put("cardNumber", order.getCardNumber());
            result.put("expiryDate", order.getExpiryDate());
            result.put("cvv", order.getCvv());

            for (OrderDrug orderDrug : order.getOrderDrugs()) {
                Map<String, Object> orderedDrugMap = new HashMap<>();
                orderedDrugMap.put("amount", orderDrug.getAmount());
                orderedDrugMap.put("quantity", orderDrug.getQuantity());
                orderedDrugMap.put("drugId", orderDrug.getDrug().getId());
                orderedDrugMap.put("drug", orderDrug.getDrug());
                drugs.add(orderedDrugMap);
            }
            result.put("drugs", drugs);
        }
        return result;
    }

    @DeleteMapping("/deleteOrder")
    public boolean deleteOrder(@RequestBody Map<String, Object> body) {
        List<Object> orderIds = (List<Object>) body.get("ids");
        for (Object orderId : orderIds) {
            Order order = orderRepository.findById(Long.parseLong(orderId.toString())).orElse(null);
            if (order != null) {
                orderDrugRepository.deleteAll(order.getOrderDrugs());
                orderRepository.delete(order);
            }
        }
        return true;
    }
}
