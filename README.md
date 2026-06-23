# InterviewAce 🚀

### AI-Powered Smart Interview Preparation Platform

[![Java](https://img.shields.io/badge/Java-17-orange)](https://openjdk.org/projects/jdk/17/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-blue)](https://www.mysql.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-4285F4)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Deployment](#deployment)

---

## Overview

**InterviewAce AI** is a comprehensive full-stack web application that helps college students and job seekers prepare for technical interviews. It combines:

- 🧑‍💻 **DSA Practice** — 200+ curated coding problems with Monaco editor
- 🧠 **Aptitude Tests** — Quantitative, Logical & Verbal with auto-scoring
- 🤖 **AI Mock Interviews** — Role-specific interviewer powered by Google Gemini
- 📄 **Resume Analyzer** — ATS scoring and gap analysis via AI
- 📈 **Progress Tracker** — Streaks, heatmaps, and personalized recommendations
- 🛡️ **Admin Panel** — Full platform management dashboard

---

## Features

| Module | Features |
|--------|----------|
| **Authentication** | JWT login/register, forgot password, role-based access |
| **Dashboard** | Stats, Chart.js weekly graphs, achievements |
| **DSA Practice** | Filter by topic/difficulty, Monaco editor, submission history |
| **Aptitude** | Timed MCQ tests, auto-scoring, detailed solutions |
| **Resume AI** | PDF upload, ATS score out of 100, skill gap analysis |
| **Mock Interview** | AI conversation, 8-question sessions, full evaluation report |
| **Progress** | Activity heatmap, topic radar chart, AI recommendations |
| **Admin** | User management, add questions/problems, analytics |
| **UI/UX** | Dark/Light mode, glassmorphism, Framer Motion animations |

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 + Vite | Core framework |
| Tailwind CSS 3 | Styling |
| React Router v6 | Navigation |
| Chart.js + react-chartjs-2 | Analytics charts |
| Monaco Editor | Code editor (VS Code engine) |
| Axios | HTTP client |
| React Dropzone | File upload |
| Framer Motion | Animations |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|-----------|---------|
| Spring Boot 3.2 | REST API framework |
| Spring Security + JWT | Authentication & authorization |
| Spring Data JPA | ORM layer |
| Apache PDFBox | PDF text extraction |
| Spring WebFlux | Reactive HTTP for Gemini API |
| SpringDoc OpenAPI | Swagger UI documentation |
| Lombok | Boilerplate reduction |

### Infrastructure
| Technology | Purpose |
|-----------|---------|
| MySQL 8.x | Primary database |
| Google Gemini 1.5 Flash | AI features |
| Maven | Backend build |
| npm + Vite | Frontend build |

---

## Project Structure

```
interviewace-ai/
├── frontend/                          # React + Vite application
│   ├── src/
│   │   ├── pages/                     # 15 page components
│   │   ├── components/                # Reusable UI components
│   │   ├── context/                   # Auth & Theme providers
│   │   ├── services/api.js            # Axios API client
│   │   └── index.css                  # Tailwind + custom styles
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                           # Spring Boot application
│   └── src/main/java/com/interviewace/
│       ├── controller/                # 8 REST controllers
│       ├── service/                   # Business logic layer
│       ├── repository/                # JPA repositories
│       ├── entity/                    # 10 JPA entities
│       ├── dto/                       # Request/Response DTOs
│       ├── security/                  # JWT auth filter & util
│       ├── config/                    # Security & CORS config
│       ├── ai/                        # Gemini API integration
│       └── exception/                 # Global error handling
│
├── database/
│   ├── schema.sql                     # Full DDL (11 tables)
│   └── seed.sql                       # Sample data
│
├── docs/
│   ├── API_ENDPOINTS.md
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   └── RESUME_DESCRIPTION.md
│
└── README.md
```

---

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.x
- Maven 3.8+
- Google Gemini API key ([Get one free](https://ai.google.dev/))

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/interviewace-ai.git
cd interviewace-ai
```

### 2. Database Setup
```sql
-- Run in MySQL
mysql -u root -p < database/schema.sql
mysql -u root -p interviewace_db < database/seed.sql
```

### 3. Backend Setup
```bash
cd backend

# Set environment variables (or edit application.yml)
export GEMINI_API_KEY=your_gemini_api_key
export MAIL_USERNAME=your_email@gmail.com
export MAIL_PASSWORD=your_app_password

# Run the application
mvn spring-boot:run
```
Backend starts at `http://localhost:8080`
Swagger UI: `http://localhost:8080/api/swagger-ui.html`

### 4. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend starts at `http://localhost:5173`

### 5. Default Credentials
| Role | Email | Password |
|------|-------|---------|
| Admin | `admin@interviewace.ai` | `Admin@123` |
| Student | `student@interviewace.ai` | `Admin@123` |

---

## Environment Variables

### Backend (`application.yml`)
```yaml
GEMINI_API_KEY=AIza...your_key_here
JWT_SECRET=your_512_bit_secret_key
MAIL_USERNAME=your_gmail@gmail.com
MAIL_PASSWORD=your_google_app_password
UPLOAD_DIR=./uploads/resumes
```

### Frontend (`.env`)
```
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## Database Setup

The project uses 11 MySQL tables:

| Table | Purpose |
|-------|---------|
| `users` | Authentication and role management |
| `profiles` | Extended user information |
| `coding_problems` | DSA problem bank |
| `problem_submissions` | Code submission history |
| `aptitude_questions` | MCQ question bank |
| `aptitude_results` | Test scores and answers |
| `resumes` | Uploaded resume files |
| `resume_reports` | AI-generated ATS reports |
| `mock_interviews` | Interview sessions |
| `interview_reports` | AI evaluation reports |
| `user_streaks` | Learning streak tracking |

---

## API Documentation

Full Swagger UI available at: `http://localhost:8080/api/swagger-ui.html`

See [docs/API_ENDPOINTS.md](docs/API_ENDPOINTS.md) for complete reference.

**Base URL:** `http://localhost:8080/api`

Quick reference:
```
POST   /auth/register         Register new user
POST   /auth/login            Login
GET    /dashboard/stats       User dashboard stats
GET    /coding/problems       List DSA problems
POST   /coding/submit         Submit code solution
GET    /aptitude/questions/:cat  Get test questions
POST   /aptitude/submit       Submit test answers
POST   /resume/upload         Upload PDF resume
POST   /interview/start       Start mock interview
GET    /progress/streak       Get streak data
```

---

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for complete deployment guide (Local, Docker, AWS, Railway).

---

## License

MIT License © 2024 InterviewAce AI

---

> 🏆 **Final Year Project** — Demonstrates: Full-stack development, AI integration, JWT authentication, MVC architecture, database design, RESTful APIs, and modern UI/UX.
