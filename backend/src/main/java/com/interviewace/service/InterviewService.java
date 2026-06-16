package com.interviewace.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewace.ai.GeminiService;
import com.interviewace.entity.*;
import com.interviewace.exception.BadRequestException;
import com.interviewace.exception.ResourceNotFoundException;
import com.interviewace.repository.MockInterviewRepository;
import com.interviewace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class InterviewService {

    private final MockInterviewRepository interviewRepo;
    private final UserRepository userRepo;
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    @Transactional
    public Map<String, Object> startInterview(String userEmail, String role, int totalQuestions) {
        User user = userRepo.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Get AI first question
        String firstQuestion = geminiService.startInterview(
            role.replace("_", " "), totalQuestions);

        List<Map<String, String>> history = new ArrayList<>();
        history.add(Map.of("role", "assistant", "content", firstQuestion));

        MockInterview interview = MockInterview.builder()
            .user(user)
            .role(MockInterview.Role.valueOf(role))
            .status(MockInterview.Status.IN_PROGRESS)
            .totalQuestions(totalQuestions)
            .currentQuestionIndex(1)
            .conversationHistory(toJson(history))
            .build();

        MockInterview saved = interviewRepo.save(interview);

        return Map.of(
            "interviewId", saved.getId(),
            "question", firstQuestion,
            "questionNumber", 1,
            "totalQuestions", totalQuestions
        );
    }

    @Transactional
    public Map<String, Object> submitAnswer(Long interviewId, String userEmail,
                                             String answer, boolean isLastAnswer) {
        User user = userRepo.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        MockInterview interview = interviewRepo.findByIdAndUserId(interviewId, user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));

        if (interview.getStatus() != MockInterview.Status.IN_PROGRESS) {
            throw new BadRequestException("Interview is already completed");
        }

        // Update conversation history
        List<Map<String, String>> history = fromJson(interview.getConversationHistory());
        history.add(Map.of("role", "user", "content", answer));

        int nextQuestion = interview.getCurrentQuestionIndex() + 1;
        Map<String, Object> result = new HashMap<>();

        if (isLastAnswer || nextQuestion > interview.getTotalQuestions()) {
            // End interview — generate full report
            String reportJson = geminiService.generateInterviewReport(
                interview.getRole().name().replace("_", " "),
                buildHistoryString(history),
                interview.getTotalQuestions()
            );

            InterviewReport report = parseAndSaveReport(reportJson, interview, user);

            interview.setStatus(MockInterview.Status.COMPLETED);
            interview.setCompletedAt(LocalDateTime.now());
            interview.setConversationHistory(toJson(history));
            interviewRepo.save(interview);

            result.put("completed", true);
            result.put("reportId", report.getId());
        } else {
            // Continue interview
            String nextQ = geminiService.continueInterview(
                interview.getRole().name().replace("_", " "),
                buildHistoryString(history),
                nextQuestion,
                interview.getTotalQuestions()
            );

            history.add(Map.of("role", "assistant", "content", nextQ));
            interview.setCurrentQuestionIndex(nextQuestion);
            interview.setConversationHistory(toJson(history));
            interviewRepo.save(interview);

            result.put("completed", false);
            result.put("nextQuestion", nextQ);
            result.put("questionNumber", nextQuestion);
        }

        return result;
    }

    public InterviewReport getReport(Long interviewId, String userEmail) {
        User user = userRepo.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        MockInterview interview = interviewRepo.findByIdAndUserId(interviewId, user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));
        if (interview.getReport() == null) {
            throw new ResourceNotFoundException("Report not yet generated");
        }
        return interview.getReport();
    }

    public Page<MockInterview> getHistory(String userEmail, int page, int size) {
        User user = userRepo.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return interviewRepo.findByUserIdOrderByStartedAtDesc(user.getId(), PageRequest.of(page, size));
    }

    // ---- Helpers ----
    private InterviewReport parseAndSaveReport(String json, MockInterview interview, User user) {
        try {
            Map<String, Object> data = objectMapper.readValue(json, Map.class);
            InterviewReport report = InterviewReport.builder()
                .interview(interview)
                .user(user)
                .role(interview.getRole().name().replace("_", " "))
                .questionCount(interview.getTotalQuestions())
                .technicalScore(getInt(data, "technicalScore", 70))
                .communicationScore(getInt(data, "communicationScore", 70))
                .confidenceScore(getInt(data, "confidenceScore", 70))
                .completenessScore(getInt(data, "completenessScore", 70))
                .overallScore(getInt(data, "overallScore", 70))
                .overallGrade(parseGrade(getString(data, "overallGrade", "B")))
                .strengths(toJson(data.get("strengths")))
                .weaknesses(toJson(data.get("weaknesses")))
                .detailedFeedback(getString(data, "detailedFeedback", ""))
                .recommendations(toJson(data.get("recommendations")))
                .hiringRecommendation(parseHiring(getString(data, "hiringRecommendation", "NEUTRAL")))
                .build();
            interview.setReport(report);
            return report;
        } catch (Exception e) {
            log.error("Failed to parse interview report: {}", e.getMessage());
            return InterviewReport.builder()
                .interview(interview).user(user)
                .technicalScore(70).communicationScore(70)
                .overallScore(70).overallGrade(InterviewReport.Grade.B)
                .detailedFeedback("AI evaluation complete. Keep practicing!")
                .hiringRecommendation(InterviewReport.HiringRecommendation.NEUTRAL)
                .build();
        }
    }

    private String buildHistoryString(List<Map<String, String>> history) {
        StringBuilder sb = new StringBuilder();
        for (Map<String, String> msg : history) {
            sb.append(msg.get("role").equals("assistant") ? "Interviewer: " : "Candidate: ")
              .append(msg.get("content")).append("\n\n");
        }
        return sb.toString();
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, String>> fromJson(String json) {
        if (json == null || json.isBlank()) return new ArrayList<>();
        try { return objectMapper.readValue(json, new TypeReference<>() {}); }
        catch (Exception e) { return new ArrayList<>(); }
    }

    private String toJson(Object obj) {
        try { return objectMapper.writeValueAsString(obj); }
        catch (Exception e) { return "[]"; }
    }

    private int getInt(Map<String, Object> m, String key, int def) {
        Object v = m.get(key); return v instanceof Number ? ((Number) v).intValue() : def;
    }
    private String getString(Map<String, Object> m, String key, String def) {
        Object v = m.get(key); return v != null ? v.toString() : def;
    }
    private InterviewReport.Grade parseGrade(String s) {
        try { return InterviewReport.Grade.valueOf(s.toUpperCase()); }
        catch (Exception e) { return InterviewReport.Grade.C; }
    }
    private InterviewReport.HiringRecommendation parseHiring(String s) {
        try { return InterviewReport.HiringRecommendation.valueOf(s.toUpperCase()); }
        catch (Exception e) { return InterviewReport.HiringRecommendation.NEUTRAL; }
    }
}
