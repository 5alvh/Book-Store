package com._alvh.eCommerce.service;

import com._alvh.eCommerce.dto.Purchase;
import com._alvh.eCommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

}
