package com.interviewace.repository;

import com.interviewace.entity.ProblemSubmission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProblemSubmissionRepository extends JpaRepository<ProblemSubmission, Long> {
    Page<ProblemSubmission> findByUserIdOrderBySubmittedAtDesc(Long userId, Pageable pageable);
    List<ProblemSubmission> findByUserIdAndProblemId(Long userId, Long problemId);
    Optional<ProblemSubmission> findTopByUserIdAndProblemIdAndStatusOrderBySubmittedAtDesc(
        Long userId, Long problemId, ProblemSubmission.Status status);
    long countByUserId(Long userId);
    long countByUserIdAndStatus(Long userId, ProblemSubmission.Status status);

    @Query("SELECT COUNT(DISTINCT ps.problem.id) FROM ProblemSubmission ps " +
           "WHERE ps.user.id = :userId AND ps.status = 'ACCEPTED'")
    long countDistinctSolvedByUserId(Long userId);

    @Query("SELECT COUNT(ps) FROM ProblemSubmission ps " +
           "WHERE ps.user.id = :userId AND ps.submittedAt >= :since")
    long countByUserIdAndSubmittedAtAfter(Long userId, LocalDateTime since);
}
