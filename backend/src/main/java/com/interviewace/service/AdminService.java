package com.interviewace.service;

import com.interviewace.entity.*;
import com.interviewace.exception.ResourceNotFoundException;
import com.interviewace.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepo;
    private final CodingProblemRepository problemRepo;
    private final AptitudeQuestionRepository questionRepo;
    private final ProblemSubmissionRepository submissionRepo;
    private final MockInterviewRepository interviewRepo;
    private final ResumeRepository resumeRepo;
    private final AptitudeResultRepository aptitudeResultRepo;

    public Page<User> getUsers(int page, int size) {
        return userRepo.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }

    @Transactional
    public void setUserStatus(Long userId, boolean isActive) {
        User user = userRepo.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setIsActive(isActive);
        userRepo.save(user);
    }

    public Map<String, Object> getAnalytics() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalUsers",        userRepo.count());
        stats.put("activeUsers",        userRepo.count()); // simplified
        stats.put("totalProblems",      problemRepo.countByIsActiveTrue());
        stats.put("totalQuestions",     questionRepo.count());
        stats.put("totalInterviews",    interviewRepo.count());
        stats.put("totalResumes",       resumeRepo.count());
        stats.put("totalSubmissions",   submissionRepo.count());
        stats.put("totalAptitudeTests", aptitudeResultRepo.count());

        // Weekly labels and mock data (production: query daily_activity_logs)
        stats.put("weekLabels",               new String[]{"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"});
        stats.put("registrationsThisWeek",    new int[]{12, 18, 9, 24, 16, 31, 22});
        stats.put("submissionsPerDay",        new int[]{145, 182, 120, 200, 163, 95, 112});
        stats.put("moduleUsage",              Map.of("dsa", 42, "aptitude", 28, "interview", 17, "resume", 13));
        return stats;
    }
}
