package com.interviewace.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "aptitude_questions",
    indexes = {
        @Index(name = "idx_category", columnList = "category"),
        @Index(name = "idx_difficulty", columnList = "difficulty")
    })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AptitudeQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;

    @Column(name = "option_a", nullable = false, length = 500)
    private String optionA;

    @Column(name = "option_b", nullable = false, length = 500)
    private String optionB;

    @Column(name = "option_c", nullable = false, length = 500)
    private String optionC;

    @Column(name = "option_d", nullable = false, length = 500)
    private String optionD;

    @Enumerated(EnumType.STRING)
    @Column(name = "correct_answer", nullable = false, length = 1)
    private AnswerOption correctAnswer;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Difficulty difficulty;

    @Column(name = "time_limit_sec")
    @Builder.Default
    private Integer timeLimitSec = 60;

    @Builder.Default
    private Integer marks = 1;

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

    public enum AnswerOption { A, B, C, D }
    public enum Category { QUANTITATIVE, LOGICAL, VERBAL }
    public enum Difficulty { EASY, MEDIUM, HARD }
}
