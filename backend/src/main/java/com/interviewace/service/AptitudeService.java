package com.interviewace.service;

import com.interviewace.entity.AptitudeQuestion;
import com.interviewace.entity.AptitudeResult;
import com.interviewace.entity.User;
import com.interviewace.exception.ResourceNotFoundException;
import com.interviewace.repository.AptitudeQuestionRepository;
import com.interviewace.repository.AptitudeResultRepository;
import com.interviewace.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AptitudeService {

    private final AptitudeQuestionRepository questionRepo;
    private final AptitudeResultRepository resultRepo;
    private final UserRepository userRepo;
    private final ObjectMapper objectMapper;

    public List<AptitudeQuestion> getQuestions(AptitudeQuestion.Category category, int count) {
        return questionRepo.findRandomByCategory(category, count > 0 ? count : 20);
    }

    public Map<String, Long> getCategoryCounts() {
        return Map.of(
            "QUANTITATIVE", questionRepo.countByCategoryAndIsActiveTrue(AptitudeQuestion.Category.QUANTITATIVE),
            "LOGICAL",       questionRepo.countByCategoryAndIsActiveTrue(AptitudeQuestion.Category.LOGICAL),
            "VERBAL",        questionRepo.countByCategoryAndIsActiveTrue(AptitudeQuestion.Category.VERBAL)
        );
    }

    @Transactional
    public AptitudeResult submitTest(String userEmail, AptitudeQuestion.Category category,
                                      List<Map<String, Object>> answers,
                                      int timeTakenSec, int totalQuestions) {
        User user = userRepo.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Grade the answers
        int correct = 0, wrong = 0, unattempted = 0;
        for (Map<String, Object> ans : answers) {
            String selected = ans.get("selectedAnswer") != null ? ans.get("selectedAnswer").toString() : null;
            if (selected == null || selected.isBlank()) { unattempted++; continue; }
            Long qId = Long.valueOf(ans.get("questionId").toString());
            AptitudeQuestion q = questionRepo.findById(qId).orElse(null);
            if (q != null && q.getCorrectAnswer().name().equals(selected.toUpperCase())) correct++;
            else wrong++;
        }

        BigDecimal percentage = BigDecimal.valueOf((double) correct / totalQuestions * 100)
            .setScale(2, RoundingMode.HALF_UP);

        AptitudeResult result = AptitudeResult.builder()
            .user(user)
            .testCategory(category)
            .score(correct)
            .totalQuestions(totalQuestions)
            .correctAnswers(correct)
            .wrongAnswers(wrong)
            .unattempted(unattempted)
            .timeTakenSec(timeTakenSec)
            .percentage(percentage)
            .passed(percentage.doubleValue() >= 60)
            .build();
        try {
            result.setAnswersJson(objectMapper.writeValueAsString(answers));
        } catch (Exception ignored) {}

        return resultRepo.save(result);
    }

    public Page<AptitudeResult> getMyResults(String email, int page, int size) {
        User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return resultRepo.findByUserIdOrderByAttemptedAtDesc(user.getId(), PageRequest.of(page, size));
    }

    public AptitudeResult getResult(Long id) {
        return resultRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Result not found"));
    }

    @Transactional
    public AptitudeQuestion addQuestion(AptitudeQuestion question, String adminEmail) {
        User admin = userRepo.findByEmail(adminEmail)
            .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
        question.setCreatedBy(admin);
        return questionRepo.save(question);
    }
}
