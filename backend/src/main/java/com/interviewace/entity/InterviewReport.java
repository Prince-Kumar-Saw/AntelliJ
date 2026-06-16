package com.interviewace.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "interview_reports",
    indexes = @Index(name = "idx_user_id", columnList = "user_id"))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false, unique = true)
    private MockInterview interview;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(length = 100)
    private String role;

    @Column(name = "question_count")
    private Integer questionCount;

    @Column(name = "technical_score")
    private Integer technicalScore;

    @Column(name = "communication_score")
    private Integer communicationScore;

    @Column(name = "confidence_score")
    private Integer confidenceScore;

    @Column(name = "completeness_score")
    private Integer completenessScore;

    @Column(name = "overall_score")
    private Integer overallScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "overall_grade", length = 2)
    private Grade overallGrade;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "JSON")
    private String strengths;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "JSON")
    private String weaknesses;

    @Column(name = "detailed_feedback", columnDefinition = "TEXT")
    private String detailedFeedback;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "JSON")
    private String recommendations;

    @Enumerated(EnumType.STRING)
    @Column(name = "hiring_recommendation", length = 25)
    private HiringRecommendation hiringRecommendation;

    @CreationTimestamp
    @Column(name = "generated_at", updatable = false)
    private LocalDateTime generatedAt;

    public enum Grade { A, B, C, D, F }
    public enum HiringRecommendation {
        STRONGLY_RECOMMEND, RECOMMEND, NEUTRAL, NOT_RECOMMEND
    }
}
