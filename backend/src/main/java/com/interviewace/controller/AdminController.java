package com.interviewace.controller;

import com.interviewace.entity.*;
import com.interviewace.service.AdminService;
import com.interviewace.service.AptitudeService;
import com.interviewace.service.CodingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Admin Panel", description = "Admin-only platform management endpoints")
public class AdminController {

    private final AdminService adminService;
    private final CodingService codingService;
    private final AptitudeService aptitudeService;

    @GetMapping("/users")
    @Operation(summary = "Get all users with pagination")
    public ResponseEntity<Page<User>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminService.getUsers(page, size));
    }

    @PutMapping("/users/{id}/status")
    @Operation(summary = "Activate or deactivate a user account")
    public ResponseEntity<Map<String, String>> updateUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {
        adminService.setUserStatus(id, body.get("isActive"));
        return ResponseEntity.ok(Map.of("message", "User status updated"));
    }

    @PostMapping("/coding/problems")
    @Operation(summary = "Add a new coding problem")
    public ResponseEntity<CodingProblem> addProblem(
            @RequestBody CodingProblem problem,
            Authentication auth) {
        return ResponseEntity.ok(codingService.addProblem(problem, auth.getName()));
    }

    @PostMapping("/aptitude/questions")
    @Operation(summary = "Add a new aptitude question")
    public ResponseEntity<AptitudeQuestion> addQuestion(
            @RequestBody AptitudeQuestion question,
            Authentication auth) {
        return ResponseEntity.ok(aptitudeService.addQuestion(question, auth.getName()));
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get platform-wide analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }
}
