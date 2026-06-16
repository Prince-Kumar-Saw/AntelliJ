-- ============================================================
-- InterviewAce AI - PostgreSQL Database Schema
-- Version: 1.0.0
-- ============================================================

-- ------------------------------------------------------------
-- Users Table
-- ------------------------------------------------------------
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'ADMIN')),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_role ON users(role);

-- ------------------------------------------------------------
-- Profiles Table
-- ------------------------------------------------------------
CREATE TABLE profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    college VARCHAR(200),
    degree VARCHAR(100),
    branch VARCHAR(100),
    graduation_year INT,
    skills TEXT,
    bio TEXT,
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Coding Problems Table
-- ------------------------------------------------------------
CREATE TABLE coding_problems (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    category VARCHAR(50) NOT NULL CHECK (category IN ('ARRAYS', 'STRINGS', 'LINKED_LISTS', 'TREES', 'GRAPHS', 'DYNAMIC_PROGRAMMING', 'SORTING', 'SEARCHING', 'BACKTRACKING', 'GREEDY')),
    constraints TEXT,
    examples JSON,
    test_cases JSON,
    starter_code_java TEXT,
    starter_code_python TEXT,
    starter_code_cpp TEXT,
    solution_java TEXT,
    editorial TEXT,
    tags JSON,
    acceptance_rate DECIMAL(5,2) DEFAULT 0.00,
    total_submissions INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_difficulty ON coding_problems(difficulty);
CREATE INDEX idx_category ON coding_problems(category);

-- ------------------------------------------------------------
-- Problem Submissions Table
-- ------------------------------------------------------------
CREATE TABLE problem_submissions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_id BIGINT NOT NULL REFERENCES coding_problems(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    language VARCHAR(20) NOT NULL CHECK (language IN ('JAVA', 'PYTHON', 'CPP', 'JAVASCRIPT')),
    status VARCHAR(30) NOT NULL CHECK (status IN ('ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'COMPILE_ERROR')),
    runtime_ms INT,
    memory_mb INT,
    test_cases_passed INT DEFAULT 0,
    total_test_cases INT DEFAULT 0,
    error_message TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sub_user_id ON problem_submissions(user_id);
CREATE INDEX idx_sub_problem_id ON problem_submissions(problem_id);
CREATE INDEX idx_submitted_at ON problem_submissions(submitted_at);

-- ------------------------------------------------------------
-- Aptitude Questions Table
-- ------------------------------------------------------------
CREATE TABLE aptitude_questions (
    id BIGSERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    option_a VARCHAR(500) NOT NULL,
    option_b VARCHAR(500) NOT NULL,
    option_c VARCHAR(500) NOT NULL,
    option_d VARCHAR(500) NOT NULL,
    correct_answer VARCHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
    explanation TEXT,
    category VARCHAR(20) NOT NULL CHECK (category IN ('QUANTITATIVE', 'LOGICAL', 'VERBAL')),
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    time_limit_sec INT DEFAULT 60,
    marks INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_apt_category ON aptitude_questions(category);
CREATE INDEX idx_apt_difficulty ON aptitude_questions(difficulty);

-- ------------------------------------------------------------
-- Aptitude Tests Table
-- ------------------------------------------------------------
CREATE TABLE aptitude_tests (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('QUANTITATIVE', 'LOGICAL', 'VERBAL', 'MIXED')),
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
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    test_category VARCHAR(20) NOT NULL CHECK (test_category IN ('QUANTITATIVE', 'LOGICAL', 'VERBAL', 'MIXED')),
    score INT NOT NULL,
    total_questions INT NOT NULL,
    correct_answers INT NOT NULL,
    wrong_answers INT NOT NULL,
    unattempted INT NOT NULL,
    time_taken_sec INT,
    answers_json JSON,
    percentage DECIMAL(5,2),
    passed BOOLEAN,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_res_user_id ON aptitude_results(user_id);
CREATE INDEX idx_res_category ON aptitude_results(test_category);

-- ------------------------------------------------------------
-- Resumes Table
-- ------------------------------------------------------------
CREATE TABLE resumes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size_kb INT,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'ANALYZED', 'FAILED')),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resumes_user_id ON resumes(user_id);

-- ------------------------------------------------------------
-- Resume Reports Table
-- ------------------------------------------------------------
CREATE TABLE resume_reports (
    id BIGSERIAL PRIMARY KEY,
    resume_id BIGINT NOT NULL UNIQUE REFERENCES resumes(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ats_score INT DEFAULT 0,
    overall_rating VARCHAR(20) CHECK (overall_rating IN ('POOR', 'AVERAGE', 'GOOD', 'EXCELLENT')),
    extracted_name VARCHAR(100),
    extracted_email VARCHAR(150),
    extracted_phone VARCHAR(20),
    skills_found JSON,
    skills_missing JSON,
    projects_count INT DEFAULT 0,
    education_details JSON,
    experience_years DECIMAL(4,1),
    keywords_matched JSON,
    strengths JSON,
    improvements JSON,
    summary TEXT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rep_user_id ON resume_reports(user_id);

-- ------------------------------------------------------------
-- Mock Interviews Table
-- ------------------------------------------------------------
CREATE TABLE mock_interviews (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(30) NOT NULL CHECK (role IN ('SOFTWARE_ENGINEER', 'JAVA_DEVELOPER', 'FRONTEND_DEVELOPER', 'BACKEND_DEVELOPER', 'DATA_ANALYST', 'FULLSTACK_DEVELOPER')),
    status VARCHAR(20) DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'ABANDONED')),
    current_question_index INT DEFAULT 0,
    total_questions INT DEFAULT 10,
    conversation_history JSON,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_mock_user_id ON mock_interviews(user_id);
CREATE INDEX idx_mock_status ON mock_interviews(status);

-- ------------------------------------------------------------
-- Interview Reports Table
-- ------------------------------------------------------------
CREATE TABLE interview_reports (
    id BIGSERIAL PRIMARY KEY,
    interview_id BIGINT NOT NULL UNIQUE REFERENCES mock_interviews(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(100),
    question_count INT,
    technical_score INT,
    communication_score INT,
    confidence_score INT,
    completeness_score INT,
    overall_score INT,
    overall_grade VARCHAR(1) CHECK (overall_grade IN ('A', 'B', 'C', 'D', 'F')),
    strengths JSON,
    weaknesses JSON,
    detailed_feedback TEXT,
    recommendations JSON,
    hiring_recommendation VARCHAR(30) CHECK (hiring_recommendation IN ('STRONGLY_RECOMMEND', 'RECOMMEND', 'NEUTRAL', 'NOT_RECOMMEND')),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_int_rep_user_id ON interview_reports(user_id);

-- ------------------------------------------------------------
-- User Progress / Streaks Table
-- ------------------------------------------------------------
CREATE TABLE user_streaks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_activity_date DATE,
    total_active_days INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Daily Activity Log Table
-- ------------------------------------------------------------
CREATE TABLE daily_activity_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    problems_solved INT DEFAULT 0,
    aptitude_tests_taken INT DEFAULT 0,
    interviews_conducted INT DEFAULT 0,
    study_minutes INT DEFAULT 0,
    CONSTRAINT unique_user_date UNIQUE (user_id, activity_date)
);

-- ------------------------------------------------------------
-- Notifications Table
-- ------------------------------------------------------------
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    type VARCHAR(20) DEFAULT 'INFO' CHECK (type IN ('INFO', 'SUCCESS', 'WARNING', 'ACHIEVEMENT')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notif_user_id ON notifications(user_id);

-- ------------------------------------------------------------
-- Admin Audit Logs
-- ------------------------------------------------------------
CREATE TABLE admin_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    admin_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    target_table VARCHAR(100),
    target_id BIGINT,
    details JSON,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_admin_id ON admin_audit_logs(admin_id);
