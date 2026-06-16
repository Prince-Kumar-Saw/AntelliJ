package com.interviewace.repository;

import com.interviewace.entity.MockInterview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MockInterviewRepository extends JpaRepository<MockInterview, Long> {
    Page<MockInterview> findByUserIdOrderByStartedAtDesc(Long userId, Pageable pageable);
    Optional<MockInterview> findByIdAndUserId(Long id, Long userId);
    long countByUserIdAndStatus(Long userId, MockInterview.Status status);
    long countByUserId(Long userId);
}
