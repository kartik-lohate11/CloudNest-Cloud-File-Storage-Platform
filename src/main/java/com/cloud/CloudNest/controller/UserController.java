package com.cloud.CloudNest.controller;

import com.cloud.CloudNest.dto.UserDto;
import com.cloud.CloudNest.dto.request.ForgotPasswordRequest;
import com.cloud.CloudNest.dto.request.LoginRequest;
import com.cloud.CloudNest.dto.request.SendOtpRequest;
import com.cloud.CloudNest.dto.request.VerifyOtpRequest;
import com.cloud.CloudNest.dto.response.OtpResponse;
import com.cloud.CloudNest.services.OtpService;
import com.cloud.CloudNest.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final OtpService otpService;

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.loginUser(request));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.loginUser(request));
    }

    @org.springframework.web.bind.annotation.GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(org.springframework.security.core.Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        String identifier = authentication.getName();
        return ResponseEntity.ok(userService.getByUserName(identifier));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.registerUser(userDto));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<OtpResponse> sendOtp(@RequestBody SendOtpRequest request) {
        return ResponseEntity.ok(otpService.sendOtp(request));
    }


    @PostMapping("/verify-otp")
    public ResponseEntity<OtpResponse> verifyOtp(@RequestBody VerifyOtpRequest request) {
        return ResponseEntity.ok(otpService.verifyOtp(request));
    }

    @PostMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.ok(userService.resetPassword(request));
    }
}
