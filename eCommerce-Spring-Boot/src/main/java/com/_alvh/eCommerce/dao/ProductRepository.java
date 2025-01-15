package com._alvh.eCommerce.dao;

import com._alvh.eCommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
