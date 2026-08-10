package com.cloud.CloudNest.controller;

import com.cloud.CloudNest.dto.UserDto;
import com.cloud.CloudNest.dto.request.LoginRequest;
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

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.loginUser(request));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.registerUser(userDto));
    }
}
