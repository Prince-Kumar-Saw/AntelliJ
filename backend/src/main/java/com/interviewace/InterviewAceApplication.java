package com.interviewace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class InterviewAceApplication {
    public static void main(String[] args) {
        SpringApplication.run(InterviewAceApplication.class, args);
    }
}
