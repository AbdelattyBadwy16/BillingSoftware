package com.AbdelattyBadwy.billingsoftware.io;

import com.AbdelattyBadwy.billingsoftware.entity.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderResponse {
    private String customerName;
    private String phoneNumber;
    private Double subTotal;
    private Double tax;
    private Double grandTotal;
    private LocalDateTime createdAt;
    private List<OrderItemRequest> cartItems;
    private String paymentMehthod;

    @Data
    @Builder
    @NoArgsConstructor
    public static class OrderItemRequest{
        private String itemId;
        private String name;
        private Double price;
        private Integer quantity;
    }
}
