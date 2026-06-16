package com.interviewace.repository;

import com.interviewace.entity.Resume;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByUserIdOrderByUploadedAtDesc(Long userId);
    Page<Resume> findByUserIdOrderByUploadedAtDesc(Long userId, Pageable pageable);
    long countByUserId(Long userId);
}
