package com.interviewace.controller;

import com.interviewace.entity.CodingProblem;
import com.interviewace.entity.ProblemSubmission;
import com.interviewace.service.CodingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/coding")
@RequiredArgsConstructor
@Tag(name = "DSA Practice", description = "Coding problem practice endpoints")
public class CodingController {

    private final CodingService codingService;

    @GetMapping("/problems")
    @Operation(summary = "Get all coding problems with optional filters")
    public ResponseEntity<Page<CodingProblem>> getProblems(
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(codingService.getProblems(difficulty, category, page, size));
    }

    @GetMapping("/problems/{id}")
    @Operation(summary = "Get problem by ID")
    public ResponseEntity<CodingProblem> getProblem(@PathVariable Long id) {
        return ResponseEntity.ok(codingService.getProblemById(id));
    }

    @GetMapping("/problems/slug/{slug}")
    @Operation(summary = "Get problem by slug")
    public ResponseEntity<CodingProblem> getProblemBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(codingService.getProblemBySlug(slug));
    }

    @PostMapping("/submit")
    @Operation(summary = "Submit code solution")
    public ResponseEntity<ProblemSubmission> submit(
            @RequestBody Map<String, Object> body,
            Authentication auth) {
        Long problemId = Long.valueOf(body.get("problemId").toString());
        String code = body.get("code").toString();
        String language = body.get("language").toString();
        return ResponseEntity.ok(codingService.submitCode(problemId, code, language, auth.getName()));
    }

    @GetMapping("/submissions/me")
    @Operation(summary = "Get current user's submission history")
    public ResponseEntity<Page<ProblemSubmission>> mySubmissions(
            Authentication auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(codingService.getUserSubmissions(auth.getName(), page, size));
    }
}
