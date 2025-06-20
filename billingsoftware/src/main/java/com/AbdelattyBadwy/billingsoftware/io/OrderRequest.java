package com.AbdelattyBadwy.billingsoftware.io;

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
public class OrderRequest  {
    private String customerName;
    private String phoneNumber;
    private List<OrderItemRequest> cartItems;
    private Double subTotal;
    private Double tax;
    private Double grandTotal;
    private PaymentMethod paymentMehthod;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderItemRequest{
        private String itemId;
        private String name;
        private Double price;
        private Integer quantity;
    }
}
