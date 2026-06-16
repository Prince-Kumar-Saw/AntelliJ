package com.interviewace.service;

import com.interviewace.ai.GeminiService;
import com.interviewace.entity.*;
import com.interviewace.exception.ResourceNotFoundException;
import com.interviewace.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final UserRepository userRepo;
    private final ProblemSubmissionRepository submissionRepo;
    private final AptitudeResultRepository aptitudeRepo;
    private final GeminiService geminiService;

    public Map<String, Object> getStreak(String email) {
        User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // In production: query user_streaks table
        Map<String, Object> streak = new LinkedHashMap<>();
        streak.put("currentStreak", 5);
        streak.put("longestStreak", 12);
        streak.put("totalActiveDays", 28);
        streak.put("lastActivityDate", LocalDate.now().toString());
        return streak;
    }

    public Map<String, Object> getTopicPerformance(String email) {
        User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Compute per-category submission performance
        List<String> categories = List.of(
            "Arrays", "Strings", "Trees", "Graphs", "DP", "Linked Lists", "Greedy"
        );
        // In production: query from problem_submissions joined with coding_problems
        List<Integer> scores = List.of(85, 72, 60, 45, 38, 70, 55);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("categories", categories);
        result.put("scores", scores);
        return result;
    }

    public List<String> getRecommendations(String email) {
        User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String weakAreas = "Graphs (45%), Dynamic Programming (38%)";
        String performance = "Strong in Arrays and Strings, weak in Graphs and DP";

        try {
            String json = geminiService.generateRecommendations(weakAreas, performance);
            // Parse JSON array
            return List.of(json.replaceAll("[\\[\\]\"]", "").split(","));
        } catch (Exception e) {
            return List.of(
                "📘 Practice 5 Graph problems daily — your graph score is 45%",
                "💡 Review Dynamic Programming patterns: knapsack, LCS, LIS",
                "⏰ Spend 30 min daily on Aptitude — focus on Logical Reasoning",
                "🎯 Take 2 mock interviews this week to boost confidence score",
                "📄 Update your resume with Docker/Kubernetes skills for ATS improvement"
            );
        }
    }
}
