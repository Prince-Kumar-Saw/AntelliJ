package com.interviewace.service;

import com.interviewace.entity.User;
import com.interviewace.repository.MockInterviewRepository;
import com.interviewace.repository.ProblemSubmissionRepository;
import com.interviewace.repository.AptitudeResultRepository;
import com.interviewace.repository.ResumeRepository;
import com.interviewace.repository.UserRepository;
import com.interviewace.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final ProblemSubmissionRepository submissionRepo;
    private final AptitudeResultRepository aptitudeRepo;
    private final MockInterviewRepository interviewRepo;
    private final ResumeRepository resumeRepo;

    public Map<String, Object> getDashboardStats(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Long userId = user.getId();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("userId", userId);
        stats.put("name", user.getName());
        stats.put("totalSubmissions", submissionRepo.countByUserId(userId));
        stats.put("problemsSolved", submissionRepo.countDistinctSolvedByUserId(userId));
        stats.put("aptitudeTestsTaken", aptitudeRepo.countByUserId(userId));
        stats.put("mockInterviewsCompleted", interviewRepo.countByUserIdAndStatus(userId, com.interviewace.entity.MockInterview.Status.COMPLETED));
        stats.put("resumesUploaded", resumeRepo.countByUserId(userId));

        // Weekly activity (last 7 days)
        long weeklySubmissions = submissionRepo.countByUserIdAndSubmittedAtAfter(
            userId, LocalDateTime.now().minusDays(7));
        stats.put("weeklyActivity", weeklySubmissions);

        return stats;
    }

    public Map<String, Object> getWeeklyPerformance(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Return mock weekly data structure (in production, query daily_activity_logs)
        Map<String, Object> perf = new LinkedHashMap<>();
        perf.put("labels", List.of("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"));
        perf.put("problemsSolved", List.of(2, 3, 1, 4, 2, 5, 3));
        perf.put("aptitudeTests", List.of(1, 0, 2, 1, 0, 1, 2));
        perf.put("studyMinutes", List.of(45, 60, 30, 90, 45, 120, 75));
        return perf;
    }
}
