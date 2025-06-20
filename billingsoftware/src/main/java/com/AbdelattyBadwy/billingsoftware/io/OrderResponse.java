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
    private String orderId;
    private String customerName;
    private String phoneNumber;
    private Double subTotal;
    private Double tax;
    private Double grandTotal;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> cartItems;
    private PaymentMethod paymentMehthod;
    private PaymentDetails paymentDetails;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderItemResponse{
        private String itemId;
        private String name;
        private Double price;
        private Integer quantity;
    }
}
