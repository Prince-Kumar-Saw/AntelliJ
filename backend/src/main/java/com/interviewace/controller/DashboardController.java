package com.interviewace.controller;

import com.interviewace.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dashboard statistics and analytics")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @Operation(summary = "Get user dashboard statistics")
    public ResponseEntity<Map<String, Object>> getStats(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getDashboardStats(auth.getName()));
    }

    @GetMapping("/weekly-performance")
    @Operation(summary = "Get weekly performance data for charts")
    public ResponseEntity<Map<String, Object>> getWeeklyPerformance(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getWeeklyPerformance(auth.getName()));
    }
}
