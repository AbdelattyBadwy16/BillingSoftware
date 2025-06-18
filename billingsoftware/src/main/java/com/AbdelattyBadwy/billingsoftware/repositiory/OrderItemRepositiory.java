package com.AbdelattyBadwy.billingsoftware.repositiory;

import com.AbdelattyBadwy.billingsoftware.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepositiory extends JpaRepository<OrderItem,Long> {

}
