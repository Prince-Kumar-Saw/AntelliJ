package com.interviewace.controller;

import com.interviewace.service.ProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/progress")
@RequiredArgsConstructor
@Tag(name = "Progress Tracker", description = "Learning progress and analytics")
public class ProgressController {

    private final ProgressService progressService;

    @GetMapping("/streak")
    @Operation(summary = "Get user learning streak data")
    public ResponseEntity<Map<String, Object>> getStreak(Authentication auth) {
        return ResponseEntity.ok(progressService.getStreak(auth.getName()));
    }

    @GetMapping("/topic-performance")
    @Operation(summary = "Get topic-wise performance breakdown")
    public ResponseEntity<Map<String, Object>> getTopicPerformance(Authentication auth) {
        return ResponseEntity.ok(progressService.getTopicPerformance(auth.getName()));
    }

    @GetMapping("/recommendations")
    @Operation(summary = "Get AI-powered personalized learning recommendations")
    public ResponseEntity<List<String>> getRecommendations(Authentication auth) {
        return ResponseEntity.ok(progressService.getRecommendations(auth.getName()));
    }
}
