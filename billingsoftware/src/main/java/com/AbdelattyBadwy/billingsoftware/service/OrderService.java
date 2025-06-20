package com.AbdelattyBadwy.billingsoftware.service;

import java.util.List;

import com.AbdelattyBadwy.billingsoftware.io.OrderRequest;
import com.AbdelattyBadwy.billingsoftware.io.OrderResponse;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

public interface OrderService {


    OrderResponse createOrder(OrderRequest order);

    void deleteOrder(String orderId);

    List<OrderResponse> getLatestOrders();

}
