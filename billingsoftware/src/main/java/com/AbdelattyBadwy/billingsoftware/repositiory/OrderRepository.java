package com.AbdelattyBadwy.billingsoftware.repositiory;

import com.AbdelattyBadwy.billingsoftware.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderId(String id);

    List<Order> findAllByOrderByCreatedAtDesc();

    @Query("SELECT SUM(o.grandTotal) FROM Order o WHERE o.createdAt >= :start AND o.createdAt < :end")
    Double getTodayTotal(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :start AND o.createdAt < :end")
    Integer countTodayOrders(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(DISTINCT o.phoneNumber) FROM Order o")
    Integer countTotalCustomers();
}
