package com.interviewace.service;

import com.interviewace.ai.GeminiService;
import com.interviewace.entity.Resume;
import com.interviewace.entity.ResumeReport;
import com.interviewace.entity.User;
import com.interviewace.exception.BadRequestException;
import com.interviewace.exception.ResourceNotFoundException;
import com.interviewace.repository.ResumeRepository;
import com.interviewace.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.EntityManager;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeService {

    private final ResumeRepository resumeRepo;
    private final UserRepository userRepo;
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    @Value("${storage.upload-dir}")
    private String uploadDir;

    @Transactional
    public Resume uploadResume(MultipartFile file, String userEmail, String targetRole) {
        if (file.isEmpty()) throw new BadRequestException("File is empty");
        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("application/pdf")) {
            throw new BadRequestException("Only PDF files are accepted");
        }

        User user = userRepo.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        try {
            // Store file
            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            file.transferTo(filePath.toFile());

            Resume resume = Resume.builder()
                .user(user)
                .fileName(file.getOriginalFilename())
                .filePath(filePath.toString())
                .fileSizeKb((int) (file.getSize() / 1024))
                .status(Resume.Status.PROCESSING)
                .build();
            Resume saved = resumeRepo.save(resume);

            // Async analysis
            analyzeResumeAsync(saved.getId(), filePath.toString(), targetRole, user);

            return saved;
        } catch (IOException e) {
            throw new BadRequestException("Failed to process uploaded file: " + e.getMessage());
        }
    }

    @Async
    @Transactional
    public void analyzeResumeAsync(Long resumeId, String filePath, String targetRole, User user) {
        try {
            // Extract text from PDF
            String resumeText = extractTextFromPdf(filePath);
            if (resumeText.isBlank()) throw new BadRequestException("Could not extract text from PDF");

            // Call Gemini AI
            String aiResponse = geminiService.analyzeResume(resumeText, targetRole);

            // Parse JSON response
            Map<String, Object> analysis = objectMapper.readValue(aiResponse, Map.class);

            Resume resume = resumeRepo.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));

            // Build report
            ResumeReport report = ResumeReport.builder()
                .resume(resume)
                .user(user)
                .atsScore(getInt(analysis, "atsScore", 0))
                .overallRating(parseRating(getString(analysis, "overallRating", "AVERAGE")))
                .extractedName(getString(analysis, "extractedName", null))
                .extractedEmail(getString(analysis, "extractedEmail", null))
                .extractedPhone(getString(analysis, "extractedPhone", null))
                .skillsFound(objectMapper.writeValueAsString(analysis.get("skillsFound")))
                .skillsMissing(objectMapper.writeValueAsString(analysis.get("skillsMissing")))
                .projectsCount(getInt(analysis, "projectsCount", 0))
                .experienceYears(BigDecimal.valueOf(getDouble(analysis, "experienceYears", 0.0)))
                .keywordsMatched(objectMapper.writeValueAsString(analysis.get("keywordsMatched")))
                .strengths(objectMapper.writeValueAsString(analysis.get("strengths")))
                .improvements(objectMapper.writeValueAsString(analysis.get("improvements")))
                .summary(getString(analysis, "summary", ""))
                .build();

            resume.setReport(report);
            resume.setStatus(Resume.Status.ANALYZED);
            resumeRepo.save(resume);

            log.info("Resume {} analyzed successfully. ATS Score: {}", resumeId, report.getAtsScore());
        } catch (Exception e) {
            log.error("Resume analysis failed for {}: {}", resumeId, e.getMessage());
            resumeRepo.findById(resumeId).ifPresent(r -> {
                r.setStatus(Resume.Status.FAILED);
                resumeRepo.save(r);
            });
        }
    }

    private String extractTextFromPdf(String filePath) throws IOException {
        try (PDDocument doc = PDDocument.load(new java.io.File(filePath))) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(doc);
        }
    }

    public ResumeReport getReport(Long resumeId, String userEmail) {
        Resume resume = resumeRepo.findById(resumeId)
            .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));
        if (!resume.getUser().getEmail().equals(userEmail)) {
            throw new BadRequestException("Access denied");
        }
        if (resume.getReport() == null) {
            throw new ResourceNotFoundException("Report not yet generated. Status: " + resume.getStatus());
        }
        return resume.getReport();
    }

    public List<Resume> getMyResumes(String userEmail) {
        User user = userRepo.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return resumeRepo.findByUserIdOrderByUploadedAtDesc(user.getId());
    }

    // Helpers
    private int getInt(Map<String, Object> m, String key, int def) {
        Object v = m.get(key); return v instanceof Number ? ((Number) v).intValue() : def;
    }
    private double getDouble(Map<String, Object> m, String key, double def) {
        Object v = m.get(key); return v instanceof Number ? ((Number) v).doubleValue() : def;
    }
    private String getString(Map<String, Object> m, String key, String def) {
        Object v = m.get(key); return v != null ? v.toString() : def;
    }
    private ResumeReport.Rating parseRating(String s) {
        try { return ResumeReport.Rating.valueOf(s.toUpperCase()); }
        catch (Exception e) { return ResumeReport.Rating.AVERAGE; }
    }
}
