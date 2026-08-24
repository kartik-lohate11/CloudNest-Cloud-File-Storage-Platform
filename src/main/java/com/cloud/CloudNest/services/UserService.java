package com.cloud.CloudNest.services;

import com.cloud.CloudNest.dto.UserDto;
import com.cloud.CloudNest.dto.request.ForgotPasswordRequest;
import com.cloud.CloudNest.dto.request.LoginRequest;
import com.cloud.CloudNest.dto.request.UpdateProfileRequest;

public interface UserService {

    UserDto registerUser(UserDto user);

    UserDto loginUser(LoginRequest request);

    UserDto getUserById(Long id);

    UserDto getUserByEmail(String mail);

    UserDto updateProfile(UpdateProfileRequest request);

    UserDto getByUserName(String userName);

    String resetPassword(ForgotPasswordRequest request);
}
