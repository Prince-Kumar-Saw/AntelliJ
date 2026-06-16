package com.interviewace.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "mock_interviews",
    indexes = {
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_status", columnList = "status")
    })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MockInterview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(length = 15)
    @Builder.Default
    private Status status = Status.IN_PROGRESS;

    @Column(name = "current_question_index")
    @Builder.Default
    private Integer currentQuestionIndex = 0;

    @Column(name = "total_questions")
    @Builder.Default
    private Integer totalQuestions = 10;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "conversation_history", columnDefinition = "JSON")
    private String conversationHistory;

    @CreationTimestamp
    @Column(name = "started_at", updatable = false)
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @OneToOne(mappedBy = "interview", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private InterviewReport report;

    public enum Role {
        SOFTWARE_ENGINEER, JAVA_DEVELOPER, FRONTEND_DEVELOPER,
        BACKEND_DEVELOPER, DATA_ANALYST, FULLSTACK_DEVELOPER
    }
    public enum Status { IN_PROGRESS, COMPLETED, ABANDONED }
}
