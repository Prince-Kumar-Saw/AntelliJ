package com.interviewace.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "aptitude_results",
    indexes = {
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_category", columnList = "test_category")
    })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AptitudeResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "test_category", nullable = false, length = 15)
    private AptitudeQuestion.Category testCategory;

    @Column(nullable = false)
    private Integer score;

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions;

    @Column(name = "correct_answers", nullable = false)
    private Integer correctAnswers;

    @Column(name = "wrong_answers", nullable = false)
    private Integer wrongAnswers;

    @Column(nullable = false)
    private Integer unattempted;

    @Column(name = "time_taken_sec")
    private Integer timeTakenSec;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "answers_json", columnDefinition = "JSON")
    private String answersJson;

    @Column(precision = 5, scale = 2)
    private BigDecimal percentage;

    private Boolean passed;

    @CreationTimestamp
    @Column(name = "attempted_at", updatable = false)
    private LocalDateTime attemptedAt;
}
