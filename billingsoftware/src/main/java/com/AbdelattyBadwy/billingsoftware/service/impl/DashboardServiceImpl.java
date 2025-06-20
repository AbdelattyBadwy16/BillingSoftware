package com.AbdelattyBadwy.billingsoftware.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.AbdelattyBadwy.billingsoftware.repositiory.OrderRepository;
import com.AbdelattyBadwy.billingsoftware.service.DashboardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final OrderRepository orderRepository;

    @Override
    public Double getTodaySales() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        return orderRepository.getTodayTotal(startOfDay, endOfDay);
    }

    @Override
    public Integer getTodayOrders() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        return orderRepository.countTodayOrders(startOfDay, endOfDay);
    }

    @Override
    public Integer getTotalCustomers() {
         return orderRepository.countTotalCustomers();
    }

}
