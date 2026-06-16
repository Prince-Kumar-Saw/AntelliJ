package com.interviewace.repository;

import com.interviewace.entity.CodingProblem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CodingProblemRepository extends JpaRepository<CodingProblem, Long> {
    Optional<CodingProblem> findBySlug(String slug);
    Page<CodingProblem> findByIsActiveTrue(Pageable pageable);
    Page<CodingProblem> findByDifficultyAndIsActiveTrue(CodingProblem.Difficulty difficulty, Pageable pageable);
    Page<CodingProblem> findByCategoryAndIsActiveTrue(CodingProblem.Category category, Pageable pageable);
    Page<CodingProblem> findByDifficultyAndCategoryAndIsActiveTrue(
        CodingProblem.Difficulty difficulty, CodingProblem.Category category, Pageable pageable);
    long countByIsActiveTrue();
    long countByDifficultyAndIsActiveTrue(CodingProblem.Difficulty difficulty);
}
