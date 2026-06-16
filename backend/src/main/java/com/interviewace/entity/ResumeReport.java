package com.interviewace.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "resume_reports",
    indexes = @Index(name = "idx_user_id", columnList = "user_id"))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false, unique = true)
    private Resume resume;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "ats_score")
    @Builder.Default
    private Integer atsScore = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "overall_rating", length = 15)
    private Rating overallRating;

    @Column(name = "extracted_name", length = 100)
    private String extractedName;

    @Column(name = "extracted_email", length = 150)
    private String extractedEmail;

    @Column(name = "extracted_phone", length = 20)
    private String extractedPhone;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "skills_found", columnDefinition = "JSON")
    private String skillsFound;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "skills_missing", columnDefinition = "JSON")
    private String skillsMissing;

    @Column(name = "projects_count")
    @Builder.Default
    private Integer projectsCount = 0;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "education_details", columnDefinition = "JSON")
    private String educationDetails;

    @Column(name = "experience_years", precision = 4, scale = 1)
    private BigDecimal experienceYears;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "keywords_matched", columnDefinition = "JSON")
    private String keywordsMatched;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "JSON")
    private String strengths;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "JSON")
    private String improvements;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @CreationTimestamp
    @Column(name = "generated_at", updatable = false)
    private LocalDateTime generatedAt;

    public enum Rating { POOR, AVERAGE, GOOD, EXCELLENT }
}
