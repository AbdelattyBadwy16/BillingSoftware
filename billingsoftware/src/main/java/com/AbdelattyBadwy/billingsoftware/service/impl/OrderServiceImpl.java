package com.AbdelattyBadwy.billingsoftware.service.impl;

import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import com.AbdelattyBadwy.billingsoftware.entity.Order;
import com.AbdelattyBadwy.billingsoftware.entity.OrderItem;
import com.AbdelattyBadwy.billingsoftware.io.OrderRequest;
import com.AbdelattyBadwy.billingsoftware.io.OrderResponse;
import com.AbdelattyBadwy.billingsoftware.io.PaymentDetails;
import com.AbdelattyBadwy.billingsoftware.io.PaymentMethod;
import com.AbdelattyBadwy.billingsoftware.repositiory.OrderRepository;
import com.AbdelattyBadwy.billingsoftware.service.OrderService;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    @Override
    public OrderResponse createOrder(OrderRequest order) {
        Order neworder = convertToOrderEntity(order);

        PaymentDetails paymentDetails = new PaymentDetails();
        paymentDetails.setPaymentStatus(
                neworder.getPaymentMethod() == PaymentMethod.CASH ? PaymentDetails.PaymentStatus.COMPLETEED
                        : PaymentDetails.PaymentStatus.PENDING);
        neworder.setPaymentDetails(paymentDetails);

        List<OrderItem> orderItems = order.getCartItems().stream()
                .map(this::convertToOrderItemEntity)
                .collect(Collectors.toList());
        neworder.setItems(orderItems);

        neworder = orderRepository.save(neworder);
        return convertToResponse(neworder);
    }

    private OrderItem convertToOrderItemEntity(OrderRequest.OrderItemRequest neworder) {
        return OrderItem.builder()
                .itemId(neworder.getItemId())
                .name(neworder.getName())
                .price(neworder.getPrice())
                .quantity(neworder.getQuantity())
                .build();

    }

    private OrderResponse convertToResponse(Order neworder) {
        return OrderResponse.builder()
                .orderId(neworder.getOrderId())
                .customerName(neworder.getCustomerName())
                .phoneNumber(neworder.getPhoneNumber())
                .subTotal(neworder.getSubTotal())
                .tax(neworder.getTax())
                .grandTotal(neworder.getGrandTotal())
                .paymentMehthod(neworder.getPaymentMethod())
                .cartItems(neworder.getItems().stream().map(this::convertToItemResponse).collect(Collectors.toList()))
                .paymentDetails(neworder.getPaymentDetails())
                .createdAt(neworder.getCreatedAt())
                .build();

    }

    private OrderResponse.OrderItemResponse convertToItemResponse(OrderItem neworder) {
        return OrderResponse.OrderItemResponse.builder()
                .itemId(neworder.getItemId())
                .name(neworder.getName())
                .price(neworder.getPrice())
                .quantity(neworder.getQuantity())
                .build();

    }

    private Order convertToOrderEntity(OrderRequest order) {
        return Order.builder()
                .customerName(order.getCustomerName())
                .phoneNumber(order.getPhoneNumber())
                .subTotal(order.getSubTotal())
                .tax(order.getTax())
                .grandTotal(order.getGrandTotal())
                .paymentMethod(order.getPaymentMehthod())
                .build();
    }

    @Override
    public void deleteOrder(String orderId) {
        Order order = orderRepository.findByOrderId(orderId).orElseThrow(()-> new RuntimeException("Order Not Found"));
        orderRepository.delete(order);
    }

    @Override
    public List<OrderResponse> getLatestOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::convertToResponse).collect(Collectors.toList());
    }

}
