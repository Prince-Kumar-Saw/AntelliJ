package com.interviewace.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.base-url}")
    private String baseUrl;

    @Value("${gemini.api.model}")
    private String model;

    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;

    /**
     * Send a prompt to Gemini and get text response.
     */
    public String generateContent(String prompt) {
        try {
            WebClient client = webClientBuilder.baseUrl(baseUrl).build();

            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(Map.of("text", prompt)))
                ),
                "generationConfig", Map.of(
                    "temperature", 0.7,
                    "maxOutputTokens", 2048,
                    "topP", 0.95
                )
            );

            String response = client.post()
                .uri("/models/{model}:generateContent?key={key}", model, apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

            // Extract text from response
            JsonNode root = objectMapper.readTree(response);
            return root.path("candidates").get(0)
                .path("content").path("parts").get(0)
                .path("text").asText();

        } catch (Exception e) {
            log.error("Gemini API call failed: {}", e.getMessage());
            return "AI service temporarily unavailable. Please try again.";
        }
    }

    /**
     * Analyze resume text and return structured JSON analysis.
     */
    public String analyzeResume(String resumeText, String targetRole) {
        String prompt = """
            You are an expert ATS (Applicant Tracking System) and HR professional.
            Analyze the following resume and provide a detailed JSON response.
            
            Target Role: %s
            
            Resume Text:
            %s
            
            Respond ONLY with a valid JSON object (no markdown) in this exact format:
            {
              "atsScore": <number 0-100>,
              "overallRating": "<POOR|AVERAGE|GOOD|EXCELLENT>",
              "extractedName": "<name or null>",
              "extractedEmail": "<email or null>",
              "extractedPhone": "<phone or null>",
              "skillsFound": ["skill1", "skill2"],
              "skillsMissing": ["missing1", "missing2"],
              "projectsCount": <number>,
              "educationDetails": {"degree": "", "institution": "", "year": ""},
              "experienceYears": <number or 0>,
              "keywordsMatched": ["keyword1"],
              "strengths": ["strength1", "strength2"],
              "improvements": ["improvement1", "improvement2"],
              "summary": "<2-3 sentence overall assessment>"
            }
            """.formatted(targetRole != null ? targetRole : "Software Engineer", resumeText);

        return generateContent(prompt);
    }

    /**
     * Generate the first interview question for a given role.
     */
    public String startInterview(String role, int totalQuestions) {
        String prompt = """
            You are conducting a technical interview for a %s position.
            This is a %d-question interview.
            
            Ask the FIRST interview question. Make it a mix of:
            - Introduction/background
            - Technical concepts
            - Problem-solving
            
            Start with: "Welcome to your mock interview for the %s role! Let's begin."
            Then ask Question 1 of %d clearly.
            
            Be professional and encouraging. Only ask ONE question.
            """.formatted(role, totalQuestions, role, totalQuestions);

        return generateContent(prompt);
    }

    /**
     * Continue the interview — evaluate previous answer and ask next question.
     */
    public String continueInterview(String role, String conversationHistory,
                                     int currentQuestion, int totalQuestions) {
        String prompt = """
            You are conducting a technical interview for a %s position.
            
            Conversation so far:
            %s
            
            This is question %d of %d.
            
            1. Give brief, constructive feedback on the previous answer (1-2 sentences)
            2. Ask the next interview question
            
            Focus areas: algorithms, system design, Java/relevant tech, behavioral questions.
            Be professional. Only ask ONE question.
            """.formatted(role, conversationHistory, currentQuestion, totalQuestions);

        return generateContent(prompt);
    }

    /**
     * Generate final interview evaluation report.
     */
    public String generateInterviewReport(String role, String conversationHistory, int questionCount) {
        String prompt = """
            You are an expert interview evaluator. Analyze this complete mock interview for a %s position.
            
            Full Interview Transcript:
            %s
            
            Total Questions: %d
            
            Provide a comprehensive evaluation as JSON ONLY (no markdown):
            {
              "technicalScore": <0-100>,
              "communicationScore": <0-100>,
              "confidenceScore": <0-100>,
              "completenessScore": <0-100>,
              "overallScore": <0-100>,
              "overallGrade": "<A|B|C|D|F>",
              "strengths": ["strength1", "strength2", "strength3"],
              "weaknesses": ["weakness1", "weakness2"],
              "detailedFeedback": "<comprehensive paragraph feedback>",
              "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
              "hiringRecommendation": "<STRONGLY_RECOMMEND|RECOMMEND|NEUTRAL|NOT_RECOMMEND>"
            }
            """.formatted(role, conversationHistory, questionCount);

        return generateContent(prompt);
    }

    /**
     * Generate personalized learning recommendations.
     */
    public String generateRecommendations(String weakAreas, String performanceSummary) {
        String prompt = """
            Based on this student's performance data, generate personalized learning recommendations.
            
            Weak Areas: %s
            Performance Summary: %s
            
            Provide 5 specific, actionable recommendations as a JSON array:
            ["recommendation1", "recommendation2", "recommendation3", "recommendation4", "recommendation5"]
            
            Each recommendation should include what to study and where to find resources.
            """.formatted(weakAreas, performanceSummary);

        return generateContent(prompt);
    }
}
