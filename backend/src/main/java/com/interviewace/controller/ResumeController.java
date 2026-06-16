package com.interviewace.controller;

import com.interviewace.entity.Resume;
import com.interviewace.entity.ResumeReport;
import com.interviewace.service.ResumeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/resume")
@RequiredArgsConstructor
@Tag(name = "Resume Analyzer", description = "AI-powered resume analysis endpoints")
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping("/upload")
    @Operation(summary = "Upload a PDF resume for AI analysis")
    public ResponseEntity<Map<String, Object>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "targetRole", defaultValue = "Software Engineer") String targetRole,
            Authentication auth) {
        Resume resume = resumeService.uploadResume(file, auth.getName(), targetRole);
        return ResponseEntity.ok(Map.of(
            "id", resume.getId(),
            "status", resume.getStatus(),
            "message", "Resume uploaded! AI analysis is in progress. Check back in 15-30 seconds."
        ));
    }

    @GetMapping("/report/{id}")
    @Operation(summary = "Get resume analysis report by resume ID")
    public ResponseEntity<ResumeReport> getReport(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(resumeService.getReport(id, auth.getName()));
    }

    @GetMapping("/reports/me")
    @Operation(summary = "Get all resume uploads for current user")
    public ResponseEntity<List<Resume>> getMyReports(Authentication auth) {
        return ResponseEntity.ok(resumeService.getMyResumes(auth.getName()));
    }
}
