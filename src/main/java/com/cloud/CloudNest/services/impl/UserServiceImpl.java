package com.cloud.CloudNest.services.impl;

import com.cloud.CloudNest.dto.UserDto;
import com.cloud.CloudNest.dto.request.ForgotPasswordRequest;
import com.cloud.CloudNest.dto.request.LoginRequest;
import com.cloud.CloudNest.dto.request.UpdateProfileRequest;
import com.cloud.CloudNest.entities.UserData;
import com.cloud.CloudNest.exception.UserNotFoundException;
import com.cloud.CloudNest.repository.UserDataRepository;
import com.cloud.CloudNest.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserDataRepository userDataRepository;

    @Override
    public UserDto registerUser(UserDto user) {
        return UserDto.toDto(userDataRepository.save(user.toEntity()));
    }

    @Override
    public UserDto loginUser(LoginRequest request) {
        UserData userData = userDataRepository.findByUserNameAndPassword(request.userName(), request.password());
        if (userData == null) {
            userData = userDataRepository.findByMailAndPassword(request.userName(), request.password());
        }
        if (userData != null) {
            log.info(request.userName() + " found");
            return UserDto.toDto(userData);
        }
        throw new UserNotFoundException("Invalid credentials for user " + request.userName());
    }

    @Override
    public UserDto getUserById(Long id) {
        return userDataRepository.findById(id)
                .map(UserDto::toDto)
                .orElseThrow(() -> new UserNotFoundException("User with ID " + id + " Not Found"));
    }

    @Override
    public UserDto getUserByEmail(String mail) {
        UserData userData = userDataRepository.findByMail(mail);
        if (userData != null) return UserDto.toDto(userData);
        throw new UserNotFoundException("User with email " + mail + " Not Found");
    }

    @Override
    public UserDto updateProfile(UpdateProfileRequest request) {
        return null;
    }

    @Override
    public UserDto getByUserName(String userName) {
        UserData userData = userDataRepository.findByUserName(userName);
        if (userData == null) {
            userData = userDataRepository.findByMail(userName);
        }
        if (userData != null) return UserDto.toDto(userData);
        throw new UserNotFoundException(userName + " Not Found");
    }

    @Transactional
    @Override
    public String resetPassword(ForgotPasswordRequest request) {

        // Check user exists
        if (!userDataRepository.existsByMail(request.mail())) {
            throw new RuntimeException("User not found");
        }

        // Encrypt password
//        String encodedPassword =
//                passwordEncoder.encode(request.getNewPassword());

        // Update password
        int updatedRows = userDataRepository.updateUserPassword(
                request.password(),
                request.mail()
        );

        if (updatedRows == 0) {
            throw new RuntimeException("Password update failed");
        }

        return "Password updated successfully";
    }
}
