package com.interviewace.service;

import com.interviewace.entity.CodingProblem;
import com.interviewace.entity.ProblemSubmission;
import com.interviewace.entity.User;
import com.interviewace.exception.ResourceNotFoundException;
import com.interviewace.repository.CodingProblemRepository;
import com.interviewace.repository.ProblemSubmissionRepository;
import com.interviewace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CodingService {

    private final CodingProblemRepository problemRepo;
    private final ProblemSubmissionRepository submissionRepo;
    private final UserRepository userRepo;

    public Page<CodingProblem> getProblems(String difficulty, String category, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        if (difficulty != null && category != null) {
            return problemRepo.findByDifficultyAndCategoryAndIsActiveTrue(
                CodingProblem.Difficulty.valueOf(difficulty.toUpperCase()),
                CodingProblem.Category.valueOf(category.toUpperCase()), pageable);
        } else if (difficulty != null) {
            return problemRepo.findByDifficultyAndIsActiveTrue(
                CodingProblem.Difficulty.valueOf(difficulty.toUpperCase()), pageable);
        } else if (category != null) {
            return problemRepo.findByCategoryAndIsActiveTrue(
                CodingProblem.Category.valueOf(category.toUpperCase()), pageable);
        }
        return problemRepo.findByIsActiveTrue(pageable);
    }

    public CodingProblem getProblemById(Long id) {
        return problemRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + id));
    }

    public CodingProblem getProblemBySlug(String slug) {
        return problemRepo.findBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Problem not found: " + slug));
    }

    @Transactional
    public ProblemSubmission submitCode(Long problemId, String code, String language,
                                        String userEmail) {
        User user = userRepo.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        CodingProblem problem = getProblemById(problemId);

        // Simulate code execution (in production: integrate Judge0 or similar)
        ProblemSubmission.Status status = simulateExecution(code, language);

        ProblemSubmission submission = ProblemSubmission.builder()
            .user(user)
            .problem(problem)
            .code(code)
            .language(ProblemSubmission.Language.valueOf(language.toUpperCase()))
            .status(status)
            .testCasesPassed(status == ProblemSubmission.Status.ACCEPTED ? 3 : 1)
            .totalTestCases(3)
            .runtimeMs(status == ProblemSubmission.Status.ACCEPTED ? 45 : 0)
            .memoryMb(status == ProblemSubmission.Status.ACCEPTED ? 42 : 0)
            .build();

        // Update problem stats
        problem.setTotalSubmissions(problem.getTotalSubmissions() + 1);
        problemRepo.save(problem);

        return submissionRepo.save(submission);
    }

    private ProblemSubmission.Status simulateExecution(String code, String language) {
        // Simple simulation - in production use Judge0 API or Docker sandboxing
        if (code == null || code.trim().length() < 20) {
            return ProblemSubmission.Status.COMPILE_ERROR;
        }
        if (code.contains("TODO") || code.contains("// Write your code here")) {
            return ProblemSubmission.Status.WRONG_ANSWER;
        }
        return ProblemSubmission.Status.ACCEPTED;
    }

    public Page<ProblemSubmission> getUserSubmissions(String email, int page, int size) {
        User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return submissionRepo.findByUserIdOrderBySubmittedAtDesc(
            user.getId(), PageRequest.of(page, size));
    }

    @Transactional
    public CodingProblem addProblem(CodingProblem problem, String adminEmail) {
        User admin = userRepo.findByEmail(adminEmail)
            .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
        problem.setCreatedBy(admin);
        return problemRepo.save(problem);
    }
}
