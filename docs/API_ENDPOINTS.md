# InterviewAce AI — Complete API Reference

**Base URL:** `http://localhost:8080/api`  
**Authentication:** All endpoints (except `/auth/**`) require `Authorization: Bearer <token>`  
**Content-Type:** `application/json`

---

## 🔐 Authentication

### POST `/auth/register`
Register a new student account.

**Request:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "SecurePass@123"
}
```
**Response `201`:**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
  "userId": 5,
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "role": "STUDENT",
  "message": "Registration successful"
}
```

---

### POST `/auth/login`
Authenticate with email and password.

**Request:**
```json
{ "email": "rahul@example.com", "password": "SecurePass@123" }
```
**Response `200`:** Same structure as register.

---

### POST `/auth/refresh`
Refresh the access token using a refresh token.

**Request:**
```json
{ "refreshToken": "eyJhbGciOiJIUzUxMiJ9..." }
```

---

### POST `/auth/forgot-password`
Request a password reset email.

**Request:**
```json
{ "email": "rahul@example.com" }
```

---

### POST `/auth/reset-password`
Reset password using the token from email.

**Request:**
```json
{ "token": "uuid-reset-token", "newPassword": "NewPass@456" }
```

---

## 📊 Dashboard

### GET `/dashboard/stats`
Get aggregated statistics for the current user.

**Response `200`:**
```json
{
  "userId": 5,
  "name": "Rahul Sharma",
  "totalSubmissions": 47,
  "problemsSolved": 28,
  "aptitudeTestsTaken": 12,
  "mockInterviewsCompleted": 3,
  "resumesUploaded": 2,
  "weeklyActivity": 8
}
```

---

### GET `/dashboard/weekly-performance`
Get weekly activity data for charts.

**Response `200`:**
```json
{
  "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  "problemsSolved": [2, 3, 1, 4, 2, 5, 3],
  "aptitudeTests": [1, 0, 2, 1, 0, 1, 2],
  "studyMinutes": [45, 60, 30, 90, 45, 120, 75]
}
```

---

## 💻 DSA Practice

### GET `/coding/problems`
Get paginated problems with optional filters.

**Query Params:** `difficulty`, `category`, `page` (default 0), `size` (default 20)

**Example:** `GET /coding/problems?difficulty=EASY&category=ARRAYS&page=0&size=10`

**Response `200`:**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Two Sum",
      "slug": "two-sum",
      "difficulty": "EASY",
      "category": "ARRAYS",
      "acceptanceRate": 48.20,
      "totalSubmissions": 1247,
      "tags": ["hash-map", "array"]
    }
  ],
  "totalElements": 42,
  "totalPages": 5,
  "size": 10,
  "number": 0
}
```

---

### GET `/coding/problems/{id}`
Get full problem details including description, test cases, and starter code.

**Response `200`:** Full `CodingProblem` object with description, examples, testCases, starterCodeJava, etc.

---

### GET `/coding/problems/slug/{slug}`
Get problem by URL slug (e.g., `two-sum`).

---

### POST `/coding/submit`
Submit a code solution for evaluation.

**Request:**
```json
{
  "problemId": 1,
  "code": "class Solution { public int[] twoSum(int[] nums, int target) { ... } }",
  "language": "JAVA"
}
```

**Response `200`:**
```json
{
  "id": 99,
  "status": "ACCEPTED",
  "testCasesPassed": 3,
  "totalTestCases": 3,
  "runtimeMs": 45,
  "memoryMb": 42,
  "submittedAt": "2024-06-10T14:30:00"
}
```

Possible statuses: `ACCEPTED`, `WRONG_ANSWER`, `TIME_LIMIT_EXCEEDED`, `RUNTIME_ERROR`, `COMPILE_ERROR`

---

### GET `/coding/submissions/me`
Get current user's submission history (paginated).

**Query Params:** `page`, `size`

---

## 🧠 Aptitude Tests

### GET `/aptitude/categories`
Get total question count per category.

**Response `200`:**
```json
{ "QUANTITATIVE": 120, "LOGICAL": 100, "VERBAL": 80 }
```

---

### GET `/aptitude/questions/{category}`
Get randomized questions for a category.

**Path:** `category` = `QUANTITATIVE` | `LOGICAL` | `VERBAL`  
**Query:** `count` (default 20)

**Response `200`:**
```json
[
  {
    "id": 1,
    "question": "A train travels 60 km/h for 2 hours...",
    "optionA": "68 km/h",
    "optionB": "72 km/h",
    "optionC": "70 km/h",
    "optionD": "75 km/h",
    "category": "QUANTITATIVE",
    "difficulty": "MEDIUM",
    "timeLimitSec": 90,
    "marks": 1
  }
]
```
> Note: `correctAnswer` and `explanation` are NOT returned to prevent cheating.

---

### POST `/aptitude/submit`
Submit test answers for grading.

**Request:**
```json
{
  "category": "QUANTITATIVE",
  "totalQuestions": 20,
  "timeTakenSec": 1845,
  "answers": [
    { "questionId": 1, "selectedAnswer": "B" },
    { "questionId": 2, "selectedAnswer": "B" },
    { "questionId": 3, "selectedAnswer": null }
  ]
}
```

**Response `200`:**
```json
{
  "id": 15,
  "testCategory": "QUANTITATIVE",
  "score": 17,
  "totalQuestions": 20,
  "correctAnswers": 17,
  "wrongAnswers": 2,
  "unattempted": 1,
  "percentage": 85.00,
  "passed": true,
  "attemptedAt": "2024-06-10T15:00:00"
}
```

---

### GET `/aptitude/results/me`
Get current user's test history (paginated).

---

### GET `/aptitude/results/{id}`
Get specific result with full answer details.

---

## 📄 Resume Analyzer

### POST `/resume/upload`
Upload PDF resume for AI analysis.

**Content-Type:** `multipart/form-data`  
**Form Fields:** `file` (PDF), `targetRole` (string, optional)

**Response `200`:**
```json
{
  "id": 3,
  "status": "PROCESSING",
  "message": "Resume uploaded! AI analysis is in progress. Check back in 15-30 seconds."
}
```

---

### GET `/resume/report/{id}`
Poll for the AI-generated resume report.

**Response `200`:**
```json
{
  "id": 3,
  "atsScore": 78,
  "overallRating": "GOOD",
  "extractedName": "Rahul Sharma",
  "extractedEmail": "rahul@example.com",
  "skillsFound": ["Java", "Spring Boot", "React", "MySQL"],
  "skillsMissing": ["Docker", "Kubernetes", "AWS"],
  "projectsCount": 3,
  "experienceYears": 0,
  "strengths": ["Clear project descriptions", "Strong technical skills"],
  "improvements": ["Add quantifiable achievements", "Include cloud technologies"],
  "summary": "Solid foundational skills...",
  "generatedAt": "2024-06-10T15:05:00"
}
```

**Response `404`** if analysis is still in progress.

---

### GET `/resume/reports/me`
Get all resume uploads for current user.

---

## 🤖 Mock Interview

### POST `/interview/start`
Start a new AI mock interview session.

**Request:**
```json
{ "role": "SOFTWARE_ENGINEER", "totalQuestions": 8 }
```

Available roles: `SOFTWARE_ENGINEER`, `JAVA_DEVELOPER`, `FRONTEND_DEVELOPER`, `BACKEND_DEVELOPER`, `DATA_ANALYST`, `FULLSTACK_DEVELOPER`

**Response `200`:**
```json
{
  "interviewId": 12,
  "question": "Welcome to your mock interview! Let's begin.\n\nQuestion 1 of 8: Tell me about yourself...",
  "questionNumber": 1,
  "totalQuestions": 8
}
```

---

### POST `/interview/answer`
Submit an answer and receive the next question (or trigger report generation).

**Request:**
```json
{
  "interviewId": 12,
  "answer": "I am a final year CS student with experience in...",
  "isLastAnswer": false
}
```

**Response (mid-interview) `200`:**
```json
{
  "completed": false,
  "nextQuestion": "Good answer! Question 2 of 8: Explain the difference between a stack and a queue...",
  "questionNumber": 2
}
```

**Response (final answer) `200`:**
```json
{ "completed": true, "reportId": 12 }
```

---

### GET `/interview/report/{id}`
Get the AI evaluation report for a completed interview.

**Response `200`:**
```json
{
  "id": 12,
  "role": "Software Engineer",
  "questionCount": 8,
  "technicalScore": 78,
  "communicationScore": 82,
  "confidenceScore": 75,
  "completenessScore": 80,
  "overallScore": 79,
  "overallGrade": "B",
  "hiringRecommendation": "RECOMMEND",
  "strengths": ["Strong DSA knowledge", "Clear communication"],
  "weaknesses": ["Limited system design depth"],
  "detailedFeedback": "Overall a strong performance...",
  "recommendations": ["Study distributed systems", "Practice mock interviews 3x/week"],
  "generatedAt": "2024-06-10T16:00:00"
}
```

---

### GET `/interview/history/me`
Get interview history for current user (paginated).

---

## 📈 Progress Tracker

### GET `/progress/streak`
**Response `200`:**
```json
{
  "currentStreak": 5,
  "longestStreak": 12,
  "totalActiveDays": 28,
  "lastActivityDate": "2024-06-10"
}
```

---

### GET `/progress/topic-performance`
**Response `200`:**
```json
{
  "categories": ["Arrays", "Strings", "Trees", "Graphs", "DP"],
  "scores": [85, 72, 60, 45, 38]
}
```

---

### GET `/progress/recommendations`
Get AI-powered personalized learning recommendations.

**Response `200`:**
```json
[
  "Practice 5 Graph problems daily — your graph score is 45%",
  "Review Dynamic Programming patterns: knapsack, LCS, LIS",
  "Spend 30 min daily on Aptitude — focus on Logical Reasoning"
]
```

---

## 🛡️ Admin Panel (ROLE_ADMIN required)

### GET `/admin/users`
Get all users with pagination.

**Query Params:** `page`, `size`

---

### PUT `/admin/users/{id}/status`
**Request:** `{ "isActive": false }`

---

### POST `/admin/coding/problems`
Add a new coding problem (full `CodingProblem` JSON body).

---

### POST `/admin/aptitude/questions`
Add a new aptitude question (full `AptitudeQuestion` JSON body).

---

### GET `/admin/analytics`
Get platform-wide statistics.

---

## Error Response Format

All errors follow this structure:
```json
{
  "timestamp": "2024-06-10T14:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Problem not found with id: 999"
}
```

**Validation Errors:**
```json
{
  "timestamp": "2024-06-10T14:30:00",
  "status": 400,
  "error": "Validation Failed",
  "fieldErrors": {
    "email": "Please provide a valid email",
    "password": "Password must be at least 8 characters"
  }
}
```

---

## HTTP Status Codes Used

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Resource Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient role) |
| 404 | Resource Not Found |
| 413 | File Too Large (>10MB) |
| 500 | Internal Server Error |
