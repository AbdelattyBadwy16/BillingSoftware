package com.AbdelattyBadwy.billingsoftware.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.AbdelattyBadwy.billingsoftware.service.DashboardService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/dashbord")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/todaySales")
    public Double getTodaySales() {
        return dashboardService.getTodaySales();
    }
    
     @GetMapping("/todayOrders")
    public Integer getTodayOrders() {
        return dashboardService.getTodayOrders();
    }

    @GetMapping("/totalCustomers")
    public Integer getTotalCustomers() {
        return dashboardService.getTotalCustomers();
    }
}
