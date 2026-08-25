package com.cloud.CloudNest.services.impl;

import com.cloud.CloudNest.dto.UserDataPrinciple;
import com.cloud.CloudNest.dto.UserDto;
import com.cloud.CloudNest.dto.request.ForgotPasswordRequest;
import com.cloud.CloudNest.dto.request.LoginRequest;
import com.cloud.CloudNest.dto.request.UpdateProfileRequest;
import com.cloud.CloudNest.dto.response.AuthResponse;
import com.cloud.CloudNest.entities.UserData;
import com.cloud.CloudNest.exception.UserNotFoundException;
import com.cloud.CloudNest.repository.UserDataRepository;
import com.cloud.CloudNest.services.UserService;
import com.cloud.CloudNest.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    private final UserDataRepository userDataRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public UserServiceImpl(UserDataRepository userDataRepository,
                           PasswordEncoder passwordEncoder,
                           @Lazy AuthenticationManager authenticationManager) {
        this.userDataRepository = userDataRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public UserDto registerUser(UserDto user) {
        String password = user.getPassword();
        user.setPassword(passwordEncoder.encode(password));
        user.setUserName(createUniqueUserName(user.getUserName()));
        return UserDto.toDto(userDataRepository.save(user.toEntity()));
    }

    @Override
    public AuthResponse loginUser(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.userName(), request.password()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                log.warn("Authentication is NULL");
                throw new RuntimeException("Issue During login! Try later");
            }

            UserDto user = this.getUserByEmail(request.userName());
            String token = JwtUtil.getToken(new UserDataPrinciple(user.toEntity()));

            return new AuthResponse(token, user);
        } catch (BadCredentialsException e) {
            throw new RuntimeException(
                    "Invalid email or password"
            );
        }
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
        String encodedPassword =
                passwordEncoder.encode(request.password());

        // Update password
        int updatedRows = userDataRepository.updateUserPassword(
                encodedPassword,
                request.mail()
        );

        if (updatedRows == 0) {
            throw new RuntimeException("Password update failed");
        }

        return "Password updated successfully";
    }

    @Override
    public UserDto registerUserByAuth(UserDto userDto) {
        UserData user = userDataRepository.save(userDto.toEntity());
        return UserDto.toDto(user);
    }


    private String createUniqueUserName(String baseUserName) {

        String cleanName = baseUserName
                .toLowerCase()
                .replaceAll("[^a-z0-9]", "");

        if (cleanName.isBlank()) {
            cleanName = "user";
        }

        String random = UUID.randomUUID()
                .toString()
                .substring(0, 8);

        return cleanName + "_" + random;
    }
}
