package com.cloud.CloudNest.services.impl;

import com.cloud.CloudNest.dto.request.SendOtpRequest;
import com.cloud.CloudNest.dto.request.VerifyOtpRequest;
import com.cloud.CloudNest.dto.response.OtpResponse;
import com.cloud.CloudNest.entities.EmailOtp;
import com.cloud.CloudNest.entities.UserData;
import com.cloud.CloudNest.enums.OtpType;
import com.cloud.CloudNest.exception.UserAllReadyExistsException;
import com.cloud.CloudNest.exception.UserInvalidInputException;
import com.cloud.CloudNest.repository.EmailOtpRepository;
import com.cloud.CloudNest.repository.UserDataRepository;
import com.cloud.CloudNest.services.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private final EmailOtpRepository emailOtpRepository;
    private final JavaMailSender mailSender;
    private final UserDataRepository userDataRepository;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Transactional
    public OtpResponse sendOtp(SendOtpRequest request) {

        String email = request.getEmail();

        UserData userData = userDataRepository.findByMail(email);

        if (OtpType.REGISTRATION.equals(request.getOtpType()) && userData != null) {
            throw new UserAllReadyExistsException("For mail id " + request.getEmail() + " User is present! Try with another mail Id");
        }

        // Forgot Password
        if (request.getOtpType().equals(OtpType.FORGOT_PASSWORD) && userData == null) {
            throw new UserInvalidInputException("Email is not registered");
        }

        if (request.getOtpType().equals(OtpType.FORGOT_PASSWORD) && !"LOCAL".equals(userData.getProvideType())) {
            throw new UserInvalidInputException("This account uses " + userData.getProvideType() + " login. Please sign in with Google.");
        }

        try {
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
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("There some Issue. Try later");
        }

        return new OtpResponse("OTP sent successfully");
    }


    @Transactional
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
