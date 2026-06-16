# InterviewAce AI — System Architecture

## Architecture Overview

InterviewAce AI follows a **three-tier client-server architecture** with AI services integrated at the backend layer.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT TIER                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React 18 + Vite + Tailwind CSS (SPA)                   │   │
│  │  • React Router v6 (client-side routing)                 │   │
│  │  • Auth Context (JWT state management)                   │   │
│  │  • Axios (HTTP client with interceptors)                 │   │
│  │  • Chart.js (analytics visualizations)                   │   │
│  │  • Monaco Editor (code editor)                           │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTPS / REST API
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       APPLICATION TIER                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Spring Boot 3.2 (Java 17)                               │   │
│  │                                                          │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │   │
│  │  │ Controllers │→ │  Services   │→ │  Repositories   │  │   │
│  │  │  (8 REST)   │  │ (Business)  │  │  (JPA/Spring)   │  │   │
│  │  └─────────────┘  └──────┬──────┘  └────────┬────────┘  │   │
│  │                          │                   │           │   │
│  │  ┌───────────────────────┘    ┌──────────────┘           │   │
│  │  │                            │                          │   │
│  │  ▼                            ▼                          │   │
│  │  ┌─────────────┐  ┌─────────────────────────────────┐    │   │
│  │  │ Gemini AI   │  │     Spring Security + JWT       │    │   │
│  │  │  Service    │  │  JwtAuthFilter + JwtUtil        │    │   │
│  │  └─────────────┘  └─────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────┬────────────────────────────┬───────────────────┘
                 │                            │
                 ▼                            ▼
┌────────────────────────┐      ┌─────────────────────────────────┐
│      DATA TIER         │      │        EXTERNAL SERVICES        │
│  ┌──────────────────┐  │      │  ┌──────────────────────────┐   │
│  │   MySQL 8.x      │  │      │  │  Google Gemini 1.5 Flash │   │
│  │  11 Tables       │  │      │  │  (AI Interview, Resume,  │   │
│  │  Indexes         │  │      │  │   Recommendations)       │   │
│  │  Foreign Keys    │  │      │  └──────────────────────────┘   │
│  └──────────────────┘  │      │  ┌──────────────────────────┐   │
│  ┌──────────────────┐  │      │  │  SMTP (Gmail)            │   │
│  │  File Storage    │  │      │  │  (Password Reset Emails) │   │
│  │  (PDF Resumes)   │  │      │  └──────────────────────────┘   │
│  └──────────────────┘  │      └─────────────────────────────────┘
└────────────────────────┘
```

---

## Backend Package Architecture (Clean MVC)

```
com.interviewace/
│
├── config/
│   └── SecurityConfig.java          # Spring Security + CORS + JWT filter chain
│
├── controller/                      # REST layer — handles HTTP in/out
│   ├── AuthController.java
│   ├── DashboardController.java
│   ├── CodingController.java
│   ├── AptitudeController.java
│   ├── ResumeController.java
│   ├── InterviewController.java
│   ├── ProgressController.java
│   └── AdminController.java
│
├── service/                         # Business logic layer
│   ├── AuthService.java
│   ├── DashboardService.java
│   ├── CodingService.java
│   ├── AptitudeService.java
│   ├── ResumeService.java           # + PDF extraction + async AI call
│   ├── InterviewService.java        # + AI conversation management
│   ├── ProgressService.java
│   └── AdminService.java
│
├── repository/                      # Data access layer (Spring Data JPA)
│   ├── UserRepository.java
│   ├── CodingProblemRepository.java
│   ├── ProblemSubmissionRepository.java
│   ├── AptitudeQuestionRepository.java
│   ├── AptitudeResultRepository.java
│   ├── ResumeRepository.java
│   └── MockInterviewRepository.java
│
├── entity/                          # JPA entities (mapped to MySQL tables)
│   ├── User.java
│   ├── Profile.java
│   ├── CodingProblem.java
│   ├── ProblemSubmission.java
│   ├── AptitudeQuestion.java
│   ├── AptitudeResult.java
│   ├── Resume.java
│   ├── ResumeReport.java
│   ├── MockInterview.java
│   └── InterviewReport.java
│
├── security/
│   ├── JwtUtil.java                 # Token generation + validation
│   ├── JwtAuthFilter.java           # Per-request JWT extraction
│   └── CustomUserDetailsService.java
│
├── ai/
│   └── GeminiService.java           # Gemini API client for all AI features
│
├── exception/
│   ├── GlobalExceptionHandler.java  # @RestControllerAdvice
│   ├── ResourceNotFoundException.java
│   └── BadRequestException.java
│
└── InterviewAceApplication.java
```

---

## Frontend Architecture

```
src/
├── main.jsx                    # React DOM entry point
├── App.jsx                     # Root router with all route definitions
├── index.css                   # Tailwind + custom design system
│
├── context/
│   ├── AuthContext.jsx         # JWT state, login/logout, user data
│   └── ThemeContext.jsx        # Dark/light mode toggle + localStorage
│
├── services/
│   └── api.js                  # Axios instance + all API functions
│                               # Interceptors: attach token, handle 401, refresh
│
├── components/
│   ├── AppLayout.jsx           # Main layout wrapper (Navbar + Sidebar)
│   ├── Navbar.jsx              # Top bar with theme toggle
│   ├── Sidebar.jsx             # Navigation sidebar with role-based items
│   ├── ProtectedRoute.jsx      # Redirect to /login if unauthenticated
│   └── AdminRoute.jsx          # Redirect if not ADMIN role
│
└── pages/
    ├── LandingPage.jsx         # Public marketing page
    ├── LoginPage.jsx           # JWT login form
    ├── RegisterPage.jsx        # Registration with validation
    ├── ForgotPasswordPage.jsx  # Password reset request
    ├── Dashboard.jsx           # Stats + Chart.js graphs
    ├── DSAModule.jsx           # Problem list with filters
    ├── ProblemEditor.jsx       # Monaco editor + test output
    ├── AptitudeModule.jsx      # Category selector + recent scores
    ├── AptitudeTest.jsx        # Timed MCQ test interface
    ├── AptitudeResult.jsx      # Score report + doughnut chart
    ├── ResumeAnalyzer.jsx      # Drag-drop upload + ATS score ring
    ├── MockInterview.jsx       # Role selector + chat interface
    ├── InterviewReport.jsx     # Radar chart + detailed feedback
    ├── ProgressTracker.jsx     # Heatmap + topic bar chart
    ├── ProfilePage.jsx         # User profile editor
    ├── AdminDashboard.jsx      # Platform analytics
    ├── AdminUsers.jsx          # User management table
    └── AdminQuestions.jsx      # Add problems/questions forms
```

---

## Database Entity Relationship Diagram

```
users ──────────── profiles (1:1)
  │
  ├──────────────── problem_submissions (1:N)
  │                      └── coding_problems (N:1)
  │
  ├──────────────── aptitude_results (1:N)
  │
  ├──────────────── resumes (1:N)
  │                      └── resume_reports (1:1)
  │
  ├──────────────── mock_interviews (1:N)
  │                      └── interview_reports (1:1)
  │
  ├──────────────── user_streaks (1:1)
  ├──────────────── daily_activity_logs (1:N)
  └──────────────── notifications (1:N)
```

---

## Security Architecture

```
HTTP Request
    │
    ▼
┌─────────────────────────────────────────────┐
│  JwtAuthFilter (OncePerRequestFilter)        │
│  1. Extract "Authorization: Bearer <token>"  │
│  2. Validate JWT signature + expiry          │
│  3. Load UserDetails from DB                 │
│  4. Set SecurityContext authentication       │
└──────────────────────────┬──────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────┐
│  SecurityFilterChain (SecurityConfig)        │
│  • /auth/** → permitAll()                    │
│  • /admin/** → hasRole('ADMIN')              │
│  • /** → authenticated()                     │
└──────────────────────────┬──────────────────┘
                           │
                           ▼
                    Controller Method
```

---

## AI Integration Flow

```
User Action (Upload Resume / Start Interview)
    │
    ▼
Spring Boot Service
    │
    ├── Resume: PDFBox extracts text from PDF
    │         → GeminiService.analyzeResume(text, role)
    │         → Parse JSON response
    │         → Save ResumeReport to MySQL
    │
    └── Interview: Build conversation history
                 → GeminiService.continueInterview(history, qNum)
                 → Return next question to frontend
                 → On last answer: GeminiService.generateInterviewReport(history)
                 → Parse + save InterviewReport to MySQL
```

---

## JWT Token Flow

```
Login → Server generates:
  • Access Token (24h expiry, HS512)
  • Refresh Token (7d expiry)

Frontend stores both in localStorage.
Axios interceptor attaches Access Token to every request.

On 401 (expired):
  Axios interceptor → POST /auth/refresh → New Access Token
  Retry original request automatically.

On refresh failure:
  Clear localStorage → Redirect to /login
```
