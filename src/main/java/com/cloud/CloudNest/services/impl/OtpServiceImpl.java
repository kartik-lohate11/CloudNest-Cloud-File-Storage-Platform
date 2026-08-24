package com.cloud.CloudNest.services.impl;

import com.cloud.CloudNest.dto.request.SendOtpRequest;
import com.cloud.CloudNest.dto.request.VerifyOtpRequest;
import com.cloud.CloudNest.dto.response.OtpResponse;
import com.cloud.CloudNest.entities.EmailOtp;
import com.cloud.CloudNest.repository.EmailOtpRepository;
import com.cloud.CloudNest.services.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private final EmailOtpRepository emailOtpRepository;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public OtpResponse sendOtp(SendOtpRequest request) {

        String email = request.getEmail();

        // Delete previous OTP
        emailOtpRepository.deleteByEmail(email);

        // Generate 6-digit OTP
        String otp = String.valueOf(
                100000 + new SecureRandom().nextInt(900000)
        );

        // Create entity
        EmailOtp emailOtp = EmailOtp.builder()
                .email(email)
                .otp(otp)
                .expiryTime(LocalDateTime.now().plusMinutes(5))
                .verified(false)
                .createdAt(LocalDateTime.now())
                .build();

        // Save OTP in DB
        emailOtpRepository.save(emailOtp);

        // Send email
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject("CloudNest - Email Verification");

        message.setText(
                "Your OTP is: " + otp +
                        "\n\nThis OTP will expire in 5 minutes."
        );

        mailSender.send(message);

        return new OtpResponse("OTP sent successfully");
    }


    public OtpResponse verifyOtp(VerifyOtpRequest request) {

        EmailOtp emailOtp = emailOtpRepository
                .findTopByEmailOrderByCreatedAtDesc(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("OTP not found")
                );

        // Check already verified
        if (emailOtp.isVerified()) {
            return new OtpResponse("OTP already used");
        }

        // Check expiry
        if (emailOtp.getExpiryTime()
                .isBefore(LocalDateTime.now())) {

            return new OtpResponse("OTP expired");
        }

        // Check OTP
        if (!emailOtp.getOtp()
                .equals(request.getOtp())) {

            return new OtpResponse("Invalid OTP");
        }

        // Mark OTP as verified
        emailOtp.setVerified(true);

        emailOtpRepository.save(emailOtp);

        return new OtpResponse("OTP verified successfully");
    }
}
