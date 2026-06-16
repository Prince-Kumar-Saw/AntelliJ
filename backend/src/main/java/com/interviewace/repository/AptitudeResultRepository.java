package com.interviewace.repository;

import com.interviewace.entity.AptitudeQuestion;
import com.interviewace.entity.AptitudeResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AptitudeResultRepository extends JpaRepository<AptitudeResult, Long> {
    Page<AptitudeResult> findByUserIdOrderByAttemptedAtDesc(Long userId, Pageable pageable);
    long countByUserId(Long userId);

    @Query("SELECT AVG(ar.percentage) FROM AptitudeResult ar WHERE ar.user.id = :userId AND ar.testCategory = :category")
    Double avgScoreByUserAndCategory(Long userId, AptitudeQuestion.Category category);

    @Query("SELECT ar.testCategory, AVG(ar.percentage) FROM AptitudeResult ar " +
           "WHERE ar.user.id = :userId GROUP BY ar.testCategory")
    List<Object[]> avgScoreByCategory(Long userId);
}
