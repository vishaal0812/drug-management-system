package com.drug_management.manager;

import com.drug_management.modal.Order;
import com.drug_management.repository.OrderDrugRepository;
import com.drug_management.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class OrderManager {

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderDrugRepository orderDrugRepository;

    public void deleteOrder(Order order) {
        if (order != null) {
            orderDrugRepository.deleteAll(order.getOrderDrugs());
            orderRepository.delete(order);
        }
    }
}
