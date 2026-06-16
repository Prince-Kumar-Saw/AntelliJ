package com.interviewace.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "problem_submissions",
    indexes = {
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_problem_id", columnList = "problem_id")
    })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProblemSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private CodingProblem problem;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private Language language;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 25)
    private Status status;

    @Column(name = "runtime_ms")
    private Integer runtimeMs;

    @Column(name = "memory_mb")
    private Integer memoryMb;

    @Column(name = "test_cases_passed")
    @Builder.Default
    private Integer testCasesPassed = 0;

    @Column(name = "total_test_cases")
    @Builder.Default
    private Integer totalTestCases = 0;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @CreationTimestamp
    @Column(name = "submitted_at", updatable = false)
    private LocalDateTime submittedAt;

    public enum Language { JAVA, PYTHON, CPP, JAVASCRIPT }
    public enum Status {
        ACCEPTED, WRONG_ANSWER, TIME_LIMIT_EXCEEDED, RUNTIME_ERROR, COMPILE_ERROR
    }
}
