-- ============================================================
-- InterviewAce AI - MySQL Database Schema
-- Version: 1.0.0
-- ============================================================

CREATE DATABASE IF NOT EXISTS interviewace_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE interviewace_db;

-- ------------------------------------------------------------
-- Users Table
-- ------------------------------------------------------------
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'ADMIN') DEFAULT 'STUDENT',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    reset_token VARCHAR(255),
    reset_token_expiry DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- ------------------------------------------------------------
-- Profiles Table
-- ------------------------------------------------------------
CREATE TABLE profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    college VARCHAR(200),
    degree VARCHAR(100),
    branch VARCHAR(100),
    graduation_year INT,
    skills TEXT COMMENT 'Comma-separated skills',
    bio TEXT,
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Coding Problems Table
-- ------------------------------------------------------------
CREATE TABLE coding_problems (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description LONGTEXT NOT NULL,
    difficulty ENUM('EASY', 'MEDIUM', 'HARD') NOT NULL,
    category ENUM('ARRAYS', 'STRINGS', 'LINKED_LISTS', 'TREES', 'GRAPHS', 'DYNAMIC_PROGRAMMING', 'SORTING', 'SEARCHING', 'BACKTRACKING', 'GREEDY') NOT NULL,
    constraints TEXT,
    examples JSON COMMENT 'Array of {input, output, explanation}',
    test_cases JSON COMMENT 'Array of {input, expected_output}',
    starter_code_java TEXT,
    starter_code_python TEXT,
    starter_code_cpp TEXT,
    solution_java TEXT,
    editorial TEXT,
    tags JSON COMMENT 'Array of tag strings',
    acceptance_rate DECIMAL(5,2) DEFAULT 0.00,
    total_submissions INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_difficulty (difficulty),
    INDEX idx_category (category),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ------------------------------------------------------------
-- Problem Submissions Table
-- ------------------------------------------------------------
CREATE TABLE problem_submissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    problem_id BIGINT NOT NULL,
    code LONGTEXT NOT NULL,
    language ENUM('JAVA', 'PYTHON', 'CPP', 'JAVASCRIPT') NOT NULL,
    status ENUM('ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'COMPILE_ERROR') NOT NULL,
    runtime_ms INT,
    memory_mb INT,
    test_cases_passed INT DEFAULT 0,
    total_test_cases INT DEFAULT 0,
    error_message TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_problem_id (problem_id),
    INDEX idx_submitted_at (submitted_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (problem_id) REFERENCES coding_problems(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Aptitude Questions Table
-- ------------------------------------------------------------
CREATE TABLE aptitude_questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    option_a VARCHAR(500) NOT NULL,
    option_b VARCHAR(500) NOT NULL,
    option_c VARCHAR(500) NOT NULL,
    option_d VARCHAR(500) NOT NULL,
    correct_answer ENUM('A', 'B', 'C', 'D') NOT NULL,
    explanation TEXT,
    category ENUM('QUANTITATIVE', 'LOGICAL', 'VERBAL') NOT NULL,
    difficulty ENUM('EASY', 'MEDIUM', 'HARD') NOT NULL,
    time_limit_sec INT DEFAULT 60,
    marks INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_difficulty (difficulty),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ------------------------------------------------------------
-- Aptitude Tests Table
-- ------------------------------------------------------------
CREATE TABLE aptitude_tests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category ENUM('QUANTITATIVE', 'LOGICAL', 'VERBAL', 'MIXED') NOT NULL,
    total_questions INT NOT NULL,
    time_limit_minutes INT NOT NULL,
    passing_score INT DEFAULT 60,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Aptitude Results Table
-- ------------------------------------------------------------
CREATE TABLE aptitude_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    test_category ENUM('QUANTITATIVE', 'LOGICAL', 'VERBAL', 'MIXED') NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    correct_answers INT NOT NULL,
    wrong_answers INT NOT NULL,
    unattempted INT NOT NULL,
    time_taken_sec INT,
    answers_json JSON COMMENT 'Array of {questionId, selectedAnswer, isCorrect}',
    percentage DECIMAL(5,2),
    passed BOOLEAN,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_category (test_category),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Resumes Table
-- ------------------------------------------------------------
CREATE TABLE resumes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size_kb INT,
    status ENUM('PENDING', 'PROCESSING', 'ANALYZED', 'FAILED') DEFAULT 'PENDING',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Resume Reports Table
-- ------------------------------------------------------------
CREATE TABLE resume_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    resume_id BIGINT NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    ats_score INT DEFAULT 0,
    overall_rating ENUM('POOR', 'AVERAGE', 'GOOD', 'EXCELLENT'),
    extracted_name VARCHAR(100),
    extracted_email VARCHAR(150),
    extracted_phone VARCHAR(20),
    skills_found JSON COMMENT 'Array of skill strings',
    skills_missing JSON COMMENT 'Array of missing skill strings',
    projects_count INT DEFAULT 0,
    education_details JSON,
    experience_years DECIMAL(4,1),
    keywords_matched JSON,
    strengths JSON,
    improvements JSON COMMENT 'Array of suggestion strings',
    summary TEXT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Mock Interviews Table
-- ------------------------------------------------------------
CREATE TABLE mock_interviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    role ENUM('SOFTWARE_ENGINEER', 'JAVA_DEVELOPER', 'FRONTEND_DEVELOPER', 'BACKEND_DEVELOPER', 'DATA_ANALYST', 'FULLSTACK_DEVELOPER') NOT NULL,
    status ENUM('IN_PROGRESS', 'COMPLETED', 'ABANDONED') DEFAULT 'IN_PROGRESS',
    current_question_index INT DEFAULT 0,
    total_questions INT DEFAULT 10,
    conversation_history JSON COMMENT 'Array of {role: user|assistant, content}',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Interview Reports Table
-- ------------------------------------------------------------
CREATE TABLE interview_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    interview_id BIGINT NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    role VARCHAR(100),
    question_count INT,
    technical_score INT COMMENT 'Score out of 100',
    communication_score INT COMMENT 'Score out of 100',
    confidence_score INT COMMENT 'Score out of 100',
    completeness_score INT COMMENT 'Score out of 100',
    overall_score INT COMMENT 'Score out of 100',
    overall_grade ENUM('A', 'B', 'C', 'D', 'F'),
    strengths JSON COMMENT 'Array of strength strings',
    weaknesses JSON COMMENT 'Array of weakness strings',
    detailed_feedback TEXT,
    recommendations JSON COMMENT 'Array of recommendation strings',
    hiring_recommendation ENUM('STRONGLY_RECOMMEND', 'RECOMMEND', 'NEUTRAL', 'NOT_RECOMMEND'),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    FOREIGN KEY (interview_id) REFERENCES mock_interviews(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- User Progress / Streaks Table
-- ------------------------------------------------------------
CREATE TABLE user_streaks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_activity_date DATE,
    total_active_days INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Daily Activity Log Table
-- ------------------------------------------------------------
CREATE TABLE daily_activity_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    activity_date DATE NOT NULL,
    problems_solved INT DEFAULT 0,
    aptitude_tests_taken INT DEFAULT 0,
    interviews_conducted INT DEFAULT 0,
    study_minutes INT DEFAULT 0,
    UNIQUE KEY unique_user_date (user_id, activity_date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Notifications Table
-- ------------------------------------------------------------
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    type ENUM('INFO', 'SUCCESS', 'WARNING', 'ACHIEVEMENT') DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Admin Audit Logs
-- ------------------------------------------------------------
CREATE TABLE admin_audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_id BIGINT NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_table VARCHAR(100),
    target_id BIGINT,
    details JSON,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_admin_id (admin_id),
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);
