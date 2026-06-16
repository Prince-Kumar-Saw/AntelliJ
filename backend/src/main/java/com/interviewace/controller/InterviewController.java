package com.interviewace.controller;

import com.interviewace.entity.InterviewReport;
import com.interviewace.entity.MockInterview;
import com.interviewace.service.InterviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/interview")
@RequiredArgsConstructor
@Tag(name = "Mock Interview", description = "AI mock interview session endpoints")
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping("/start")
    @Operation(summary = "Start a new AI mock interview session")
    public ResponseEntity<Map<String, Object>> start(
            @RequestBody Map<String, Object> body,
            Authentication auth) {
        String role = body.get("role").toString();
        int total = body.containsKey("totalQuestions")
            ? Integer.parseInt(body.get("totalQuestions").toString()) : 8;
        return ResponseEntity.ok(interviewService.startInterview(auth.getName(), role, total));
    }

    @PostMapping("/answer")
    @Operation(summary = "Submit an answer and get the next question or final report")
    public ResponseEntity<Map<String, Object>> answer(
            @RequestBody Map<String, Object> body,
            Authentication auth) {
        Long id = Long.valueOf(body.get("interviewId").toString());
        String answer = body.get("answer").toString();
        boolean isLast = Boolean.parseBoolean(body.getOrDefault("isLastAnswer", "false").toString());
        return ResponseEntity.ok(interviewService.submitAnswer(id, auth.getName(), answer, isLast));
    }

    @GetMapping("/report/{id}")
    @Operation(summary = "Get interview evaluation report")
    public ResponseEntity<InterviewReport> getReport(
            @PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(interviewService.getReport(id, auth.getName()));
    }

    @GetMapping("/history/me")
    @Operation(summary = "Get current user's interview history")
    public ResponseEntity<Page<MockInterview>> history(
            Authentication auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(interviewService.getHistory(auth.getName(), page, size));
    }
}
