package com._alvh.eCommerce.dto;

import com._alvh.eCommerce.entity.Address;
import com._alvh.eCommerce.entity.Customer;
import com._alvh.eCommerce.entity.Order;
import com._alvh.eCommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
