package com.interviewace.controller;

import com.interviewace.entity.AptitudeQuestion;
import com.interviewace.entity.AptitudeResult;
import com.interviewace.service.AptitudeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/aptitude")
@RequiredArgsConstructor
@Tag(name = "Aptitude Tests", description = "Aptitude test questions and results")
public class AptitudeController {

    private final AptitudeService aptitudeService;

    @GetMapping("/categories")
    @Operation(summary = "Get question count per category")
    public ResponseEntity<Map<String, Long>> getCategories() {
        return ResponseEntity.ok(aptitudeService.getCategoryCounts());
    }

    @GetMapping("/questions/{category}")
    @Operation(summary = "Get randomized questions for a category")
    public ResponseEntity<List<AptitudeQuestion>> getQuestions(
            @PathVariable String category,
            @RequestParam(defaultValue = "20") int count) {
        AptitudeQuestion.Category cat = AptitudeQuestion.Category.valueOf(category.toUpperCase());
        return ResponseEntity.ok(aptitudeService.getQuestions(cat, count));
    }

    @PostMapping("/submit")
    @Operation(summary = "Submit test answers and get result")
    public ResponseEntity<AptitudeResult> submit(
            @RequestBody Map<String, Object> body,
            Authentication auth) {
        String category = body.get("category").toString();
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> answers = (List<Map<String, Object>>) body.get("answers");
        int timeTaken = body.containsKey("timeTakenSec")
            ? Integer.parseInt(body.get("timeTakenSec").toString()) : 0;
        int total = body.containsKey("totalQuestions")
            ? Integer.parseInt(body.get("totalQuestions").toString()) : answers.size();

        AptitudeQuestion.Category cat = AptitudeQuestion.Category.valueOf(category.toUpperCase());
        return ResponseEntity.ok(
            aptitudeService.submitTest(auth.getName(), cat, answers, timeTaken, total));
    }

    @GetMapping("/results/me")
    @Operation(summary = "Get current user's aptitude test history")
    public ResponseEntity<Page<AptitudeResult>> myResults(
            Authentication auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(aptitudeService.getMyResults(auth.getName(), page, size));
    }

    @GetMapping("/results/{id}")
    @Operation(summary = "Get specific aptitude result by ID")
    public ResponseEntity<AptitudeResult> getResult(@PathVariable Long id) {
        return ResponseEntity.ok(aptitudeService.getResult(id));
    }
}
