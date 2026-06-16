package com.interviewace.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coding_problems",
    indexes = {
        @Index(name = "idx_difficulty", columnList = "difficulty"),
        @Index(name = "idx_category", columnList = "category")
    })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodingProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, unique = true, length = 200)
    private String slug;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Difficulty difficulty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Category category;

    @Column(columnDefinition = "TEXT")
    private String constraints;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "JSON")
    private String examples;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "test_cases", columnDefinition = "JSON")
    private String testCases;

    @Column(name = "starter_code_java", columnDefinition = "TEXT")
    private String starterCodeJava;

    @Column(name = "starter_code_python", columnDefinition = "TEXT")
    private String starterCodePython;

    @Column(name = "starter_code_cpp", columnDefinition = "TEXT")
    private String starterCodeCpp;

    @Column(name = "solution_java", columnDefinition = "TEXT")
    private String solutionJava;

    @Column(columnDefinition = "TEXT")
    private String editorial;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "JSON")
    private String tags;

    @Column(name = "acceptance_rate", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal acceptanceRate = BigDecimal.ZERO;

    @Column(name = "total_submissions")
    @Builder.Default
    private Integer totalSubmissions = 0;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Difficulty { EASY, MEDIUM, HARD }
    public enum Category {
        ARRAYS, STRINGS, LINKED_LISTS, TREES, GRAPHS,
        DYNAMIC_PROGRAMMING, SORTING, SEARCHING, BACKTRACKING, GREEDY
    }
}
