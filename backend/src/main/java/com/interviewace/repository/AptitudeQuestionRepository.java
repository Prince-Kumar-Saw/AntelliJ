package com.interviewace.repository;

import com.interviewace.entity.AptitudeQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AptitudeQuestionRepository extends JpaRepository<AptitudeQuestion, Long> {
    List<AptitudeQuestion> findByCategoryAndIsActiveTrue(AptitudeQuestion.Category category);

    @Query(value = "SELECT * FROM aptitude_questions WHERE category = :#{#category.name()} AND is_active = true ORDER BY RAND() LIMIT :limit", nativeQuery = true)
    List<AptitudeQuestion> findRandomByCategory(AptitudeQuestion.Category category, int limit);

    long countByCategoryAndIsActiveTrue(AptitudeQuestion.Category category);
}
